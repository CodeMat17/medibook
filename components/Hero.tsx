"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import Link from "next/link";
import OTPModal from "./OTPModal";
import { PatientForm } from "./PatientForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";



export function Hero() {

  return (
    <div className='py-14 w-full relative flex flex-col justify-center antialiased'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-evenly items-center gap-12 w-full '>
          <div className='md:order-2 flex justify-center items-center  w-full max-w-[280px] sm:max-w-[310px] md:max-w-[350px] '>
            <Image
              alt='hero image'
              priority
              width={300}
              height={300}
              src='/hero.webp'
              className='shrink-0 w-full aspect-square object-cover rounded-full border-4 border-sky-500 animate-glow'
            />
          </div>

          <div className='w-full flex flex-col justify-center max-w-md md:max-w-sm lg:max-w-md'>
            <PatientForm />
            <div className='flex justify-end z-40 mx-4 mt-2'>
           

              <OTPModal />
            </div>
          </div>
        </div>
        {/* <BackgroundBeams /> */}
      </div>
    </div>
  );
}
