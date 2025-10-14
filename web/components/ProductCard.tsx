/**
 * Product Card Component
 * Reusable product display card with cart functionality
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types/api';
import { useCart } from '@/lib/context';
import { formatPrice } from '@/lib/api/services';

interface ProductCardProps {
  product: Product;
  onTryOn?: (product: Product) => void;
}

export default function ProductCard({ product, onTryOn }: ProductCardProps) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleBuyNow = () => {
    addItem(product);
    router.push('/cart');
  };

  const handleTryOn = () => {
    if (onTryOn) {
      onTryOn(product);
    } else {
      router.push('/try-on');
    }
  };

  return (
    <div className="bg-white border-2 border-[#BA9456] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="bg-gradient-to-br border border-[#BA9456] from-amber-50 to-white rounded-xl mb-4 p-8 flex items-center justify-center h-48 relative">
        {product.images ? (
          <Image
            src={product.images}
            alt={product.product_name}
            fill
            className="object-contain"
            onError={(e) => {
              // Fallback to logo if image fails
              e.currentTarget.src = '/evollogo.png';
            }}
          />
        ) : (
          <div className="flex items-center justify-center">
            <Image
              src="/evollogo.png"
              alt="Evol Studio Logo"
              width={150}
              height={60}
            />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
          {product.product_name}
        </h3>

        {product.collection && (
          <p className="text-sm text-gray-600">
            Collection: <span className="font-medium">{product.collection}</span>
          </p>
        )}

        {product.category && (
          <p className="text-sm text-gray-600">
            Category: <span className="font-medium">{product.category}</span>
          </p>
        )}

        {product.vibes && product.vibes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.vibes.slice(0, 3).map((vibe, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
              >
                {vibe}
              </span>
            ))}
          </div>
        )}

        {product.price && (
          <p className="text-gray-700 font-semibold text-lg">
            Price: <span className="text-[#B9832B] text-xl">{formatPrice(product.price)}</span>
          </p>
        )}

        {product.similarity_score && (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#BA9456] h-2 rounded-full"
                style={{ width: `${product.similarity_score * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(product.similarity_score * 100)}% match
            </span>
          </div>
        )}

        {/* Try This On Button */}
        <button
          onClick={handleTryOn}
          className="w-full bg-[#BA945626] border border-[#BA9456] text-[#BA9456] py-2 rounded-lg hover:bg-amber-50 transition-colors font-medium"
        >
          Try this on
        </button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBuyNow}
            className="flex-1 text-lg bg-[#BA9456] hover:bg-amber-700 text-white py-2 rounded-lg transition-colors font-medium"
          >
            Buy now
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isInCart(product.id)}
            className={`flex-1 text-lg py-2 rounded-lg transition-colors font-medium ${
              isInCart(product.id)
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-[#BA9456] hover:bg-amber-600 text-white'
            }`}
          >
            {isInCart(product.id) ? 'In Cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

