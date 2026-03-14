import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../environment'; 
import { useAuth } from '../context/AuthContext'; 

import DashNavbar from '../components/dashboard/DashNavbar'; 
import MapPinIcon from '@mui/icons-material/LocationOn';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HistoryIcon from '@mui/icons-material/History';
import NearMeIcon from '@mui/icons-material/NearMe';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Heart, Plus, SearchX, Sparkles } from 'lucide-react'; 
import { customAlert } from '../utils/toastAlert';


import "../components/dashboard/Products.css"; 
import "./SearchResults.css"; 

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const defaultYouTubeVideoId = "g4xs_5rZdos"; 

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';

  const [exactProducts, setExactProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const [dealType, setDealType] = useState('all');
  const [sortType, setSortType] = useState('recent'); 

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showLocModal, setShowLocModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home'
  });

  useEffect(() => {
    if (token) {
      axios.get(`${server}/customer/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data.success) {
            const addrs = res.data.data.addresses || [];
            setAddresses(addrs);
            const defAddr = addrs.find(a => a.isDefault) || addrs[0];
            setSelectedAddress(defAddr);
          }
        }).catch(err => console.error(err));
    }
  }, [token]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) { setLoading(false); return; }

      setLoading(true);
      try {
        let params = { q: searchTerm, type: sortType };
        
        if (sortType === 'nearby' && selectedAddress?.location?.coordinates) {
            params.lng = selectedAddress.location.coordinates[0];
            params.lat = selectedAddress.location.coordinates[1];
        }

        const res = await axios.get(`${server}/customer/products/search`, { params });
        
        if (res.data.success) {
            setExactProducts(sortType === 'nearby' ? res.data.data.exact : shuffleArray(res.data.data.exact));
            setRelatedProducts(res.data.data.related);
        }

        if (token) {
          const wishRes = await axios.get(`${server}/customer/profile/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
          if (wishRes.data.success) setWishlistIds(wishRes.data.data.map(item => item._id));
        }
      } catch (error) { console.error("Search fetch error", error); } 
      finally { setLoading(false); }
    };

    fetchSearchResults();
  }, [searchTerm, sortType, selectedAddress, token]);

  const handleSelectAddress = async (addr) => {
    setSelectedAddress(addr);
    setShowLocModal(false);
    try { await axios.put(`${server}/customer/profile/address/${addr._id}/default`, {}, { headers: { Authorization: `Bearer ${token}` } }); } 
    catch (e) { console.error(e); }
  };

  const handleAddAddress = async () => {
    if (!formData.name || !formData.city || !formData.addressLine || !formData.phone || !formData.state) return customAlert("Please fill all required fields");
    setSavingAddress(true);
    try {
      const res = await axios.post(`${server}/customer/profile/address`, { ...formData, isDefault: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setAddresses(res.data.data);
        setSelectedAddress(res.data.data.find(a => a.isDefault));
        setIsAddingAddress(false);
        setFormData({ name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home' });
      }
    } catch (e) { customAlert("Failed to add address"); }
    finally { setSavingAddress(false); }
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); 
    if (!token) { customAlert("Please login to add to cart!"); navigate('/auth'); return; }
    try {
      const res = await axios.post(`${server}/customer/cart/add`, { productId: item._id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) customAlert(`🛒 ${item.name} added to cart!`);
    } catch (error) { customAlert("Failed to add to cart"); }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation(); 
    if (!token) { customAlert("Please login!"); navigate('/auth'); return; }
    const isLiked = wishlistIds.includes(productId);
    setWishlistIds(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId]);
    try { await axios.post(`${server}/customer/profile/wishlist/toggle`, { productId }, { headers: { Authorization: `Bearer ${token}` } }); } 
    catch (e) { console.error(e); }
  };

  const goToInfo = (item) => {
      const combinedProducts = [...exactProducts, ...relatedProducts];
      navigate(`/product/${item._id}`, { state: { product: item, allProducts: combinedProducts } });
  };

  const filterList = (list) => {
    return list.filter(p => {
      if (dealType === 'bargain' && !p.isBargainable) return false;
      if (dealType === 'fixed' && p.isBargainable) return false;
      
      if (sortType === 'nearby' && (p.distance === undefined || p.distance === null)) {
          return false;
      }
      
      return true;
    });
  };

  const renderProductCard = (item) => {
    const displayImage = item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
    const isLiked = wishlistIds.includes(item._id);
    
    let distanceText = null;
    if (sortType === 'nearby' && item.distance !== undefined && item.distance !== null) {
        distanceText = item.distance < 1000 
          ? `${Math.round(item.distance)} m away` 
          : `${(item.distance / 1000).toFixed(1)} km away`;
    }

    return (
      <div className="ecom-card" key={item._id} onClick={() => goToInfo(item)}>
        <div className="image-box">
          {playingVideoId === item._id ? (
            <div className="video-player-wrapper" onClick={(e) => e.stopPropagation()}>
              <iframe src={`https://www.youtube.com/embed/${defaultYouTubeVideoId}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%' }}></iframe>
              <button className="close-video-btn" onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }}><CloseIcon sx={{ fontSize: 14 }} /></button>
            </div>
          ) : (
            <>
              <img src={displayImage} alt={item.name} />
              <button className="watch-video-btn" onClick={(e) => { e.stopPropagation(); setPlayingVideoId(item._id); }}><PlayIcon sx={{ fontSize: 20 }} /></button>
            </>
          )}
          {item.isBargainable && <span className="bargain-tag">NEGOTIABLE</span>}
        </div>

        <div className="content-box">
          <div className="prod-title-row">
            <h3 className="prod-title">{item.name}</h3>
            <button className="wishlist-btn-inline" onClick={(e) => handleToggleWishlist(e, item._id)}>
              <Heart size={20} color={isLiked ? "#FF2E63" : "#cbd5e1"} fill={isLiked ? "#FF2E63" : "none"} />
            </button>
          </div>

          <div className="price-row">
            <span className="price-val">₹{item.mrp?.toLocaleString()}</span>
            
            {sortType === 'nearby' ? (
                <span className="dist-text-label">{distanceText || "Nearby"}</span>
            ) : (
                <span className="rating-mini">★ 4.5</span>
            )}
          </div>
          
          <p className="vendor-location-tag"><MapPinIcon sx={{fontSize: 14, mr: 0.5, color: '#FF2E63'}} /> {item.vendorId?.companyName || "Nearby Store"}</p>

          <div className="btn-group">
            {item.isBargainable ? (
              <button className="btn-main-bargain"><GavelIcon sx={{ fontSize: 18 }} /> Start Bargain</button>
            ) : (
              <div className="btn-split-row">
                <button className="btn-split-cart" onClick={(e) => handleAddToCart(e, item)}>Add</button>
                <button className="btn-split-buy" onClick={(e) => { e.stopPropagation(); goToInfo(item); }}>Buy Now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="search-page-wrapper">
      <DashNavbar />
      
      <div className="search-main-content container">
        
        <div className="search-header-compact">
            <h2 className="search-title">
                Search results for <span>"{searchTerm}"</span>
            </h2>
        </div>

        {token && (
          <div className="compact-location-strip" onClick={() => { setShowLocModal(true); setIsAddingAddress(false); }}>
             <MapPinIcon sx={{ fontSize: 20, color: '#FF2E63' }} />
             <div className="loc-info-text">
                <span className="loc-label">Choose a delivery address to see products from nearby shops</span>
                <p className="loc-address-text">{selectedAddress ? `${selectedAddress.addressLine}, ${selectedAddress.city}` : "Add an address to see nearby products"}</p>
             </div>
             <button className="change-btn-small">CHANGE</button>
          </div>
        )}

        <div className="top-tabs-compact">
          <div className="pill-container">
            <button className={sortType === 'nearby' ? 'tab active' : 'tab'} onClick={() => { if(!token) return customAlert("Login to see nearby!"); setSortType('nearby'); }}><NearMeIcon sx={{ fontSize: 16 }} /> Nearby</button>
            <button className={sortType === 'recent' ? 'tab active' : 'tab'} onClick={() => setSortType('recent')}><HistoryIcon sx={{ fontSize: 16 }} /> Recent</button>
          </div>

          <div className="pill-container">
            <button className={dealType === 'all' ? 'pill active' : 'pill'} onClick={() => setDealType('all')}><CategoryIcon sx={{ fontSize: 16, mr: '4px' }} /> All Items</button>
            <button className={dealType === 'bargain' ? 'pill active' : 'pill'} onClick={() => setDealType('bargain')}><GavelIcon sx={{ fontSize: 16, mr: '4px' }} /> Bargainable</button>
            <button className={dealType === 'fixed' ? 'pill active' : 'pill'} onClick={() => setDealType('fixed')}><LockIcon sx={{ fontSize: 16, mr: '4px' }} /> Fixed Price</button>
          </div>
        </div>

        {loading ? (
           <div className="loading-state">
               <Sparkles className="spin-animation" size={24} color="#FF2E63" />
               <p>Loading results...</p>
           </div>
        ) : (
          <div className="search-results-section">
            {filterList(exactProducts).length > 0 ? (
                <div className="amazon-grid">
                    {filterList(exactProducts).map(item => renderProductCard(item))}
                </div>
            ) : (
                <div className="empty-state-box">
                  <SearchX size={40} color="#cbd5e1" />
                  <h4>No exact matches</h4>
                  <p>Try searching for something else.</p>
                </div>
            )}

            {filterList(relatedProducts).length > 0 && (
                <div className="related-section-compact">
                    <div className="related-header-small">
                        <h3>{exactProducts.length > 0 ? "Related categories" : "Recommended for you"}</h3>
                    </div>
                    <div className="amazon-grid">
                        {filterList(relatedProducts).map(item => renderProductCard(item))}
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      {showLocModal && (
        <div className="loc-modal-overlay">
          <div className="loc-modal-box fade-in">
            <div className="loc-modal-header">
               <h4>Select Delivery Location</h4>
               <CloseIcon onClick={() => setShowLocModal(false)} sx={{cursor: 'pointer', color: '#666'}} />
            </div>
            <div className="loc-modal-body">
               {!isAddingAddress ? (
                 <>
                   {addresses.map(add => (
                     <div key={add._id} className={`addr-card ${selectedAddress?._id === add._id ? 'active' : ''}`} onClick={() => handleSelectAddress(add)}>
                        <div className="addr-header"><strong>{add.name}</strong> <span className="addr-tag">{add.type}</span></div>
                        <p>{add.addressLine}, {add.city}</p>
                     </div>
                   ))}
                   <button className="add-addr-btn" onClick={() => setIsAddingAddress(true)}>
                      <Plus size={18} /> Add New Delivery Address
                   </button>
                 </>
               ) : (
                 <div className="addr-form-inline">
                    <div className="bk-grid-2">
                        <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input type="text" placeholder="State (Required)" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                        <input type="text" placeholder="Pincode" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} />
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bk-input">
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <textarea placeholder="Address Line (Flat/House No/Street)" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} />
                    <div className="bk-action-row">
                        <button className="cp-btn-outline" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                        <button className="cp-btn-primary" onClick={handleAddAddress} disabled={savingAddress}>
                            {savingAddress ? 'Saving...' : 'Save & Select'}
                        </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;