import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Code, 
  Quote, 
  Minus,
  Table as TableIcon
} from "lucide-react";
import { CommandList } from "../command-list";

export const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Heading 1",
      description: "Big section heading.",
      icon: Heading1,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      icon: Heading2,
      command: ({ editor, range }: any) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
        title: "Heading 3",
        description: "Small section heading.",
        icon: Heading3,
        command: ({ editor, range }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 3 })
            .run();
        },
      },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      icon: List,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Ordered List",
      description: "Create a numbered list.",
      icon: ListOrdered,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
        title: "Code Block",
        description: "Capture a code snippet.",
        icon: Code,
        command: ({ editor, range }: any) => {
          editor.chain().deleteRange(range).toggleCodeBlock().run();
        },
      },
    {
      title: "Blockquote",
      description: "Capture a quote.",
      icon: Quote,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: "Table",
      description: "Insert a simple table.",
      icon: TableIcon,
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      },
    },
    {
        title: "Divider",
        description: "Visually divide content.",
        icon: Minus,
        command: ({ editor, range }: any) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
};

export const renderSuggestion = () => {
  let component: ReactRenderer;
  let popup: any;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate(props: any) {
      component.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown(props: any) {
      if (props.event.key === "Escape") {
        popup[0].hide();

        return true;
      }

      // @ts-ignore
      return component.ref?.onKeyDown(props);
    },
    onExit() {
      popup[0].destroy();
      component.destroy();
    },
  };
};

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommand;
