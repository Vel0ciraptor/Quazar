import React from 'react';
import { cn } from '../lib/utils';

interface HUDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HUDCard({ children, className, ...props }: HUDCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 bg-[#0a0a0a]/80 backdrop-blur-sm border border-brand-900/30",
        className
      )}
      {...props}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-500 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-500 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-500 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-500 rounded-br-sm pointer-events-none" />
      
      {children}
    </div>
  );
}
