"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "/customer/tours", label: "Explorar Tours" },
    { href: "/customer/bookings", label: "As Minhas Reservas" },
    { href: "/host", label: "Portal Anfitrião" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setIsMenuOpen(false);
      }
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isTabletView = windowWidth >= 768 && windowWidth <= 1024;

  return (
    <>
      <nav
        className={cn(
          "bg-white sticky top-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "shadow-md py-2 border-b border-gray-100"
            : "shadow-sm py-3"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">TT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              TravelTrek
            </span>
          </Link>

          {/* Desktop Navigation and Actions */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-700 hover:text-blue-600 transition-colors font-medium relative py-2",
                  pathname === link.href
                    ? "text-blue-600 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full"
                    : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-blue-400 hover:after:rounded-full after:transition-all after:duration-300"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3 ml-6">
              <Button variant="outline" size="sm" className="rounded-lg">
                Entrar
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Registrar
              </Button>
            </div>
          </div>

          {/* Mobile/Tablet Right Section */}
          <div className="lg:hidden flex items-center space-x-4">
            {isTabletView && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Registrar
                </Button>
              </div>
            )}
            <button
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transform transition duration-300 ease-in-out",
                    isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transition duration-300 ease-in-out",
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 rounded transform transition duration-300 ease-in-out",
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
          <div className="flex flex-col space-y-6 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-medium py-2 px-3 rounded-lg transition-colors",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                className="w-full justify-center rounded-lg bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
