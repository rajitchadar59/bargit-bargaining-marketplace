import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../../environment';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Loader2, ChevronDown } from 'lucide-react';
import VendorDashNavbar from '../vendor/VendorDashNavbar';
import './VendorAnalytics.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const VendorAnalytics = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [revenueRange, setRevenueRange] = useState('7');

    const [stats, setStats] = useState({
        totalRevenue: 0, totalOrders: 0, aiDealsClosed: 0, activeProducts: 0, productLimit: 1
    });

    const [chartData, setChartData] = useState({
        trendLabels: [], trendValues: [],
        productLabels: [], productValues: [],
        statusLabels: [], statusValues: []
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${server}/vendors/analytics?range=${revenueRange}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data.success) {
                    const d = res.data.data;
                    setStats(d.stats);

                    setChartData({
                        trendLabels: d.charts.revenueTrend.labels,
                        trendValues: d.charts.revenueTrend.data,
                        productLabels: d.charts.topProducts.labels,
                        productValues: d.charts.topProducts.data,
                        statusLabels: d.charts.orderStatus.labels,
                        statusValues: d.charts.orderStatus.data
                    });
                }
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token, revenueRange]);

    // 1. Line Chart
    const lineData = {
        labels: chartData.trendLabels,
        datasets: [{
            label: 'Revenue (₹)',
            data: chartData.trendValues,
            borderColor: '#FF2E63',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 350);
                gradient.addColorStop(0, 'rgba(255, 46, 99, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 46, 99, 0.0)');
                return gradient;
            },
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#FF2E63',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', padding: 12, cornerRadius: 8, displayColors: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' }, border: {display: false} },
            y: { grid: { color: '#f1f5f9', borderDash: [4, 4] }, ticks: { color: '#64748b', maxTicksLimit: 6 }, border: {display: false} }
        },
        interaction: { intersect: false, mode: 'index' },
    };

    const barData = {
        labels: chartData.productLabels,
        datasets: [{
            label: 'Revenue (₹)',
            data: chartData.productValues,
            backgroundColor: '#0f172a', 
            hoverBackgroundColor: '#FF2E63', 
            borderRadius: 6,
            barThickness: 24,
        }]
    };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', padding: 12, cornerRadius: 8 } },
        scales: {
            x: { grid: { display: false }, ticks: { display: false }, border: {display: false} }, // 🌟 FIX: ticks display false kar diya
            y: { display: false, min: 0 }
        }
    };

    const statusDoughnutData = {
        labels: chartData.statusLabels,
        datasets: [{
            data: chartData.statusValues,
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], 
            borderWidth: 2,
            borderColor: '#ffffff',
        }]
    };

    const capacityValue = stats.activeProducts;
    const capacityLimit = stats.productLimit;
    const remainingCapacity = capacityLimit - capacityValue;
    const percentageUsed = capacityLimit > 0 ? Math.round((capacityValue / capacityLimit) * 100) : 0;

    const capacityDoughnutData = {
        labels: ['Used', 'Remaining'],
        datasets: [{
            data: [capacityValue, remainingCapacity > 0 ? remainingCapacity : 0],
            backgroundColor: ['#FF2E63', '#f1f5f9'],
            borderWidth: 0,
        }]
    };

    if(loading && chartData.trendLabels.length === 0) return <div style={{padding: '100px', textAlign: 'center'}}><Loader2 className="spinner text-pink" size={40} style={{margin:'0 auto'}}/></div>

    return (
        <div className="vo-layout">
            <VendorDashNavbar />

            <div className="va-full-width-container">
                <div className="va-header">
                    <div>
                        <h2 className="va-title">Store <span className="pink-text">Analytics.</span></h2>
                        <p className="ve-subtitle">Insights drawn from real-time customer data.</p>
                    </div>
                </div>

                <div className="va-naked-stats-container">
                    <div className="va-n-stat-item">
                        <span className="va-n-label">Delivered Revenue</span>
                        <strong className="va-n-value text-pink">₹ {stats.totalRevenue.toLocaleString()}</strong>
                    </div>
                    
                    <div className="va-n-divider"></div>
                    
                    <div className="va-n-stat-item">
                        <span className="va-n-label">Total Orders Placed</span>
                        <strong className="va-n-value">{stats.totalOrders}</strong>
                    </div>
                    
                    <div className="va-n-divider"></div>
                    
                    <div className="va-n-stat-item">
                        <span className="va-n-label">Avg. Order Value</span>
                        <strong className="va-n-value">₹ {stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}</strong>
                    </div>
                    
                    <div className="va-n-divider"></div>
                    
                    <div className="va-n-stat-item">
                        <span className="va-n-label">Inventory Size</span>
                        <strong className="va-n-value">{stats.activeProducts}</strong>
                    </div>
                </div>

                <div className="va-chart-card mb-30">
                    <div className="va-chart-header">
                        <div>
                            <h4>Revenue Growth</h4>
                            <p>Daily performance tracking for delivered orders.</p>
                        </div>
                        <div className="va-chart-filter-box">
                            <select value={revenueRange} onChange={(e) => setRevenueRange(e.target.value)}>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                                <option value="year">This Year</option>
                            </select>
                            <ChevronDown size={14} className="filter-arrow" />
                        </div>
                    </div>
                    
                    <div className="va-chart-large">
                        {loading ? <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center'}}><Loader2 className="spinner text-pink"/></div> : <Line data={lineData} options={lineOptions} />}
                    </div>
                </div>

                <div className="va-bottom-3-grid">
                    
                    <div className="va-chart-card">
                        <div className="va-chart-header">
                            <h4>Top Grossing Products</h4>
                        </div>
                        <div className="va-chart-medium">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className="va-chart-card">
                        <div className="va-chart-header">
                            <h4>Order Pipeline</h4>
                        </div>
                        <div className="va-doughnut-wrapper">
                            <Doughnut data={statusDoughnutData} options={{responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } }}} />
                            <div className="va-doughnut-center-text">
                                <h3>{stats.totalOrders}</h3>
                                <p>Orders</p>
                            </div>
                        </div>
                        <div className="va-custom-legend">
                            <div className="va-legend-item"><span className="dot" style={{background:'#f59e0b'}}></span> Proc.</div>
                            <div className="va-legend-item"><span className="dot" style={{background:'#3b82f6'}}></span> Ship.</div>
                            <div className="va-legend-item"><span className="dot" style={{background:'#10b981'}}></span> Del.</div>
                        </div>
                    </div>

                    <div className="va-chart-card">
                        <div className="va-chart-header">
                            <h4>Plan Capacity</h4>
                        </div>
                        <div className="va-doughnut-wrapper">
                            <Doughnut data={capacityDoughnutData} options={{responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } }}} />
                            <div className="va-doughnut-center-text">
                                <h3 className={percentageUsed >= 100 ? 'text-red' : ''}>{percentageUsed}%</h3>
                                <p>Used</p>
                            </div>
                        </div>
                        <div style={{textAlign:'center', marginTop:'15px', color:'#64748b', fontSize:'0.85rem', fontWeight:'600'}}>
                            {stats.activeProducts} of {stats.productLimit} slots occupied.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VendorAnalytics;