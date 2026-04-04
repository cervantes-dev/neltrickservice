import { useState, useRef, useEffect } from "react";
import { FilterList } from "@mui/icons-material";

interface UserFilterProps {
  options: string[];
  onSelect: (option: string) => void;
  filterCount?: number;
  value?: string;
}

export default function UserFilter({ options, onSelect, filterCount = 0, value = "" }: UserFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = value;
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: rect.right - 160,
      });
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-1.5 border border-brand-green/20 bg-brand-green/5 rounded-md text-sm text-brand-green hover:bg-brand-green/10 transition-colors cursor-pointer"
      >
        <FilterList fontSize="small" />
        <span>Filter</span>
        {filterCount > 0 && (
          <span className="text-xs font-medium text-brand-green border border-brand-green/30 rounded px-1 leading-4">
            {filterCount > 99 ? "99+" : filterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed z-50 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Filter by Status
            </span>
            {selected && (
              <button
                onClick={() => {
                  onSelect("");
                  setIsOpen(false);
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Options — each divided */}
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
            ${selected === option
                    ? "bg-brand-green text-white"
                    : "text-gray-600 hover:bg-brand-green/5 hover:text-brand-green"
                  }`}
              >
                {option}
              </li>
            ))}
          </ul>

        </div>
      )}
    </>
  );
}