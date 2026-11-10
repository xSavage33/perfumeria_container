'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { api, Product } from '@/lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, isLoading } = useCartStore();
  const [productDetails, setProductDetails] = useState<Record<number, Product>>({});

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: Record<number, Product> = {};
      for (const item of cart.items) {
        if (!productDetails[item.productId]) {
          try {
            const product = await api.getProduct(item.productId);
            details[item.productId] = product;
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
          }
        }
      }
      if (Object.keys(details).length > 0) {
        setProductDetails(prev => ({ ...prev, ...details }));
      }
    };
    if (cart.items.length > 0 && isOpen) {
      fetchProductDetails();
    }
  }, [cart.items, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrito ({cart.itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
              <p>Tu carrito esta vacio</p>
              <button
                onClick={onClose}
                className="mt-4 btn btn-secondary"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => {
                const product = productDetails[item.productId];
                return (
                  <li key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                    <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product?.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-primary-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-secondary text-sm">
                        {product?.name || `Producto #${item.productId}`}
                      </p>
                      <p className="text-accent font-semibold">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          disabled={isLoading}
                          className="ml-auto p-1 text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Subtotal:</span>
              <span className="text-accent">${Number(cart.subtotal).toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn btn-primary w-full"
            >
              Proceder al Checkout
            </Link>
            <button
              onClick={onClose}
              className="btn btn-outline w-full"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
