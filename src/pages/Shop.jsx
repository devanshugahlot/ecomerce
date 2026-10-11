import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check, PackageCheck, Package } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { useProducts } from '../context/ProductContext';
import { BRAND_NAME } from '../utils/constants';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBestseller = searchParams.get('bestseller') === 'true';

  const { products: productsList, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(3000);
  const [onlyBestSeller, setOnlyBestSeller] = useState(initialBestseller);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);
    if (searchParams.get('bestseller') === 'true') setOnlyBestSeller(true);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (selectedCategory) {
      result = result.filter(
        (p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.benefitSummary?.toLowerCase().includes(q)
      );
    }

    if (priceRange < 3000) {
      result = result.filter((p) => (p.price || 0) <= priceRange);
    }

    if (onlyBestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Sort logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'bestsellers') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [productsList, selectedCategory, searchQuery, priceRange, onlyBestSeller, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange(3000);
    setOnlyBestSeller(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="bg-white min-h-screen py-6 space-y-6 text-[#0A0A0A]">
      <SEO
        title={`Buy ${BRAND_NAME} Formulations Online — Official Store`}
        description="Browse doctor-backed performance catalog. Free discreet shipping & cash on delivery across India."
      />

      {/* Header Banner Section Card */}
      <div className="section-card-float flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#F5F5F5] border border-[#E5E5E5]">
        <div className="space-y-2 max-w-xl">
          <span className="eyebrow-label text-[#6B6B6B]">
            CLINICAL CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-black">
            {BRAND_NAME} Storefront
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-black" /> Formulated with clinical ingredients. Delivered in plain unmarked boxes.
          </p>
        </div>

        {/* Search inside shop */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-white border border-[#E5E5E5] rounded-full pl-10 pr-4 py-2.5 text-xs text-black font-medium placeholder-neutral-400 focus:outline-none focus:border-black min-h-[44px]"
          />
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Filter Sidebar Card */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-6 border border-[#E5E5E5] space-y-6 sticky top-24 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <h3 className="font-heading font-black text-sm text-black flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-black" />
              Filter Catalog
            </h3>
            {(selectedCategory || searchQuery || priceRange < 3000 || onlyBestSeller) && (
              <button onClick={resetFilters} className="text-[11px] font-bold text-black hover:underline">
                Reset All
              </button>
            )}
          </div>

          {/* Dynamic Categories from Admin */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[40px] ${
                  !selectedCategory
                    ? 'bg-black text-white font-black shadow-xs'
                    : 'text-neutral-700 hover:bg-[#F5F5F5]'
                }`}
              >
                All Categories ({productsList.length})
              </button>
              {categories.map((cat) => {
                const cName = cat.name || cat.slug;
                const count = productsList.filter((p) => (p.category || '').toLowerCase() === cName.toLowerCase()).length;
                return (
                  <button
                    key={cat.id || cat.slug || cat.name}
                    onClick={() => setSelectedCategory(cName)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors min-h-[40px] ${
                      selectedCategory.toLowerCase() === cName.toLowerCase()
                        ? 'bg-black text-white font-black shadow-xs'
                        : 'text-neutral-700 hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <span>{cName}</span>
                    <span className={`text-[10px] ${selectedCategory.toLowerCase() === cName.toLowerCase() ? 'text-white/80' : 'text-neutral-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
            <div className="flex justify-between items-center text-xs font-bold text-black">
              <span>Max Price</span>
              <span className="text-black font-black">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black bg-[#E5E5E5] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Best Sellers Filter Toggle */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={onlyBestSeller}
                onChange={(e) => setOnlyBestSeller(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E5E5] accent-black text-black"
              />
              <span>Only Bestsellers</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden btn-secondary px-3.5 py-2 text-xs font-bold min-h-[40px]"
              >
                <Filter className="w-4 h-4 text-black" />
                <span>Filter</span>
              </button>

              <span className="text-xs font-medium text-neutral-500">
                Showing <strong className="text-black">{filteredProducts.length}</strong> of {productsList.length} products
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-full px-4 py-2 text-xs font-bold text-black focus:outline-none focus:border-black min-h-[38px]"
              >
                <option value="featured">Featured First</option>
                <option value="bestsellers">Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory || onlyBestSeller || priceRange < 3000) && (
            <div className="flex flex-wrap gap-2 items-center text-xs font-medium">
              <span className="text-neutral-500">Active filters:</span>
              {selectedCategory && (
                <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-black flex items-center gap-1.5 font-bold border border-[#E5E5E5]">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {onlyBestSeller && (
                <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-black flex items-center gap-1.5 font-bold border border-[#E5E5E5]">
                  Bestseller
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setOnlyBestSeller(false)} />
                </span>
              )}
              {priceRange < 3000 && (
                <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-black flex items-center gap-1.5 font-bold border border-[#E5E5E5]">
                  Under ₹{priceRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(3000)} />
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-[#E5E5E5] shadow-xs">
              <Package className="w-12 h-12 text-neutral-400 mx-auto" />
              <h4 className="font-heading font-bold text-black text-lg">No products found</h4>
              <p className="text-neutral-500 text-xs font-medium max-w-sm mx-auto">
                No products found in catalog matching your filters. Try resetting your filters.
              </p>
              <button onClick={resetFilters} className="btn-primary bg-black text-white text-xs font-bold py-3 px-6 rounded-full min-h-[48px] inline-flex">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
