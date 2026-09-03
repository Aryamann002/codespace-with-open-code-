'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CartDrawer from '../components/CartDrawer';

const categories = ['all', 'espresso', 'coldbrew', 'tea', 'bakery'];
const categoryLabels = { all: 'All Creations', espresso: 'Espresso & Lattes', coldbrew: 'Cold Brews', tea: 'Artisanal Teas', bakery: 'Bakery & Bites' };
const items = [
  ['Spanish Honey Latté', 'Double ristretto, clover honey, steamed whole milk, and Ceylon cinnamon.', 'espresso', '$6.25', 'Bestseller'],
  ['Cardamom Oat Cortado', 'Rich espresso and silky oat milk infused with freshly crushed Guatemalan cardamom.', 'espresso', '$5.50', 'Staff Pick'],
  ['Blackberry Cascara Fizz', 'Cold-steeped cascara, blackberry shrub, sparkling mineral water, and a citrus peel.', 'coldbrew', '$5.75', 'Seasonal'],
  ['Honey Lavender Oat Latté', 'Velvety oat micro-foam, wildflower honey, lavender, and a double shot.', 'espresso', '$6.50', 'Today'],
  ['Jasmine Cloud Tea', 'Organic jasmine pearls, spring water, and a whisper of orange blossom.', 'tea', '$4.75', 'Delicate'],
  ['Masala Chai, Slow Simmered', 'Assam black tea, cardamom, ginger, clove, and steamed whole milk.', 'tea', '$5.25', 'Comfort'],
  ['Brown Butter Morning Bun', 'Laminated pastry, brown butter sugar, and flaky Maldon salt.', 'bakery', '$4.50', 'Fresh baked'],
  ['Olive Oil Citrus Cake', 'Bright lemon, extra virgin olive oil, and a soft almond crumb.', 'bakery', '$5.00', 'New'],
];
const seasonalBlends = [
  ['Maple Ember', 'Maple, cacao nib, and a smoky Colombia micro-lot.', '$6.75', 'Rich & warming'],
  ['Apricot Bloom', 'Apricot, jasmine, and a bright Ethiopian natural roast.', '$6.50', 'Floral & bright'],
  ['Cedar Cold Brew', 'Vanilla, cedar-smoked syrup, and twelve-hour cold brew.', '$6.25', 'Smooth & silky'],
];

function MenuCard({ item, onAdd, disabled }) {
  const [size, setSize] = useState('12oz');
  const [added, setAdded] = useState(false);
  const [name, description, , price, badge] = item;
  function addItem() { if (disabled) return; setAdded(true); onAdd({ name, price, size }); setTimeout(() => setAdded(false), 1400); }
  return <article className={`menu-card ${disabled ? 'order-locked' : ''}`}><div><div className="card-top"><span className="badge">{badge}</span><strong className="price">{price}</strong></div><h3>{name}</h3><p>{description}</p><div className="tags"><span>Small batch</span><span>Made today</span></div><div className="size-row"><span>Size</span><div className="size-picker">{['12oz', '16oz'].map((option) => <button disabled={disabled} className={size === option ? 'chosen' : ''} key={option} onClick={() => setSize(option)}>{option}</button>)}</div></div></div><button className="add-button" disabled={disabled} onClick={addItem}>{disabled ? 'Order in preparation' : added ? '✓ Added to Tray' : '+ Customize & Add'}</button></article>;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const [orderStartedAt, setOrderStartedAt] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(320);
  const [selectedBlend, setSelectedBlend] = useState(null);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const visibleItems = items.filter((item) => filter === 'all' || item[2] === filter);
  useEffect(() => {
    const savedPoints = window.localStorage.getItem('cafe-o-late-reward-points');
    if (savedPoints) setRewardPoints(Number(savedPoints));
    const savedOrder = window.localStorage.getItem('cafe-o-late-order');
    if (!savedOrder) return;
    const order = JSON.parse(savedOrder);
    if (Date.now() - order.startedAt < 60000) {
      setCartItems(order.items);
      setOrderStartedAt(order.startedAt);
      setOrderInProgress(true);
    } else {
      window.localStorage.removeItem('cafe-o-late-order');
    }
  }, []);
  function addToCart(item) { setCartItems((current) => { const existing = current.find((cartItem) => cartItem.name === item.name && cartItem.size === item.size); if (existing) return current.map((cartItem) => cartItem === existing ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem); return [...current, { ...item, quantity: 1 }]; }); setCartOpen(true); }
  function removeFromCart(name) { setCartItems((current) => current.flatMap((item) => item.name === name && item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : item.name === name ? [] : [item])); }
  function submitOrder() { if (!cartItems.length || orderInProgress) return; const startedAt = Date.now(); setOrderStartedAt(startedAt); setOrderInProgress(true); setCartOpen(true); window.localStorage.setItem('cafe-o-late-order', JSON.stringify({ items: cartItems, startedAt })); }
  function collectOrder() { const earnedStars = cartItems.reduce((total, item) => total + Math.round(Number.parseFloat(item.price.slice(1)) * item.quantity), 0); const nextPoints = rewardPoints + earnedStars; setRewardPoints(nextPoints); window.localStorage.setItem('cafe-o-late-reward-points', nextPoints); setOrderInProgress(false); setOrderStartedAt(null); setCartItems([]); window.localStorage.removeItem('cafe-o-late-order'); }
  function addBlend(blend) { if (orderInProgress) return; addToCart({ name: blend[0], price: blend[2], size: '12oz' }); setSelectedBlend(blend[0]); setTimeout(() => setSelectedBlend(null), 1400); }
  function redeemReward() { if (rewardPoints < 400) return; const nextPoints = rewardPoints - 400; setRewardPoints(nextPoints); window.localStorage.setItem('cafe-o-late-reward-points', nextPoints); }
  return <><Header onMenuToggle={() => setSidebarOpen(true)} /><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><CartDrawer open={cartOpen} items={cartItems} orderInProgress={orderInProgress} orderStartedAt={orderStartedAt} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onSubmit={submitOrder} onCollect={collectOrder} /><main id="top"><section className="hero"><div className="hero-copy"><span className="kicker">◉ Artisanal Roastery & Craft Café</span><h1>Every cup tells a <em>slower</em> story.</h1><p>Ethically harvested micro-lot beans, gently drum-roasted each morning in our sunlit London roastery. Finished with velvety organic oat micro-foam and deliberate, hand-poured precision.</p><div className="hero-actions"><a className="button button-dark" href="#menu">Explore today&apos;s menu ↓</a><a className="button button-light" href="#visit">♧ Reserve a table</a></div><div className="metrics"><div><strong>100%</strong><span>Direct trade</span></div><div><strong>18 hr</strong><span>Cold steeped</span></div><div><strong>24 hr</strong><span>Roast freshness</span></div></div></div><div className="hero-visual"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASN2TPn5CfC2zBJokR6lSAN3JaZ2o2J1i6AhHEsocQB4gJ2RJhnK7UhlO3ArP3Jqk426QuHLaUv0YXGcbQsCp2TKwH4DhR8MRJQIyS9NioYoLkNd-5UKeg5yAdhiN3jdI5nVF4Gz7a1hVCqJj8N4Ymrp4pbOf14bSOHft4u4wM2x4H6nY6N23b3fb4ZIpez6k2l2N9ViY7CiZhOe0DHmStkPDalpN2ef7zOyy7HJSKznx0bItjsQbG" alt="Sunlit artisanal cafe interior" /><div className="live-label">● Live roastery · Open today till 7:00 PM</div><div className="rating">★ <strong>4.9</strong><span>2,400+ coffee purists</span></div><div className="special"><span>Today&apos;s special</span><strong>Honey Lavender Oat Latté</strong></div></div></section><section className="highlights"><article><span className="feature-icon">♧</span><span className="eyebrow">Origin traceability</span><h2>Single-origin sourcing</h2><p>Direct partnership with organic family estates in Huila and Yirgacheffe, guaranteeing equitable wages and rare harvest varietals.</p><a href="#menu">Read harvest dossier →</a></article><article><span className="feature-icon amber">♨</span><span className="eyebrow">Daily roast lab</span><h2>Cast-iron drum roasting</h2><p>Calibrated slow drum curves coax sweet caramelization without scorch. Every micro-batch is cupped and profiled.</p><a href="#menu">View roast curves →</a></article><article><span className="feature-icon stone">◌</span><span className="eyebrow">Micro-foam mastery</span><h2>Velvet micro-foam</h2><p>Silky steamed organic oat and whole milk textured to precisely 62°C, balancing crema with botanical latte art.</p><a href="#menu">Our milk craft →</a></article></section><section className="menu-section" id="menu"><div className="section-heading"><div><span className="kicker">✦ Handcrafted daily</span><h2>The Cafe o Late menu</h2><p>Single-origin espressos, botanical cold brews, and oven-fresh laminates.</p></div><div className="filters">{categories.map((category) => <button className={filter === category ? 'active' : ''} onClick={() => setFilter(category)} key={category}>{categoryLabels[category]}</button>)}</div></div><div className="menu-grid">{visibleItems.map((item) => <MenuCard item={item} disabled={orderInProgress} onAdd={addToCart} key={item[0]} />)}</div></section><section className="seasonal-section" id="seasonal-blends"><div className="section-heading"><div><span className="kicker">✦ Limited roast release</span><h2>Seasonal blends</h2><p>Small lots that follow the weather, the harvest, and the mood of the morning.</p></div></div><div className="blend-grid">{seasonalBlends.map((blend) => <article className={`blend-card ${selectedBlend === blend[0] ? 'blend-added' : ''}`} key={blend[0]}><span className="blend-art">☕</span><span className="eyebrow">{blend[3]}</span><h3>{blend[0]}</h3><p>{blend[1]}</p><div className="blend-footer"><strong>{blend[2]}</strong><button disabled={orderInProgress} onClick={() => addBlend(blend)}>{selectedBlend === blend[0] ? 'Added ✓' : 'Add to tray'}</button></div></article>)}</div></section><section className="rewards-section" id="rewards"><div><span className="kicker">★ Cafe o Late rewards</span><h2>A little more joy in every cup.</h2><p>Earn 1 star for every dollar spent. Redeem 400 stars for a drink on us.</p></div><div className="rewards-panel"><div className="rewards-top"><span>Your balance</span><strong>{rewardPoints} <small>stars</small></strong></div><div className="reward-track"><span style={{ width: `${Math.min(100, (rewardPoints / 400) * 100)}%` }} /></div><div className="reward-meta"><span>{400 - rewardPoints} stars to a free drink</span><button disabled={rewardPoints < 400} onClick={redeemReward}>Redeem free drink</button></div></div></section><section className="visit" id="visit"><div><span className="eyebrow">Come sit with us</span><h2>A slower morning is waiting.</h2><p>14 Melrose Lane, London · Open daily, 7am–7pm</p></div><a className="button button-light" href="#top">Get directions ↗</a></section></main><button className={`cart-fab ${cartOpen ? 'is-open' : ''}`} onClick={() => setCartOpen(true)} aria-label={`${cartCount} items in tray`}>♧<span>{cartCount}</span></button></>;
}
