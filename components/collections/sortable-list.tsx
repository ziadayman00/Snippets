"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { reorderCollection, removeFromCollection } from "@/lib/actions/collections";
import { useState, useId, useEffect } from "react";

// Helper to determine ID
const getItemId = (item: any) =>
  item.entryId ? `entry-${item.entryId}` : `tech-${item.technologyId}`;

function SortableItem({ id, item, onRemove }: { id: string; item: any; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const isSnippet = !!item.entry;
  const entry = item.entry;
  const technology = item.technology;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/30 transition-all mb-4 relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex flex-col items-center gap-4 text-[var(--text-muted)] cursor-move touch-none p-1 hover:text-[var(--text-primary)] transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1">
        {isSnippet && entry ? (
          <div className="flex items-center justify-between">
              <Link
                href={`/technology/${entry.technologyId}/edit/${entry.id}`}
                className="flex-1"
              >
                  <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                      {entry.title}
                      </h3>
                      {entry.technology?.name && (
                      <span className="text-xs font-medium text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] ml-2">
                          {entry.technology.name}
                      </span>
                      )}
                  </div>
              </Link>
          </div>
        ) : technology ? (
           <Link href={`/technology/${technology.id}`} className="block">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] text-xs font-bold">
                        T
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                        {technology.name}
                    </h3>
                    <span className="text-xs font-medium text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] ml-auto">
                        Technology
                    </span>
                </div>
            </Link>
        ) : null}
      </div>

      <button
        onClick={(e) => {
            e.stopPropagation();
            onRemove();
        }}
        className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SortableList({
  collectionId,
  items: initialItems,
}: {
  collectionId: string;
  items: any[];
}) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const id = useId(); 
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRemove = async (index: number) => {
      const itemToDelete = items[index];
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      
      const type = itemToDelete.entry ? 'entry' : 'technology';
      const id = itemToDelete.entry ? itemToDelete.entryId : itemToDelete.technologyId;
      
      try {
          await removeFromCollection(collectionId, id, type);
      } catch (error) {
          console.error("Failed to remove", error);
          setItems(items); // revert
      }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
        const newIndex = items.findIndex((item) => getItemId(item) === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Call server action
        const updates = newItems.map((item) => ({
             entryId: item.entryId || null,
             technologyId: item.technologyId || null
        }));
        
        reorderCollection(collectionId, updates).catch((err) => {
            console.error("Reorder failed", err);
        });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => getItemId(item))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((item, index) => (
            <SortableItem 
                key={getItemId(item)} 
                id={getItemId(item)} 
                item={item} 
                onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
