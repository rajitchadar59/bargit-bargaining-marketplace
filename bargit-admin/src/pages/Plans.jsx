import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../environment'; 
import AdminNavbar from '../components/AdminNavbar';
import { Edit3, X, CheckCircle2, Loader2, Trash2, Plus, Calculator, Lock } from 'lucide-react';
import './Plans.css';

const Plans = () => {
    const defaultPlans = [
        { 
            planId: 'free', planType: 'free', name: 'Free Tier', 
            price: 0, period: 99999, productLimit: 5, platformFee: 0, 
            pricePerDay: 0, pricePerProduct: 0, isActive: true,
            features: ['Standard Store Profile', 'Basic Email Support'],
            style: 'basic', btnClass: 'btn-outline'
        },
        { 
            planId: 'pro', planType: 'fixed', name: 'Pro Plan', 
            price: 999, period: 30, productLimit: 100, platformFee: 0, 
            pricePerDay: 0, pricePerProduct: 0, isActive: true,
            features: ['Priority AI Bargaining', 'Premium Store Badge'],
            badge: 'RECOMMENDED', badgeClass: 'badge-blue', style: 'pro', btnClass: 'btn-solid-blue'
        },
        { 
            planId: 'premium', planType: 'fixed', name: 'Premium Plan', 
            price: 2499, period: 365, productLimit: 99999, platformFee: 0, 
            pricePerDay: 0, pricePerProduct: 0, isActive: true,
            features: ['Advanced Analytics', '24/7 Priority Support'],
            badge: 'BEST VALUE', badgeClass: 'badge-pink', style: 'premium', btnClass: 'btn-solid-pink'
        },
        { 
            planId: 'flexible', planType: 'flexible', name: 'Pay-As-You-Go', 
            price: 0, period: -1, productLimit: -1, platformFee: 0, // -1 means Vendor Chooses
            pricePerDay: 15, // Cost per Day
            pricePerProduct: 2, // Cost per Product Upload
            isActive: true,
            features: ['Vendor chooses duration', 'Vendor chooses limits', 'Auto-calculated pricing'],
            badge: 'SMART FLEXIBLE', badgeClass: 'badge-purple', style: 'special', btnClass: 'btn-solid-purple'
        }
    ];

    const [plans, setPlans] = useState(defaultPlans);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get(`${server}/admin/plans`);
                if (res.data.success && res.data.data.length > 0) {
                    const dbPlans = res.data.data.map(dbPlan => {
                        const matchedDefault = defaultPlans.find(p => p.planId === dbPlan.planId) || {};
                        return { ...matchedDefault, ...dbPlan }; 
                    });
                    
                    if (!dbPlans.find(p => p.planId === 'flexible')) {
                        dbPlans.push(defaultPlans.find(p => p.planId === 'flexible'));
                    }
                    setPlans(dbPlans);
                }
            } catch (error) {
                console.log("Showing default UI. Backend might be empty.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleEditClick = (plan) => {
        setEditingPlan({ ...plan });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setEditingPlan(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...editingPlan.features];
        newFeatures[index] = value;
        setEditingPlan(prev => ({ ...prev, features: newFeatures }));
    };
    const addFeature = () => setEditingPlan(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeFeature = (index) => setEditingPlan(prev => ({ ...prev, features: editingPlan.features.filter((_, i) => i !== index) }));

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            setPlans(prevPlans => prevPlans.map(p => p.planId === editingPlan.planId ? editingPlan : p));
            setIsModalOpen(false);
            await axios.put(`${server}/admin/plans/${editingPlan.planId}`, editingPlan);
        } catch (error) {
            console.error("Database update failed");
        } finally {
            setSaving(false);
        }
    };

    // Helper to format Period Display
    const renderPeriodText = (period) => {
        if (period === 99999) return "Lifetime";
        if (period === -1) return "Custom";
        if (period === 30) return "/month";
        if (period === 365) return "/year";
        return `${period} Days`;
    };

    return (
        <>
            <AdminNavbar />
            <div className="plans-container">
                <div className="plans-header">
                    <h3 className= 'sub-mat'>Subscription Matrix</h3>
                    <p className= 'up-text'>Configure fixed plans, lifetime free tier, and smart flexible pricing.</p>
                </div>

                <div className="plans-grid">
                    {plans.map((plan) => (
                        <div key={plan.planId} className={`plan-card ${plan.style || 'basic'} ${!plan.isActive ? 'disabled' : ''}`}>
                            
                            {!plan.isActive ? (
                                <span className="plan-badge badge-gray">DISABLED</span>
                            ) : plan.badge ? (
                                <span className={`plan-badge ${plan.badgeClass}`}>{plan.badge}</span>
                            ) : null}
                            
                            <div className="plan-name">{plan.name}</div>
                            
                            {plan.planType === 'flexible' ? (
                                <div className="plan-price">
                                    <Calculator size={26} style={{marginRight: '8px', verticalAlign: 'middle', color: '#8b5cf6'}}/> 
                                    Dynamic <span>/ vendor choice</span>
                                </div>
                            ) : (
                                <div className="plan-price">
                                    ₹{plan.price} <span>{renderPeriodText(plan.period) === 'Lifetime' ? ' (Lifetime)' : renderPeriodText(plan.period)}</span>
                                </div>
                            )}

                            <ul className="plan-features">
                                {plan.planType === 'flexible' ? (
                                    <>
                                        <li><CheckCircle2 size={18} color="#8b5cf6" style={{flexShrink: 0}}/> <strong>₹{plan.pricePerDay}</strong> Base cost per day</li>
                                        <li><CheckCircle2 size={18} color="#8b5cf6" style={{flexShrink: 0}}/> <strong>₹{plan.pricePerProduct}</strong> Cost per product slot</li>
                                        <li><CheckCircle2 size={18} color="#8b5cf6" style={{flexShrink: 0}}/> Unlimited scaling possibility</li>
                                    </>
                                ) : (
                                    <>
                                        <li><CheckCircle2 size={18} color={plan.style === 'premium' ? '#FF2E63' : '#10b981'} style={{flexShrink: 0}} /> Up to <strong className={plan.productLimit >= 99999 ? 'pink-text' : ''}>{plan.productLimit >= 99999 ? 'Unlimited' : plan.productLimit} Products</strong></li>
                                        <li><CheckCircle2 size={18} color={plan.style === 'premium' ? '#FF2E63' : '#10b981'} style={{flexShrink: 0}} /> <strong>{plan.platformFee}%</strong> Commission on Sales</li>
                                    </>
                                )}

                                {plan.features && plan.features.map((feat, idx) => (
                                    <li key={idx}>
                                        <CheckCircle2 size={18} color={plan.style === 'premium' ? '#FF2E63' : plan.style === 'special' ? '#8b5cf6' : '#10b981'} style={{flexShrink: 0}} /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button className={`edit-plan-btn ${plan.btnClass || 'btn-outline'}`} onClick={() => handleEditClick(plan)}>
                                <Edit3 size={18} /> Configure {plan.planType === 'flexible' ? 'Rates' : 'Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                {isModalOpen && editingPlan && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Configure {editingPlan.name}</h2>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} strokeWidth={3} /></button>
                            </div>

                            <div className="modal-body">
                                
                                <div className="switch-container">
                                    <label className="toggle-switch">
                                        <input type="checkbox" name="isActive" checked={editingPlan.isActive} onChange={handleInputChange} disabled={editingPlan.planId === 'free'}/>
                                        <span className="slider"></span>
                                    </label>
                                    <div className="toggle-label-text">
                                        <span className="toggle-title">{editingPlan.isActive ? "Plan is Active" : "Plan is Disabled"}</span>
                                        <span className="toggle-desc">{editingPlan.planId === 'free' ? "Free tier cannot be disabled." : "Toggle visibility for vendors."}</span>
                                    </div>
                                </div>

                                <div className="edit-form-grid">
                                    
                                    {editingPlan.planType === 'free' && (
                                        <>
                                            <div className="edit-form-group">
                                                <label><Lock size={12} style={{display:'inline'}}/> Price</label>
                                                <input type="text" value="₹0 (Locked)" disabled />
                                            </div>
                                            <div className="edit-form-group">
                                                <label><Lock size={12} style={{display:'inline'}}/> Validity</label>
                                                <input type="text" value="Lifetime (Locked)" disabled />
                                            </div>
                                            <div className="edit-form-group">
                                                <label>Product Limit</label>
                                                <input type="number" name="productLimit" value={editingPlan.productLimit} onChange={handleInputChange} />
                                            </div>
                                        </>
                                    )}

                                    {editingPlan.planType === 'fixed' && (
                                        <>
                                            <div className="edit-form-group">
                                                <label>Fixed Price (₹)</label>
                                                <input type="number" name="price" value={editingPlan.price} onChange={handleInputChange} />
                                            </div>
                                            <div className="edit-form-group">
                                                <label>Validity (Exact Days)</label>
                                                <input type="number" name="period" value={editingPlan.period} onChange={handleInputChange} placeholder="e.g. 30, 90, 365" />
                                            </div>
                                            <div className="edit-form-group">
                                                <label>Product Limit (99999 = Unl.)</label>
                                                <input type="number" name="productLimit" value={editingPlan.productLimit} onChange={handleInputChange} />
                                            </div>
                                        </>
                                    )}

                                    {editingPlan.planType === 'flexible' && (
                                        <>
                                            <div className="edit-form-group full-width" style={{background:'#faf5ff', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                                                <span style={{fontSize:'0.8rem', color:'#6d28d9', fontWeight:'600'}}>Vendor will choose exact Days & Limits. You only set the costs below.</span>
                                            </div>
                                            <div className="edit-form-group">
                                                <label>Cost Per Day (₹)</label>
                                                <input type="number" name="pricePerDay" value={editingPlan.pricePerDay} onChange={handleInputChange} />
                                            </div>
                                            <div className="edit-form-group">
                                                <label>Cost Per Product (₹)</label>
                                                <input type="number" name="pricePerProduct" value={editingPlan.pricePerProduct} onChange={handleInputChange} />
                                            </div>
                                        </>
                                    )}

                                    <div className="edit-form-group">
                                        <label>Commission Fee (%)</label>
                                        <input type="number" name="platformFee" value={editingPlan.platformFee} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="edit-form-group full-width" style={{marginTop: '10px'}}>
                                    <label>Plan Features</label>
                                    {editingPlan.features.map((feature, index) => (
                                        <div key={index} className="feature-row">
                                            <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} placeholder="e.g. Priority Support" />
                                            <button className="remove-btn" onClick={() => removeFeature(index)}><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button className="add-feature-btn" onClick={addFeature}>
                                        <Plus size={18} style={{display: 'inline', verticalAlign: 'middle', marginRight: '6px'}}/> Add New Feature
                                    </button>
                                </div>

                            </div>

                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
                                <button className="btn-save" onClick={handleSaveChanges} disabled={saving}>
                                    {saving ? <Loader2 size={18} className="spinner" /> : 'Save Configurations'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Plans;