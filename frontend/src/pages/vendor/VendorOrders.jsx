import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../../environment'; 
import { useAuth } from '../../context/AuthContext'; 
import { 
    Search, Filter, Download, MapPin, 
    ChevronDown, Clock, Truck, CheckCircle2, Package, AlertCircle, ShoppingBag, Eye, X, CreditCard, User, Box, Loader2
} from 'lucide-react';
import VendorDashNavbar from '../vendor/VendorDashNavbar';
import './VendorOrders.css'; 
import { customAlert } from '../../utils/toastAlert';


const VendorOrders = () => {
    const { token } = useAuth(); 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${server}/vendors/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const handleStatusChange = async (e, orderId, newStatus) => {
        e.stopPropagation(); 
        try {
            const res = await axios.patch(`${server}/vendors/orders/${orderId}/status`, 
                { orderStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const updatedOrderData = res.data.data;
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrderData : o));
                
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder(updatedOrderData);
                }
                
                if(newStatus === 'Delivered' && updatedOrderData.paymentMethod === 'cod') {
                    customAlert(`Order Delivered & COD Payment Marked as Completed!`);
                } else {
                    customAlert(`Order updated to ${newStatus}`);
                }
            }
        } catch (error) {
            customAlert("Failed to update status. Please try again.");
            console.error(error);
        }
    };

    const handleExportOrders = () => {
        if (filteredOrders.length === 0) {
            return customAlert("No orders available to export.");
        }
        const headers = ['Order_ID', 'Date', 'Customer_Name', 'Phone', 'City', 'Items_Count', 'Total_INR', 'Payment_Method', 'Payment_Status', 'Order_Status'];
        const csvRows = filteredOrders.map(order => {
            const safeName = order.deliveryAddress?.name ? order.deliveryAddress.name.replace(/,/g, ' ') : 'N/A';
            const safeCity = order.deliveryAddress?.city ? order.deliveryAddress.city.replace(/,/g, ' ') : 'N/A';
            const safeId = `'${order._id.slice(-4).toUpperCase()}`; 
            return [
                safeId, new Date(order.createdAt).toLocaleDateString('en-IN'), safeName, order.deliveryAddress?.phone || 'N/A', safeCity,
                order.items?.length || 0, order.totalAmount, order.paymentMethod.toUpperCase(), order.paymentStatus, order.orderStatus
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Store_Orders_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Processing': return { text: 'text-orange', icon: <Package size={14}/> };
            case 'Shipped': return { text: 'text-blue', icon: <Truck size={14}/> };
            case 'Delivered': return { text: 'text-green', icon: <CheckCircle2 size={14}/> };
            case 'Cancelled': return { text: 'text-red', icon: <AlertCircle size={14}/> };
            default: return { text: 'text-gray', icon: <Clock size={14}/> };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              order.deliveryAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            <div className="va-full-width-container">
                <div className="vi-header-row">
                    <div>
                        <h2 className="va-title">Active <span className="pink-text">Orders.</span></h2>
                        <p className="ve-subtitle">Manage fulfillment, packing, and dispatch pipeline.</p>
                    </div>
                    <button className="vi-premium-add-btn" onClick={handleExportOrders}>
                        <Download size={16} /> Export Orders
                    </button>
                </div>

                {loading ? (
                    <div style={{textAlign: 'center', padding: '100px'}}>
                        <Loader2 className="spinner text-pink" size={40} style={{margin: '0 auto'}}/>
                        <p style={{marginTop: '15px', color: '#64748b'}}>Loading Orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', marginTop: '30px', border: '1px dashed #cbd5e1'}}>
                        <ShoppingBag size={60} color="#cbd5e1" style={{marginBottom: '20px', margin: '0 auto'}} />
                        <h3 style={{marginTop:'15px', fontWeight: '800'}}>No orders found!</h3>
                        <p style={{color:'#64748b', fontSize: '0.9rem'}}>Your store's orders will appear here once customers start buying.</p>
                    </div>
                ) : (
                    <>
                        <div className="vi-naked-stats-row">
                            <div className="vi-n-stat"><strong>{orders.filter(o => o.orderStatus === 'Processing').length}</strong> <span>Processing</span></div>
                            <div className="vi-n-divider"></div>
                            <div className="vi-n-stat"><strong>{orders.filter(o => o.orderStatus === 'Shipped').length}</strong> <span>Shipped</span></div>
                            <div className="vi-n-divider"></div>
                            <div className="vi-n-stat"><strong>{orders.filter(o => o.orderStatus === 'Delivered').length}</strong> <span>Delivered</span></div>
                        </div>

                        <div className="booking-section-card vi-table-wrapper">
                            <div className="vi-toolbar">
                                <div className="vi-search-box">
                                    <Search size={16} className="vi-search-icon" />
                                    <input type="text" placeholder="Search..." className="vi-search-input" onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="vi-filters-group">
                                    <div className="vi-custom-filter">
                                        <Filter size={14} className="vi-filter-icon" />
                                        <select className="vi-filter-select" onChange={e => setStatusFilter(e.target.value)}>
                                            <option value="All">All Statuses</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <ChevronDown size={14} className="vi-filter-arrow"/>
                                    </div>
                                </div>
                            </div>

                            <div className="vi-table-responsive">
                                <table className="vi-table">
                                    <thead>
                                        <tr>
                                            <th>Order Details</th>
                                            <th>Customer & Location</th>
                                            <th>Items</th>
                                            <th>Total Paid</th>
                                            <th>Status</th>
                                            <th style={{textAlign: 'right'}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => {
                                            const statusStyle = getStatusStyle(order.orderStatus);
                                            return (
                                                <tr key={order._id}>
                                                    <td>
                                                        <h5 className="vi-prod-name" style={{fontSize: '0.9rem'}}>#{order._id.slice(-4).toUpperCase()}</h5>
                                                        <span className="vi-prod-id">{formatDate(order.createdAt)}</span>
                                                    </td>
                                                    <td>
                                                        <h5 className="vi-prod-name" style={{fontSize: '0.85rem'}}>{order.deliveryAddress?.name}</h5>
                                                        <span className="vi-prod-id" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                            <MapPin size={10}/> {order.deliveryAddress?.city}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{fontSize:'0.85rem', color: '#475569', fontWeight: '600'}}>{order.items?.length || 0} Item(s)</div>
                                                    </td>
                                                    <td>
                                                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                                            <strong className="vi-price-mrp" style={{fontWeight: '800'}}>
                                                                ₹{order.totalAmount.toLocaleString()}
                                                            </strong>
                                                            {order.paymentStatus === 'Completed' ? (
                                                                <span className="vi-category-tag text-green" style={{ width: 'max-content'}}>Paid</span>
                                                            ) : (
                                                                <span className="vi-category-tag text-orange" style={{ width: 'max-content'}}>Pending</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`vo-status-text ${statusStyle.text}`}>
                                                            {statusStyle.icon} <span>{order.orderStatus}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{textAlign: 'right'}}>
                                                        <div className="vi-action-btns">
                                                            <button 
                                                                className="vi-icon-btn"
                                                                onClick={() => setSelectedOrder(order)}
                                                                title="View Details"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <select 
                                                                className="vo-action-select" 
                                                                value={order.orderStatus}
                                                                onChange={(e) => handleStatusChange(e, order._id, e.target.value)}
                                                                disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                                                            >
                                                                <option value="Processing">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {selectedOrder && (
                <div className="vo-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="vo-modal-content fade-in-scale" onClick={e => e.stopPropagation()}>
                        
                        <div className="vo-modal-header">
                            <div>
                                <h3 className="va-title" style={{fontSize: '1.3rem'}}>
                                    Order <span className="pink-text">#{selectedOrder._id.slice(-4).toUpperCase()}</span>
                                </h3>
                                <p className="ve-subtitle" style={{marginTop: '2px'}}>
                                    Placed on {formatDate(selectedOrder.createdAt)}
                                </p>
                            </div>
                            <button className="vi-icon-btn" onClick={() => setSelectedOrder(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="vo-modal-body">
                            <div className="vo-details-grid">
                                <div className="vo-detail-card">
                                    <h4 className="vo-card-title"><User size={15}/> Customer Info</h4>
                                    <p><strong>Name:</strong> {selectedOrder.customerId?.username || selectedOrder.deliveryAddress?.name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerId?.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.deliveryAddress?.phone}</p>
                                </div>

                                <div className="vo-detail-card">
                                    <h4 className="vo-card-title"><MapPin size={15}/> Shipping Address</h4>
                                    <p><strong>{selectedOrder.deliveryAddress?.name}</strong></p>
                                    <p style={{lineHeight: '1.5', marginTop: '6px', color: '#475569', fontSize: '0.85rem'}}>
                                        {selectedOrder.deliveryAddress?.addressLine}<br/>
                                        {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}<br/>
                                        Pincode: <strong>{selectedOrder.deliveryAddress?.pin}</strong>
                                    </p>
                                </div>

                                <div className="vo-detail-card">
                                    <h4 className="vo-card-title"><CreditCard size={15}/> Payment Info</h4>
                                    <p><strong>Method:</strong> <span style={{textTransform:'uppercase'}}>{selectedOrder.paymentMethod}</span></p>
                                    <p style={{marginTop: '6px', display:'flex', alignItems: 'center', gap: '6px'}}><strong>Status:</strong> 
                                        <span className={`vi-category-tag ${selectedOrder.paymentStatus === 'Completed' ? 'text-green bg-green-light' : 'text-orange bg-orange-light'}`} style={{padding: '2px 8px', display:'inline-block'}}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </p>
                                    <h3 style={{marginTop: '15px', color: '#0f172a', fontSize: '1.2rem', fontWeight: '900'}}>
                                        Total: ₹{selectedOrder.totalAmount.toLocaleString()}
                                    </h3>
                                </div>
                            </div>

                            <div className="vo-items-section">
                                <h4 className="vo-card-title" style={{marginBottom: '15px'}}><Box size={15}/> Items Ordered</h4>
                                <div className="vo-items-list">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="vo-item-row">
                                            <div className="vo-item-image">
                                                <img 
                                                    src={item.productImage ? (item.productImage.startsWith('http') ? item.productImage : `${server}/${item.productImage}`) : 'https://placehold.co/100x100?text=No+Image'} 
                                                    alt={item.productName} 
                                                />
                                            </div>
                                            <div className="vo-item-info">
                                                <p className="vi-prod-name">{item.productName}</p>
                                                <p className="vi-prod-id">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="vo-item-price" style={{fontWeight: '800', color: '#0f172a'}}>
                                                ₹{(item.priceAtPurchase * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="vo-modal-footer">
                                <span style={{fontWeight: '600', color: '#64748b', fontSize: '0.85rem'}}>Order Status:</span>
                                <div className={`vo-status-text ${getStatusStyle(selectedOrder.orderStatus).text}`} >
                                    {getStatusStyle(selectedOrder.orderStatus).icon} <span>{selectedOrder.orderStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorOrders;