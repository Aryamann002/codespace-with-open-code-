'use client';

const links = [
  ['⌂', 'Our Roastery', '#top'],
  ['☕', 'Artisanal Menu', '#menu'],
  ['✦', 'Seasonal Blends', '#top'],
  ['★', 'Rewards & Stars', '#top'],
  ['⌖', 'Find a Cafe', '#visit'],
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Site navigation">
        <div className="sidebar-heading"><span>Explore</span><button className="icon-button" onClick={onClose} aria-label="Close navigation">×</button></div>
        <div className="sidebar-rule" />
        {links.map(([icon, label, href], index) => (
          <a className={`sidebar-link ${index === 1 ? 'selected' : ''}`} href={href} key={label} onClick={onClose}>
            <span className="sidebar-icon">{icon}</span><span>{label}</span>
          </a>
        ))}
        <div className="sidebar-note"><span className="eyebrow">Open today</span><strong>07:00 - 19:00</strong><span>14 Melrose Lane, London</span></div>
      </aside>
    </>
  );
}
