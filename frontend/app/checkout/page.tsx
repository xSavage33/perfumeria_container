'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { api, Product } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, fetchCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState<Record<number, Product>>({});

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    paymentMethod: 'cash',
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
    if (cart.items.length > 0) {
      fetchProductDetails();
    }
  }, [cart.items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: productDetails[item.productId]?.name || `Producto #${item.productId}`,
          quantity: item.quantity,
          unitPrice: Number(item.price),
        })),
      };

      const order = await api.createOrder(orderData);

      // Update stock for each product
      for (const item of cart.items) {
        try {
          const product = productDetails[item.productId];
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await api.updateProduct(item.productId, { stock: newStock });
          }
        } catch (err) {
          console.error(`Error updating stock for product ${item.productId}:`, err);
        }
      }

      setOrderNumber(order.orderNumber);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setError('Error al procesar el pedido. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom px-4 max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-secondary mb-4">
              Pedido Confirmado
            </h1>
            <p className="text-gray-600 mb-6">
              Gracias por tu compra. Hemos recibido tu pedido correctamente.
            </p>

            <div className="bg-primary-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Numero de pedido</p>
              <p className="text-2xl font-bold text-secondary">{orderNumber}</p>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Recibirás un correo electrónico con los detalles de tu pedido.
            </p>

            <Link href="/productos" className="btn btn-primary">
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-secondary mb-4">Tu carrito esta vacio</h1>
          <Link href="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4">
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al carrito
        </Link>

        <h1 className="text-3xl font-bold text-secondary mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-secondary mb-6">
                  Informacion de Contacto
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="label">Nombre completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className="input"
                      placeholder="Juan Perez"
                    />
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      className="input"
                      placeholder="juan@email.com"
                    />
                  </div>

                  <div>
                    <label className="label">Telefono</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, customerPhone: e.target.value })
                      }
                      className="input"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-secondary mb-6">
                  Direccion de Envio
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="label">Direccion *</label>
                    <textarea
                      required
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingAddress: e.target.value })
                      }
                      className="input"
                      rows={3}
                      placeholder="Calle, numero, apartamento..."
                    />
                  </div>

                  <div>
                    <label className="label">Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={formData.shippingCity}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingCity: e.target.value })
                      }
                      className="input"
                      placeholder="Ciudad"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-secondary mb-6">
                  Metodo de Pago
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="w-4 h-4 text-accent"
                    />
                    <span>Pago contra entrega</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="w-4 h-4 text-accent"
                    />
                    <span>Transferencia bancaria</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full text-lg py-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-secondary mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {productDetails[item.productId]?.name || `Producto #${item.productId}`} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envio</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-accent">${cart.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
