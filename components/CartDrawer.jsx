'use client';

import { useEffect, useState } from 'react';

export default function CartDrawer({ open, items, orderInProgress, orderStartedAt, onClose, onRemove, onSubmit, onCollect }) {
  const [progress, setProgress] = useState(0);
  const total = items.reduce((sum, item) => sum + Number.parseFloat(item.price.slice(1)) * item.quantity, 0);

  useEffect(() => {
    if (!orderInProgress) {
      setProgress(0);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - orderStartedAt) / 60000) * 100));
    }, 1000);
    setProgress(Math.min(100, ((Date.now() - orderStartedAt) / 60000) * 100));
    return () => window.clearInterval(timer);
  }, [orderInProgress, orderStartedAt]);

  return <>
    <div className={`cart-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
    <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-label="Your order" aria-hidden={!open}>
      <div className="cart-heading"><div><span className="eyebrow">Cafe o Late</span><h2>{orderInProgress ? 'Your order is brewing' : 'Your tray'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close tray">×</button></div>
      {orderInProgress ? <div className="order-status">
        <div className="status-orbit"><span>☕</span></div>
        <span className="eyebrow">Order in preparation</span>
        <h3>Made slowly, made for you.</h3>
        <p>Your order is being prepared at the bar. Please collect it when the barista calls your name.</p>
        <div className="progress-meta"><span>Preparation progress</span><strong>{Math.round(progress)}%</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <div className="progress-steps"><span className={progress >= 0 ? 'done' : ''}>Received</span><span className={progress >= 35 ? 'done' : ''}>Preparing</span><span className={progress >= 100 ? 'done' : ''}>Collect</span></div>
        {progress >= 100 ? <button className="pay-button collect-button" onClick={onCollect}>Collect order <span>✓</span></button> : <p className="order-note">Pay at counter when you collect · about 1 minute</p>}
      </div> : items.length ? <>
        <div className="cart-items">{items.map((item) => <div className="cart-item" key={item.name}><div><strong>{item.name}</strong><span>{item.size} · Qty {item.quantity}</span></div><div className="cart-item-actions"><b>${(Number.parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}</b><button onClick={() => onRemove(item.name)} aria-label={`Remove ${item.name}`}>−</button></div></div>)}</div>
        <div className="cart-total"><span>Total at counter</span><strong>${total.toFixed(2)}</strong></div>
        <button className="pay-button" onClick={onSubmit}>Pay at counter <span>→</span></button>
        <p className="counter-note">No online payment required. We&apos;ll start your order once you confirm.</p>
      </> : <div className="empty-cart"><div className="empty-cup">☕</div><h3>Your tray is waiting.</h3><p>Add something delicious from the menu and we&apos;ll have it ready at the counter.</p><button className="button button-dark" onClick={onClose}>Browse the menu</button></div>}
    </aside>
  </>;
}
