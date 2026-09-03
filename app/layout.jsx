import './globals.css';

export const metadata = {
  title: 'Cafe o Late | Artisanal Roastery',
  description: 'Single-origin coffee, slow roasted in London.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
