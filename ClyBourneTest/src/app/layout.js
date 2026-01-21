"use client"; // ✅ required at the top for client components
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Header } from "./component/Global-file/Header";
import Footer from "./component/Global-file/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReduxProvider } from "../redux/Providers"
import { usePathname } from "next/navigation";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
        <ReduxProvider>
          <Header />
          {children}
          {!pathname?.startsWith("/dashboard") && <Footer />}
        </ReduxProvider>
      </body>
    </html>
  );
}
