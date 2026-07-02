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
            primary: "bg-signal-core text-bg-void border-2 border-edge shadow-brutal-sm hover:brightness-105",
            secondary: "bg-transparent border-2 border-edge text-text-main hover:bg-border-soft",
            ghost: "bg-bg-elev text-text-main hover:bg-bg-base border-2 border-edge"
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "brutal-btn px-8 py-3 font-bold font-heading flex items-center gap-2 justify-center",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
