import React, { useState, useEffect } from 'react';
import axios from '../axiosPatch'; 
import server from '../environment';
import AdminNavbar from '../components/AdminNavbar';
import { Search, Box, Trash2, Eye, X, Store,XOctagon,CheckCircle2, IndianRupee, Layers, AlertTriangle, List, RefreshCcw, AlertOctagon, PackageOpen } from 'lucide-react';
import './Catalog.css';
import { customAlert } from '../utils/toastAlert';


const Catalog = () => {
    const [activeTab, setActiveTab] = useState('live');
    const [products, setProducts] = useState([]);
    const [trashedProducts, setTrashedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchCatalog();
    }, [activeTab]);

    const fetchCatalog = async () => {
        setLoading(true);
        try {
            if (activeTab === 'live') {
                const res = await axios.get(`${server}/admin/catalog`);
                if (res.data.success) setProducts(res.data.data);
            } else {
                const res = await axios.get(`${server}/admin/trash/catalog`);
                if (res.data.success) setTrashedProducts(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch catalog", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTakedown = async (productId, productName) => {
        if (!window.confirm(`⚠️ FORCE TAKEDOWN: Are you sure you want to remove "${productName}"? It will be moved to the Trash Bin.`)) return;
        
        try {
            const res = await axios.post(`${server}/admin/catalog/${productId}/trash`);
            if (res.data.success) {
                setProducts(products.filter(p => p._id !== productId));
            }
        } catch (error) { customAlert("Failed to take down product"); }
    };

    const handleRecover = async (trashId, productName) => {
        if (!window.confirm(`Recover "${productName}"? It will go live on the platform again.`)) return;
        try {
            const res = await axios.post(`${server}/admin/trash/catalog/${trashId}/recover`);
            if (res.data.success) {
                setTrashedProducts(trashedProducts.filter(p => p._id !== trashId));
            }
        } catch (error) { customAlert("Failed to recover product"); }
    };

    const handlePermanentDelete = async (trashId, productName) => {
        if (!window.confirm(`⚠️ PERMANENTLY DELETE "${productName}"? This cannot be undone and all data will be lost forever.`)) return;
        try {
            const res = await axios.delete(`${server}/admin/trash/catalog/${trashId}`);
            if (res.data.success) {
                setTrashedProducts(trashedProducts.filter(p => p._id !== trashId));
            }
        } catch (error) { customAlert("Failed to delete permanently"); }
    };

    const currentList = activeTab === 'live' ? products : trashedProducts;
    const filteredProducts = currentList.filter(item => {
        const target = activeTab === 'live' ? item : item.productData;
        return target.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
               target.vendorId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="admin-page-layout">
            <AdminNavbar />
            
            <div className="cat-main-container">
                
                <div className="cat-header-section">
                    <div className="cat-title-block">
                        <h3>Global Catalog</h3>
                        <p>Monitor all products, enforce quality control, and manage takedowns.</p>
                    </div>
                    <div className="cat-search-pill">
                        <Search size={16} className="cat-icon-gray"/>
                        <input 
                            type="text" 
                            placeholder="Search product or vendor..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="cat-tabs-row">
                    <button 
                        className={`cat-tab-btn ${activeTab === 'live' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('live')}
                    >
                        <Box size={14}/> Live Products <span className="cat-tab-count">{products.length}</span>
                    </button>
                    <button 
                        className={`cat-tab-btn ${activeTab === 'trash' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('trash')}
                    >
                        <Trash2 size={14}/> Takedowns <span className="cat-tab-count trash">{trashedProducts.length}</span>
                    </button>
                </div>

                {activeTab === 'live' && (
                    <div className="cat-kpi-grid">
                        <div className="cat-kpi-card">
                            <div className="kpi-icon "><PackageOpen size={16}/></div>
                            <div className="kpi-data">
                                <p>Total Live Products</p>
                                <h4>{products.length}</h4>
                            </div>
                        </div>
                        <div className="cat-kpi-card ">
                            <div className="kpi-icon "><AlertTriangle size={16}/></div>
                            <div className="kpi-data">
                                <p>Low Stock Alerts ({"< 5"})</p>
                                <h4 className="text-orange">{products.filter(p => p.stock < 5 && p.stock > 0).length}</h4>
                            </div>
                        </div>
                        <div className="cat-kpi-card ">
                            <div className="kpi-icon "><XOctagon size={16}/></div>
                            <div className="kpi-data">
                                <p>Out of Stock (0)</p>
                                <h4 className="text-red">{products.filter(p => p.stock === 0).length}</h4>
                            </div>
                        </div>
                    </div>
                )}

                <div className="cat-data-surface">
                    {loading ? (
                        <div className="cat-empty-state">
                            <RefreshCcw className="spinner" size={24} color="#0ea5e9" />
                            <p>Loading catalog data...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="cat-empty-state">
                            {activeTab === 'live' ? <Box size={32} color="#94a3b8" /> : <Trash2 size={32} color="#fca5a5" />}
                            <h3>No Products Found</h3>
                            <p>No matching items in this list.</p>
                        </div>
                    ) : (
                        <table className="cat-table">
                            <thead>
                                <tr>
                                    <th>Product Item</th>
                                    <th>Category</th>
                                    <th>Sold By (Vendor)</th>
                                    <th>Price & Stock</th>
                                    <th style={{textAlign: 'right'}}>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(item => {
                                    const isTrash = activeTab === 'trash';
                                    const product = isTrash ? item.productData : item;
                                    const itemId = item._id;

                                    return (
                                        <tr key={itemId} className={product.stock === 0 || isTrash ? 'cat-row-dimmed' : 'cat-row-active'}>
                                            <td>
                                                <div className="cat-profile-flex">
                                                    <div className="cat-img-sm">
                                                        <img 
                                                            src={product.images && product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${server}/${product.images[0]}`) : 'https://placehold.co/100x100?text=No+Img'} 
                                                            alt="product" 
                                                        />
                                                    </div>
                                                    <div className="cat-profile-text">
                                                        <strong title={product.name}>{product.name.length > 35 ? product.name.substring(0, 35) + '...' : product.name}</strong>
                                                        <span>ID: {product._id?.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="cat-tag tag-purple">{product.category}</span>
                                            </td>

                                            <td>
                                                <div className="cat-info-stack">
                                                    <span className="text-dark"><Store size={12}/> {product.vendorId?.companyName || 'Unknown Vendor'}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="cat-info-stack">
                                                    <span className="text-dark font-bold">₹{product.mrp?.toLocaleString()}</span>
                                                    {isTrash ? (
                                                        <span className="text-red"><AlertOctagon size={12}/> Takedown</span>
                                                    ) : product.stock > 0 ? (
                                                        <span className={product.stock < 5 ? "text-orange" : "text-emerald"}>
                                                            {product.stock < 5 ? <AlertTriangle size={12}/> : <CheckCircle2 size={12}/>} Stock: {product.stock}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red"><XOctagon size={12}/> Out of Stock</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={{textAlign: 'right'}}>
                                                {isTrash ? (
                                                    <div className="cat-action-group">
                                                        <button className="cat-btn-soft btn-green" onClick={() => handleRecover(itemId, product.name)}>
                                                            <RefreshCcw size={12} /> Restore
                                                        </button>
                                                        <button className="cat-btn-soft btn-red" onClick={() => handlePermanentDelete(itemId, product.name)}>
                                                            <AlertOctagon size={12} /> Delete
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="cat-action-group">
                                                        <button className="cat-btn-soft btn-blue" onClick={() => setSelectedProduct({ ...product, isTrashId: itemId })}>
                                                            <Eye size={12} /> View
                                                        </button>
                                                        <button className="cat-btn-soft btn-gray" onClick={() => handleTakedown(itemId, product.name)} title="Force Takedown">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <div className="cat-modal-backdrop" onClick={() => setSelectedProduct(null)}>
                    <div className="cat-modal-window fade-in" onClick={e => e.stopPropagation()}>
                        
                        <div className="cm-pro-header">
                            <div>
                                <h3>Product Details</h3>
                                <p>Review catalog entry, specs, and vendor details.</p>
                            </div>
                            <button className="cm-close-btn" onClick={() => setSelectedProduct(null)}><X size={18} /></button>
                        </div>

                        <div className="cat-modal-body">
                            <div className="cat-modal-split">
                                
                                <div className="cm-left-gallery">
                                    <div className="cm-main-img">
                                        <img 
                                            src={selectedProduct.images && selectedProduct.images[0] ? (selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `${server}/${selectedProduct.images[0]}`) : 'https://placehold.co/400x400?text=No+Image'} 
                                            alt="Main" 
                                        />
                                    </div>
                                    <div className="cm-thumb-list">
                                        {selectedProduct.images?.slice(1, 5).map((img, idx) => (
                                            <div key={idx} className="cm-thumb">
                                                <img src={img.startsWith('http') ? img : `${server}/${img}`} alt="thumb" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="cm-right-data">
                                    <div className="cm-title-area">
                                        <span className="cat-tag tag-purple" style={{marginBottom: '8px'}}>{selectedProduct.category}</span>
                                        <h4>{selectedProduct.name}</h4>
                                        <span className="cm-pid">Product ID: {selectedProduct._id}</span>
                                    </div>

                                    <div className="cm-price-stock-grid">
                                        <div className="cm-metric-box">
                                            <label>Listed MRP</label>
                                            <h4 className="text-dark">₹{selectedProduct.mrp?.toLocaleString()}</h4>
                                        </div>
                                        <div className="cm-metric-box">
                                            <label>Stock Status</label>
                                            <h4 className={selectedProduct.stock === 0 ? 'text-red' : selectedProduct.stock < 5 ? 'text-orange' : 'text-emerald'}>
                                                {selectedProduct.stock} Units
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="cm-detail-panel">
                                        <div className="panel-header">
                                            <Store size={14}/> <h4>Vendor Information</h4>
                                        </div>
                                        <div className="panel-row">
                                            <span className="panel-label">Store Name</span>
                                            <span className="panel-value">{selectedProduct.vendorId?.companyName || 'N/A'}</span>
                                        </div>
                                        <div className="panel-row">
                                            <span className="panel-label">Owner</span>
                                            <span className="panel-value">{selectedProduct.vendorId?.ownerName || 'N/A'}</span>
                                        </div>
                                        <div className="panel-row">
                                            <span className="panel-label">Contact</span>
                                            <span className="panel-value">{selectedProduct.vendorId?.email || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="cm-detail-panel">
                                        <div className="panel-header">
                                            <List size={14}/> <h4>Specifications</h4>
                                        </div>
                                        {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
                                            <div className="cm-spec-grid">
                                                {selectedProduct.specifications.map((spec, idx) => (
                                                    <div key={idx} className="spec-pill">
                                                        <span className="s-key">{spec.name || spec.key}</span>
                                                        <span className="s-val">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="cm-empty-text">No specifications provided.</p>
                                        )}
                                    </div>

                                    <div className="cm-detail-panel" style={{marginBottom: 0}}>
                                        <div className="panel-header">
                                            <Layers size={14}/> <h4>Description</h4>
                                        </div>
                                        <div className="cm-desc-text">
                                            {selectedProduct.description || 'No description provided by the vendor.'}
                                        </div>
                                    </div>

                                    <div className="cm-modal-actions">
                                        {activeTab === 'live' ? (
                                            <button className="cm-btn-block btn-red" onClick={() => {
                                                handleTakedown(selectedProduct._id, selectedProduct.name);
                                                setSelectedProduct(null);
                                            }}>
                                                <AlertTriangle size={16}/> Force Takedown
                                            </button>
                                        ) : (
                                            <div style={{display:'flex', gap:'10px', width: '100%'}}>
                                                <button className="cm-btn-block btn-green" style={{flex: 1}} onClick={() => {
                                                    handleRecover(selectedProduct.isTrashId, selectedProduct.name);
                                                    setSelectedProduct(null);
                                                }}>
                                                    <RefreshCcw size={16}/> Restore
                                                </button>
                                                <button className="cm-btn-block btn-red" style={{flex: 1}} onClick={() => {
                                                    handlePermanentDelete(selectedProduct.isTrashId, selectedProduct.name);
                                                    setSelectedProduct(null);
                                                }}>
                                                    <AlertOctagon size={16}/> Delete Forever
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;