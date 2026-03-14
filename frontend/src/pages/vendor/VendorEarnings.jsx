import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../../environment';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { Download, Wallet, Landmark, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import VendorDashNavbar from '../vendor/VendorDashNavbar';
import './VendorEarnings.css';

const VendorEarnings = () => {
    const { token } = useAuth();
    const navigate = useNavigate(); 
    
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    
    const [wallet, setWallet] = useState({ availableBalance: 0, pendingBalance: 0, lifetimeEarnings: 0 });
    const [transactions, setTransactions] = useState([]);
    const [hasBankDetails, setHasBankDetails] = useState(true); 

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${server}/vendors/wallet`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setWallet(res.data.wallet);
                setTransactions(res.data.transactions);
                setHasBankDetails(res.data.hasBankDetails); 
            }
        } catch (error) {
            console.error("Failed to fetch wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchWalletData();
    }, [token]);

    const handleMaxAmount = () => {
        setWithdrawAmount(wallet.availableBalance);
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || withdrawAmount <= 0) return alert("Enter a valid amount");
        if (withdrawAmount > wallet.availableBalance) return alert("Insufficient balance");

        setProcessing(true);
        try {
            const res = await axios.post(`${server}/vendors/wallet/withdraw`, 
                { amount: Number(withdrawAmount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                alert("Withdrawal request submitted! It will be processed soon.");
                setWithdrawAmount('');
                fetchWalletData(); 
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to process withdrawal");
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleDownloadStatement = () => {
        if (transactions.length === 0) {
            return alert("No transactions available to download.");
        }

        const headers = ['Date', 'Transaction ID', 'Order ID (If Any)', 'Type', 'Payment Method', 'Amount (INR)', 'Status', 'Description'];

        const csvRows = transactions.map(txn => {
            const cleanDesc = txn.description ? `"${txn.description.replace(/"/g, '""')}"` : 'N/A'; // Wrap in quotes to avoid comma breaks
            const orderId = txn.orderId ? `'#${txn.orderId.toString().slice(-4).toUpperCase()}` : 'N/A'; // Adding quote so excel doesnt convert to formula

            return [
                new Date(txn.createdAt).toLocaleDateString('en-IN'),
                `'${txn._id.toString()}`,
                orderId,
                txn.type.toUpperCase(),
                txn.paymentMethod ? txn.paymentMethod.toUpperCase() : 'N/A',
                txn.type === 'credit' ? `+${txn.amount}` : `-${txn.amount}`,
                txn.status,
                cleanDesc
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Earnings_Statement_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Loading your wallet...</div>;

    return (
        <>  
        <VendorDashNavbar />
        <div className="booking-page">
          
            <div className="container booking-main-layout">
                
                <div className="ve-page-header">
                    <div>
                        <h2 className="ve-title">Earnings & <span className="pink-text">Payouts</span></h2>
                        <p className="ve-subtitle">Track sales and withdraw funds directly to your bank/UPI.</p>
                    </div>
                    <button className="ve-download-btn" onClick={handleDownloadStatement}>
                        <Download size={14} /> Statement
                    </button>
                </div>

                <div className="booking-grid-wrapper">
                    <div className="sections-container">
                        
                        <div className="booking-section-card">
                            <div className="card-top">
                                <span className="step-count">01</span>
                                <h4>Financial Overview</h4>
                            </div>
                            <div className="ve-compact-balance">
                                <span className="ve-compact-label">Available for Payout</span>
                                <h2 className="ve-compact-amount">₹{wallet.availableBalance.toLocaleString()}</h2>
                                <p className="ve-compact-help">Ready to be withdrawn</p>
                                
                                <div className="ve-compact-secondary">
                                    <div className="ve-sec-stat">
                                        <p><Clock size={12}/> Pending</p>
                                        <h4>₹{wallet.pendingBalance.toLocaleString()}</h4>
                                    </div>
                                    <div className="ve-sec-stat">
                                        <p><Wallet size={12}/> Lifetime</p>
                                        <h4 className="text-pink">₹{wallet.lifetimeEarnings.toLocaleString()}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="booking-section-card highlight">
                            <div className="card-top">
                                <span className="step-count">02</span>
                                <h4>Request Payout</h4>
                            </div>
                            
                            <div className="address-display" style={{ marginBottom: '15px' }}>
                                <div className="user-info">
                                    <span className="tag-home">SETTLEMENT A/C</span>
                                    <h5>Setup Bank / UPI Details</h5> 
                                </div>
                                <p className="address-text">Ensure your payout details are added in profile.</p>
                            </div>

                            {!hasBankDetails ? (
                                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff1f2', border: '1px dashed #fecdd3', borderRadius: '8px', marginTop: '10px' }}>
                                    <AlertCircle color="#ef4444" size={30} style={{ marginBottom: '10px' }}/>
                                    <h4 style={{ color: '#ef4444', margin: '0 0 5px 0' }}>Action Required</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '15px' }}>Please add your bank account or UPI ID to receive payouts.</p>
                                    <button 
                                        className="btn-main" 
                                        style={{ backgroundColor: '#0f172a', padding: '10px 20px', fontSize: '0.9rem' }}
                                        onClick={() => navigate('/vendor/account', { state: { activeTab: 'bank' } })}
                                    >
                                        <Landmark size={14} style={{ marginRight: '5px' }}/> Add Payout Details
                                    </button>
                                </div>
                            ) : (
                                <div className="ve-withdraw-form">
                                    <div className="flex-between" style={{marginBottom: '6px'}}>
                                        <label className="ve-input-label">Amount</label>
                                        <span className="ve-text-link" onClick={handleMaxAmount}>Max</span>
                                    </div>
                                    
                                    <div className="ve-input-wrapper">
                                        <span className="ve-currency-symbol">₹</span>
                                        <input 
                                            type="number" 
                                            className="ve-amount-input" 
                                            placeholder="0"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            max={wallet.availableBalance}
                                        />
                                    </div>
                                    <p className="ve-compact-help" style={{marginTop: '6px'}}>Takes 1-2 business days.</p>

                                    <div style={{ marginTop: 'auto', paddingTop: '15px' }}>
                                        <button 
                                            className="btn-main finalize-btn" 
                                            onClick={handleWithdraw}
                                            disabled={processing || wallet.availableBalance <= 0}
                                            style={{ opacity: (processing || wallet.availableBalance <= 0) ? 0.6 : 1 }}
                                        >
                                            {processing ? 'PROCESSING...' : `TRANSFER ₹${withdrawAmount || '0'}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="booking-section-card">
                            <div className="card-top">
                                <span className="step-count">03</span>
                                <h4>Transactions</h4>
                            </div>
                            
                            <div className="payment-options-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                {transactions.length === 0 ? (
                                    <p style={{textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '20px 0'}}>No transactions yet.</p>
                                ) : (
                                    transactions.map((txn) => (
                                        <div key={txn._id} className="pay-item" style={{ cursor: 'default' }}>
                                            <div className="pay-content">
                                                <p className="pay-title" style={{textTransform: 'capitalize'}}>{txn.type} {txn.paymentMethod === 'cod' && '(COD)'}</p>
                                                <p className="pay-subtitle">{formatDate(txn.createdAt)}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p className={`pay-title ${txn.type === 'credit' ? 'text-green' : 'text-dark'}`}>
                                                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                                </p>
                                                <p className="pay-subtitle flex-align" style={{justifyContent: 'flex-end', gap: '3px'}}>
                                                    {txn.status === 'Processing' ? <Clock size={10}/> : txn.status === 'Failed' ? <AlertCircle size={10} color="red"/> : <CheckCircle2 size={10} color="green"/>}
                                                    <span style={{color: txn.status === 'Failed' ? 'red' : 'inherit'}}>{txn.status}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        </>
    );
};

export default VendorEarnings;