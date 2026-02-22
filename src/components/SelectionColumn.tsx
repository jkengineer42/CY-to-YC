interface SelectionColumnProps {
  title: string;
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  accentColor?: "pink" | "purple" | "orange";
}

const ACCENT_STYLES = {
  pink: "bg-[rgba(244,171,186,0.35)] border-[rgba(244,171,186,0.5)]",
  purple: "bg-[rgba(196,181,253,0.35)] border-[rgba(196,181,253,0.5)]",
  orange: "bg-[rgba(253,186,116,0.35)] border-[rgba(253,186,116,0.5)]"
};

const SelectionColumn = ({ title, items, selectedIndex, onSelect, accentColor = "pink" }: SelectionColumnProps) => {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0 pt-1 pb-4">
      <span className="text-base tracking-wide text-foreground mb-1 text-left font-mono font-extrabold">
        {title}
      </span>
      <div className="flex flex-col items-center gap-1 w-full">
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={item}
              onClick={() => onSelect(index)}
              className={`w-full max-w-[220px] py-3 px-6 rounded-full text-center transition-all duration-200 cursor-pointer select-none ${
              isSelected ?
              `${ACCENT_STYLES[accentColor]} text-foreground font-semibold text-base border` :
              "text-muted-foreground font-normal text-sm hover:text-foreground/70"}`
              }>

              {item}
            </button>);

        })}
      </div>
    </div>);

};

export default SelectionColumn;