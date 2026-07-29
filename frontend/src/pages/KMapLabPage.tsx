import React from 'react';
import { KMapLab } from './kmap-lab';

export const KMapLabPage: React.FC = () => {
    return (
        // No local top header bar here: the shared PortalLayout already provides
        // the nav cluster + "K-Map Lab" breadcrumb top-left, and KMapLab renders
        // its own centered title. A second header here sat under the fixed nav
        // pills and its text showed through the gaps (overlap). See routeMeta.
        <div className="min-h-[100svh] w-full bg-bg-void text-text-main flex flex-col overflow-y-auto lg:overflow-hidden lg:h-screen">
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                <KMapLab />
            </div>
        </div>
    );
};
