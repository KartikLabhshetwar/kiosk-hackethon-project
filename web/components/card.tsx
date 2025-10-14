import Image from 'next/image';

interface CardProps {
  image: string;
  title: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function Card({ 
  image, 
  title, 
  alt, 
  className = '', 
  onClick,
  isSelected = false 
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 shadow-lg w-50 h-44 cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected 
          ? 'border-[#BA9456] bg-[#BA9456] bg-opacity-10' 
          : 'border-[#BA9456] hover:border-[#af894b]'
      } ${className}`}
    >
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3">
        <Image
          src={image}
          alt={alt || title}
          fill
          className="object-cover"
        />
      </div>
      <h3 className={`text-2xl font-semibold text-center ${
        isSelected ? 'text-[#af894b]' : 'text-[#BA9456]'
      }`}>
        {title}
      </h3>
    </div>
  );
}
