"use client";
import Image from "next/image";
import React from "react";
import Card from "@/components/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EvolStudioLanding() {
    const router=useRouter()
  const leftImages = [
    "/jewel1.png",
    "/jewel2.png",
    "/jewel3.png",
    "/jewel4.png",
  ];

  const rightImages = [
    "/jewel1.png",
    "/jewel2.png",
    "/jewel3.png",
    "/jewel4.png",
  ];
  const [value, setValue] = useState(10000);

  return (
 
    <div className="w-full">
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center overflow-hidden">
        <div className="flex w-full h-screen">
          {/* Left Marquee Column */}
          <div className="w-[300px] relative overflow-hidden">
            <div className="marquee-container-up bg-white p-4 border-r-2 border-[#BA9456]">
              {leftImages.map((img, idx) => (
                <div key={idx} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {leftImages.map((img, idx) => (
                <div key={`copy-${idx}`} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Content */}
          {/* Center Content */}
          <div className="flex-1 flex items-center justify-center ">
            <div className=" w-full text-center">
              {/* Logo */}
              <div>
                <div className="mb-6">
                                <Image
                                  src="/evollogo.png"
                                  alt="Evol Studio Logo"
                                  width={150}
                                  height={60}
                                  className="mx-auto"
                                />
                              </div>
              </div>

              {/* Heading */}
              <h1 className="text-4xl playfair  mb-4">
                Let's find the Perfect jewelry for you!
              </h1>

              {/* Question */}
              <h2 className="text-4xl h-15 w-full bg-white text-[#BA9456] jakarta font-medium mb-4 flex items-center justify-center">
                What’s your Budget / Range?
              </h2>

              {/* Cards Grid */}
              <div className="flex justify-center items-center mb-4 min-h-80">
                <div className="grid grid-cols-2 gap-4">
                  <div className="cursor-pointer text-[#BA9456] flex flex-col items-center justify-center p-4 bg-white border-2 border-[#BA9456] rounded-2xl hover:scale-105 transition-transform duration-300 text-2xl font-normal">
                    Under ₹1,00,000
                  </div>
                  <div className="cursor-pointer text-[#BA9456] flex flex-col items-center justify-center p-4 bg-white border-2 border-[#BA9456] rounded-2xl hover:scale-105 transition-transform duration-300 text-2xl font-normal">
                    Under ₹2,00,000
                  </div>
                  <div className="cursor-pointer text-[#BA9456] flex flex-col items-center justify-center p-4 bg-white border-2 border-[#BA9456] rounded-2xl hover:scale-105 transition-transform duration-300 text-2xl font-normal">
                    Under ₹3,00,000
                  </div>
                  <div className="cursor-pointer text-[#BA9456] flex flex-col items-center justify-center p-4 bg-white border-2 border-[#BA9456] rounded-2xl hover:scale-105 transition-transform duration-300 text-2xl font-normal">
                    Under ₹4,00,000
                  </div>
                  
                </div>
              </div>
               {/* <div>
                    <input type="range" />
                </div> */}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/occasion")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">3</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button onClick={()=>router.push("/vibe")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Marquee Column */}
          <div className="w-[300px] relative overflow-hidden">
            <div className="marquee-container-down  bg-white p-4 border-l-2 border-[#BA9456]">
              {rightImages.map((img, idx) => (
                <div key={idx} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {rightImages.map((img, idx) => (
                <div key={`copy-${idx}`} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
