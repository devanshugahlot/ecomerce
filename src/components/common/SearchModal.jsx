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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
            <Search className="w-5 h-5 text-[#0A7E8C] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search performance oil, delay gel, intimate care..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary px-3 py-1.5 text-xs font-bold shrink-0"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {!query.trim() ? (
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-black text-[#D4A373] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    Popular Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Enlargement Oils', 'Delay Gels', 'Sexual Wellness', 'Intimate Performance'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleQuickCategory(cat)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[#0A7E8C] text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    Featured Searches
                  </h4>
                  <div className="space-y-1">
                    {['Enlargement Herbal Oil', 'Extended Delay Gel', 'Stamina Boost Combo'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="w-full text-left py-2 px-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between group transition-colors"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A7E8C] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 font-bold pb-2 border-b border-slate-100">
                  Found {filteredProducts.length} product{filteredProducts.length > 1 ? 's' : ''}
                </div>
                <div className="space-y-2">
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id || p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                        />
                        <div>
                          <h5 className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">{p.name}</h5>
                          <span className="text-[11px] text-[#0A7E8C] font-bold">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-slate-900">
                          {formatCurrency(p.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-slate-600 text-sm font-medium">No products found matching "{query}"</p>
                <p className="text-xs text-slate-400 font-bold">Try searching for oil, gel, or wellness.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

