import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../environment'; 
import { useAuth } from '../context/AuthContext'; 
import DashNavbar from '../components/dashboard/DashNavbar';
import defaultComingSoonVideo from '../assets/videos/commingsoon.mp4';



import MapPinIcon from '@mui/icons-material/LocationOn';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import NearMeIcon from '@mui/icons-material/NearMe';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Heart, Plus, Loader2 } from 'lucide-react'; 
import { customAlert } from '../utils/toastAlert';


import './Categories.css';

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Categories = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const defaultYouTubeVideoId = "g4xs_5rZdos"; 

  const [selectedCat, setSelectedCat] = useState('All');
  const [dealType, setDealType] = useState('all');
  const [sortType, setSortType] = useState('recent');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showLocModal, setShowLocModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home'
  });
  
  const categoriesList = [
    { id: 1, name: 'All', img: 'https://img.icons8.com/fluency/96/category.png' },
    { id: 2, name: 'Mobiles', img: 'https://img.icons8.com/fluency/96/iphone.png' },
    { id: 3, name: 'Laptops', img: 'https://img.icons8.com/fluency/96/laptop.png' },
    { id: 4, name: 'Fashion', img: 'https://img.icons8.com/fluency/96/t-shirt.png' },
    { id: 5, name: 'Shoes', img: 'https://img.icons8.com/fluency/96/sneakers.png' },
    { id: 6, name: 'Gaming', img: 'https://img.icons8.com/fluency/96/console.png' },
    { id: 7, name: 'Watches', img: 'https://img.icons8.com/fluency/96/apple-watch.png' },
    { id: 8, name: 'Audio', img: 'https://img.icons8.com/fluency/96/headphones.png' },
    { id: 9, name: 'Appliances', img: 'https://img.icons8.com/fluency/96/washing-machine.png' },
    { id: 10, name: 'Beauty', img: 'https://img.icons8.com/fluency/96/lipstick.png' },
    { id: 11, name: 'Grocery', img: 'https://img.icons8.com/fluency/96/shopping-basket.png' },
    { id: 12, name: 'Gym', img: 'https://img.icons8.com/fluency/96/dumbbell.png' },
    { id: 13, name: 'Kitchen', img: 'https://img.icons8.com/fluency/96/kitchen.png' },
    { id: 14, name: 'Furniture', img: 'https://img.icons8.com/fluency/96/sofa.png' },
    { id: 15, name: 'Sports', img: 'https://img.icons8.com/fluency/96/basketball.png' },
    { id: 16, name: 'Toys', img: 'https://img.icons8.com/fluency/96/teddy-bear.png' },
    { id: 17, name: 'Books', img: 'https://img.icons8.com/fluency/96/books.png' },
    { id: 18, name: 'Jewelry', img: 'https://img.icons8.com/fluency/96/diamond-ring.png' },
    { id: 19, name: 'Decor', img: 'https://img.icons8.com/fluency/96/home-decor.png' },
    { id: 20, name: 'Camera', img: 'https://img.icons8.com/fluency/96/slr-camera.png' },
    { id: 21, name: 'Pets', img: 'https://img.icons8.com/fluency/96/dog-bowl.png' },
    { id: 22, name: 'Cycles', img: 'https://img.icons8.com/fluency/96/bicycle.png' }
  ];

  useEffect(() => {
    if (token) {
      axios.get(`${server}/customer/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data.success) {
            const addrs = res.data.data.addresses || [];
            setAddresses(addrs);
            setSelectedAddress(addrs.find(a => a.isDefault) || addrs[0]);
          }
        }).catch(err => console.error(err));
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let params = {};
        let endpoint = `${server}/customer/products`; 

        if (selectedCat !== 'All') {
            endpoint = `${server}/customer/category-products`;
            params.category = selectedCat;
        }

        
        if (sortType === 'nearby' && selectedAddress?.location?.coordinates) {
            params.lng = selectedAddress.location.coordinates[0];
            params.lat = selectedAddress.location.coordinates[1];
        }

        const res = await axios.get(endpoint, { params });
        if (res.data.success) {
          setProducts(sortType === 'nearby' ? res.data.data : shuffleArray(res.data.data)); 
        } else {
          setProducts([]);
        }

        
        if (token) {
          const wishRes = await axios.get(`${server}/customer/profile/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (wishRes.data.success) setWishlistIds(wishRes.data.data.map(item => item._id));
        }
      } catch (error) { 
          console.error(error); 
          setProducts([]);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [token, sortType, selectedAddress, selectedCat]);

  
  const filteredProducts = products.filter(p => {
    if (dealType === 'bargain' && !p.isBargainable) return false;
    if (dealType === 'fixed' && p.isBargainable) return false;
    return true;
  });

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
    if (!formData.name || !formData.city || !formData.addressLine || !formData.phone || !formData.state) {
        return customAlert("Please fill all fields");
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
    } catch (e) { customAlert("Failed to add address."); } 
    finally { setSavingAddress(false); }
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); 
    if (!token) { customAlert("Please login!"); navigate('/auth'); return; }
    try {
      const res = await axios.post(`${server}/customer/cart/add`, { productId: item._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) customAlert(`🛒 ${item.name} added to cart!`);
    } catch (error) { customAlert("Failed to add to cart"); }
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
    <div className="cat-page-wrapper">
      <DashNavbar />
      
      <div className="container main-content mt-20">
        
       
        <div className="category-wrap-container">
          {categoriesList.map((cat) => (
            <div 
              key={cat.id} 
              className={`cat-chip ${selectedCat === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat.name)}
            >
              <img src={cat.img} alt={cat.name} onError={(e) => e.target.src='https://img.icons8.com/fluency/96/box.png'} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        
        {token && (
          <div className="location-indicator-strip" onClick={() => { setShowLocModal(true); setIsAddingAddress(false); }}>
             <MapPinIcon sx={{ fontSize: 20, color: '#FF2E63' }} />
             <div className="loc-info-text">
                <span className="loc-label"><strong>Delivery Location</strong></span>
                <p className="loc-address-text">{selectedAddress ? `${selectedAddress.addressLine}, ${selectedAddress.city}` : "Add an address to see nearby products"}</p>
             </div>
             <button className="change-btn">CHANGE</button>
          </div>
        )}

        
        <div className="top-tabs">
          <div className="pill-container">
            <button className={sortType === 'nearby' ? 'tab active' : 'tab'} onClick={() => { if(!token) return customAlert("Login first!"); setSortType('nearby'); }}><NearMeIcon sx={{ fontSize: 18 }} /> Nearby</button>
            <button className={sortType === 'recent' ? 'tab active' : 'tab'} onClick={() => setSortType('recent')}><HistoryIcon sx={{ fontSize: 18 }} /> Recent</button>
          </div>
          <div className="pill-container">
            <button className={dealType === 'all' ? 'pill active' : 'pill'} onClick={() => setDealType('all')}><CategoryIcon sx={{ fontSize: 18, mr: '5px' }} /> All</button>
            <button className={dealType === 'bargain' ? 'pill active' : 'pill'} onClick={() => setDealType('bargain')}><GavelIcon sx={{ fontSize: 18, mr: '5px' }} /> Bargainable</button>
            <button className={dealType === 'fixed' ? 'pill active' : 'pill'} onClick={() => setDealType('fixed')}><LockIcon sx={{ fontSize: 18, mr: '5px' }} /> Fixed Price</button>
          </div>
        </div>

        
        <div className="title-section-simple">
          <h2>{selectedCat === 'All' ? 'Recommended For You' : `${selectedCat} Collection`}</h2>
          <div className="bottom-bar"></div>
        </div>

        
        {loading ? (
            <div style={{display:'flex', justifyContent:'center', padding:'50px'}}><Loader2 className="spinner" size={40} color="#FF2E63" /></div>
        ) : filteredProducts.length === 0 ? (
           <div style={{textAlign: 'center', padding: '50px', color: '#64748b', fontSize:'1.1rem'}}>
             Oops! No products found in {selectedCat} matching your filters.
           </div>
        ) : (
          <div className="amazon-grid">
            {filteredProducts.map(item => {
              const displayImage = item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
              const isLiked = wishlistIds.includes(item._id);
              let distanceText = item.distance !== undefined ? (item.distance < 1000 ? `${Math.round(item.distance)} m away` : `${(item.distance / 1000).toFixed(1)} km away`) : "";

              return (
                <div className="ecom-card" key={item._id} onClick={() => navigate(`/product/${item._id}`, { state: { product: item } })}>
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
                        <button className="btn-main-bargain" onClick={(e) => { e.stopPropagation(); navigate(`/bargain/${item._id}`); }}>
                          <GavelIcon sx={{ fontSize: 18 }} /> Start Bargain
                        </button>
                      ) : (
                        <div className="btn-split-row">
                          <button className="btn-split-cart" onClick={(e) => handleAddToCart(e, item)}>🛒 Add</button>
                          <button className="btn-split-buy" onClick={(e) => { e.stopPropagation(); navigate(`/booking/${item._id}`, { state: { product: item } }); }}>Buy Now</button>
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
                   <button className="add-addr-btn" onClick={() => setIsAddingAddress(true)}><Plus size={18} /> Add New Address</button>
                 </>
               ) : (
                 <div className="addr-form-inline">
                    <div className="bk-grid-2">
                        <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input type="text" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                    <textarea placeholder="Address Line" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} />
                    <div className="bk-action-row">
                        <button className="cp-btn-outline" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                        <button className="cp-btn-primary" onClick={handleAddAddress} disabled={savingAddress}>Save & Select</button>
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

export default Categories;