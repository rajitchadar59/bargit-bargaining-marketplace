import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import server from '../environment';
import { useAuth } from '../context/AuthContext';
import DashNavbar from '../components/dashboard/DashNavbar';
import { customAlert } from '../utils/toastAlert';



import { Send, Clock, ShieldCheck, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import './BargainRoom.css';

const BargainRoom = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(3);
    const [timeLeft, setTimeLeft] = useState('05:00');

    const chatEndRef = useRef(null);


    const initSession = async (isRetry = false) => {
        if (!isRetry && session) return; 
        setLoading(true);
        try {
            const res = await axios.post(`${server}/customer/bargain/init`, 
                { productId, action: isRetry ? 'retry' : 'load' }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                const data = res.data.data;
                setSession(data);
                setChatHistory(data.chatHistory); 
                setAttemptsLeft(data.attemptsLeft);
                setMaxAttempts(data.maxAttempts);
            }
        } catch (error) {
            console.error("Failed to init bargain:", error);
            if (error.response?.data?.isLimitReached) {
                customAlert(error.response.data.message);
                navigate(-1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) initSession(false);
    }, [productId, token, navigate]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [chatHistory, isTyping]);


    useEffect(() => {
        let interval;
        if (session) {
            if (session.status === 'Active' && session.bargainExpiresAt) {
               
                interval = setInterval(() => {
                    const distance = new Date(session.bargainExpiresAt).getTime() - new Date().getTime();
                    if (distance <= 0) {
                        clearInterval(interval);
                        setSession(prev => ({ ...prev, status: 'Expired' }));
                        setTimeLeft('00:00');
                    } else {
                        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const s = Math.floor((distance % (1000 * 60)) / 1000);
                        setTimeLeft(`0${m}:${s < 10 ? '0' : ''}${s}`);
                    }
                }, 1000);
            } else if (session.status === 'Active' && !session.bargainExpiresAt) {
          
                setTimeLeft('05:00');
            } else if (session.status === 'Won' && session.expiresAt) {
               
                interval = setInterval(() => {
                    const distance = new Date(session.expiresAt).getTime() - new Date().getTime();
                    if (distance <= 0) {
                        clearInterval(interval);
                        setSession(prev => ({ ...prev, status: 'Expired' }));
                        setTimeLeft('00:00');
                    } else {
                        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const s = Math.floor((distance % (1000 * 60)) / 1000);
                        setTimeLeft(`${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`);
                    }
                }, 1000);
            }
        }
        return () => clearInterval(interval);
    }, [session]);

    const handleSendMessage = async () => {
        if (!message.trim() || isTyping || session.status !== 'Active') return;

        const userMsg = message.trim();
        setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
        setMessage('');
        setIsTyping(true);

        try {
            const res = await axios.post(`${server}/customer/bargain/chat`, {
                sessionId: session.sessionId,
                userMessage: userMsg
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const data = res.data.data;
                setChatHistory(prev => [...prev, { sender: 'seller', text: data.reply }]);

                setSession(prev => ({
                    ...prev,
                    status: data.status,
                    agreedPrice: data.agreedPrice,
                    expiresAt: data.expiresAt,
                    bargainExpiresAt: data.bargainExpiresAt
                }));
                if (data.attemptsLeft !== undefined) {
                    setAttemptsLeft(data.attemptsLeft);
                }
            }
        } catch (error) {
            if(error.response?.data?.status === 'Expired') {
                setSession(prev => ({ ...prev, status: 'Expired' }));
                customAlert("Time is up! Deal expired.");
            } else {
                setChatHistory(prev => [...prev, { sender: 'seller', text: "Connection error. Say that again." }]);
            }
        } finally {
            setIsTyping(false);
        }
    };

    const handleProceedToPay = () => {
        navigate(`/booking/${productId}`, {
            state: {
                product: { ...session.productDetails, mrp: session.agreedPrice, _id: productId },
                isBargained: true,
                sessionId: session.sessionId
            }
        });
    };

    if (loading) return <div className="flex-align justify-center" style={{ height: '100vh' }}><Loader2 className="spinner text-pink" size={40} /></div>;
    if (!session) return null;

    if (session.status === 'Purchased') {
        return (
            <div className="bargain-page">
                <DashNavbar />
                <div className="bargain-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
                    <ShieldCheck size={80} color="#22c55e" />
                    <h2 style={{ marginTop: '20px', color: '#0f172a' }}>Item Already Purchased!</h2>
                    <p style={{ color: '#64748b', marginTop: '10px' }}>You successfully cracked the deal and bought this item.</p>
                    <button className="btn-main mt-20" onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', borderRadius: '8px' }}>
                        Continue Shopping
                    </button>
                    {attemptsLeft > 0 && (
                        <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#64748b'}}>
                            Want another one? <span style={{color: '#FF2E63', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => initSession(true)}>Start a new bargain!</span>
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const prod = session.productDetails;

    return (
        <div className="bargain-page">
            <DashNavbar />
            <div className="bargain-container">
                <div className="br-grid">
                    {/* LEFT COL */}
                    <div className="br-product-col">
                        <div className="br-product-card">
                            <img src={prod.image.startsWith('http') ? prod.image : `${server}/${prod.image}`} alt={prod.name} className="br-prod-img" />
                            <h2 className="br-prod-title">{prod.name}</h2>
                            <p className="br-prod-mrp">Original Price: <span>₹{prod.mrp.toLocaleString()}</span></p>

                            <div className="br-rules">
                                <h4><ShieldCheck size={16} /> Bargaining Rules</h4>
                                <ul>
                                    <li>Timer starts <strong>after your first message</strong>.</li>
                                    <li>You have <strong>5 minutes</strong> to crack the deal.</li>
                                    <li>If successful, you get <strong>10 minutes</strong> to pay.</li>
                                </ul>
                            </div>
                            
                            <div style={{marginTop: '20px', padding: '10px', background: '#fff5f7', border: '1px solid #FF2E63', borderRadius: '8px', textAlign: 'center'}}>
                                <p style={{margin:0, color: '#FF2E63', fontWeight: 'bold'}}>
                                    Attempts Left Today: {attemptsLeft} / {maxAttempts}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="br-chat-col">
                        <div className="br-chat-header">
                            <div>
                                <h3>Live Negotiation</h3>
                                <p>Bargit Smart Assistant</p>
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                {(session.status === 'Active' || session.status === 'Won') && (
                                    <div style={{color: '#ef4444', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
                                        <Clock size={16}/> {timeLeft}
                                    </div>
                                )}
                                <div className={`br-status-badge ${session.status.toLowerCase()}`}>
                                    {session.status}
                                </div>
                            </div>
                        </div>

                        <div className="br-chat-box">
                            {chatHistory.map((chat, idx) => (
                                <div key={idx} className={`br-msg-row ${chat.sender}`}>
                                    <div className={`br-msg-bubble ${chat.sender}`}>{chat.text}</div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="br-msg-row seller"><div className="br-msg-bubble seller typing"><div className="dot-flashing"></div></div></div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="br-chat-footer">
                            {session.status === 'Active' && (
                                <div className="br-input-group">
                                    <input
                                        type="text"
                                        placeholder="Type your offer... (e.g. ₹18,000 chalega?)"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        disabled={isTyping}
                                    />
                                    <button onClick={handleSendMessage} disabled={!message.trim() || isTyping}><Send size={18} /></button>
                                </div>
                            )}

                            {session.status === 'Won' && (
                                <div className="br-won-state fade-in">
                                    <div className="timer-box">
                                        <Clock size={20} className="pulse-red" />
                                        <span className="timer-text pulse-red">{timeLeft}</span>
                                    </div>
                                    <p className="deal-text">Deal locked at <strong>₹{session.agreedPrice.toLocaleString()}</strong></p>
                                    <button className="btn-pay-now" onClick={handleProceedToPay}>Proceed to Pay <ArrowRight size={18} /></button>
                                </div>
                            )}

                            {session.status === 'Expired' && (
                                <div className="br-expired-state fade-in">
                                    <AlertTriangle size={24} color="#ef4444" />
                                    <p>Session Expired or Deal Failed!</p>
                                    {attemptsLeft > 0 ? (
                                        <button className="btn-pay-now" style={{background:'#0f172a', color:'white', marginTop:'10px'}} onClick={() => initSession(true)}>
                                            <RefreshCw size={16} /> Try Again (Fresh Chat)
                                        </button>
                                    ) : (
                                        <button className="btn-outline" onClick={() => navigate(-1)}>Out of Attempts. Go Back</button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BargainRoom;