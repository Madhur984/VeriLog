/**
 * PanelContainer.tsx — Wraps any tool into a dockable panel
 *
 * Provides a header bar with label, icon, and collapse/close controls.
 * Designed to be placed inside PanelManager's split layout.
 */

import React, { useState, memo } from 'react';

interface PanelContainerProps {
    id: string;
    label: string;
    icon: string;
    onClose?: () => void;
    children: React.ReactNode;
}

export const PanelContainer = memo(({ id, label, icon, onClose, children }: PanelContainerProps) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className="wb-panel"
            data-panel-id={id}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                background: '#0a0e17',
                border: '1px solid rgba(0, 212, 255, 0.08)',
                borderRadius: 4,
            }}
        >
            {/* Panel Header */}
            <div
                className="wb-panel-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    background: 'rgba(0, 212, 255, 0.04)',
                    borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
                    cursor: 'default',
                    userSelect: 'none',
                    flexShrink: 0,
                }}
            >
                <span style={{ fontSize: 12 }}>{icon}</span>
                <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    flex: 1,
                }}>{label}</span>

                {/* Collapse */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        fontSize: 10,
                        padding: '0 4px',
                        lineHeight: 1,
                    }}
                >
                    {collapsed ? '▼' : '▲'}
                </button>

                {/* Close */}
                {onClose && (
                    <button
                        onClick={onClose}
                        title="Close panel"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            fontSize: 10,
                            padding: '0 4px',
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Panel Content */}
            {!collapsed && (
                <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                    {children}
                </div>
            )}
        </div>
    );
});

PanelContainer.displayName = 'PanelContainer';
