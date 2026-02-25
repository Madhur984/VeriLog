import { CompType } from '../../simulator/types';

interface DraggableProps {
    type: CompType;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
}

export const DraggableItem = ({ type, label, icon, disabled }: DraggableProps) => {
    const handleDragStart = (e: React.DragEvent) => {
        if (disabled) return;
        e.dataTransfer.setData('type', type);
        e.dataTransfer.effectAllowed = 'copy';

        // Hide the ghost image or create a custom one if needed
    };

    return (
        <div
            draggable={!disabled}
            onDragStart={handleDragStart}
            className={`
        flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 bg-white
        ${disabled
                    ? 'opacity-40 border-neutral-200 cursor-not-allowed bg-neutral-100'
                    : 'border-neutral-200 shadow-[0_4px_0_0_#e5e5e5] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#e5e5e5] cursor-grab active:cursor-grabbing active:translate-y-0 active:shadow-none'
                }
      `}
        >
            <div className="scale-125 pb-2 pointer-events-none">
                {icon}
            </div>
            <span className="text-neutral-500 font-bold text-sm tracking-wide font-heading uppercase">{label}</span>
        </div>
    );
};