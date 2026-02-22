import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { getAllSessions, deleteSession, type ChatSession } from "@/lib/chatStore";
import { useState, useEffect } from "react";

interface ChatHistoryProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDeleted?: (deletedId: string) => void;
  refreshKey: number;
}

const ChatHistory = ({ activeId, onSelect, onNew, onDeleted, refreshKey }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(getAllSessions());
  }, [refreshKey]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getAllSessions());
    if (id === activeId) {
      onNew();
    }
    onDeleted?.(id);
  };

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={onNew}
        className="flex items-center gap-2 mx-3 mb-3 px-3 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <Plus className="h-4 w-4" />
        New Audit
      </button>

      <div className="flex-1 overflow-auto space-y-0.5 px-2">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors group ${
              activeId === s.id
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{s.title}</span>
            <Trash2
              className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0 transition-opacity"
              onClick={(e) => handleDelete(e, s.id)}
            />
          </button>
        ))}
        {sessions.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No history yet</p>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
