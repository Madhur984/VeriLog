import React, { useState, useEffect } from 'react';

/**
 * BitForBytes KINETIC TYPOGRAPHY
 * "The mechanical scramble."
 */
export const KineticText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//_";
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((char, index) => {
                if (index < iterations) return text[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join(""));
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1/4;
        }, 25);
        return () => clearInterval(interval);
    }, [text]);

    return <span className={className}>{display}</span>;
};
