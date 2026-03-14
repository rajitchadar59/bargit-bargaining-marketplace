import React, { useState, useEffect } from 'react';
import { Package, Eye, MapPin, CreditCard } from 'lucide-react';
import axios from 'axios';
import server from '../../environment';
import { Loader2 } from 'lucide-react';
import './CustomerOrders.css'; 

const CustomerOrders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${server}/customer/profile/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) setOrders(res.data.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return 'co-status-green';
            case 'Processing': return 'co-status-orange';
            case 'Shipped': return 'co-status-blue';
            case 'Cancelled': return 'co-status-red';
            default: return 'co-status-gray';
        }
    };

    if (loading) return <div className="flex-align justify-center"><Loader2 className="spinner text-pink"/></div>;

    if (orders.length === 0) {
        return (
            <div className="co-empty-state fade-in">
                <Package size={48} color="#cbd5e1" style={{marginBottom: '10px'}}/>
                <h4>No Orders Found</h4>
                <p>Looks like you haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h3 className="co-section-title">My Orders</h3>
            <div className="co-list">
                {orders.map(order => {
                    const firstItem = order.items[0];
                    const moreCount = order.items.length - 1;
                    
                    return (
                        <div key={order._id} className="co-card">
                            <div className="co-header">
                                <div className="co-header-item">
                                    <span className="co-label">ORDER PLACED</span>
                                    <span className="co-val">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</span>
                                </div>
                                <div className="co-header-item">
                                    <span className="co-label">TOTAL</span>
                                    <span className="co-val">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="co-header-item hide-mobile">
                                    <span className="co-label">SHIP TO</span>
                                    <span className="co-val co-link">{order.deliveryAddress.name}</span>
                                </div>
                                <div className="co-header-item right-align">
                                    <span className="co-label">ORDER # {order._id.slice(-4).toUpperCase()}</span>
                                    <button className="co-view-btn" onClick={() => toggleExpand(order._id)}>
                                        <Eye size={14}/> {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>

                            <div className="co-body">
                                <h4 className={`co-status ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</h4>
                                <div className="co-preview-row">
                                    <div className="co-preview-img">
                                        <img src={firstItem?.productImage?.startsWith('http') ? firstItem.productImage : `${server}/${firstItem?.productImage}`} alt="Item" />
                                    </div>
                                    <div className="co-preview-text">
                                        <p className="co-item-title">{firstItem?.productName}</p>
                                        {moreCount > 0 && <span className="co-more-tag">+{moreCount} more item{moreCount > 1 ? 's' : ''}</span>}
                                    </div>
                                </div>
                            </div>

                            {expandedOrder === order._id && (
                                <div className="co-expanded fade-in">
                                    <div className="co-expanded-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="co-full-item">
                                                <img src={item.productImage.startsWith('http') ? item.productImage : `${server}/${item.productImage}`} alt={item.productName} />
                                                <div className="co-full-info">
                                                    <h5>{item.productName}</h5>
                                                    <p>Qty: {item.quantity} <span>|</span> ₹{item.priceAtPurchase.toLocaleString()}</p>
                                                </div>
                                                <div className="co-full-price">₹{(item.quantity * item.priceAtPurchase).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="co-footer-grid">
                                        <div className="co-footer-box">
                                            <h6><MapPin size={14}/> Shipping Address</h6>
                                            <p><strong>{order.deliveryAddress.name}</strong><br/>{order.deliveryAddress.addressLine}<br/>{order.deliveryAddress.city} - {order.deliveryAddress.pin}</p>
                                        </div>
                                        <div className="co-footer-box">
                                            <h6><CreditCard size={14}/> Payment Info</h6>
                                            <p>Method: <span style={{textTransform:'uppercase'}}>{order.paymentMethod}</span></p>
                                            <p>Status: <strong className={order.paymentStatus === 'Paid' ? 'text-green' : 'text-orange'}>{order.paymentStatus}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomerOrders;