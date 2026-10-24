import { GripVertical } from 'lucide-react'
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Row } from './ui'

// A row that drags by its grip only, so clicking the row still opens the editor.
// Space picks it up with the keyboard, the arrow keys move it, Space drops it.
function SortableRow({ id, label, disabled, ...row }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled })

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      disabled={disabled}
      aria-label={`Reorder ${label}`}
      title={disabled ? 'Clear the search to reorder' : 'Drag to reorder'}
      className="flex h-14 w-8 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors enabled:cursor-grab enabled:hover:text-primary-strong enabled:active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={18} />
    </button>
  )

  return (
    <Row
      {...row}
      title={label}
      handle={handle}
      liRef={setNodeRef}
      // Vertical movement only; the transition is what lets the rows slide aside.
      liStyle={{ transform: CSS.Translate.toString(transform && { ...transform, x: 0 }), transition }}
      dragging={isDragging}
    />
  )
}

export default function SortableList({ items, disabled, onReorder, renderRow }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(items, from, to))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((item) => {
            const { label, ...row } = renderRow(item)
            return <SortableRow key={item.id} id={item.id} label={label} disabled={disabled} {...row} />
          })}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
