import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../environment'; 
import { useAuth } from '../context/AuthContext'; 
import { customAlert } from '../utils/toastAlert';
import defaultComingSoonVideo from '../assets/videos/commingsoon.mp4';


import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Heart, Loader2 } from 'lucide-react';

import './CartRelatedProducts.css';

const CartRelatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { token } = useAuth();
  const defaultYouTubeVideoId = "g4xs_5rZdos"; 

  useEffect(() => {
    const fetchCartRelated = async () => {
      try {
        const res = await axios.get(`${server}/customer/cart-related`);
        if (res.data.success) setProducts(res.data.data);

        if (token) {
          const wishRes = await axios.get(`${server}/customer/profile/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (wishRes.data.success) setWishlistIds(wishRes.data.data.map(item => item._id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartRelated();
  }, [token]);

  const handleAddToCart = async (e, item) => {
    e.stopPropagation();
    if (!token) { customAlert("Please login!"); navigate('/auth'); return; }
    try {
      const res = await axios.post(`${server}/customer/cart/add`, 
        { productId: item._id, quantity: 1 }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        customAlert(`🛒 ${item.name} added to cart!`);
        window.location.reload(); 
      }
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

  if (loading) return <div className="cart-related-loader"><Loader2 className="spinner" size={30} color="#FF2E63" /></div>;
  if (products.length === 0) return null;

  return (
    <div className="cart-related-wrapper container">
      <h2 className="upsell-section-title">You might also like </h2>
      <div className="cart-related-grid">
        {products.map(item => {
          const displayImage = item.images && item.images.length > 0 
            ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`)
            : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
          
          const isLiked = wishlistIds.includes(item._id);

          return (
            <div className="ecom-card" key={item._id} onClick={() => navigate(`/product/${item._id}`)}>
              <div className="image-box">
                {playingVideoId === item._id ? (
                  <div className="video-player-wrapper" onClick={(e) => e.stopPropagation()}>
                   <video src={defaultComingSoonVideo} autoPlay loop  playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>     
                    <button className="close-video-btn" onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                ) : (
                  <>
                    <img src={displayImage} alt={item.name} />
                    <button className="watch-video-btn" onClick={(e) => { e.stopPropagation(); setPlayingVideoId(item._id); }}>
                      <PlayIcon sx={{ fontSize: 20 }} />
                    </button>
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
                </div>

                <div className="btn-group">
                  <button className="btn-main-cart-upsell" onClick={(e) => handleAddToCart(e, item)}>
                    <ShoppingCartIcon sx={{ fontSize: 18 }} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartRelatedProducts;