import { Mark, mergeAttributes } from "@tiptap/core";

// --- Marker (Highlight) Extension ---
export interface MarkerOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    marker: {
      setMarker: (attributes?: { color: string }) => ReturnType;
      toggleMarker: (attributes?: { color: string }) => ReturnType;
      unsetMarker: () => ReturnType;
    };
  }
}

export const Marker = Mark.create<MarkerOptions>({
  name: "marker",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {}
          }
          return {
            style: `background-color: ${attributes.color}; color: #000000`, // Enforce black text for contrast against bright highlights 
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "mark",
      },
      {
         style: 'background-color',
         getAttrs: value => !!value && null,
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Add some padding to ensure it covers the text nicely
    const style = HTMLAttributes.style ? `${HTMLAttributes.style};` : '';
    const newAttrs = { ...HTMLAttributes, style: `${style} padding: 0.1em 0; box-decoration-break: clone; -webkit-box-decoration-break: clone;` };
    
    return ["mark", mergeAttributes(this.options.HTMLAttributes, newAttrs), 0];
  },

  addCommands() {
    return {
      setMarker:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleMarker:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetMarker:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

// --- Underline Extension ---
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    underline: {
      setUnderline: () => ReturnType;
      toggleUnderline: () => ReturnType;
      unsetUnderline: () => ReturnType;
    };
  }
}

export const Underline = Mark.create({
  name: "underline",

  parseHTML() {
    return [
      {
        tag: "u",
      },
      {
        style: "text-decoration=underline",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["u", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setUnderline:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleUnderline:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetUnderline:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

// --- Font Size Extension (Simple Mark) ---
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Mark.create({
  name: 'fontSize',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) {
            return {}
          }
          return {
            style: `font-size: ${attributes.size}`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
           // Only match spans with font-size
           const hasFontSize = (element as HTMLElement).style.fontSize;
           return hasFontSize ? {} : false;
        }
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize: (size: string) => ({ commands }) => {
        return commands.setMark('fontSize', { size });
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.unsetMark('fontSize');
      },
    }
  },
})
