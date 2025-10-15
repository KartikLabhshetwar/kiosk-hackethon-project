"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context';
import { formatPrice } from '@/lib/api/services';

const Cart = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
           <Image
                src="/evollogo.png"
                alt="Evol Studio Logo"
                width={150}
                height={60} 
                className="mx-auto mb-4"
            />
          <h2 className="text-2xl md:text-3xl font-medium mb-8 bg-white py-4 jakarta">
            Cart ({getTotalItems()} items)
          </h2>
          
          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total: {formatPrice(getTotalPrice())}</span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => router.push("/")} 
                    className="bg-[#BA9456] text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button 
                    onClick={clearCart} 
                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-[#BA9456] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="bg-gradient-to-br border border-[#BA9456] from-amber-50 to-white rounded-xl mb-4 p-8 flex items-center justify-center h-48">
                  <div className="flex gap-2 items-center">
                    <Image
                      src="/evollogo.png"
                      alt="Evol Studio Logo"
                      width={150}
                      height={60}
                      className="mx-auto"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>
                  <p className="text-gray-700 font-semibold text-lg">
                    Price: <span className="text-[#B9832B] text-xl font-semibold">{formatPrice(item.price || 0)}</span>
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Quantity:</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Try This On Button */}
                  <button 
                    onClick={() => router.push("/try-on")} 
                    className="w-full bg-[#BA945626] border border-[#BA9456] text-[#BA9456] py-2 rounded-lg hover:bg-amber-50 transition-colors font-medium"
                  >
                    Try this on
                  </button>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => router.push("/thank-you-page")} 
                      className="flex-1 text-lg bg-[#BA9456] hover:bg-amber-700 text-white py-2 rounded-lg transition-colors font-medium"
                    >
                      Buy now
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="flex-1 text-lg bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#BA9456] text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;