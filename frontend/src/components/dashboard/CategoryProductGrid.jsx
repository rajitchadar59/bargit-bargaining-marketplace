
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../../environment'; 
import { customAlert } from '../../utils/toastAlert';
import MapPinIcon from '@mui/icons-material/LocationOn';
import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CloseIcon from '@mui/icons-material/Close';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import NearMeIcon from '@mui/icons-material/NearMe';
import HistoryIcon from '@mui/icons-material/History';
import CategoryIcon from '@mui/icons-material/Category';
import LockIcon from '@mui/icons-material/Lock';
import { Loader2 } from 'lucide-react';

import './CategoryProductGrid.css';

const CategoryProductGrid = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  
  const [dealType, setDealType] = useState('all');
  const [sortType, setSortType] = useState('nearby');
  
  const navigate = useNavigate();

  const defaultYouTubeVideoId = "g4xs_5rZdos";

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${server}/customer/category-products?category=${selectedCategory}`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    setDealType('all');
    setSortType('nearby');
  }, [selectedCategory]); 

  const filteredProducts = products.filter(p => {
    if (dealType === 'all') return true;
    if (dealType === 'bargain') return p.isBargainable === true;
    if (dealType === 'fixed') return p.isBargainable === false;
    return true;
  });

  const goToInfo = (item) => {
    navigate(`/product/${item._id}`, { state: { product: item } });
  };

  const handleBuyNow = (item) => {
    navigate(`/booking/${item._id}`, { state: { product: item } }); 
  };

  if (loading) {
    return (
      <div className="flex-align justify-center" style={{ height: '40vh', width: '100%', display: 'flex', alignItems:'center', justifyContent: 'center' }}>
        <Loader2 className="spinner text-pink" size={40} color="#FF2E63" />
      </div>
    );
  }

  return (
    <div className="cat-wrapper">
      
      <div className="cat-top-tabs">
        <div className="cat-pill-container">
          <button className={sortType === 'nearby' ? 'cat-tab active' : 'cat-tab'} onClick={() => setSortType('nearby')}>
            <NearMeIcon sx={{ fontSize: 18 }} /> Nearby
          </button>
          <button className={sortType === 'recent' ? 'cat-tab active' : 'cat-tab'} onClick={() => setSortType('recent')}>
            <HistoryIcon sx={{ fontSize: 18 }} /> Recent
          </button>
        </div>

        <div className="cat-pill-container">
          <button className={dealType === 'all' ? 'cat-pill active' : 'cat-pill'} onClick={() => setDealType('all')}>
            <CategoryIcon sx={{ fontSize: 18, marginRight: '5px' }} /> All Items
          </button>
          <button className={dealType === 'bargain' ? 'cat-pill active' : 'cat-pill'} onClick={() => setDealType('bargain')}>
            <GavelIcon sx={{ fontSize: 18, marginRight: '5px' }} /> Bargainable
          </button>
          <button className={dealType === 'fixed' ? 'cat-pill active' : 'cat-pill'} onClick={() => setDealType('fixed')}>
            <LockIcon sx={{ fontSize: 18, marginRight: '5px' }} /> Fixed Price
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="cat-empty-state">
          <SearchOffIcon sx={{ fontSize: 80, color: '#cbd5e1', marginBottom: '15px' }} />
          <h3>Oops! No Items Found</h3>
          <p>We couldn't find any <strong>{dealType !== 'all' ? dealType : ''}</strong> products in the <strong>{selectedCategory}</strong> category right now.</p>
        </div>
      ) : (
        <div className="cat-product-grid">
          {filteredProducts.map(item => {
            const fallbackImg = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
            const displayImage = item.images && item.images.length > 0 
              ? (item.images[0].startsWith('http') ? item.images[0] : `${server}/${item.images[0]}`)
              : fallbackImg;
            
            const hasNativeVideo = item.video ? true : false;
            const nativeVideoUrl = hasNativeVideo 
              ? (item.video.startsWith('http') ? item.video : `${server}/${item.video}`) 
              : null;

            return (
              <div className="cat-ecom-card" key={item._id}>
                <div className="cat-image-box">
                  {playingVideoId === item._id ? (
                    <div className="cat-video-wrapper">
                      {hasNativeVideo ? (
                        <video src={nativeVideoUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : ( 
                        <iframe src={`https://www.youtube.com/embed/${defaultYouTubeVideoId}?autoplay=1&mute=0&controls=1`} title="Video" frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%' }}></iframe>
                      )}
                      <button className="cat-close-video" onClick={() => setPlayingVideoId(null)}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <img src={displayImage} alt={item.name} />
                      <button className="cat-watch-video" onClick={() => setPlayingVideoId(item._id)}>
                        <PlayIcon sx={{ fontSize: 20 }} />
                      </button>
                    </>
                  )}
                  {item.isBargainable && <span className="cat-bargain-tag">NEGOTIABLE</span>}
                </div>

                <div className="cat-content-box">
                  <h3 className="cat-prod-title">{item.name}</h3>
                  
                  <div className="cat-price-row">
                    <span className="cat-price-val">₹{item.mrp?.toLocaleString()}</span>
                    <span className="cat-rating">★ 4.5</span>
                  </div>

                  <p className="cat-vendor-tag">
                    <MapPinIcon sx={{fontSize: 14, mr: 0.5, color: '#FF2E63'}} /> 
                    {item.vendorId?.city || "Nearby Store"}
                  </p>

                  <div className="cat-btn-group">
                    {item.isBargainable ? (
                      <button className="cat-btn-bargain" onClick={() => goToInfo(item)}>
                        <GavelIcon sx={{ fontSize: 18 }} /> Start Bargain
                      </button>
                    ) : (
                      <div className="cat-btn-split">
                        <button className="cat-btn-cart" onClick={() => customAlert("Added to Cart!")}>
                          <ShoppingCartIcon sx={{ fontSize: 18 }} /> Add
                        </button>
                        <button className="cat-btn-buy" onClick={() => handleBuyNow(item)}>
                          <FlashOnIcon sx={{ fontSize: 18 }} /> Buy Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryProductGrid;