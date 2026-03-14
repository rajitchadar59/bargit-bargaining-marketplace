import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Loader2, Calculator, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import server from '../../environment'; 
import '../../pages/vendor/VendorAccount.css';
import { customAlert } from '../../utils/toastAlert';


const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => { resolve(true); };
        script.onerror = () => { resolve(false); };
        document.body.appendChild(script);
    });
};

const VendorSubscription = () => {
    const [showUpgradePlans, setShowUpgradePlans] = useState(false);
    const [plans, setPlans] = useState([]);
    
    const [currentSub, setCurrentSub] = useState(null);
    const [usedLimit, setUsedLimit] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [flexDays, setFlexDays] = useState(30);
    const [flexProducts, setFlexProducts] = useState(100);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const profileRes = await axios.get(`${server}/vendors/profile/subscription`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (profileRes.data.success) {
                    setCurrentSub(profileRes.data.data.subscription);
                    setUsedLimit(profileRes.data.data.totalProducts || 0);
                }

                const plansRes = await axios.get(`${server}/admin/plans`);
                if (plansRes.data.success) {
                    setPlans(plansRes.data.data.filter(p => p.isActive));
                }
            } catch (error) {
                console.error("Failed to load subscription data", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchAllData();
    }, []);

    const fixedUpgrades = plans.filter(p => p.planType === 'fixed' && p.planId !== 'free');
    const flexiblePlan = plans.find(p => p.planType === 'flexible');

    const calculateFlexiblePrice = () => {
        if (!flexiblePlan) return 0;
        const baseFee = flexiblePlan.price || 0;
        const dayCost = flexDays * (flexiblePlan.pricePerDay || 0);
        const productCost = flexProducts * (flexiblePlan.pricePerProduct || 0);
        return baseFee + dayCost + productCost;
    };

    const handleBuyPlan = async (plan, isFlexible = false) => {
        let finalLimit = isFlexible ? flexProducts : plan.productLimit;
        let finalAmount = isFlexible ? calculateFlexiblePrice() : plan.price;
        let finalDays = isFlexible ? flexDays : plan.period;

        setIsProcessingPayment(true);

        try {
            const eligRes = await axios.post(`${server}/vendors/profile/check-eligibility`, 
                { targetPlanLimit: finalLimit }, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (!eligRes.data.success) {
                customAlert(eligRes.data.message);
                setIsProcessingPayment(false);
                return;
            }

            const res = await loadRazorpayScript();
            if (!res) {
                customAlert('Razorpay SDK failed to load. Are you online?');
                setIsProcessingPayment(false);
                return;
            }

            const orderResponse = await axios.post(`${server}/vendors/payment/create-order`, {
                amount: finalAmount,
                planId: plan.planId,
                planName: plan.name,
                days: finalDays,
                productLimit: finalLimit
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!orderResponse.data.success) {
                customAlert("Server error. Please try again.");
                setIsProcessingPayment(false);
                return;
            }

            const { order, tempData, key_id } = orderResponse.data; 

            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: "BARGIT.",
                description: `Subscription Upgrade: ${plan.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${server}/vendors/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planData: tempData
                        }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        });

                        if (verifyRes.data.success) {
                            customAlert("Payment Successful! Plan Upgraded.");
                            window.location.reload(); 
                        }
                    } catch (err) {
                        customAlert("Error updating your plan.");
                    }
                },
                theme: { color: "#FF2E63" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            customAlert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (loadingData) {
        return <div className="vsp-tab-content flex-align justify-center" style={{padding: '50px'}}><Loader2 className="spinner text-pink" size={32}/></div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const now = new Date();
    const isExpired = currentSub?.planId !== 'free' && currentSub?.endDate && new Date(currentSub.endDate) < now;
    const isOverLimit = usedLimit > currentSub?.productLimit;

    return (
        <div className="vsp-tab-content vsp-fade-in">
            {currentSub && (
                <div className={`vsp-free-plan-card ${currentSub.planId !== 'free' ? 'vsp-premium-border' : ''}`}>
                    <div className="vsp-wide-plan-header">
                        <div className="vsp-title-area">
                            <span className={`vsp-status-pill vsp-mb-10 ${ (isExpired || isOverLimit) ? 'vsp-bg-red vsp-text-red' : 'vsp-bg-green vsp-text-green'}`}>
                                {(isExpired || isOverLimit) ? <AlertTriangle size={14}/> : <CheckCircle2 size={14}/>} 
                                {(isExpired || isOverLimit) ? ' EXPIRED PLAN' : ` ${currentSub.status.toUpperCase()} PLAN`}
                            </span>
                            <h2 className={`vsp-massive-title vsp-m-0 ${currentSub.planId !== 'free' ? 'vsp-text-pink' : ''}`} style={{fontSize:"1.3rem"}}>
                                {currentSub.planName}
                            </h2>
                            <p className="vsp-card-subtitle vsp-mt-10">
                                {currentSub.planId === 'free' 
                                    ? "You are on the lifetime free plan. Upgrade to unlock full store potential."
                                    : `Valid until: ${currentSub.endDate ? formatDate(currentSub.endDate) : 'Lifetime'}`
                                }
                            </p>
                        </div>
                        <div className="vsp-stats-area">
                            <div className="vsp-stat-box">
                                <p className="vsp-label">Started On</p>
                                <p className="vsp-val">{formatDate(currentSub.startDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="vsp-usage-section vsp-mt-30">
                        <div className="vsp-flex-between vsp-mb-10">
                            <span className="vsp-label" style={{fontSize: '0.8rem', color: '#0f172a'}}>Inventory Upload Usage</span>
                            <span className="vsp-val" style={{color: '#FF2E63', fontSize: '1rem'}}>
                                {usedLimit} 
                                <span style={{color: '#64748b', fontSize: '1rem'}}>
                                    / {currentSub.productLimit >= 99999 ? 'Unlimited' : currentSub.productLimit} Products
                                </span>
                            </span>
                        </div>
                        
                        <div className="vsp-progress-bar">
                            <div className="vsp-progress-fill" style={{width: `${Math.min((usedLimit / currentSub.productLimit) * 100, 100)}%`}}></div>
                        </div>
                        
                        {currentSub.productLimit < 99999 ? (
                            <p className="vsp-helper-text vsp-mt-10">
                                {isOverLimit ? "Limit exceeded! Please upgrade." : `You have ${currentSub.productLimit - usedLimit} product slots remaining.`}
                            </p>
                        ) : (
                            <p className="vsp-helper-text vsp-mt-10 text-green">You have unlimited product slots! Keep uploading.</p>
                        )}
                    </div>

                    {!showUpgradePlans && (
                        <div className="vsp-action-row vsp-mt-30 vsp-border-top-pt" style={{justifyContent: 'center'}}>
                            <button className="vsp-btn-upgrade vsp-flex-align" onClick={() => setShowUpgradePlans(true)}>
                                View Upgrade Plans <ArrowRight size={18}/>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showUpgradePlans && (
                <div className="vsp-upgrade-section vsp-fade-in vsp-mt-20">
                    <div className="vsp-text-center vsp-mb-30">
                        <h3 className="vsp-card-title" style={{fontSize: '1.3rem'}}>Choose Your Superpower</h3>
                        <p className="vsp-card-subtitle">Upgrade your store and scale your business without limits.</p>
                    </div>
                    
                    <div className="vsp-grid-2">
                        {fixedUpgrades.map((plan) => (
                            <div key={plan._id} className={`vsp-pricing-card ${plan.planId === 'premium' ? 'vsp-premium-border' : ''}`}>
                                {plan.planId === 'premium' && <div className="vsp-popular-badge">RECOMMENDED FOR YOU</div>}
                                
                                <h3 className={`vsp-plan-name ${plan.planId === 'premium' ? 'vsp-text-pink' : ''}`}>{plan.name}</h3>
                                <div className="vsp-plan-price">₹{plan.price}<span>{plan.periodLabel}</span></div>
                                
                                <ul className="vsp-plan-features">
                                    <li>
                                        <CheckCircle2 size={18} className={plan.planId === 'premium' ? 'vsp-text-pink' : 'vsp-text-green'}/> 
                                        Up to <strong>{plan.productLimit >= 99999 ? 'Unlimited' : plan.productLimit} Products</strong>
                                    </li>
                                    {plan.features.map((f, i) => (
                                        <li key={i}><CheckCircle2 size={18} className={plan.planId === 'premium' ? 'vsp-text-pink' : 'vsp-text-green'}/> {f}</li>
                                    ))}
                                </ul>
                                <button 
                                    className={plan.planId === 'premium' ? 'vsp-btn-upgrade vsp-w-100 vsp-mt-30' : 'vsp-btn-outline vsp-w-100 vsp-mt-30'}
                                    onClick={() => handleBuyPlan(plan, false)}
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? 'Processing...' : `Select ${plan.name}`}
                                </button>
                            </div>
                        ))}
                    </div>

                    {flexiblePlan && (
                        <div className="vsp-pricing-card vsp-mt-20" style={{ border: '2px solid #8b5cf6', background: '#faf5ff', textAlign: 'left' }}>
                            <div className="vsp-popular-badge" style={{background: '#8b5cf6'}}>PAY AS YOU GO</div>
                            
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
                                <div style={{flex: '1', minWidth: '280px'}}>
                                    <h3 className="vsp-plan-name" style={{color: '#6d28d9', fontSize: '1.4rem'}}>{flexiblePlan.name}</h3>
                                    <p className="vsp-card-subtitle mb-20">Build your own package. Only pay for what you need.</p>

                                    <div style={{marginBottom: '20px'}}>
                                        <div className="vsp-flex-between mb-10">
                                            <label style={{fontSize: '0.85rem', fontWeight: '700', color: '#334155'}}>Validity Required</label>
                                            <span style={{color: '#8b5cf6', fontWeight: '800'}}>{flexDays} Days</span>
                                        </div>
                                        <input type="range" min="10" max={flexiblePlan.period > 0 ? flexiblePlan.period : 365} step="5" value={flexDays} onChange={(e) => setFlexDays(Number(e.target.value))} style={{width: '100%', accentColor: '#8b5cf6', cursor: 'pointer'}}/>
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                        <div className="vsp-flex-between mb-10">
                                            <label style={{fontSize: '0.85rem', fontWeight: '700', color: '#334155'}}>Product Limit</label>
                                            <span style={{color: '#8b5cf6', fontWeight: '800'}}>{flexProducts} Products</span>
                                        </div>
                                        <input type="range" min="10" max={flexiblePlan.productLimit > 0 ? flexiblePlan.productLimit : 10000} step="10" value={flexProducts} onChange={(e) => setFlexProducts(Number(e.target.value))} style={{width: '100%', accentColor: '#8b5cf6', cursor: 'pointer'}}/>
                                    </div>
                                </div>

                                <div style={{background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '250px', textAlign: 'center'}}>
                                    <p style={{fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px'}}>Total Price</p>
                                    <div className="vsp-plan-price" style={{marginBottom: '15px'}}>₹{calculateFlexiblePrice().toLocaleString()}</div>
                                    
                                    <button 
                                        className="vsp-btn-upgrade vsp-w-100" 
                                        style={{background: '#8b5cf6'}}
                                        onClick={() => handleBuyPlan(flexiblePlan, true)}
                                        disabled={isProcessingPayment}
                                    >
                                        {isProcessingPayment ? 'Processing...' : 'Buy Custom Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="vsp-text-center vsp-mt-20">
                        <button className="vsp-btn-ghost" onClick={() => setShowUpgradePlans(false)}>Close & Keep Current Plan</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSubscription;