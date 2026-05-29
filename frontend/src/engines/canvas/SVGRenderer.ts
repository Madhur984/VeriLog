/**
 * SVGRenderer.ts - SVG-based implementation of ICanvasRenderer
 *
 * Renders circuit nodes and edges as React-compatible SVG.
 * This is the current default renderer.
 * Can be swapped for a WebGL/PixiJS renderer in the future.
 */

import type { ICanvasRenderer, RenderNode, RenderEdge, RenderOptions } from './CanvasRenderer';
import { computeBezierPath, DEFAULT_RENDER_OPTIONS } from './CanvasRenderer';

export class SVGRenderer implements ICanvasRenderer {
    private container: HTMLElement | null = null;
    private svgElement: SVGSVGElement | null = null;
    private currentViewport = { zoom: 1, panX: 0, panY: 0 };

    init(container: HTMLElement): void {
        this.container = container;

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.background = 'transparent';
        svg.style.overflow = 'visible';

        // Defs for markers and filters
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Glow filter
        const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        glowFilter.id = 'wire-glow';
        glowFilter.innerHTML = `
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        `;
        defs.appendChild(glowFilter);

        svg.appendChild(defs);
        container.appendChild(svg);
        this.svgElement = svg;
    }

    render(nodes: RenderNode[], edges: RenderEdge[], options: RenderOptions = DEFAULT_RENDER_OPTIONS): void {
        if (!this.svgElement) return;

        // Clear existing content (keep defs)
        const defs = this.svgElement.querySelector('defs');
        this.svgElement.innerHTML = '';
        if (defs) this.svgElement.appendChild(defs);

        // Create transform group for zoom/pan (use stored viewport if overrides match defaults)
        const vp = this.currentViewport;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${options.panX || vp.panX}, ${options.panY || vp.panY}) scale(${options.zoom || vp.zoom})`);

        // Draw grid
        if (options.showGrid) {
            this.drawGrid(g, options.gridSize);
        }

        // Draw edges
        for (const edge of edges) {
            this.drawEdge(g, edge);
        }

        // Draw nodes
        for (const node of nodes) {
            this.drawNode(g, node);
        }

        this.svgElement.appendChild(g);
    }

    setViewport(zoom: number, panX: number, panY: number): void {
        this.currentViewport = { zoom, panX, panY };
    }

    hitTest(x: number, y: number): { type: 'node' | 'edge' | 'port' | 'none'; id: string; portIndex?: number } {
        if (!this.svgElement) return { type: 'none', id: '' };

        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
            const nodeId = el.getAttribute('data-node-id');
            if (nodeId) return { type: 'node', id: nodeId };

            const edgeId = el.getAttribute('data-edge-id');
            if (edgeId) return { type: 'edge', id: edgeId };

            const portId = el.getAttribute('data-port-id');
            const portIndex = el.getAttribute('data-port-index');
            if (portId) return { type: 'port', id: portId, portIndex: Number(portIndex) };
        }

        return { type: 'none', id: '' };
    }

    destroy(): void {
        if (this.svgElement && this.container) {
            this.container.removeChild(this.svgElement);
        }
        this.svgElement = null;
        this.container = null;
    }

    // ─── Private Helpers ──────────────────────────────────────────────

    private drawGrid(parent: SVGGElement, gridSize: number): void {
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.id = 'grid-pattern';
        pattern.setAttribute('width', String(gridSize));
        pattern.setAttribute('height', String(gridSize));
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', '0');
        dot.setAttribute('cy', '0');
        dot.setAttribute('r', '0.5');
        dot.setAttribute('fill', 'rgba(0, 212, 255, 0.08)');
        pattern.appendChild(dot);

        const defs = this.svgElement?.querySelector('defs');
        if (defs) defs.appendChild(pattern);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '5000');
        rect.setAttribute('height', '5000');
        rect.setAttribute('x', '-2500');
        rect.setAttribute('y', '-2500');
        rect.setAttribute('fill', 'url(#grid-pattern)');
        parent.appendChild(rect);
    }

    private drawNode(parent: SVGGElement, node: RenderNode): void {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-node-id', node.id);

        // Body rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(node.x));
        rect.setAttribute('y', String(node.y));
        rect.setAttribute('width', String(node.width));
        rect.setAttribute('height', String(node.height));
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', node.selected ? 'rgba(0, 212, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)');
        rect.setAttribute('stroke', node.selected ? '#00d4ff' : 'rgba(255, 255, 255, 0.15)');
        rect.setAttribute('stroke-width', node.selected ? '2' : '1');
        g.appendChild(rect);

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(node.x + node.width / 2));
        text.setAttribute('y', String(node.y + node.height / 2));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
        text.setAttribute('font-family', "'IBM Plex Mono', monospace");
        text.setAttribute('font-size', '11');
        text.textContent = node.label;
        g.appendChild(text);

        parent.appendChild(g);
    }

    private drawEdge(parent: SVGGElement, edge: RenderEdge): void {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = computeBezierPath(edge.fromX, edge.fromY, edge.toX, edge.toY);
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', edge.isLive ? '#10B981' : 'rgba(255, 255, 255, 0.15)');
        path.setAttribute('stroke-width', edge.isLive ? '2' : '1');
        path.setAttribute('data-edge-id', edge.id);

        if (edge.isLive) {
            path.setAttribute('filter', 'url(#wire-glow)');
        }

        parent.appendChild(path);
    }
}
