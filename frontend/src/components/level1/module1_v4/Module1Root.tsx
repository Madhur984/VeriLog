import React, { useState } from 'react';
import { Module1Engine } from './Module1Engine';

export const Module1Root: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
            <Module1Engine 
                isDarkMode={isDarkMode} 
                onThemeToggle={() => setIsDarkMode(!isDarkMode)} 
            />
        </div>
    );
};

export default Module1Root;
