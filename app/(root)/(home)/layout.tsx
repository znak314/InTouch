import Navbar from '@/components/ui/Navbar'
import Sidebar from '@/components/ui/Sidebar'
import { Metadata } from 'next';
import React, {ReactNode} from 'react'

export const metadata: Metadata = {
    title: "InTouch",
    description: "Stay in touch!",
    icons: {
      icon : 'icons/logo.svg'
    }
  };
  
const HomeLayout = ({children}: { children: ReactNode}) => {
    return (
        <main className='relative'>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14 bg-[linear-gradient(178.6deg,_rgb(232,_245,_253)_3.3%,_rgb(252,_253,_255)_109.6%)]"> 
                    <div className='w-full'>
                        {children}
                    </div>
                </section>
            </div>
        </main>
    )
}

export  default HomeLayout