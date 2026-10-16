import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '600px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid #E4E4E7',
          }}
        >
          <Search size={20} color="#000000" />
          <input
            type="text"
            autoFocus
            placeholder="SEARCH SERIES 01 (JUG, BOTTLE, VAULT, FLASK)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#000000',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              outline: 'none',
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '1rem' }}>
          {query.trim() === '' ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#71717A', fontSize: '0.85rem' }}>
              Type product name, capacity, or material to search the archive.
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#71717A', fontSize: '0.85rem' }}>
              No objects matched "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filtered.map((item) => (
                <div
                  key={item.id || item.slug}
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    backgroundColor: '#F8F8FA',
                    border: '1px solid #E4E4E7',
                    transition: 'all 0.2s',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '2px', backgroundColor: '#F4F4F5' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 800 }}>{item.name}</h5>
                    <span style={{ fontSize: '0.72rem', color: '#52525B' }}>
                      {item.capacity} • {formatPrice(item.price, currency)}
                    </span>
                  </div>
                  <ArrowRight size={14} color="#000000" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
