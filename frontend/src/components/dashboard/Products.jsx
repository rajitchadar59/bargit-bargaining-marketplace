import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import server from '../../environment'; 
import { useAuth } from '../../context/AuthContext'; 

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
import { Heart, Plus } from 'lucide-react'; 
import { customAlert } from '../../utils/toastAlert';

import defaultComingSoonVideo from '../../assets/videos/commingsoon.mp4';

import "./Products.css";

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Products() {
  const [dealType, setDealType] = useState('all');
  const [sortType, setSortType] = useState('recent');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); 

  // 🌟 Address States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showLocModal, setShowLocModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  // 🌟 FIX: Added 'state' to formData
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home'
  });
  
  const navigate = useNavigate();
  const location = useLocation(); 
  const { token } = useAuth(); 

  // 1. Fetch Profile & Addresses
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

  // 2. Fetch Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = {};
        if (sortType === 'nearby' && selectedAddress?.location?.coordinates) {
            params.lng = selectedAddress.location.coordinates[0];
            params.lat = selectedAddress.location.coordinates[1];
        }

        const res = await axios.get(`${server}/customer/products`, { params });
        if (res.data.success) {
          setProducts(sortType === 'nearby' ? res.data.data : shuffleArray(res.data.data)); 
        }

        if (token) {
          const wishRes = await axios.get(`${server}/customer/profile/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (wishRes.data.success) setWishlistIds(wishRes.data.data.map(item => item._id));
        }
      } catch (error) { console.error(error); } 
    };
    fetchData();
  }, [token, sortType, selectedAddress]);

  const handleSelectAddress = async (addr) => {
    setSelectedAddress(addr);
    setShowLocModal(false);
    try {
        await axios.put(`${server}/customer/profile/address/${addr._id}/default`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (e) { console.error(e); }
  };

  const handleAddAddress = async () => {
    // 🌟 Validation update: State is now mandatory
    if (!formData.name || !formData.city || !formData.addressLine || !formData.phone || !formData.state) {
        return customAlert("Please fill all fields (Name, Phone, City, State, Address)");
    }
    setSavingAddress(true);
    try {
      const res = await axios.post(`${server}/customer/profile/address`, { ...formData, isDefault: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAddresses(res.data.data);
        setSelectedAddress(res.data.data.find(a => a.isDefault));
        setIsAddingAddress(false);
        setFormData({ name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home' });
      }
    } catch (e) { 
        customAlert(e.response?.data?.message || "Failed to add address. Try again."); 
    } finally { setSavingAddress(false); }
  };

  const filtered = products.filter(p => {
    if (dealType === 'all') return true;
    if (dealType === 'bargain') return p.isBargainable === true;
    if (dealType === 'fixed') return p.isBargainable === false;
    return true;
  });

  const goToInfo = (item) => navigate(`/product/${item._id}`, { state: { product: item, allProducts: products } });

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); 
    if (!token) { customAlert("Please login!"); navigate('/auth'); return; }
    try {
      const res = await axios.post(`${server}/customer/cart/add`, { productId: item._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) customAlert(`🛒 ${item.name} added to cart!`);
    } catch (error) { customAlert("Failed to add"); }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.stopPropagation(); 
    if (!token) { customAlert("Please login!"); navigate('/auth'); return; }
    const isLiked = wishlistIds.includes(productId);
    setWishlistIds(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId]);
    try {
      await axios.post(`${server}/customer/profile/wishlist/toggle`, { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="prod-wrapper">
      <div className="main-content container">
        
        {/* 🌟 Top Location Strip */}
        {token && (
          <div className="location-indicator-strip" onClick={() => { setShowLocModal(true); setIsAddingAddress(false); }}>
             <MapPinIcon sx={{ fontSize: 20, color: '#FF2E63' }} />
             <div className="loc-info-text">
                <span className="loc-label"><strong>Choose a delivery address to see products from nearby shops</strong></span>
                <p className="loc-address-text">{selectedAddress ? `${selectedAddress.addressLine}, ${selectedAddress.city}` : "Add an address to see nearby products"}</p>
             </div>
             <button className="change-btn">CHANGE</button>
          </div>
        )}

        <div className="top-tabs">
          <div className="pill-container">
            <button className={sortType === 'nearby' ? 'tab active' : 'tab'} onClick={() => { if(!token) return customAlert("Login to see nearby!"); setSortType('nearby'); }}><NearMeIcon sx={{ fontSize: 18 }} /> Nearby</button>
            <button className={sortType === 'recent' ? 'tab active' : 'tab'} onClick={() => setSortType('recent')}><HistoryIcon sx={{ fontSize: 18 }} /> Recent</button>
          </div>

          <div className="pill-container">
            <button className={dealType === 'all' ? 'pill active' : 'pill'} onClick={() => setDealType('all')}><CategoryIcon sx={{ fontSize: 18, mr: '5px' }} /> All Items</button>
            <button className={dealType === 'bargain' ? 'pill active' : 'pill'} onClick={() => setDealType('bargain')}><GavelIcon sx={{ fontSize: 18, mr: '5px' }} /> Bargainable</button>
            <button className={dealType === 'fixed' ? 'pill active' : 'pill'} onClick={() => setDealType('fixed')}><LockIcon sx={{ fontSize: 18, mr: '5px' }} /> Fixed Price</button>
          </div>
        </div>

        {filtered.length === 0 ? (
           <div style={{textAlign: 'center', padding: '50px', width: '100%', color: '#64748b'}}>No products found in this area.</div>
        ) : (
          <div className="amazon-grid">
            {filtered.map(item => {
              const displayImage = item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
              const isLiked = wishlistIds.includes(item._id);
              
              let distanceText = "";
              if (item.distance !== undefined) {
                  distanceText = item.distance < 1000 ? `${Math.round(item.distance)} m away` : `${(item.distance / 1000).toFixed(1)} km away`;
              }

              return (
                <div className="ecom-card" key={item._id} onClick={() => goToInfo(item)}>
                  <div className="image-box">
                    {playingVideoId === item._id ? (
                      <div className="video-player-wrapper" onClick={(e) => e.stopPropagation()}>
                        <video src={defaultComingSoonVideo} autoPlay loop  playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
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
                      {distanceText && <span className="dist-text-label">{distanceText}</span>}
                    </div>
                    
                    <p className="vendor-location-tag"><MapPinIcon sx={{fontSize: 14, mr: 0.5, color: '#FF2E63'}} /> {item.vendorId?.companyName || "Nearby Store"}</p>

                    <div className="btn-group">
                      {item.isBargainable ? (
                        <button className="btn-main-bargain"><GavelIcon sx={{ fontSize: 18 }} /> Start Bargain</button>
                      ) : (
                        <div className="btn-split-row">
                          <button className="btn-split-cart" onClick={(e) => handleAddToCart(e, item)}>🛒 Add</button>
                          <button className="btn-split-buy" onClick={(e) => { e.stopPropagation(); goToInfo(item); }}>Buy Now</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🌟 Address Modal */}
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
}

export default Products;