import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PassageCard } from './PassageCard';
import { Passage } from '@/types/passage';

interface SortablePassageCardProps {
  passage: Passage;
  onSettingsClick: (passage: Passage) => void;
  onClick: (passage: Passage) => void;
  sortMode: 'biblical' | 'date' | 'manual';
}

export function SortablePassageCard({ passage, onSettingsClick, onClick, sortMode }: SortablePassageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: passage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <PassageCard
        passage={passage}
        onSettingsClick={onSettingsClick}
        onClick={onClick}
        sortMode={sortMode}
        dragListeners={listeners}
      />
    </div>
  );
}
