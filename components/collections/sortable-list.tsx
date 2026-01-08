"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Link from "next/link";
import { reorderCollection } from "@/lib/actions/collections";

// Helper to determine ID
const getItemId = (item: any) =>
  item.entryId ? `entry-${item.entryId}` : `tech-${item.technologyId}`;

function SortableItem({ id, item }: { id: string; item: any }) {
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
      className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/30 transition-all mb-4"
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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
        const newIndex = items.findIndex((item) => getItemId(item) === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Call server action
        // Map to format aligned with reorderCollection action
        const updates = newItems.map((item) => ({
             entryId: item.entryId || null,
             technologyId: item.technologyId || null
        }));
        
        reorderCollection(collectionId, updates).catch((err) => {
            console.error("Reorder failed", err);
            // Optionally revert state here if critical
        });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => getItemId(item))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((item) => (
            <SortableItem key={getItemId(item)} id={getItemId(item)} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
