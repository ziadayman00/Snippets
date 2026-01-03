import { NodeViewContent, NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlock({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const languages = extension.options.lowlight.listLanguages();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Placeholder for copy logic
  };

  return (
    <NodeViewWrapper className="code-block my-4 overflow-hidden rounded-lg border border-[var(--border-primary)] bg-[#1e1e1e] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#252526] px-4 py-2 select-none" contentEditable={false}>
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded text-xs font-medium text-[#cce5ff] hover:bg-[#2a2a2a] px-2 py-1 transition-colors"
          >
            {defaultLanguage || "auto"}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          
          {isOpen && (
             <>
             <div 
               className="fixed inset-0 z-40" 
               onClick={() => setIsOpen(false)} 
             />
             <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-32 overflow-auto rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-1 shadow-xl">
               {languages.map((lang: string, index: number) => (
                 <button
                   key={index}
                   onClick={() => {
                     updateAttributes({ language: lang });
                     setIsOpen(false);
                   }}
                   className={`w-full rounded-sm px-2 py-1 text-left text-xs text-[#d4d4d4] hover:bg-[#2a2a2a] ${
                     lang === defaultLanguage ? "bg-[#37373d]" : ""
                   }`}
                 >
                   {lang}
                 </button>
               ))}
             </div>
           </>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#a8a8a8] hover:bg-[#2a2a2a] hover:text-[#d4d4d4] transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative">
          <pre className="!m-0 !rounded-none !bg-[#1e1e1e] !p-4">
            <NodeViewContent />
          </pre>
      </div>
    </NodeViewWrapper>
  );
}
