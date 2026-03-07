import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: "bg-accent-cyan text-background-primary shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:bg-[#99f6ff]",
            secondary: "bg-transparent border-2 border-neutral text-neutral hover:border-white hover:text-white",
            ghost: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10"
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "px-8 py-3 rounded-full font-bold font-heading transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 justify-center",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
