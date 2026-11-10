'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { api, Product, Category, Brand } from '@/lib/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') || '',
    brandId: searchParams.get('brandId') || '',
    gender: searchParams.get('gender') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {};
        if (filters.categoryId) params.categoryId = parseInt(filters.categoryId);
        if (filters.brandId) params.brandId = parseInt(filters.brandId);
        if (filters.gender) params.gender = filters.gender;
        if (filters.search) params.search = filters.search;

        const data = await api.getProducts(params);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      categoryId: '',
      brandId: '',
      gender: '',
      search: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="container-custom px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary">
            {filters.gender === 'masculino' && 'Perfumes para Hombre'}
            {filters.gender === 'femenino' && 'Perfumes para Mujer'}
            {filters.gender === 'unisex' && 'Perfumes Unisex'}
            {!filters.gender && 'Todos los Productos'}
          </h1>
          <p className="text-secondary-600 mt-2">
            Descubre nuestra coleccion completa de fragancias
          </p>
        </div>
      </div>

      <div className="container-custom px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 btn btn-outline"
          >
            <Filter className="w-5 h-5" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                Activos
              </span>
            )}
          </button>

          {/* Filters Sidebar */}
          <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-secondary">Filtros</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="label">Buscar</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Nombre del perfume..."
                  className="input"
                />
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="label">Genero</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  className="input"
                >
                  <option value="">Todos</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="label">Categoria</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  className="input"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="label">Marca</label>
                <select
                  value={filters.brandId}
                  onChange={(e) => setFilters({ ...filters, brandId: e.target.value })}
                  className="input"
                >
                  <option value="">Todas</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-gray-500 mb-6">
                  {products.length} producto{products.length !== 1 && 's'} encontrado{products.length !== 1 && 's'}
                </p>
                <ProductGrid products={products} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
