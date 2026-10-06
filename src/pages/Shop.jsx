import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check, PackageCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { useProducts } from '../context/ProductContext';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBestseller = searchParams.get('bestseller') === 'true';

  const { products: productsList } = useProducts();
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
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
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
      result = result.filter((p) => p.price <= priceRange);
    }

    if (onlyBestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Sort logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF7F2] text-[#1B1F1D]">
      <SEO
        title="Buy Hypril™ Performance Oil & Delay Gel Online — Hypril Official Store"
        description="Browse doctor-backed Hypril performance catalog: Hypril Enlargement Oil & Extended Delay Gel. Free discreet shipping & cash on delivery across India."
      />

      {/* Header Banner — Deep Forest & Ivory Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4E0D8] shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-extrabold text-[#B8924A] uppercase tracking-widest block">
            CLINICAL CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0F3D2B]">
            Hypril™ Storefront
          </h1>
          <p className="text-xs sm:text-sm text-[#5B655F] font-medium flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-[#B8924A]" /> Formulated with clinical ingredients. Delivered in plain unmarked boxes.
          </p>
        </div>

        {/* Search inside shop */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#5B655F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-[#FAF7F2] border border-[#E4E0D8] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1B1F1D] font-bold placeholder-slate-400 focus:outline-none focus:border-[#0F3D2B]"
          />
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-[#E4E0D8] space-y-6 sticky top-24 shadow-premium">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E0D8]">
            <h3 className="font-extrabold text-sm text-[#1B1F1D] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0F3D2B]" />
              Filter Catalog
            </h3>
            {(selectedCategory || searchQuery || priceRange < 3000 || onlyBestSeller) && (
              <button onClick={resetFilters} className="text-[11px] font-bold text-[#0F3D2B] hover:underline">
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-[#B8924A] uppercase tracking-wider">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  !selectedCategory
                    ? 'bg-[#EEF3EE] text-[#0F3D2B] border border-[#0F3D2B]/20 font-extrabold'
                    : 'text-[#5B655F] hover:bg-[#FAF7F2]'
                }`}
              >
                All Categories ({productsList.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = productsList.filter((p) => p.category === cat.name).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-[#EEF3EE] text-[#0F3D2B] border border-[#0F3D2B]/20 font-extrabold'
                        : 'text-[#5B655F] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-[#5B655F]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-[#E4E0D8]">
            <div className="flex justify-between items-center text-xs font-bold text-[#1B1F1D]">
              <span>Max Price</span>
              <span className="text-[#0F3D2B] font-black">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="300"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#0F3D2B] bg-slate-200 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Best Sellers Filter Toggle */}
          <div className="pt-4 border-t border-[#E4E0D8]">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-[#1B1F1D]">
              <input
                type="checkbox"
                checked={onlyBestSeller}
                onChange={(e) => setOnlyBestSeller(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0F3D2B] focus:ring-[#0F3D2B]"
              />
              <span>Only Bestsellers</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Count + Mobile Filter Button + Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4E0D8] shadow-sm">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden btn-secondary px-3.5 py-2 text-xs font-bold"
              >
                <Filter className="w-4 h-4 text-[#0F3D2B]" />
                <span>Filter</span>
              </button>

              <span className="text-xs font-bold text-[#5B655F]">
                Showing <strong className="text-[#1B1F1D]">{filteredProducts.length}</strong> of {productsList.length} formulas
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-[#5B655F] font-bold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E4E0D8] rounded-xl px-3 py-2 text-xs font-bold text-[#1B1F1D] focus:outline-none focus:border-[#0F3D2B]"
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
            <div className="flex flex-wrap gap-2 items-center text-xs font-semibold">
              <span className="text-[#5B655F]">Active filters:</span>
              {selectedCategory && (
                <span className="px-3 py-1 rounded-full bg-[#EEF3EE] text-[#0F3D2B] flex items-center gap-1.5 font-bold border border-[#0F3D2B]/20">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {onlyBestSeller && (
                <span className="px-3 py-1 rounded-full bg-[#FAF4E8] text-[#B8924A] flex items-center gap-1.5 font-bold border border-[#B8924A]/30">
                  Bestseller
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyBestSeller(false)} />
                </span>
              )}
              {priceRange < 3000 && (
                <span className="px-3 py-1 rounded-full bg-slate-200 text-[#1B1F1D] flex items-center gap-1.5 font-bold">
                  Under ₹{priceRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(3000)} />
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-[#E4E0D8] shadow-sm">
              <p className="text-[#5B655F] text-sm font-medium">No formulas found matching your search or filters.</p>
              <button onClick={resetFilters} className="btn-primary text-xs mx-auto font-bold shadow-glow-forest">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
