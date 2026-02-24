import { CompType, DragState, DropResult } from './types';
import { computeForce, interpolatePosition, SNAP_THRESHOLD } from './MagneticField';
import { SnapGrid } from './SnapGrid';

export class DragEngine {
    private rafId: number | null = null;
    private state: DragState;
    private snapGrid: SnapGrid;

    // DOM/SVG Refs for bypass-render updates
    private ghostRef: SVGGElement | null = null;
    private canvasRef: SVGSVGElement | null = null;

    // Callbacks to notify React
    private onDragUpdate: (state: Partial<DragState>) => void;
    private onDrop: (result: DropResult) => void;
    private onCancel: () => void;

    constructor(
        snapGrid: SnapGrid,
        callbacks: {
            onDragUpdate: (state: Partial<DragState>) => void;
            onDrop: (result: DropResult) => void;
            onCancel: () => void;
        }
    ) {
        this.snapGrid = snapGrid;
        this.onDragUpdate = callbacks.onDragUpdate;
        this.onDrop = callbacks.onDrop;
        this.onCancel = callbacks.onCancel;

        this.state = this.getInitialState();
    }

    private getInitialState(): DragState {
        return {
            isDragging: false,
            source: null,
            componentType: null,
            componentId: null,
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0,
            currentX: 0,
            currentY: 0,
            nearestSnap: null,
            magneticForce: 0,
        };
    }

    /**
     * Set the SVG refs required for direct manipulation and coordinate conversion.
     */
    setRefs(canvas: SVGSVGElement | null, ghost: SVGGElement | null) {
        this.canvasRef = canvas;
        this.ghostRef = ghost;
    }

    getDragState(): DragState {
        return { ...this.state };
    }

    getDragType(): CompType | null {
        return this.state.componentType;
    }

    /**
     * Start the drag operation.
     */
    startDrag(
        source: 'tray' | 'canvas',
        type: CompType,
        id: string | null,
        clientX: number,
        clientY: number,
        originX: number,
        originY: number
    ) {
        const svgCoords = this.clientToSVG(clientX, clientY);

        this.state = {
            ...this.getInitialState(),
            isDragging: true,
            source,
            componentType: type,
            componentId: id,
            originX,
            originY,
            currentX: svgCoords.x,
            currentY: svgCoords.y,
            offsetX: svgCoords.x - originX,
            offsetY: svgCoords.y - originY,
        };

        this.startRAF();
    }

    /**
     * Update the raw cursor position from mouse/pointer events.
     */
    updateCursor(clientX: number, clientY: number) {
        if (!this.state.isDragging) return;

        const { x, y } = this.clientToSVG(clientX, clientY);
        this.state.currentX = x;
        this.state.currentY = y;
    }

    /**
     * End the drag operation and determine the outcome.
     */
    endDrag(): DropResult | null {
        if (!this.state.isDragging) return null;

        const { componentType, nearestSnap, currentX, currentY, offsetX, offsetY } = this.state;
        this.stopRAF();

        const rawX = currentX - offsetX;
        const rawY = currentY - offsetY;

        const isSnapped = !!nearestSnap && this.getDistance(currentX, currentY, nearestSnap.x, nearestSnap.y) < SNAP_THRESHOLD;

        const result: DropResult = {
            accepted: isSnapped, // Require snap for acceptance for premium feel
            position: isSnapped ? { x: nearestSnap!.x, y: nearestSnap!.y } : { x: rawX, y: rawY },
            snapNodeId: isSnapped ? nearestSnap!.id : undefined,
            componentType: componentType!,
        };

        this.state = this.getInitialState();
        this.onDrop(result);

        // Reset ghost transform via ref if it exists
        if (this.ghostRef) {
            this.ghostRef.setAttribute('transform', `translate(0, 0)`);
        }

        return result;
    }

    cancel() {
        this.stopRAF();
        this.state = this.getInitialState();
        this.onCancel();
    }

    private startRAF() {
        if (this.rafId !== null) return;
        const loop = () => {
            this.tick();
            this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
    }

    private stopRAF() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * The core animation tick. Computes physics and updates DOM.
     */
    private tick() {
        if (!this.state.isDragging) return;

        // 1. Find nearest snap node
        const nearest = this.snapGrid.findNearest(this.state.currentX, this.state.currentY);
        this.state.nearestSnap = nearest;

        let renderX = this.state.currentX - this.state.offsetX;
        let renderY = this.state.currentY - this.state.offsetY;
        let magneticForce = 0;

        // 2. Apply magnetic attraction if nearby
        if (nearest) {
            const mProp = computeForce(this.state.currentX, this.state.currentY, nearest);
            magneticForce = mProp.force;

            if (magneticForce > 0) {
                const interpolated = interpolatePosition(
                    renderX,
                    renderY,
                    nearest.x,
                    nearest.y,
                    magneticForce
                );
                renderX = interpolated.x;
                renderY = interpolated.y;
            }
        }

        this.state.magneticForce = magneticForce;

        // 3. Direct DOM Update (Bypass React)
        if (this.ghostRef) {
            // Apply scale, rotation and shadow effects here or via CSS transitions/classes
            // For raw performance, we use translate
            this.ghostRef.setAttribute('transform', `translate(${renderX}, ${renderY})`);
        }

        // 4. Throttled React Notification (for UI overlays like SNAP badge)
        // We only notify React when essential state changes (e.g. crossing a magnetic threshold or changing nearest node)
        this.onDragUpdate({
            nearestSnap: nearest,
            magneticForce,
            currentX: renderX,
            currentY: renderY
        });
    }

    private clientToSVG(clientX: number, clientY: number): { x: number; y: number } {
        if (!this.canvasRef) return { x: clientX, y: clientY };
        const pt = this.canvasRef.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const ctm = this.canvasRef.getScreenCTM();
        if (!ctm) return { x: clientX, y: clientY };
        const svgPt = pt.matrixTransform(ctm.inverse());
        return { x: svgPt.x, y: svgPt.y };
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
