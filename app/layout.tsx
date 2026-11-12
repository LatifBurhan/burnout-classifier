import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WFH Burnout Risk Classifier",
  description: "Prediksi tingkat risiko burnout karyawan Work From Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
