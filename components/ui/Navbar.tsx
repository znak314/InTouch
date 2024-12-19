import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar: React.FC = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('uk-UA', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hourCycle: 'h23' // 24-годинний формат
  });
  
  // Форматування дати англійською
  const date = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).format(now);

  return (
    <nav className='flex-between fixed z-50 w-full bg-[#c8d9eb] px-6 py-4 lg:px-10 rounded-b-lg'>
      <Link href="/" className="flex items-center gap-1 max-sm:hidden">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-black max-sm:hidden">
          InTouch
        </p>
      </Link>

      <div>
      <h1 className="text-1xl font-bold lg:text-2xl text-black">
        {time}
        <span className="hidden sm:inline">, {date}</span> {/* Дата буде прихована на малих екранах */}
      </h1>

      </div>

      <div className='flex-between gap-5'>
        <SignedIn>
          <UserButton />
        </SignedIn>
        
        <SignedOut>
          <UserButton />
        </SignedOut>

        <MobileNav />
      </div>
    </nav>
  );
}

export default Navbar;
