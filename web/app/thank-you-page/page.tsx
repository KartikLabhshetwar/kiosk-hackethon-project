"use client";
import Image from "next/image";
import React from "react";
import Card from "@/components/card";
import { useState ,useRef ,useEffect } from "react";
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
  
  const videoRef = useRef<HTMLVideoElement | null>(null);


  useEffect(() => {
    // Ask for camera permission and stream video
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);

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
          <div className="flex-1 flex items-center justify-center bg-[#FDF8F3] ">
  <div className="w-full max-w-8xl">
    {/* Logo */}
    <div className="text-center mb-4">
    <Image
        src="/evollogo.png"
        alt="Evol Studio Logo"
        width={150}
        height={60}
        className="mx-auto"
    />
    </div>

    {/* Heading */}
    <h1 className="text-3xl md:text-4xl bg-white text-center text-[#BA9456] mb-10 font-semibold">
      Thanks for shopping with us !!!
    </h1>

    {/* Main Try-On Section */}
    <div className="relative flex items-center justify-center gap-4 mb-8">
  {/* Back Button */}
 

  {/* Model Image Container */}
   <div className="relative flex justify-center items-center">
  {/* Outer container */}
  <div className="relative h-[400px] w-[600px] bg-white rounded-3xl border-4 border-[#BA9456] overflow-hidden shadow-xl">
    {/* The image */}
    <Image
      src="/thanksjewel.png"
      alt="logo"
      fill
      className="object-cover pb-20 p-20 z-0"
    />

    {/* Overlay box */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 rounded-xl shadow-lg p-4 flex flex-row items-center justify-center gap-4 w-[80%] border border-[#BA9456] z-10">
      {/* QR box */}
      <div className="bg-white rounded-lg border border-[#BA9456] p-2 shadow-md flex items-center justify-center">
        <svg
          width="70px"
          height="70px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          <g id="SVGRepo_iconCarrier">
            <path d="M3 9h6V3H3zm1-5h4v4H4zm1 1h2v2H5zm10 4h6V3h-6zm1-5h4v4h-4zm1 1h2v2h-2zM3 21h6v-6H3zm1-5h4v4H4zm1 1h2v2H5zm15 2h1v2h-2v-3h1zm0-3h1v1h-1zm0-1v1h-1v-1zm-10 2h1v4h-1v-4zm-4-7v2H4v-1H3v-1h3zm4-3h1v1h-1zm3-3v2h-1V3h2v1zm-3 0h1v1h-1zm10 8h1v2h-2v-1h1zm-1-2v1h-2v2h-2v-1h1v-2h3zm-7 4h-1v-1h-1v-1h2v2zm6 2h1v1h-1zm2-5v1h-1v-1zm-9 3v1h-1v-1zm6 5h1v2h-2v-2zm-3 0h1v1h-1v1h-2v-1h1v-1zm0-1v-1h2v1zm0-5h1v3h-1v1h-1v1h-1v-2h-1v-1h3v-1h-1v-1zm-9 0v1H4v-1zm12 4h-1v-1h1zm1-2h-2v-1h2zM8 10h1v1H8v1h1v2H8v-1H7v1H6v-2h1v-2zm3 0V8h3v3h-2v-1h1V9h-1v1zm0-4h1v1h-1zm-1 4h1v1h-1zm3-3V6h1v1z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
          </g>
        </svg>
      </div>

      {/* Text */}
      <p className="text-sm text-[#BA9456] font-medium text-left max-w-[70%] leading-relaxed">
        Kindly download your receipt by scanning this QR code
      </p>
    </div>
  </div>
</div>


 
</div>

    {/* Action Buttons */}
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Add to Cart */}
     <button onClick={()=>router.push("/")} className="bg-white py-6 px-10 border-2  border-[#BA9456] rounded-lg">
       <div className="text-xl font-medium text-black">
        Help me buy another one
        </div> 
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
