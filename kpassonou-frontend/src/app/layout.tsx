import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kpassonou - Alertes Inondations Cotonou',
  description: 'Dashboard de surveillance des inondations à Cotonou, Bénin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
