import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export interface MentionListProps {
  items: any[]
  command: (props: any) => void
}

export const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item.id, label: item.title })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xl min-w-[200px]">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`text-left px-4 py-2 text-sm transition-colors
              ${index === selectedIndex ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}
            `}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-[var(--text-muted)]">
          No snippets found
        </div>
      )}
    </div>
  )
})

MentionList.displayName = 'MentionList'
