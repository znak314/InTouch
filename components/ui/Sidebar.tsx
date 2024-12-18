'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className='sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-[#c8d9eb]   p-6 pt-28 text-black  rounded-br-3xl max-sm:hidden lg:w-[264px]'>
      <div className='flex flex-1 flex-col gap-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);

          return (
            <Link
              href={link.route}
              key = {link.label}
              className={cn('flex gap-4 items-center p-4 rounded-3xl justify-start', {'bg-blue-1': isActive},)}
            >
              <Image
                src={link.imgUrl}
                alt={link.label}
                width={36}
                height={36}
              />

              <p className='text-lg font-semibold max-lg:hidden'>{link.label}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Sidebar