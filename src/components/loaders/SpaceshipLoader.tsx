import React from 'react';
import './SpaceshipLoader.css';

export const SpaceshipLoader: React.FC = () => {
    return (
        <div className="spaceship-loader-container">
            <div className="loader">
                <span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <div className="base">
                    <span></span>
                    <div className="face"></div>
                </div>
            </div>
            <div className="longfazers">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="loading-text">Loading VeriQuest...</p>
        </div>
    );
};
