import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import server from '../../environment';
import { Loader2 } from 'lucide-react';

import GavelIcon from '@mui/icons-material/Gavel';
import FlashOnIcon from '@mui/icons-material/FlashOn'; 
import { customAlert } from '../../utils/toastAlert';


import './CustomerWishlist.css';

const CustomerWishlist = ({ token }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${server}/customer/profile/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setWishlist(res.data.data);
        } catch (error) {
            console.error("Error fetching wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const handleRemove = async (productId, e) => {
        e.stopPropagation();
        try {
            await axios.post(`${server}/customer/profile/wishlist/toggle`, { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWishlist();
        } catch (error) {
            customAlert("Failed to remove item");
        }
    };

    const handleAddToCart = async (e, item) => {
        e.stopPropagation(); 
        try {
            const res = await axios.post(`${server}/customer/cart/add`, { productId: item._id, quantity: 1 }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) customAlert(`🛒 ${item.name} added to cart!`);
        } catch (error) { customAlert("Failed to add to cart"); }
    };

    const goToInfo = (item) => navigate(`/product/${item._id}`);

    if (loading) return <div className="flex-align justify-center cw-mt-20"><Loader2 className="spinner text-pink"/></div>;

    if (wishlist.length === 0) {
        return (
            <div className="cw-empty-state fade-in">
                <Heart size={48} color="#cbd5e1" style={{marginBottom: '10px'}}/>
                <h4>Your Wishlist is Empty</h4>
                <p className="cw-text-gray">Save your favorite items here to buy them later.</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h3 className="cw-section-title">My Wishlist ({wishlist.length})</h3>
            <div className="cw-grid">
                {wishlist.map(item => {
                    const displayImage = item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
                    
                    return (
                        <div className="cw-card" key={item._id} onClick={() => goToInfo(item)}>
                            <div className="cw-img-box">
                                <img src={displayImage} alt={item.name} />
                                <button className="cw-delete-btn" onClick={(e) => handleRemove(item._id, e)}>
                                    <Trash2 size={16}/>
                                </button>
                                {item.isBargainable && <span className="cw-tag">NEGOTIABLE</span>}
                            </div>

                            <div className="cw-info-box">
                                <h3 className="cw-title" title={item.name}>{item.name}</h3>
                                <div className="cw-price">₹{item.mrp?.toLocaleString()}</div>

                                <div className="cw-action-group">
                                    {item.isBargainable ? (
                                        <button className="cw-btn-bargain" onClick={(e) => { e.stopPropagation(); navigate(`/bargain/${item._id}`); }}>
                                            <GavelIcon sx={{ fontSize: 16 }} /> Start Bargain
                                        </button>
                                    ) : (
                                        <div className="cw-split-btns">
                                            <button className="cw-btn-cart" onClick={(e) => handleAddToCart(e, item)}>
                                                <ShoppingCart size={16}/> Add
                                            </button>
                                            <button className="cw-btn-buy" onClick={(e) => { e.stopPropagation(); navigate(`/booking/${item._id}`); }}>
                                                <FlashOnIcon sx={{ fontSize: 16 }}/> Buy {/* 🌟 FIX: Updated tag to FlashOnIcon */}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomerWishlist;