import React from 'react';
import { Module1Engine } from './Module1Engine';
import { useColorScheme } from '../../../hooks/useColorScheme';

export const Module1Root: React.FC = () => {
    const [scheme, toggleTheme] = useColorScheme();
    const isDarkMode = scheme === 'dark';

    return (
        <div className={isDarkMode ? 'dark text-white' : 'light text-slate-900'}>
            <Module1Engine 
                isDarkMode={isDarkMode} 
                onThemeToggle={toggleTheme} 
            />
        </div>
    );
};

export default Module1Root;
