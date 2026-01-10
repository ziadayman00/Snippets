import { Sparkles, Bot, Zap } from "lucide-react";

export default function AIFeaturePage() {
  return (
    <div className="container mx-auto px-6 max-w-6xl">
       <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-6">
                <Sparkles className="h-3 w-3" />
                <span>Ask AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Your personal <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">technical assistant.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                Don't just search. Ask. Our AI understands your entire snippet library and synthesizes answers based on your unique context.
            </p>
       </div>
    </div>
  );
}
