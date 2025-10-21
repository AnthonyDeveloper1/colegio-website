/**
 * Root Layout
 * Layout principal de la aplicación
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { INSTITUTION } from "@/lib/constants";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${INSTITUTION.name} - Educación de Excelencia`,
  description: `${INSTITUTION.name}. Institución educativa comprometida con la excelencia académica y el desarrollo integral de nuestros estudiantes.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
