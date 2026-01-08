import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
  } from 'react'
  import { 
    Heading1, 
    Heading2, 
    Heading3, 
    List, 
    ListOrdered, 
    CheckSquare, 
    Code, 
    Quote, 
    Minus 
  } from 'lucide-react'
  
  export interface CommandItemProps {
    title: string
    description: string
    icon: any
    command: (props: { editor: any; range: any }) => void
  }
  
  export const CommandList = forwardRef((props: {
    items: CommandItemProps[]
    command: any
    editor: any
    range: any
  }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
  
    const selectItem = useCallback(
      (index: number) => {
        const item = props.items[index]
  
        if (item) {
          props.command(item)
        }
      },
      [props]
    )
  
    useEffect(() => {
      setSelectedIndex(0)
    }, [props.items])
  
    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
          return true
        }
  
        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % props.items.length)
          return true
        }
  
        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
  
        return false
      },
    }))
  
    return (
      <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-1 shadow-md transition-all animate-in fade-in zoom-in-95 duration-100">
        <div className="text-[10px] font-medium text-[var(--text-muted)] px-2 py-1.5 uppercase tracking-wider">
            Basic Blocks
        </div>
        {props.items.map((item, index) => (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
              index === selectedIndex
                 ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                 : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-primary)]/50 ${
                 index === selectedIndex ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-secondary)]"
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    )
  })
  
  CommandList.displayName = 'CommandList'
