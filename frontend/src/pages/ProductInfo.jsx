import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import server from '../environment'; 
import defaultComingSoonVideo from '../assets/videos/commingsoon.mp4';


// Icons
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import GavelIcon from '@mui/icons-material/Gavel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import { Loader2 } from 'lucide-react';
import { customAlert } from '../utils/toastAlert';


import DashNavbar from '../components/dashboard/DashNavbar';
import Products from '../components/dashboard/Products';
import './ProductInfo.css'; 

const ProductInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { token } = useAuth(); 

  // --- DEFAULT FALLBACKS ---
  const defaultYouTubeVideoId = "g4xs_5rZdos";
  const defaultImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

  const getInitialImage = () => {
    if (location.state?.product?.images?.[0]) {
      const firstImg = location.state.product.images[0];
      return firstImg.startsWith('http') ? firstImg : `${server}/${firstImg}`;
    }
    return defaultImg; 
  };

  // --- STATES ---
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product); 
  const [activeImg, setActiveImg] = useState(getInitialImage()); 
  const [showVideo, setShowVideo] = useState(false);
  
  // 🌟 FETCH REAL PRODUCT DATA
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowVideo(false); 
    
    const loadProductInfo = async () => {
      setLoading(true);

      // Case 1: Agar state se data aaya hai
      if (location.state?.product && location.state.product._id === id) {
        const newProd = location.state.product;
        setProduct(newProd);
        
        const firstImg = newProd.images?.[0] || defaultImg;
        setActiveImg(firstImg.startsWith('http') ? firstImg : `${server}/${firstImg}`);
        setLoading(false);
      } 
      // Case 2: Agar URL se directly khola hai
      else {
        try {
          const res = await axios.get(`${server}/customer/products/${id}`);
          if (res.data.success) {
            const fetchedProduct = res.data.data;
            setProduct(fetchedProduct);
            
            const firstImg = fetchedProduct.images?.[0] || defaultImg;
            setActiveImg(firstImg.startsWith('http') ? firstImg : `${server}/${firstImg}`);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProductInfo();
  }, [id, location.state]);

  // 🛒 Add To Cart Logic
  const handleAddToCart = async () => {
    if (!token) {
      customAlert("Please login to add items to your cart!");
      navigate('/auth', { state: { from: location } });
      return;
    }

    try {
      const res = await axios.post(`${server}/customer/cart/add`, {
        productId: product._id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        customAlert(`🛒 ${product.name} added to cart!`);
      }
    } catch (error) {
      customAlert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleStartBargain = () => {
    if (!token) {
        customAlert("Please login to start bargaining!");
        navigate('/auth', { state: { from: location } });
        return;
    }
    navigate(`/bargain/${product._id}`);
  };

  if (loading) return <div className="flex-align justify-center" style={{ height: '100vh' }}><Loader2 className="spinner text-pink" size={40} /></div>;
  if (!product) return <div style={{textAlign: 'center', padding: '50px'}}>Product not found!</div>;

  const hasNativeVideo = product.video ? true : false;
  const nativeVideoUrl = hasNativeVideo ? (product.video.startsWith('http') ? product.video : `${server}/${product.video}`) : null;
  const vendor = product.vendorId || {};

  return (
    <div className="dash-wrapper">
      <DashNavbar />

      <div className="fullscreen-container">
        <div className="product-hero-grid">
          
          <div className="p-media-col">
            <div className="main-display">
              {showVideo ? (
                <div className="video-container">
                  {hasNativeVideo ? (
                    <video src={nativeVideoUrl} controls autoPlay style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                  ) : (
                  <video src={defaultComingSoonVideo} autoPlay loop  playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>   
                  )}
                  <button className="close-video" onClick={() => setShowVideo(false)}><CloseIcon sx={{fontSize: 16}}/></button>
                </div>
              ) : (
                <img src={activeImg} alt={product.name} />
              )}
            </div>

            <div className="thumbnail-row">
              {product.images && product.images.length > 0 ? (
                product.images.map((src, idx) => {
                  const imgUrl = src.startsWith('http') ? src : `${server}/${src}`;
                  return (
                    <img key={idx} src={imgUrl} className={activeImg === imgUrl && !showVideo ? 'thumb active' : 'thumb'} onClick={() => { setActiveImg(imgUrl); setShowVideo(false); }} alt={`thumb-${idx}`} />
                  );
                })
              ) : (
                <img src={defaultImg} className="thumb active" alt="fallback" />
              )}
              <div className={`thumb video-thumb ${showVideo ? 'active' : ''}`} onClick={() => setShowVideo(true)}>
                <PlayIcon sx={{ fontSize: 24 }} />
                <span>VIDEO</span>
              </div>
            </div>
          </div>

          <div className="p-info-col">
            <span className="p-category">{product.category}</span>
            <h1 className="p-title-main">{product.name}</h1>
            
            <div className="p-rating-row">
              <StarIcon sx={{color: "#f59e0b", fontSize: 18}}/> 
              <span>{vendor.rating ? `${vendor.rating} Rating` : '4.5 Rating (124)'}</span>
              <span className="dot">•</span>
              <span className="status-text"><VerifiedUserIcon sx={{fontSize: 14}}/> Verified Item</span>
            </div>

            <hr className="subtle-divider" />

            <div className="p-price-block">
              <span className="discount-tag">-10%</span>
              <h2 className="final-price">₹{product.mrp?.toLocaleString()}</h2>
            </div>
            <p className="taxes-text">Inclusive of all taxes</p>

            <div className="p-desc-box">
              <h3>About this item</h3>
              <p className="p-desc">{product.description}</p>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="specs-section">
                <h3>Specifications</h3>
                <div className="specs-grid-wide">
                   {product.specifications.map((s, i) => (
                     <div className="spec-row-wide" key={i}>
                        <span className="spec-key-wide">{s.key}</span>
                        <span className="spec-val-wide">{s.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-action-col">
            <div className="action-card-sticky">
              
              <div className="buybox-price">
                 ₹{product.mrp?.toLocaleString()}
              </div>
              <p className="buybox-delivery">
                <LocalShippingIcon sx={{fontSize: 16, color: '#FF2E63', mr: 0.5}}/>
                Free Delivery available
              </p>

              <p className="buybox-stock">In Stock</p>

              <div className="main-btns-stack">
                {product.isBargainable ? (
                  <button className="btn-bargain-large" onClick={handleStartBargain}>
                    <GavelIcon sx={{fontSize: 18}}/> Start Bargain
                  </button>
                ) : (
                  <>
                    <button className="btn-buy-large" onClick={handleAddToCart}>
                       <ShoppingCartIcon sx={{fontSize: 18}}/> Add to Cart
                    </button>
                    <button className="btn-outline-large" onClick={() => navigate(`/booking/${product._id}`)}>
                       <FlashOnIcon sx={{fontSize: 18}} /> Buy Now
                    </button>
                  </>
                )}
              </div>

              <div className="secure-box">
                 <ShieldIcon sx={{fontSize: 16, color: '#64748b'}}/>
                 <span>Secure transaction</span>
              </div>

              <hr className="subtle-divider" />

              <div className="buybox-seller-info">
                <div className="seller-row">
                  <span>Sold by</span>
                  <strong>{vendor.companyName || "Verified Retailer"}</strong>
                </div>
                <div className="seller-row">
                  <span>Ships from</span>
                  <strong>{vendor.shopAddress?.city || "Local City"}</strong>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="related-section">
           <hr className="solid-divider" />
           <h3 className="section-title">You might also like</h3>
           <Products />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;