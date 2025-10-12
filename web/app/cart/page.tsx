"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Suggestions = () => {
    const router=useRouter()

  const products = Array(6).fill({
    name: 'Golden Leaf Studs',
    price: '₹1,00,000',
    image: '/api/placeholder/200/200'
  });

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
          <h2 className="text-2xl md:text-3xl font-meduim mb-8 bg-white py-4 jakarta">
            Cart
          </h2>
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-end max-w-7xl">
            <button onClick={()=>router.push("/")} className="bg-[#BA9456] text-xl hover:bg-[#af894b] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Start again
            </button> 
            <button onClick={()=>router.push("/cart")} className="bg-[#BA9456] text-xl hover:bg-[#af894b] text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Clear cart
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#BA9456] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="bg-gradient-to-br border border-[#BA9456] from-amber-50 to-white rounded-xl mb-4 p-8 flex items-center justify-center h-48">
                <div className="flex gap-2 items-center ">
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
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-700 font-semibold text-lg">
                  Price : <span className="text-[#B9832B] text-xl font-semibold">{product.price}</span>
                </p>

                {/* Try This On Button */}
                <button onClick={()=>router.push("/try-on")} className="w-full bg-[#BA945626] border border-[#BA9456] text-[#BA9456] py-2 rounded-lg hover:bg-amber-50 transition-colors font-medium">
                  Try this on
                </button>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={()=>router.push("/thank-you-page")} className="flex-1 text-lg bg-[#BA9456] hover:bg-amber-700 text-white py-2 rounded-lg transition-colors font-medium">
                    Buy now
                  </button>
                  <button onClick={()=>router.push("/cart")} className="flex-1 text-lg bg-[#BA9456] hover:bg-amber-600 text-white py-2 rounded-lg transition-colors font-medium">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;