import React, { useState, useEffect } from 'react';
import { 
    UploadCloud, Plus, X, Video, Image as ImageIcon, 
    Sparkles, Info, Trash2, Loader2, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import server from '../../environment';
import VendorDashNavbar from './VendorDashNavbar';
import { customAlert } from '../../utils/toastAlert';

import './VendorAddProduct.css';

const VendorAddProduct = () => {
    const [planStatus, setPlanStatus] = useState({
        used: 0,
        limit: 0,
        isExpired: false,
        loading: true
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        customCategory: '',
        mrp: '',
        isBargainable: true,
        minBargainPrice: '',
        stock: '',
        sku: ''
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    
    const [specifications, setSpecifications] = useState([
        { key: '', value: '' }
    ]);

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitType, setSubmitType] = useState('');

    const categoriesList = [
        'Mobiles', 'Laptops', 'Fashion', 'Shoes', 'Gaming', 
        'Watches', 'Audio', 'Appliances', 'Beauty', 'Grocery', 'Others'
    ];

    useEffect(() => {
        const checkVendorLimit = async () => {
            try {
                const res = await axios.get(`${server}/vendors/profile/subscription`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                if (res.data.success) {
                    const sub = res.data.data.subscription;
                    const totalUsed = res.data.data.totalProducts || 0;
                    const now = new Date();
                    
                    const expired = sub.planId !== 'free' && sub.endDate && new Date(sub.endDate) < now;

                    setPlanStatus({
                        used: totalUsed,
                        limit: sub.productLimit,
                        isExpired: expired,
                        loading: false
                    });
                }
            } catch (error) {
                console.error("Failed to check limits", error);
                setPlanStatus(prev => ({ ...prev, loading: false }));
            }
        };

        checkVendorLimit();
    }, []);

    const isLimitReached = planStatus.used >= planStatus.limit;
    const canUpload = !isLimitReached && !planStatus.isExpired;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        }
    };
    const removeTag = (indexToRemove) => setTags(tags.filter((_, i) => i !== indexToRemove));
    
    const handleSpecChange = (index, field, value) => {
        const updatedSpecs = [...specifications];
        updatedSpecs[index][field] = value;
        setSpecifications(updatedSpecs);
    };
    const addSpecification = () => setSpecifications([...specifications, { key: '', value: '' }]);
    const removeSpecification = (indexToRemove) => setSpecifications(specifications.filter((_, i) => i !== indexToRemove));

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove, e) => {
        e.preventDefault(); 
        setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = (e) => {
        e.preventDefault();
        setVideoFile(null);
        setVideoPreview(null);
    };

    
    const handleSubmit = async (e, finalStatus) => {
        e.preventDefault();

        if (!canUpload) {
            return customAlert("Action denied! Your limit is reached or plan is expired.");
        }
        
        if (!formData.name || !formData.category || !formData.mrp || !formData.stock) {
            return customAlert("Please fill all required fields marked with (*)");
        }

        if (formData.isBargainable) {
            if (!formData.minBargainPrice) {
                return customAlert("AI Bargaining is ON. Please enter a Minimum Bargain Price.");
            }
            if (Number(formData.minBargainPrice) > Number(formData.mrp)) {
                return customAlert("Minimum Bargain Price cannot be greater than List Price (MRP).");
            }
        }

        if (imageFiles.length === 0) {
            return customAlert("At least one product image is required.");
        }

        setIsSubmitting(true);
        setSubmitType(finalStatus); 

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        if (formData.category === 'Others') {
            submitData.append('customCategory', formData.customCategory);
        }
        submitData.append('mrp', formData.mrp);
        submitData.append('isBargainable', formData.isBargainable);
        submitData.append('minBargainPrice', formData.minBargainPrice);
        submitData.append('stock', formData.stock);
        submitData.append('sku', formData.sku);
        submitData.append('status', finalStatus); 

        let finalTags = [...tags];
        if (tagInput.trim() !== '') {
            finalTags.push(tagInput.trim().toLowerCase());
        }

        const validSpecs = specifications.filter(s => s.key.trim() && s.value.trim());
        
        submitData.append('tags', JSON.stringify(finalTags));
        submitData.append('specifications', JSON.stringify(validSpecs));

        imageFiles.forEach(file => {
            submitData.append('images', file); 
        });

        if (videoFile) {
            submitData.append('video', videoFile);
        }

        try {
            const res = await axios.post(`${server}/vendors/products/add`, submitData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token goes here
                }
            });

            if (res.data.success) {
                customAlert(`Product ${finalStatus === 'Active' ? 'Published' : 'Saved as Draft'} successfully!`);
                window.location.reload(); 
            }
        } catch (err) {
            console.error("Upload error:", err);
            customAlert(err.response?.data?.message || 'Failed to add product. Check console for details.');
        } finally {
            setIsSubmitting(false);
            setSubmitType('');
        }
    };

    if (planStatus.loading) {
        return <div className="flex-align justify-center" style={{height: '100vh'}}><Loader2 className="spinner text-pink" size={40}/></div>;
    }

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            
            <div className="va-full-width-container">
                
                {/* --- PAGE HEADER --- */}
                <div className="vap-header-row">
                    <div>
                        <h2 className="va-title">Add New <span className="pink-text">Product.</span></h2>
                        <p className="ve-subtitle">Create a new listing with images and videos.</p>
                    </div>
                    
                    <div className="vap-header-actions">
                        <button 
                            className="vap-btn-ghost flex-align" 
                            onClick={(e) => handleSubmit(e, 'Draft')}
                            disabled={isSubmitting || !canUpload}
                            style={{gap: '6px', opacity: canUpload ? 1 : 0.5, cursor: canUpload ? 'pointer' : 'not-allowed'}}
                        >
                            {isSubmitting && submitType === 'Draft' ? <><Loader2 size={14} className="spinner"/> Saving...</> : 'Save as Draft'}
                        </button>
                        <button 
                            className="vap-btn-primary flex-align" 
                            onClick={(e) => handleSubmit(e, 'Active')}
                            disabled={isSubmitting || !canUpload}
                            style={{gap: '8px', opacity: canUpload ? 1 : 0.5, cursor: canUpload ? 'pointer' : 'not-allowed'}}
                        >
                            {isSubmitting && submitType === 'Active' ? <><Loader2 size={16} className="spinner"/> Publishing...</> : 'Publish Product'}
                        </button>
                    </div>
                </div>

                <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto' }}>
                    {isLimitReached && (
                        <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="flex-align" style={{gap: '10px'}}>
                                <AlertTriangle size={20}/>
                                <span><strong>Upload Limit Reached!</strong> You have exhausted your {planStatus.limit} product limit.</span>
                            </div>
                            <Link to="/vendor/account" style={{ background: '#b91c1c', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                Upgrade Plan
                            </Link>
                        </div>
                    )}
                    
                    {planStatus.isExpired && !isLimitReached && (
                        <div style={{ background: '#fef9c3', border: '1px solid #facc15', color: '#a16207', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="flex-align" style={{gap: '10px'}}>
                                <AlertTriangle size={20}/>
                                <span><strong>Plan Expired!</strong> Please renew your subscription to continue uploading.</span>
                            </div>
                            <Link to="/vendor/account" style={{ background: '#a16207', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                Renew Now
                            </Link>
                        </div>
                    )}
                </div>

                
                <div className="vap-grid-layout" style={{ opacity: canUpload ? 1 : 0.6, pointerEvents: canUpload ? 'auto' : 'none' }}>
                    
                    <div className="vap-left-col">
                        
                        <div className="vap-card">
                            <h4 className="vap-card-title">Basic Information</h4>
                            
                            <div className="vap-input-group">
                                <label>Product Name *</label>
                                <input type="text" name="name" placeholder="e.g. Sony PlayStation 5" value={formData.name} onChange={handleInputChange} disabled={isSubmitting} />
                            </div>

                            <div className="vap-input-group">
                                <label>Description *</label>
                                <textarea name="description" rows="4" placeholder="Detail your product..." value={formData.description} onChange={handleInputChange} disabled={isSubmitting}></textarea>
                            </div>

                            <div className="vap-row-inputs">
                                <div className="vap-input-group" style={{flex: 1}}>
                                    <label>Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} disabled={isSubmitting}>
                                        <option value="">Select Category</option>
                                        {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                
                                {formData.category === 'Others' && (
                                    <div className="vap-input-group" style={{flex: 1}}>
                                        <label>Custom Category *</label>
                                        <input type="text" name="customCategory" placeholder="Enter category" value={formData.customCategory} onChange={handleInputChange} disabled={isSubmitting}/>
                                    </div>
                                )}
                            </div>

                            <div className="vap-input-group">
                                <label>Search Tags <span className="text-gray" style={{fontWeight: 'normal', fontSize: '0.75rem'}}>(Press Enter)</span></label>
                                <div className="vap-tags-container">
                                    {tags.map((tag, idx) => (
                                        <span key={idx} className="vap-tag">
                                            {tag} <X size={12} onClick={() => !isSubmitting && removeTag(idx)} style={{cursor: isSubmitting ? 'not-allowed' : 'pointer'}}/>
                                        </span>
                                    ))}
                                    <input type="text" placeholder="e.g. gaming, 5g..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="vap-tag-input" disabled={isSubmitting}/>
                                </div>
                            </div>
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Product Media</h4>
                            
                            <label className="vap-media-upload-box" style={{cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1}}>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} disabled={isSubmitting}/>
                                <ImageIcon size={32} className="text-gray" style={{marginBottom: '10px'}}/>
                                <p className="vap-upload-text"><strong>Click to select images</strong></p>
                                <p className="vap-upload-sub">PNG, JPG or JPEG (Max 5MB)</p>
                            </label>

                            {imagePreviews.length > 0 && (
                                <div className="vap-image-preview-grid mt-15">
                                    {imagePreviews.map((url, idx) => (
                                        <div key={idx} className="vap-preview-item">
                                            <img src={url} alt={`preview-${idx}`} />
                                            <button className="vap-remove-media-btn" onClick={(e) => removeImage(idx, e)} disabled={isSubmitting}>
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="vap-divider"></div>

                            <div className="vap-input-group mb-0">
                                <label className="flex-align" style={{gap: '6px'}}><Video size={14}/> Product Video Showcase (Optional)</label>
                                
                                {!videoPreview ? (
                                    <label className="vap-video-upload-btn" style={{cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1}}>
                                        <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={handleVideoUpload} style={{display: 'none'}} disabled={isSubmitting}/>
                                        <UploadCloud size={16} /> Select Video File
                                    </label>
                                ) : (
                                    <div className="vap-video-preview-box">
                                        <video src={videoPreview} controls className="vap-video-player" />
                                        <button className="vap-btn-ghost text-red flex-align" onClick={removeVideo} style={{gap: '4px', marginTop: '10px'}} disabled={isSubmitting}>
                                            <Trash2 size={14}/> Remove Video
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Custom Specifications</h4>
                            
                            <div className="vap-specs-list">
                                {specifications.map((spec, idx) => (
                                    <div key={idx} className="vap-spec-row">
                                        <input type="text" placeholder="  Key (e.g. RAM)" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} disabled={isSubmitting}/>
                                        <input type="text" placeholder="  Value (e.g. 8GB)" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} disabled={isSubmitting}/>
                                        <button className="vap-remove-btn" onClick={() => removeSpecification(idx)} disabled={isSubmitting}><X size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <button className="vap-add-spec-btn" onClick={addSpecification} disabled={isSubmitting}>
                                <Plus size={14}/> Add New Row
                            </button>
                        </div>
                    </div>

                    <div className="vap-right-col">
                        
                        <div className="vap-card highlight-ai-box">
                            <div className="flex-align" style={{justifyContent: 'space-between', marginBottom: '15px'}}>
                                <h4 className="vap-card-title" style={{margin: 0}}>Pricing & Bargaining</h4>
                            </div>

                            <div className="vap-input-group">
                                <label>List Price (MRP) *</label>
                                <div className="vap-price-input">
                                    <span>₹</span>
                                    <input type="number" name="mrp" placeholder="0.00" value={formData.mrp} onChange={handleInputChange} disabled={isSubmitting}/>
                                </div>
                            </div>

                            <div className="vap-toggle-box">
                                <div>
                                    <label className="vap-toggle-label">Enable AI Bargaining</label>
                                    <p className="vap-toggle-sub">Let AI negotiate with customers.</p>
                                </div>
                                <label className="vap-switch">
                                    <input type="checkbox" name="isBargainable" checked={formData.isBargainable} onChange={handleInputChange} disabled={isSubmitting}/>
                                    <span className="vap-slider"></span>
                                </label>
                            </div>

                            {formData.isBargainable && (
                                <div className="vap-input-group vap-min-price-box">
                                    <label>Minimum Bargain Price (Floor) *</label>
                                    <div className="vap-price-input pink-focus">
                                        <span>₹</span>
                                        <input type="number" name="minBargainPrice" placeholder="0.00" value={formData.minBargainPrice} onChange={handleInputChange} disabled={isSubmitting}/>
                                    </div>
                                    <p className="flex-align text-gray" style={{fontSize: '0.7rem', marginTop: '6px', gap: '4px'}}>
                                        <Info size={12}/> AI will not sell below this limit.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Inventory</h4>
                            
                            <div className="vap-input-group">
                                <label>Available Stock *</label>
                                <input type="number" name="stock" placeholder="0" value={formData.stock} onChange={handleInputChange} disabled={isSubmitting}/>
                            </div>

                            <div className="vap-input-group mb-0">
                                <label>SKU (Code)</label>
                                <input type="text" name="sku" placeholder="e.g. POLO-BLK-M" value={formData.sku} onChange={handleInputChange} disabled={isSubmitting}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAddProduct;