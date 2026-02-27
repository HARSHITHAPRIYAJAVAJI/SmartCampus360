import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DraggableResourceProps {
  id: string;
  type: 'faculty' | 'subject' | 'room';
  data: any;
  children: ReactNode;
}

export function DraggableResource({ id, type, data, children }: DraggableResourceProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `resource-${type}-${id}`,
    data: {
      type: 'resource',
      resourceType: type,
      id,
      ...data
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        transition-opacity duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {children}
    </div>
  );
}