'use client';


import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'bg-blue-1 px-6 py-6 flex flex-col justify-center items-center w-full xl:max-w-[700px] min-h-[320px] rounded-[18px] cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="text-2xl font-normal">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;