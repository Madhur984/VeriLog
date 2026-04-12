import React from 'react';
import { SubModule2_1 } from '../components/level1/SubModule2_1';

/**
 * ModuleTwo — Page wrapper for /module/2
 * Delegates all rendering to SubModule2_1 (19-screen scroll-snap module).
 */
export const ModuleTwo: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
      background: '#FFFFFF',
    }}>
      <SubModule2_1 />
    </div>
  );
};
