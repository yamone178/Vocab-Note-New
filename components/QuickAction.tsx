import { ChevronRight, LucideIcon } from "lucide-react";

interface QuickActionProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function QuickAction({ title, icon: Icon, onClick }: QuickActionProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-secondary text-primary">
          <Icon size={20} />
        </div>
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}