'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { api, Brand } from '@/lib/api';

export default function BrandsAdmin() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', logoUrl: '' });
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', logoUrl: '' });
  const [saving, setSaving] = useState(false);

  const loadBrands = async () => {
    try {
      const data = await api.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createBrand({
        name: newForm.name,
        logoUrl: newForm.logoUrl || undefined,
      });
      setShowNew(false);
      setNewForm({ name: '', logoUrl: '' });
      loadBrands();
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Error al crear la marca');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setEditForm({ name: brand.name, logoUrl: brand.logoUrl || '' });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await api.updateBrand(editingId, {
        name: editForm.name,
        logoUrl: editForm.logoUrl || undefined,
      });
      setEditingId(null);
      loadBrands();
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Error al actualizar la marca');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estas seguro de eliminar esta marca?')) return;
    try {
      await api.deleteBrand(id);
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error al eliminar la marca. Puede que tenga productos asociados.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Marcas</h1>
        <button
          onClick={() => setShowNew(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Marca
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Marca</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Logo URL</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* New Brand Row */}
            {showNew && (
              <tr className="bg-primary/10">
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Nombre de marca"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/logo.png"
                    value={newForm.logoUrl}
                    onChange={(e) => setNewForm({ ...newForm, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={saving || !newForm.name}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setShowNew(false); setNewForm({ name: '', logoUrl: '' }); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay marcas. Crea una nueva.
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editingId === brand.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                            Logo
                          </div>
                        )}
                        <span className="font-medium text-secondary">{brand.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === brand.id ? (
                      <input
                        type="url"
                        value={editForm.logoUrl}
                        onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://ejemplo.com/logo.png"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm truncate block max-w-xs">
                        {brand.logoUrl || 'Sin logo'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingId === brand.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
