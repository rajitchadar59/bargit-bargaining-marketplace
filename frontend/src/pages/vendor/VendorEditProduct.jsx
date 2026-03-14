import React, { useState, useEffect } from 'react';
import { 
    UploadCloud, Plus, X, Video, Image as ImageIcon, 
    Sparkles, Info, Trash2, Loader2, ArrowLeft 
} from 'lucide-react';
import axios from 'axios';
import server from '../../environment';
import VendorDashNavbar from './VendorDashNavbar';
import { customAlert } from '../../utils/toastAlert';

import './VendorAddProduct.css'; 
import { useParams, useNavigate } from 'react-router-dom';

const VendorEditProduct = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        name: '', description: '', category: '', customCategory: '', mrp: '',
        isBargainable: true, minBargainPrice: '', stock: '', sku: ''
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);

    const [imageFiles, setImageFiles] = useState([]); 
    const [existingImages, setExistingImages] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 
    
    const [videoFile, setVideoFile] = useState(null); 
    const [existingVideo, setExistingVideo] = useState(null); 
    const [videoPreview, setVideoPreview] = useState(null); 

    const [isSubmitting, setIsSubmitting] = useState(false);

    const categoriesList = ['Mobiles', 'Laptops', 'Fashion', 'Shoes', 'Gaming', 'Watches', 'Audio', 'Appliances', 'Beauty', 'Grocery', 'Others'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${server}/vendors/products/${id}`);
                if (res.data.success) {
                    const prod = res.data.data;
                    let isCustomCat = !categoriesList.includes(prod.category);
                    
                    setFormData({
                        name: prod.name || '',
                        description: prod.description || '',
                        category: isCustomCat ? 'Others' : prod.category,
                        customCategory: isCustomCat ? prod.category : '',
                        mrp: prod.mrp || '',
                        isBargainable: prod.isBargainable,
                        minBargainPrice: prod.minBargainPrice || '',
                        stock: prod.stock || 0,
                        sku: prod.sku || ''
                    });

                    setTags(prod.tags || []);
                    if(prod.specifications && prod.specifications.length > 0) setSpecifications(prod.specifications);

                    setExistingImages(prod.images || []);
                    setExistingVideo(prod.video || null);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                customAlert("Could not load product details.");
                navigate('/vendor/inventory');
            } finally {
                setLoadingData(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !tags.includes(newTag)) setTags([...tags, newTag]);
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

    const removeExistingImage = (indexToRemove, e) => {
        e.preventDefault();
        setExistingImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const removeNewImage = (indexToRemove, e) => {
        e.preventDefault(); 
        setImageFiles(prev => prev.filter((_, i) => i !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setExistingVideo(null); 
        }
    };

    const removeVideo = (e) => {
        e.preventDefault();
        setVideoFile(null);
        setVideoPreview(null);
        setExistingVideo(null);
    };

    const handleSubmit = async (e, finalStatus) => {
        e.preventDefault();
        
        if (!formData.name || !formData.category || !formData.mrp || !formData.stock) return customAlert("Please fill required fields (*)");
        if (formData.isBargainable && !formData.minBargainPrice) return customAlert("Enter Minimum Bargain Price.");
        if (existingImages.length === 0 && imageFiles.length === 0) return customAlert("At least one product image is required.");

        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        if (formData.category === 'Others') submitData.append('customCategory', formData.customCategory);
        submitData.append('mrp', formData.mrp);
        submitData.append('isBargainable', formData.isBargainable);
        if(formData.isBargainable) submitData.append('minBargainPrice', formData.minBargainPrice);
        submitData.append('stock', formData.stock);
        submitData.append('sku', formData.sku);
        submitData.append('status', finalStatus); 

        let finalTags = [...tags];
        if (tagInput.trim() !== '') finalTags.push(tagInput.trim().toLowerCase());

        const validSpecs = specifications.filter(s => s.key.trim() && s.value.trim());
        
        submitData.append('tags', JSON.stringify(finalTags));
        submitData.append('specifications', JSON.stringify(validSpecs));
        submitData.append('existingImages', JSON.stringify(existingImages));

        imageFiles.forEach(file => submitData.append('images', file));
        if (videoFile) submitData.append('video', videoFile);

        try {
            const res = await axios.put(`${server}/vendors/products/${id}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.success) {
                customAlert(`Product Updated successfully!`);
                navigate('/vendor/inventory'); 
            }
        } catch (err) {
            customAlert(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if(loadingData) return <div style={{display:'flex', justifyContent:'center', marginTop:'100px'}}><Loader2 className="spinner" size={40}/></div>;

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            <div className="va-full-width-container">
                <div className="vap-header-row">
                    <div>
                        <button className="vap-btn-ghost flex-align" onClick={()=>navigate('/vendor/inventory')} style={{padding:0, border:'none', background:'none', marginBottom:'10px', gap:'4px'}}>
                            <ArrowLeft size={14}/> Back to Inventory
                        </button>
                        <h2 className="va-title">Edit <span className="pink-text">Product.</span></h2>
                    </div>
                    <div className="vap-header-actions">
                        <button className="vap-btn-primary flex-align" onClick={(e) => handleSubmit(e, 'Active')} disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 size={16} className="spinner"/> Updating...</> : 'Update Product'}
                        </button>
                    </div>
                </div>

                <div className="vap-grid-layout">
                    <div className="vap-left-col">
                        <div className="vap-card">
                            <h4 className="vap-card-title">Basic Information</h4>
                            <div className="vap-input-group"><label>Product Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={isSubmitting} /></div>
                            <div className="vap-input-group"><label>Description *</label><textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} disabled={isSubmitting}></textarea></div>
                            <div className="vap-row-inputs">
                                <div className="vap-input-group" style={{flex: 1}}>
                                    <label>Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} disabled={isSubmitting}>
                                        <option value="">Select Category</option>
                                        {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                {formData.category === 'Others' && (
                                    <div className="vap-input-group" style={{flex: 1}}><label>Custom Category *</label><input type="text" name="customCategory" value={formData.customCategory} onChange={handleInputChange} disabled={isSubmitting}/></div>
                                )}
                            </div>
                            <div className="vap-input-group">
                                <label>Search Tags</label>
                                <div className="vap-tags-container">
                                    {tags.map((tag, idx) => <span key={idx} className="vap-tag">{tag} <X size={12} onClick={() => !isSubmitting && removeTag(idx)}/></span>)}
                                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="vap-tag-input" disabled={isSubmitting}/>
                                </div>
                            </div>
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Product Media</h4>
                            <label className="vap-media-upload-box" style={{cursor: isSubmitting ? 'not-allowed' : 'pointer'}}>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} disabled={isSubmitting}/>
                                <ImageIcon size={32} className="text-gray" style={{marginBottom: '10px'}}/>
                                <p className="vap-upload-text"><strong>Click to add more images</strong></p>
                            </label>
                            <div className="vap-image-preview-grid mt-15">
                                {existingImages.map((url, idx) => (
                                    <div key={`ext-${idx}`} className="vap-preview-item">
                                        <img src={url} alt="existing" />
                                        <button className="vap-remove-media-btn" onClick={(e) => removeExistingImage(idx, e)} disabled={isSubmitting}><X size={12} /></button>
                                    </div>
                                ))}
                                {imagePreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="vap-preview-item" style={{border: '2px solid #FF2E63'}}>
                                        <img src={url} alt="new" />
                                        <button className="vap-remove-media-btn" onClick={(e) => removeNewImage(idx, e)} disabled={isSubmitting}><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="vap-divider"></div>
                            <div className="vap-input-group mb-0">
                                <label className="flex-align" style={{gap: '6px'}}><Video size={14}/> Product Video</label>
                                {!videoPreview && !existingVideo ? (
                                    <label className="vap-video-upload-btn">
                                        <input type="file" accept="video/*" onChange={handleVideoUpload} style={{display: 'none'}} disabled={isSubmitting}/>
                                        <UploadCloud size={16} /> Select New Video
                                    </label>
                                ) : (
                                    <div className="vap-video-preview-box">
                                        <video src={videoPreview || existingVideo} controls className="vap-video-player" />
                                        <button className="vap-btn-ghost text-red flex-align" onClick={removeVideo} style={{gap: '4px', marginTop: '10px'}} disabled={isSubmitting}><Trash2 size={14}/> Remove Video</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Custom Specifications</h4>
                            <div className="vap-specs-list">
                                {specifications.map((spec, idx) => (
                                    <div key={idx} className="vap-spec-row">
                                        <input type="text" placeholder="Key" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} disabled={isSubmitting}/>
                                        <input type="text" placeholder="Value" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} disabled={isSubmitting}/>
                                        <button className="vap-remove-btn" onClick={() => removeSpecification(idx)} disabled={isSubmitting}><X size={16}/></button>
                                    </div>
                                ))}
                            </div>
                            <button className="vap-add-spec-btn" onClick={addSpecification} disabled={isSubmitting}><Plus size={14}/> Add Row</button>
                        </div>
                    </div>

                    <div className="vap-right-col">
                        <div className="vap-card highlight-ai-box">
                            <h4 className="vap-card-title mb-15">Pricing & Bargaining</h4>
                            <div className="vap-input-group">
                                <label>List Price (MRP) *</label>
                                <div className="vap-price-input">
                                    <span>₹</span><input type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} disabled={isSubmitting}/>
                                </div>
                            </div>
                            <div className="vap-toggle-box">
                                <div><label className="vap-toggle-label">Enable AI Bargaining</label></div>
                                <label className="vap-switch"><input type="checkbox" name="isBargainable" checked={formData.isBargainable} onChange={handleInputChange} disabled={isSubmitting}/><span className="vap-slider"></span></label>
                            </div>
                            {formData.isBargainable && (
                                <div className="vap-input-group vap-min-price-box">
                                    <label>Minimum Bargain Price (Floor) *</label>
                                    <div className="vap-price-input pink-focus">
                                        <span>₹</span><input type="number" name="minBargainPrice" value={formData.minBargainPrice} onChange={handleInputChange} disabled={isSubmitting}/>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="vap-card">
                            <h4 className="vap-card-title">Inventory</h4>
                            <div className="vap-input-group"><label>Stock *</label><input type="number" name="stock" value={formData.stock} onChange={handleInputChange} disabled={isSubmitting}/></div>
                            <div className="vap-input-group mb-0"><label>SKU (Code)</label><input type="text" name="sku" value={formData.sku} onChange={handleInputChange} disabled={isSubmitting}/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorEditProduct;