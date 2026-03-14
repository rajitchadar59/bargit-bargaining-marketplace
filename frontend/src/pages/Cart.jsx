import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import server from '../environment';
import DashNavbar from '../components/dashboard/DashNavbar';
import { ShoppingBag, Trash2, Loader2, Plus } from 'lucide-react';
import './cart.css';
import CartRelatedProducts from '../components/CartRelatedProducts'
import { customAlert } from '../utils/toastAlert';



const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => { resolve(true); };
        script.onerror = () => { resolve(false); };
        document.body.appendChild(script);
    });
};

const Cart = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [payMethod, setPayMethod] = useState('online');
    
   
    const [loading, setLoading] = useState(true);
    const [isChangingAddress, setIsChangingAddress] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    
    const [formData, setFormData] = useState({ 
        name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home' 
    });

  
    useEffect(() => {
        const fetchCartAndProfile = async () => {
            if (!token) return;
            try {
                
                const cartRes = await axios.get(`${server}/customer/cart`, { headers: { Authorization: `Bearer ${token}` } });
                if (cartRes.data.success) setCartItems(cartRes.data.cart);

                const profileRes = await axios.get(`${server}/customer/profile`, { headers: { Authorization: `Bearer ${token}` } });
                if (profileRes.data.success) {
                    const userAddrs = profileRes.data.data.addresses || [];
                    setAddresses(userAddrs);
                    if (userAddrs.length > 0) setSelectedAddress(userAddrs.find(a => a.isDefault) || userAddrs[0]);
                    else setIsAddingAddress(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartAndProfile();
    }, [token]);

    const updateQty = async (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        setCartItems(prev => prev.map(item => item.productId._id === productId ? { ...item, quantity: newQty } : item));

        try {
            await axios.put(`${server}/customer/cart/update`, { productId, quantity: newQty }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
            customAlert(err.response?.data?.message || "Failed to update quantity");
            setCartItems(prev => prev.map(item => item.productId._id === productId ? { ...item, quantity: currentQty } : item));
        }
    };

    const removeFromCart = async (productId) => {
        setCartItems(prev => prev.filter(item => item.productId._id !== productId));
        try {
            await axios.delete(`${server}/customer/cart/remove/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
            customAlert("Failed to remove item");
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSelectAddress = async (selectedAddr) => {
        setSelectedAddress(selectedAddr);
        setIsChangingAddress(false);
        try {
            const res = await axios.put(`${server}/customer/profile/address/${selectedAddr._id}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.data.success) setAddresses(res.data.data); 
        } catch (error) {
            console.error("Failed to set address as default", error);
        }
    };

    const handleAddAddress = async () => {
        if (!formData.name || !formData.city || !formData.addressLine || !formData.phone) {
            return customAlert("Please fill all required fields");
        }
        setSavingAddress(true);
        try {
            const res = await axios.post(`${server}/customer/profile/address`, 
                { ...formData, isDefault: true }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setAddresses(res.data.data);
                setSelectedAddress(res.data.data.find(a => a.isDefault));
                setIsAddingAddress(false);
                setIsChangingAddress(false);
                setFormData({ name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home' });
            }
        } catch (error) { customAlert("Failed to add address."); } 
        finally { setSavingAddress(false); }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) return customAlert("Please select an address");
        setPlacingOrder(true);

        const itemsPayload = cartItems.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
        }));

        try {
            if (payMethod === 'cod') {
                const res = await axios.post(`${server}/customer/orders/place`, {
                    items: itemsPayload, 
                    paymentMethod: payMethod,
                    addressId: selectedAddress._id
                }, { headers: { Authorization: `Bearer ${token}` } });

                if (res.data.success) {
                    customAlert("🎉 Order placed successfully!");
                    navigate('/profile', { state: { activeTab: 'orders' } }); 
                }
                setPlacingOrder(false);
            } 
            else if (payMethod === 'online') {
                const resScript = await loadRazorpayScript();
                if (!resScript) { setPlacingOrder(false); return customAlert('Razorpay SDK failed to load.'); }

                const orderRes = await axios.post(`${server}/customer/payments/create-order`, { items: itemsPayload }, { headers: { Authorization: `Bearer ${token}` } });

                const { key_id, data } = orderRes.data;

                const options = {
                    key: key_id,
                    amount: data.amount,
                    currency: data.currency,
                    name: "Bargit",
                    description: `Payment for ${cartItems.length} items`,
                    order_id: data.orderId,
                    handler: async function (response) {
                        try {
                            setPlacingOrder(true);
                            const verifyRes = await axios.post(`${server}/customer/payments/verify`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                items: itemsPayload,
                                addressId: selectedAddress._id
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            if (verifyRes.data.success) {
                                customAlert("🎉 Order placed successfully!");
                                navigate('/profile', { state: { activeTab: 'orders' } });
                            }
                        } catch (err) { customAlert("Payment verification failed."); }
                        finally { setPlacingOrder(false); }
                    },
                    theme: { color: "#FF2E63" },
                    modal: { ondismiss: () => setPlacingOrder(false) }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', () => setPlacingOrder(false));
                rzp.open();
            }
        } catch (error) {
            customAlert(error.response?.data?.message || "Checkout Failed");
            setPlacingOrder(false);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.productId.mrp * item.quantity), 0);
    const grandTotal = subtotal; 

    if (loading) return <div className="cart-page"><DashNavbar /><div style={{display:'flex', justifyContent:'center', height:'60vh', alignItems:'center'}}><Loader2 className="spinner" size={40} color="#FF2E63" /></div></div>;

    if (cartItems.length === 0) return (
        <div className="cart-page">
            <DashNavbar />
            <div  style={{ textAlign: 'center', padding: '100px' }}>
                <ShoppingBag size={80} color="#cbd5e1" />
                <h2 style={{marginTop: '20px', color: '#64748b'}}>Your Cart is Empty!</h2>
            </div>
        </div>
    );

    return (
        <>
        <div className="cart-page">
            <DashNavbar />
            <div className="container cart-main-layout">
                
                <div className="desktop-timeline">
                    <div className="t-line"></div>
                    <div className="t-dot active"><span>1</span><p>Cart & Address</p></div>
                    <div className="t-dot active"><span>2</span><p>Summary</p></div>
                    <div className="t-dot"><span>3</span><p>Payment</p></div>
                </div>

                <div className="cart-grid-wrapper">
                    <div className="sections-container">
                        
                        <div className="cart-section-card">
                            <div className="card-top">
                                <span className="step-count">01</span>
                                <h4>Delivery Address</h4>
                            </div>
                            
                            {isAddingAddress ? (
                                <div className="inline-address-form fade-in">
                                    <h5>Add New Address</h5>
                                    <div className="bk-grid-2">
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="bk-input" />
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit Mobile No." className="bk-input" />
                                        <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} placeholder="Pincode" className="bk-input" />
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="bk-input" />
                                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="bk-input" />
                                        <select name="type" value={formData.type} onChange={handleInputChange} className="bk-input">
                                            <option value="Home">Home</option>
                                            <option value="Office">Office</option>
                                        </select>
                                    </div>
                                    <textarea rows="2" name="addressLine" value={formData.addressLine} onChange={handleInputChange} placeholder="Flat, House no., Building, Street" className="bk-input mt-10"></textarea>
                                    
                                    <div className="bk-action-row">
                                        {addresses.length > 0 && (
                                            <button className="bk-btn-text" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                                        )}
                                        <button className="btn-main bk-save-btn" onClick={handleAddAddress} disabled={savingAddress}>
                                            {savingAddress ? 'Saving...' : 'Save & Deliver Here'}
                                        </button>
                                    </div>
                                </div>
                            ) : isChangingAddress ? (
                                <div className="inline-address-list fade-in">
                                    {addresses.map(add => (
                                        <label key={add._id} className={`bk-address-item ${selectedAddress?._id === add._id ? 'selected' : ''}`}>
                                            <input type="radio" checked={selectedAddress?._id === add._id} onChange={() => handleSelectAddress(add)} />
                                            <div className="bk-add-content">
                                                <div className="bk-add-header">
                                                    <strong>{add.name}</strong> <span className="bk-tag">{add.type}</span>
                                                    {add.phone && <span className="bk-phone">{add.phone}</span>}
                                                </div>
                                                <p>{add.addressLine}, {add.city}, {add.state} - {add.pin}</p>
                                                {selectedAddress?._id === add._id && (
                                                    <button className="btn-main mt-10" style={{padding: '8px 15px', borderRadius: '6px'}} onClick={() => setIsChangingAddress(false)}>
                                                        Deliver Here
                                                    </button>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                    <div className="bk-add-new-trigger" onClick={() => setIsAddingAddress(true)}>
                                        <Plus size={16} /> Add a new address
                                    </div>
                                </div>
                            ) : (
                                selectedAddress && (
                                    <div className="address-display fade-in">
                                        <div className="user-info">
                                            <span className="tag-home">{selectedAddress.type.toUpperCase()}</span>
                                            <h5>{selectedAddress.name}</h5>
                                        </div>
                                        <p className="address-text">{selectedAddress.addressLine} <br/> {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}</p>
                                        <p className="phone-text"><strong>Contact:</strong> +91 {selectedAddress.phone}</p>
                                        <button className="edit-btn" onClick={() => setIsChangingAddress(true)}>Change Address</button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="cart-section-card">
                            <div className="card-top">
                                <span className="step-count">02</span>
                                <h4>Cart Items ({cartItems.length})</h4>
                            </div>
                            <div className="cart-items-list">
                                {cartItems.map((item) => {
                                    const fallbackImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
                                    const displayImg = item.productId.images?.[0] 
                                        ? (item.productId.images[0].startsWith('http') ? item.productId.images[0] : `${server}/${item.productId.images[0]}`) 
                                        : fallbackImg;

                                    return (
                                        <div className="product-summary-box" key={item.productId._id}>
                                            <div className="prod-meta">
                                                <img src={displayImg} alt="product" />
                                                <div className="prod-meta-text" style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <h6>{item.productId.name}</h6>
                                                        <Trash2 size={16} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => removeFromCart(item.productId._id)} />
                                                    </div>
                                                    <p className="price-tag">₹{item.productId.mrp?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            
                                            {item.productId.specifications && item.productId.specifications.length > 0 && (
                                                <div className="specs-grid">
                                                    {item.productId.specifications.slice(0, 2).map((s, i) => (
                                                        <div key={i} className="spec-item">• {s.value}</div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="qty-row">
                                                <span>Quantity</span>
                                                <div className="qty-controls">
                                                    <button onClick={() => updateQty(item.productId._id, item.quantity, -1)}>-</button>
                                                    <span className="qty-count">{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.productId._id, item.quantity, 1)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="cart-section-card highlight">
                            <div className="card-top">
                                <span className="step-count">03</span>
                                <h4>Payment Method</h4>
                            </div>
                            <div className="payment-options-list">
                                <label className={`pay-item ${payMethod === 'online' ? 'selected' : ''}`}>
                                    <input type="radio" name="pay" checked={payMethod === 'online'} onChange={() => setPayMethod('online')} />
                                    <div className="pay-content">
                                        <p className="pay-title">Net Banking / UPI</p>
                                        <p className="pay-subtitle">Secure payment via Razorpay</p>
                                    </div>
                                    <div className="custom-radio"></div>
                                </label>

                                <label className={`pay-item ${payMethod === 'cod' ? 'selected' : ''}`}>
                                    <input type="radio" name="pay" checked={payMethod === 'cod'} onChange={() => setPayMethod('cod')} />
                                    <div className="pay-content">
                                        <p className="pay-title">Cash On Delivery</p>
                                        <p className="pay-subtitle green-text">No extra convenience fee</p>
                                    </div>
                                    <div className="custom-radio"></div>
                                </label>
                            </div>
                            
                            <div className="billing-details">
                                <div className="bill-item"><span>Subtotal</span> <span>₹{subtotal.toLocaleString()}</span></div>
                                <div className="bill-item"><span>Shipping</span> <span className="green-text">FREE</span></div>
                                <div className="bill-item total"><span>Grand Total</span> <span>₹{grandTotal.toLocaleString()}</span></div>
                            </div>
                            
                            <button 
                                className="btn-main finalize-btn" 
                                onClick={handleCheckout} 
                                disabled={!selectedAddress || isAddingAddress || placingOrder}
                                style={{ opacity: (!selectedAddress || isAddingAddress || placingOrder) ? 0.5 : 1, cursor: (!selectedAddress || isAddingAddress || placingOrder) ? 'not-allowed' : 'pointer' }}
                            >
                                {placingOrder ? 'Processing...' : (payMethod === 'cod' ? 'PLACE ORDER (COD)' : 'PROCEED TO PAY')}
                            </button>
                        </div>

                    </div>
                </div>
                
            </div>
            
        </div>

        <CartRelatedProducts/>
        
        </>
    );
};

export default Cart;