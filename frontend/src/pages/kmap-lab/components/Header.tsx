
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 lg:py-12 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 lg:mb-4">
        <span className="text-gradient">KMap Executer</span>
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-text-sub font-medium max-w-2xl mx-auto px-4">
        High-performance Interactive Boolean Simplifier
      </p>
    </header>
  );
};
