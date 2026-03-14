import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Loader2 } from 'lucide-react';
import axios from 'axios'; 

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../pages/vendor/VendorAccount.css';
import server from '../../environment';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const VendorLocation = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); 
    const [message, setMessage] = useState({ text: '', type: '' });

 
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [address, setAddress] = useState({
        street: '', 
        city: '', 
        state: '', 
        pincode: '',
        coordinates: null 
    });

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get(`${server}/vendors/profile/location`);

                if (response.data.success && response.data.data) {
                    const dbAddress = response.data.data;
                    setAddress({
                        street: dbAddress.street || '',
                        city: dbAddress.city || '',
                        state: dbAddress.state || '',
                        pincode: dbAddress.pincode || '',
                        coordinates: dbAddress.location?.coordinates || null 
                    });
                }
            } catch (error) {
                console.error('Failed to fetch location:', error);
                setMessage({ text: 'Could not load address data.', type: 'error' });
            } finally {
                setIsFetching(false);
            }
        };

        fetchLocation();
    }, []);

 
    useEffect(() => {
        if (!isEditing && address.coordinates && mapContainer.current) {
            
            if (map.current) {
                map.current.remove();
                map.current = null;
            }

            try {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: address.coordinates, 
                    zoom: 14,
                });

                new mapboxgl.Marker({ color: '#FF4F9A' })
                    .setLngLat(address.coordinates)
                    .addTo(map.current);

                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            } catch (err) {
                console.error("Mapbox init error:", err);
            }
        }

        return () => {
            if (map.current && typeof map.current.remove === 'function') {
                map.current.remove();
                map.current = null;
            }
        };
    }, [isEditing, address.coordinates]);

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleUpdateLocation = async () => {
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.put(`${server}/vendors/profile/location`, address);

            if (response.data.success) {
                setMessage({ text: 'Location updated successfully!', type: 'success' });
                
                const updatedAdd = response.data.data;
                setAddress({
                    street: updatedAdd.street || '',
                    city: updatedAdd.city || '',
                    state: updatedAdd.state || '',
                    pincode: updatedAdd.pincode || '',
                    coordinates: updatedAdd.location?.coordinates || null // 👉 Naye coordinates save kiye
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Update failed:', error);
            const errorMsg = error.response?.data?.message || 'Failed to update location.';
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="vac-tab-content fade-in">
                <div className="vac-card" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Loader2 className="spinner text-pink" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="vac-tab-content fade-in">
            <div className="vac-card">
                <div className="vac-card-header-flex">
                    <div>
                        <h3 className="vac-card-title">Physical Location</h3>
                        <p className="vac-card-subtitle">Required for customer discovery and local delivery.</p>
                    </div>
                    {!isEditing && (
                        <button className="vac-btn-ghost flex-align" onClick={() => { setIsEditing(true); setMessage({text:'', type:''}); }}>
                            <Edit3 size={14}/> Edit Location
                        </button>
                    )}
                </div>

                {message.text && (
                    <div style={{
                        padding: '10px 4px', borderRadius: '8px', marginBottom: '20px',
                        color: message.type === 'success' ? '#15803d' : '#ef4444',
                        fontSize: '0.9rem', fontWeight: '600'
                    }}>
                        {message.text}
                    </div>
                )}

                {!isEditing ? (
                    <>
                        <div className="vac-read-grid mt-20">
                            <div className="vac-read-item" >
                                <label>Street Address</label>
                                <p>{address.street || <span className="text-gray" >Not set</span>}</p>
                            </div>
                            <div className="vac-read-item">
                                <label>City</label>
                                <p>{address.city || <span className="text-gray">Not set</span>}</p>
                            </div>
                            <div className="vac-read-item">
                                <label>State</label>
                                <p>{address.state || <span className="text-gray" >Not set</span>}</p>
                            </div>
                            <div className="vac-read-item">
                                <label>Pincode</label>
                                <p>{address.pincode || <span className="text-gray" >Not set</span>}</p>
                            </div>
                        </div>

                        {address.coordinates && address.coordinates.length === 2 && (
                            <div style={{ marginTop: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: '#6b7280' }}>Map View</label>
                                <div 
                                    ref={mapContainer} 
                                    style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1px solid #e5e7eb' }} 
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="vac-edit-form mt-20">
                        <div className="vac-input-group">
                            <label>Street Address</label>
                            <input type="text" name="street" value={address.street} onChange={handleAddressChange} disabled={isLoading} placeholder="e.g. 12/4 Karol Bagh" />
                        </div>
                        <div className="vac-grid-3">
                            <div className="vac-input-group mb-0">
                                <label>City *</label>
                                <input type="text" name="city" value={address.city} onChange={handleAddressChange} disabled={isLoading} placeholder="e.g. New Delhi" />
                            </div>
                            <div className="vac-input-group mb-0">
                                <label>State *</label>
                                <input type="text" name="state" value={address.state} onChange={handleAddressChange} disabled={isLoading} placeholder="e.g. Delhi" />
                            </div>
                            <div className="vac-input-group mb-0">
                                <label>Pincode</label>
                                <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} disabled={isLoading} placeholder="e.g. 110005" />
                            </div>
                        </div>
                        <div className="vac-action-row mt-20 border-top-pt">
                            <button className="vac-btn-outline" onClick={() => { setIsEditing(false); setMessage({text:'', type:''}); }} disabled={isLoading}>
                                Cancel
                            </button>
                            <button className="vac-btn-primary flex-align" onClick={handleUpdateLocation} disabled={isLoading || !address.city || !address.state}>
                                {isLoading ? <><Loader2 size={16} className="spinner" /> Updating...</> : 'Update Address'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorLocation;