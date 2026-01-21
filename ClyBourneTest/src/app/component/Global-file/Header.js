'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import logoImage from "../../../static/images/logo.png";
import { clearToken, fetchUser } from "../../../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

export const Header = () => {
  // Separate states for mobile menu and profile dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { userData } = useSelector((state) => state.user);

  // Refs for both dropdowns
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUser());
    setMounted(true);
  }, [dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if click is outside
      if (
        profileDropdownOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }

      // Close mobile menu if click is outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, mobileMenuOpen]);

  // Close dropdowns on escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearToken());
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/auth/login");
  };

  if (!mounted) return null;

  return (
    <header className="w-full sticky top-0 left-0 bg-white z-50 py-5 sm:py-6 lg:py-8 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
        <div className="flex items-center cursor-pointer">
          <Image
            src={logoImage}
            alt="logo"
            className="h-10 w-auto md:h-6 lg:h-8 xl:h-10"
            priority
          />
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4 xl:gap-8">
        <ul className="flex gap-4 md:gap-3 lg:gap-6 xl:gap-8 text-sm sm:text-xs xl:text-sm 2xl:text-lg font-medium text-black">
          <li><Link href="/how-it-works" className="hover:text-blue-950">How It Works</Link></li>
          <li><Link href="/methodology" className="hover:text-blue-950">Methodology</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-950">Pricing</Link></li>
          <li><Link href="/about-us" className="hover:text-blue-950">About Us</Link></li>
          <li><Link href="/blogs" className="hover:text-blue-950">Blogs</Link></li>
        </ul>

        {isLoggedIn ? (
          // Profile Icon + Dropdown (Desktop only)
          <div className="flex items-center lg:gap-3 relative ml-3">
            <p className='text-black text-sm'>
              Hi, {mounted && userData?.first_name ? userData.first_name : "Guest"}
            </p>

            {/* Profile Button with ref */}
            <button
              ref={profileButtonRef}
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="focus:outline-none"
              aria-label="User menu"
            >
              <FaUserCircle className="text-3xl text-themegreen cursor-pointer hover:opacity-80 transition-opacity" />
            </button>

            {/* Profile Dropdown (Desktop only) */}
            {profileDropdownOpen && (
              <div
                ref={profileDropdownRef}
                className="absolute right-0 text-black top-full mt-2 bg-white border rounded-lg shadow-lg w-48 z-50 py-2"
              >
                <Link
                  href="/dashboard/newOrder"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  New Order
                </Link>

                <Link
                  href="/dashboard/order"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  My Orders
                </Link>

                <Link
                  href="/dashboard/upgradePlan"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Upgrade Plan
                </Link>

                <Link
                  href="/dashboard/plan&billing"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  Plans & Billing
                </Link>

                <Link
                  href="/dashboard/myProfile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  My Profile
                </Link>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="ml-1 text-sm sm:text-xs xl:text-sm 2xl:text-lg border border-gray-500 px-2 lg:px-4 py-1.5 rounded hover:bg-lightgrey transition text-black">
            <Link href="/auth/login">Login</Link> / <Link href="/auth/signup">Signup</Link>
          </button>
        )}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button 
          ref={hamburgerButtonRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav - Takes 50% height from top */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-white md:hidden z-50 shadow-lg max-h-[50vh] overflow-y-auto"
        >
          <div className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 py-6">
            {/* Navigation Links */}
            <ul className="flex flex-col gap-4 text-base font-medium text-black">
              <li>
                <Link 
                  href="/how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-950 block py-2"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/methodology" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-950 block py-2"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-950 block py-2"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/about-us" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-950 block py-2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/blogs" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-blue-950 block py-2"
                >
                  Blogs
                </Link>
              </li>
              
              {/* User section for mobile */}
              {isLoggedIn ? (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Welcome</p>
                    <p className="font-medium mb-4">
                      {mounted && userData?.first_name ? userData.first_name : "Guest"}
                    </p>
                    
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-themegreen block py-2"
                    >
                      Dashboard
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left border border-gray-500 px-4 py-2 rounded hover:bg-lightgrey transition text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t">
                  <button className="w-full border border-gray-500 px-4 py-2.5 rounded hover:bg-lightgrey transition mb-3">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </button>
                  <button className="w-full border border-gray-500 px-4 py-2.5 rounded hover:bg-lightgrey transition">
                    <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      Signup
                    </Link>
                  </button>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};