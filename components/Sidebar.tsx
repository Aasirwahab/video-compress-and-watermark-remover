import React from 'react';
import { Tool, ToolCategory, TOOLS } from './Dashboard';
import { Video } from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
}

export function Sidebar({ activeToolId, onSelectTool }: SidebarProps) {
  const categories: ToolCategory[] = ['Core', 'Editing', 'Social', 'Advanced', 'Utility'];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Video className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">VideoForge</h1>
      </div>

      <div className="p-4 space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
              {category}
            </h2>
            <div className="space-y-1">
              {TOOLS.filter(t => t.category === category).map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeToolId === tool.id
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <tool.icon className={`w-4 h-4 ${activeToolId === tool.id ? 'text-indigo-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{tool.name}</span>
                  {tool.isReal && (
                    <span className="ml-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                      Real
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
