"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function GraphVisualization() {
  // Distributed positions for 1000x500 canvas
  const initialNodes = [
    { id: 1, x: 200, y: 150, color: "#3b82f6", label: "Auth" },
    { id: 2, x: 450, y: 100, color: "#8b5cf6", label: "Database" },
    { id: 3, x: 750, y: 180, color: "#10b981", label: "API" },
    { id: 4, x: 300, y: 350, color: "#f59e0b", label: "Frontend" },
    { id: 5, x: 600, y: 300, color: "#ec4899", label: "Utils" },
    { id: 6, x: 850, y: 250, color: "#6366f1", label: "Types" },
    { id: 7, x: 150, y: 400, color: "#ef4444", label: "Config" },
  ];

  const links = [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 1, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 6 },
    { source: 4, target: 7 },
    { source: 2, target: 5 },
  ];

  return (
    <div className="w-full h-full min-h-[400px] relative bg-[#0F0F10] overflow-hidden rounded-xl border border-white/5 shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <svg 
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
      >
        
        {/* Render Lines first so they are behind nodes */}
        {links.map((link, i) => {
          const source = initialNodes.find(n => n.id === link.source);
          const target = initialNodes.find(n => n.id === link.target);
          if (!source || !target) return null;

          return (
            <motion.line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
            />
          );
        })}

        {/* Render Nodes */}
        {initialNodes.map((node, i) => (
          <motion.g 
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Animated Group wrapper for floating effect if desired, 
                but keeping it static-ish for "clean" look first */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="#1A1A1A"
              stroke={node.color}
              strokeWidth="2"
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.5, strokeWidth: 3 }}
              className="cursor-pointer"
            />
            
            {/* Pulsing halo */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              stroke={node.color}
              strokeWidth="1"
              fill="transparent"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />

            {/* Label */}
            <text
              x={node.x + 12}
              y={node.y + 4}
              className="text-[11px] font-mono fill-zinc-500 font-medium tracking-wide select-none"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-zinc-500 font-medium">
        Live Knowledge Graph
      </div>
    </div>
  );
}
