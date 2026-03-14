import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, Edit2, Trash2, 
    ChevronDown, Loader2, FileEdit
} from 'lucide-react';
import VendorDashNavbar from '../vendor/VendorDashNavbar';
import './VendorInventory.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../../environment'; 
import { customAlert } from '../../utils/toastAlert';


const VendorDrafts = () => {
    const navigate = useNavigate();
    
    const [draftData, setDraftData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [categories, setCategories] = useState(["All Categories"]);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/vendors/products`);
            if (res.data.success) {
                const draftsOnly = res.data.data.filter(item => item.status === 'Draft');
                
                setDraftData(draftsOnly);

                const uniqueCategories = ["All Categories", ...new Set(draftsOnly.map(item => item.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching drafts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this draft?")) return;

        try {
            const res = await axios.delete(`${server}/vendors/products/${productId}`);
            if (res.data.success) fetchDrafts(); 
        } catch (error) {
            customAlert("Failed to delete draft.");
        }
    };

    const filteredDrafts = draftData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            
            <div className="va-full-width-container">
                <div className="vi-header-row">
                    <div>
                        <h2 className="va-title">Saved <span className="pink-text">Drafts.</span></h2>
                        <p className="ve-subtitle">Finish setting up these products to make them live.</p>
                    </div>
                    <button className="vi-premium-add-btn" onClick={() => navigate("/vendor/inventory")} >
                        Back to Live Inventory
                    </button>
                </div>

                <div className="booking-section-card vi-table-wrapper" style={{marginTop:'30px'}}>
                    <div className="vi-toolbar">
                        <div className="vi-search-box">
                            <Search size={16} className="vi-search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search drafts..." 
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
                        </div>
                    </div>

                    <div className="vi-table-responsive">
                        {loading ? (
                            <div style={{display: 'flex', justifyContent: 'center', padding: '40px'}}><Loader2 className="spinner" size={30} color="#FF2E63"/></div>
                        ) : filteredDrafts.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '60px', color: '#64748b'}}>
                                <FileEdit size={40} color="#cbd5e1" style={{marginBottom: '10px'}}/>
                                <h4>No drafts found.</h4>
                                <p style={{fontSize:'0.85rem'}}>Products saved as "Draft" will appear here.</p>
                            </div>
                        ) : (
                            <table className="vi-table">
                                <thead>
                                    <tr>
                                        <th>Product Details</th>
                                        <th>Category</th>
                                        <th>List Price (MRP)</th>
                                        <th>Status</th>
                                        <th style={{textAlign: 'right'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDrafts.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="vi-product-col">
                                                    <img src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`) : "https://placehold.co/100"} alt={item.name} className="vi-prod-img" style={{opacity: 0.6}} />
                                                    <div>
                                                        <h5 className="vi-prod-name">{item.name}</h5>
                                                        <span className="vi-prod-id" style={{color: '#ef4444'}}>Incomplete Setup</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="vi-category-tag">{item.category}</span></td>
                                            <td><strong className="vi-price-mrp">₹{item.mrp?.toLocaleString() || 0}</strong></td>
                                            <td>
                                                <span style={{background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700'}}>
                                                    Draft
                                                </span>
                                            </td>
                                            <td style={{textAlign: 'right'}}>
                                                <div className="vi-action-btns">
                                                    <button className="vi-icon-btn" title="Continue Editing" onClick={() => navigate(`/vendor/edit-product/${item._id}`)}>
                                                        <Edit2 size={14}/>
                                                    </button>
                                                    <button className="vi-icon-btn text-red" title="Delete Draft" onClick={() => handleDelete(item._id)}>
                                                        <Trash2 size={14}/>
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

export default VendorDrafts;