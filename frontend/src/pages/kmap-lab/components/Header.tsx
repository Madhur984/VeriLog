
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-12 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
        <span className="text-gradient">KMap Executer</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
        High-performance Interactive Boolean Simplifier
      </p>
    </header>
  );
};
