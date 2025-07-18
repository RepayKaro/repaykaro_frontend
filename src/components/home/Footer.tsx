'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
const MOBILE_WHATSAPP = process.env.NEXT_PUBLIC_COMPANY_MOBILE_WHATSAPP;
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Add fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Add pulsing animation every 5 seconds
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <footer className={`bg-white dark:bg-gray-900 border-t border-purple-100 dark:border-purple-900/20 mt-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* WhatsApp Floating Button */}
        <div className="fixed bottom-4 right-4 z-[100]">

          <a
            href={`https://wa.me/${MOBILE_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <div className={`relative animate-float ${isPulsing ? 'animate-pulse-once' : ''}`}>
              <Image
                src="/images/whatsapp-512.png"
                alt="WhatsApp chat"
                width={50}
                height={50}
                className={`inline-block hover:opacity-80 transition-all duration-3000 ${isPulsing ? 'scale-100' : 'scale-100'
                  }`}
              />
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Column 1: RepayKaro Info */}
          <div className="min-h-[150px]">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-3xl gradient-text dark:gradient-text transition-colors duration-300">
                <Image
                  src={theme === "dark" ? "/images/logo/rpk-new.png" : "/images/logo/rpk.png"}
                  alt="RepayKaro"
                  width={250}
                  height={10}
                />
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              We specialize in helping lenders recover bad debts efficiently, while offering customers the motivation to repay by providing attractive incentives.
            </p>
          </div>

          {/* Column 2: Contact Us */}
          <div className="min-h-[150px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+917428400144" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center justify-center md:justify-start gap-2 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 7428400144
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon-Fri 9am-6pm
              </li>
              <li>
                <a href="mailto:hr@repaykaro.com" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center justify-center md:justify-start gap-2 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hr@repaykaro.com
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Online support
              </li>
            </ul>
          </div>

          {/* Column 3: Address */}
          <div className="min-h-[150px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Address</h3>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-300 space-y-4 flex flex-col items-center md:items-start">
              <span>KnockOff Dues Technologies Pvt. Ltd.</span>
              <span>3rd Floor, B-56 Old Plot, No-56, </span>
              <span>South Ganesh Nagar, East Delhi, East Delhi, East Delhi- 110092, Delhi</span>
            </address>
          </div>

          {/* Column 4: Useful Links */}
          <div className="min-h-[150px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Useful Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 py-2 block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 py-2 block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 py-2 block">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} True Business Minds Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;