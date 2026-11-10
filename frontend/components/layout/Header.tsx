'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, isCartOpen, setCartOpen } = useCartStore();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-secondary">el</span>
              <span className="text-2xl font-bold text-accent">Container</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-secondary-600 hover:text-secondary font-medium transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-secondary-600 hover:text-secondary font-medium transition-colors"
              >
                Productos
              </Link>
              <Link
                href="/productos?gender=masculino"
                className="text-secondary-600 hover:text-secondary font-medium transition-colors"
              >
                Hombre
              </Link>
              <Link
                href="/productos?gender=femenino"
                className="text-secondary-600 hover:text-secondary font-medium transition-colors"
              >
                Mujer
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-secondary-600 hover:text-secondary transition-colors hidden md:block">
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-secondary-600 hover:text-secondary transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cart.itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-secondary-600 hover:text-secondary transition-colors md:hidden"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden border-t py-4 px-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-secondary-600 hover:text-secondary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/productos"
                  className="text-secondary-600 hover:text-secondary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  href="/productos?gender=masculino"
                  className="text-secondary-600 hover:text-secondary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hombre
                </Link>
                <Link
                  href="/productos?gender=femenino"
                  className="text-secondary-600 hover:text-secondary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mujer
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
