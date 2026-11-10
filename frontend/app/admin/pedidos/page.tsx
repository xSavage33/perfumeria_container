'use client';

import { useState, useEffect } from 'react';
import { Package, Eye, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { api, Order } from '@/lib/api';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmed', label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped', label: 'Enviado', color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({
        limit: 50,
        status: filterStatus || undefined
      });
      setOrders(data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId: number, newStatus: string, orderItems: any[]) => {
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    // If cancelling, we need to restore stock
    if (newStatus === 'cancelled' && currentOrder.status !== 'cancelled') {
      if (!confirm('¿Cancelar este pedido? El stock de los productos será restaurado.')) {
        return;
      }
    }

    setUpdatingOrder(orderId);
    try {
      // Update order status
      await api.updateOrderStatus(orderId, newStatus);

      // If cancelling, restore stock for each product
      if (newStatus === 'cancelled' && currentOrder.status !== 'cancelled') {
        for (const item of orderItems) {
          try {
            const product = await api.getProduct(item.productId);
            const newStock = product.stock + item.quantity;
            await api.updateProduct(item.productId, { stock: newStock });
          } catch (err) {
            console.error(`Error restoring stock for product ${item.productId}:`, err);
          }
        }
      }

      // Reload orders
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusInfo = (status: string) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Pedidos</h1>
        <button
          onClick={loadOrders}
          className="btn btn-outline flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No hay pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-secondary">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-accent">${Number(order.total).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items?.length || 0} productos</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {isExpanded && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-semibold text-secondary mb-3">Información del Cliente</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Nombre:</span> {order.customerName}</p>
                          <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
                          <p><span className="text-gray-500">Teléfono:</span> {order.customerPhone || 'No proporcionado'}</p>
                          <p><span className="text-gray-500">Ciudad:</span> {order.shippingCity}</p>
                          <p><span className="text-gray-500">Dirección:</span> {order.shippingAddress}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold text-secondary mb-3">Productos</h3>
                        <div className="space-y-2">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm bg-white p-2 rounded">
                              <span>
                                {item.productName} x {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${Number(item.totalPrice || item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-accent">${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t mt-4 pt-4">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Cambiar estado:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value, order.items || [])}
                          disabled={updatingOrder === order.id}
                          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        {updatingOrder === order.id && (
                          <span className="text-sm text-gray-500">Actualizando...</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
