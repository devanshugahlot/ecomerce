import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';

export const SearchModal = ({ isOpen, onClose, products = [] }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product) => {
    onClose();
    navigate(`/products/${product.slug || product._id || product.id}`);
  };

  const handleQuickCategory = (cat) => {
    onClose();
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 bg-white">
            <Search className="w-5 h-5 text-black shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search formulations, sprays, shilajit, oils..."
              className="w-full bg-transparent text-black placeholder-neutral-400 focus:outline-none text-sm font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-neutral-400 hover:text-black p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary px-3.5 py-1.5 text-xs font-bold shrink-0 rounded-full"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {!query.trim() ? (
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                    Popular Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Vitality & Stamina', 'Climax Control', 'Daily Performance', 'Intimate Care'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleQuickCategory(cat)}
                        className="px-3.5 py-2 rounded-full bg-neutral-100 hover:bg-brand-green hover:text-white text-xs font-semibold text-black border border-neutral-200 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                    Featured Searches
                  </h4>
                  <div className="space-y-1">
                    {['Performance Spray', 'Pure Shilajit Resin', 'Stamina Combo Kit'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-neutral-50 text-xs font-bold text-black flex items-center justify-between group transition-colors"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-neutral-500 font-bold pb-2 border-b border-neutral-100">
                  Found {filteredProducts.length} product{filteredProducts.length > 1 ? 's' : ''}
                </div>
                <div className="space-y-2">
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id || p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-neutral-200"
                        />
                        <div>
                          <h5 className="font-heading font-bold text-xs sm:text-sm text-black">{p.name}</h5>
                          <span className="text-[11px] text-neutral-500 font-medium">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-black">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-neutral-700 text-sm font-medium">No products found matching "{query}"</p>
                <p className="text-xs text-neutral-400 font-bold">Try searching for stamina, spray, or shilajit.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

