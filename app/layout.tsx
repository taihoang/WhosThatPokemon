import type { Metadata } from 'next';
import './app.css';

export const metadata: Metadata = {
  title: "Who's That Pokémon?",
  description: 'Test your Pokémon knowledge by identifying Pokémon from their silhouettes!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
