"use client";

import { motion } from "motion/react";

const brands = [
  { name: "Next.js", logo: "Next.js" },
  { name: "Vercel", logo: "▲ Vercel" },
  { name: "Supabase", logo: "⚡ Supabase" },
  { name: "Tailwind", logo: "Tailwind CSS" },
  { name: "Framer", logo: "Framer" },
  { name: "Stripe", logo: "Stripe" },
  { name: "Prisma", logo: "Prisma" },
  { name: "TypeScript", logo: "TypeScript" },
];

export function BrandWall() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Trusted by developers building on modern stacks
        </p>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-16 min-w-full items-center justify-around px-8">
          {brands.map((brand, idx) => (
            <span 
              key={`${brand.name}-${idx}`} 
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--text-secondary)] to-[var(--text-muted)] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default select-none"
            >
              {brand.logo}
            </span>
          ))}
          {/* Duplicate for infinite loop */}
          {brands.map((brand, idx) => (
            <span 
              key={`${brand.name}-duplicate-${idx}`} 
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--text-secondary)] to-[var(--text-muted)] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default select-none"
            >
              {brand.logo}
            </span>
          ))}
        </div>
        
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
