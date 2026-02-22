import { useRef, useEffect, useCallback, useState } from "react";

interface ScrollColumnProps {
  title: string;
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ITEM_HEIGHT = 48;
const VISIBLE_COUNT = 5;

const ScrollColumn = ({ title, items, selectedIndex, onSelect }: ScrollColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (!containerRef.current) return;
    const scrollTop = index * ITEM_HEIGHT;
    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToIndex(selectedIndex, false);
  }, []);

  // When items change (e.g. column 2 updates), reset to index 0
  useEffect(() => {
    scrollToIndex(0, false);
    onSelect(0);
  }, [items.join(",")]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    setIsScrolling(true);
    clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, items.length - 1));
      scrollToIndex(clampedIndex);
      onSelect(clampedIndex);
      setIsScrolling(false);
    }, 80);
  }, [items.length, onSelect, scrollToIndex]);

  const paddingItems = Math.floor(VISIBLE_COUNT / 2);

  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        {title}
      </span>
      <div className="relative w-full" style={{ height: VISIBLE_COUNT * ITEM_HEIGHT }}>
        {/* Fade masks */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none rounded-t-lg" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none rounded-b-lg" />

        {/* Selection highlight */}
        <div
          className="absolute inset-x-2 z-[5] rounded-lg bg-accent border border-forest/20 pointer-events-none transition-colors"
          style={{
            top: paddingItems * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
        />

        {/* Scrollable content */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

          {/* Top padding */}
          {Array.from({ length: paddingItems }).map((_, i) => (
            <div key={`top-${i}`} style={{ height: ITEM_HEIGHT }} />
          ))}

          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item}
                className={`snap-center flex items-center justify-center px-4 cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? "text-accent-foreground font-semibold text-base"
                    : "text-muted-foreground font-normal text-sm opacity-50"
                }`}
                style={{ height: ITEM_HEIGHT }}
                onClick={() => {
                  onSelect(index);
                  scrollToIndex(index);
                }}
              >
                <span className="truncate">{item}</span>
              </div>
            );
          })}

          {/* Bottom padding */}
          {Array.from({ length: paddingItems }).map((_, i) => (
            <div key={`bottom-${i}`} style={{ height: ITEM_HEIGHT }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollColumn;
