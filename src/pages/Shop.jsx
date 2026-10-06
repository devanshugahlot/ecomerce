import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { MOCK_PRODUCTS } from '../utils/mockProducts';
import { CATEGORIES } from '../utils/constants';

import api from '../services/api';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBestseller = searchParams.get('bestseller') === 'true';

  const [productsList, setProductsList] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [onlyBestSeller, setOnlyBestSeller] = useState(initialBestseller);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setProductsList(res.data);
      }
    } catch (err) {
      console.log('Error fetching products');
    }
  };

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

    if (priceRange < 2000) {
      result = result.filter((p) => p.price <= priceRange);
    }

    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
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
  }, [selectedCategory, searchQuery, priceRange, minRating, onlyBestSeller, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange(2000);
    setMinRating(0);
    setOnlyBestSeller(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Men's Wellness Products Catalog",
    "url": "https://vyro.men/shop",
    "description": "Browse doctor-formulated stamina gummies, Himalayan Shilajit gold, Hair regrowth serums and intimate care products."
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF9F6] text-slate-900">
      <SEO
        title="Buy Men's Sexual Wellness, Stamina & Hair Products Online"
        description="Browse doctor-formulated men's wellness products in India: stamina gummies, Shilajit gold, Minoxidil hair serums, and intimate hygiene. Free discreet delivery."
        canonicalUrl="https://vyro.men/shop"
        jsonLd={shopJsonLd}
      />

      {/* Header Banner — Warm Cream Card matching Bold Care */}
      <div className="bg-[#FEF8EC] rounded-3xl p-6 sm:p-10 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            ALL PRODUCTS CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Men's Wellness Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Formulated with clinical ingredients. Delivered in discreet packaging.
          </p>
        </div>

        {/* Search inside shop */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 space-y-6 sticky top-24 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter Catalog
            </h3>
            {(selectedCategory || searchQuery || priceRange < 2000 || minRating > 0 || onlyBestSeller) && (
              <button onClick={resetFilters} className="text-[11px] font-bold text-emerald-700 hover:underline">
                Reset All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  !selectedCategory
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Categories ({MOCK_PRODUCTS.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = MOCK_PRODUCTS.filter((p) => p.category === cat.name).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Max Price</span>
              <span className="text-emerald-700 font-extrabold">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Best Sellers Filter Toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={onlyBestSeller}
                onChange={(e) => setOnlyBestSeller(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Only Bestsellers</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Count + Mobile Filter Button + Sort Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden btn-secondary px-3 py-2 text-xs font-bold"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <span className="text-xs font-bold text-slate-600">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {MOCK_PRODUCTS.length} products
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
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
          {(selectedCategory || onlyBestSeller || priceRange < 2000) && (
            <div className="flex flex-wrap gap-2 items-center text-xs font-semibold">
              <span className="text-slate-500">Active filters:</span>
              {selectedCategory && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 font-bold">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {onlyBestSeller && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1 font-bold">
                  Bestseller
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyBestSeller(false)} />
                </span>
              )}
              {priceRange < 2000 && (
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 flex items-center gap-1 font-bold">
                  Under ₹{priceRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange(2000)} />
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
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-sm font-medium">No products found matching your search or filters.</p>
              <button onClick={resetFilters} className="btn-primary text-xs mx-auto font-bold">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
