import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, Plus, Edit2, Trash2, 
    MoreVertical, ChevronDown, Tag, Loader2
} from 'lucide-react';
import VendorDashNavbar from '../vendor/VendorDashNavbar';
import './VendorInventory.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../../environment'; 
import { customAlert } from '../../utils/toastAlert';


const VendorInventory = () => {
    const navigate = useNavigate();
    
    const [inventoryData, setInventoryData] = useState([]);
    const [stats, setStats] = useState({ totalProducts: 0, lowStockCount: 0, outOfStockCount: 0 });
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedPricing, setSelectedPricing] = useState("All Pricing");
    const [categories, setCategories] = useState(["All Categories"]);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/vendors/products`);
            if (res.data.success) {
                const activeProducts = res.data.data.filter(item => item.status !== 'Draft');
                
                setInventoryData(activeProducts);
                
                setStats({
                    totalProducts: activeProducts.length,
                    lowStockCount: activeProducts.filter(p => p.stock > 0 && p.stock <= 10).length,
                    outOfStockCount: activeProducts.filter(p => p.stock === 0).length
                });

                const uniqueCategories = ["All Categories", ...new Set(activeProducts.map(item => item.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            customAlert("Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? This will also update your total product limit.")) return;

        try {
            const res = await axios.delete(`${server}/vendors/products/${productId}`);
            if (res.data.success) {
                fetchInventory(); 
            }
        } catch (error) {
            customAlert(error.response?.data?.message || "Failed to delete product.");
        }
    };

    const handleUpdateStock = async (productId, currentStock) => {
        const newStock = window.prompt("Enter new stock quantity:", currentStock);
        
        if (newStock === null || newStock.trim() === "") return;
        
        const stockNumber = Number(newStock);
        if (isNaN(stockNumber) || stockNumber < 0) {
            return customAlert("Please enter a valid non-negative number.");
        }

        try {
            const res = await axios.patch(`${server}/vendors/products/${productId}/stock`, { stock: stockNumber });
            if (res.data.success) {
                fetchInventory(); 
            }
        } catch (error) {
            customAlert(error.response?.data?.message || "Failed to update stock.");
        }
    };

    const filteredInventory = inventoryData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
        const matchesPricing = selectedPricing === "All Pricing" ||
                               (selectedPricing === "Bargainable" && item.isBargainable) ||
                               (selectedPricing === "Fixed Price" && !item.isBargainable);

        return matchesSearch && matchesCategory && matchesPricing;
    });

    const getStockStatus = (stock) => {
        if (stock === 0) return "Out of Stock";
        if (stock <= 10) return "Low Stock";
        return "In Stock";
    };

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            
            <div className="va-full-width-container">
                <div className="vi-header-row">
                    <div>
                        <h2 className="va-title">Product <span className="pink-text">Inventory.</span></h2>
                        <p className="ve-subtitle">Manage your live catalog, stock levels, and pricing models.</p>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                        <button className="vi-premium-add-btn" onClick={() => navigate("/vendor/add-product")}>
                            <Plus size={16} /> Add New Product
                        </button>
                    </div>
                </div>

                <div className="vi-naked-stats-row">
                    <div className="vi-n-stat">
                        <strong className="text-dark">{stats.totalProducts}</strong> 
                        <span>Active Products</span>
                    </div>
                    <div className="vi-n-divider"></div>
                    <div className="vi-n-stat">
                        <strong className="text-orange">{stats.lowStockCount}</strong> 
                        <span className="text-orange">Low Stock</span>
                    </div>
                    <div className="vi-n-divider"></div>
                    <div className="vi-n-stat">
                        <strong className="text-red">{stats.outOfStockCount}</strong> 
                        <span className="text-red">Out of Stock</span>
                    </div>
                </div>

                <div className="booking-section-card vi-table-wrapper">
                    <div className="vi-toolbar">
                        <div className="vi-search-box">
                            <Search size={16} className="vi-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search product name or SKU..." 
                                className="vi-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="vi-filters-group">
                            <div className="vi-custom-filter">
                                <Filter size={14} className="vi-filter-icon" />
                                <select className="vi-filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                    {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                                </select>
                                <ChevronDown size={14} className="vi-filter-arrow"/>
                            </div>

                            <div className="vi-custom-filter">
                                <Tag size={14} className="vi-filter-icon" />
                                <select className="vi-filter-select" value={selectedPricing} onChange={(e) => setSelectedPricing(e.target.value)}>
                                    <option value="All Pricing">All Pricing</option>
                                    <option value="Bargainable">Bargainable</option>
                                    <option value="Fixed Price">Fixed Price</option>
                                </select>
                                <ChevronDown size={14} className="vi-filter-arrow"/>
                            </div>
                        </div>
                    </div>

                    <div className="vi-table-responsive">
                        {loading ? (
                            <div style={{display: 'flex', justifyContent: 'center', padding: '40px'}}><Loader2 className="spinner" size={30} color="#FF2E63"/></div>
                        ) : filteredInventory.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>No active products found matching your criteria.</div>
                        ) : (
                            <table className="vi-table">
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Category</th>
                                        <th>Stock Status</th>
                                        <th>List Price (MRP)</th>
                                        <th>Pricing Model</th>
                                        <th style={{textAlign: 'right'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="vi-product-col">
                                                    <img src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://placehold.co/100"} alt={item.name} className="vi-prod-img" />
                                                    <div>
                                                        <h5 className="vi-prod-name">{item.name}</h5>
                                                        <span className="vi-prod-id">{item.sku || item._id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="vi-category-tag">{item.category}</span></td>
                                            <td>
                                                <div className="vi-stock-col">
                                                    <span className={`vi-status-dot ${item.stock > 10 ? 'bg-green' : item.stock > 0 ? 'bg-orange' : 'bg-red'}`}></span>
                                                    <span style={{fontWeight: '700', color: '#1e293b', fontSize: '0.85rem'}}>{item.stock} Units</span>
                                                    <span className="vi-prod-id" style={{fontSize: '0.7rem', display: 'block', marginTop: '2px'}}>{getStockStatus(item.stock)}</span>
                                                </div>
                                            </td>
                                            <td><strong className="vi-price-mrp">₹{item.mrp?.toLocaleString()}</strong></td>
                                            <td>
                                                {item.isBargainable ? (
                                                    <div className="vi-bargain-box">
                                                        <span className="text-pink" style={{fontWeight: '800', fontSize: '0.85rem'}}>Min: ₹{item.minBargainPrice?.toLocaleString() || 0}</span>
                                                    </div>
                                                ) : <span className="vi-fixed-price-tag">Fixed Price</span>}
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                                <div className="vi-action-btns">
                                                    <button className="vi-icon-btn" title="Edit Full Details" onClick={() => navigate(`/vendor/edit-product/${item._id}`)}>
                                                        <Edit2 size={14}/>
                                                    </button>
                                                    <button className="vi-icon-btn text-red" title="Delete Product" onClick={() => handleDelete(item._id)}>
                                                        <Trash2 size={14}/>
                                                    </button>
                                                    <button className="vi-icon-btn" title="Quick Update Stock" onClick={() => handleUpdateStock(item._id, item.stock)}>
                                                        <MoreVertical size={14}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorInventory;