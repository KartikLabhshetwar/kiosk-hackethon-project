import Image from 'next/image';

interface CardProps {
  image: string;
  title: string;
  alt?: string;
  className?: string;
}

export default function Card({ image, title, alt, className = '' }: CardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-[#BA9456] shadow-lg w-30 h-45 ${className}`}
    >
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3">
        <Image
          src={image}
          alt={alt || title}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-2xl font-semibold text-[#BA9456] text-center">
        {title}
      </h3>
    </div>
  );
}
