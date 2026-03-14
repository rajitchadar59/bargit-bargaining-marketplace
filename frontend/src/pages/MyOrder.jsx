import React from 'react';
import DashNavbar from '../components/dashboard/DashNavbar';
import { PackageCheck, Clock } from 'lucide-react';
import './MyOrder.css';

const MyOrder = () => {
  const orders = [
    { id: "ORD-9921", date: "12 Feb, 2026", total: "₹1,24,900", status: "Delivered", img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400" },
    { id: "ORD-8820", date: "05 Feb, 2026", total: "₹45,000", status: "Processing", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
  ];

  return (
    <div className="orders-page">
      <DashNavbar />
      <div className="container orders-wrapper">
        <h2>Your <span className="pink-text">Orders</span></h2>
        <div className="orders-list">
          {orders.map((order, i) => (
            <div className="order-card" key={i}>
              <img src={order.img} alt="" />
              <div className="order-info">
                <p className="order-id">{order.id}</p>
                <h4>Apple iPhone 15 Pro</h4>
                <span>Placed on: {order.date}</span>
              </div>
              <div className="order-meta">
                <p className="price-bold">{order.total}</p>
                <div className={`status-tag ${order.status.toLowerCase()}`}>
                  {order.status === 'Delivered' ? <PackageCheck size={14}/> : <Clock size={14}/>}
                  {order.status}
                </div>
              </div>
              <button className="track-btn">Track Order</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MyOrder;