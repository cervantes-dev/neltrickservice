import {
  useState, useRef, useEffect,
  cloneElement, isValidElement,
  Children
} from "react";

interface MenuProps {
  children: React.ReactNode;
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
}

export function Menu({ children }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
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
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
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
      {Children.map(children, (child) => {
        if (isValidElement(child) && child.type === MenuTrigger) {
          return cloneElement(child as React.ReactElement<any>, {
            triggerRef,
            onClick: handleTriggerClick,
          });
        }
        if (isValidElement(child) && child.type === MenuList) {
          return cloneElement(child as React.ReactElement<any>, {
            isOpen,
            menuPos,
            menuRef,
          });
        }
        return child;
      })}
    </>
  );
}

export function MenuTrigger({
  triggerRef,
  onClick,
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>;
  onClick?: () => void;
}) {
  return (
    <button
      ref={triggerRef}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400
        hover:bg-brand-green/10 hover:text-brand-green transition-colors text-base leading-none"
    >
      ···
    </button>
  );
}

export function MenuList({
  children,
  isOpen,
  menuPos,
  menuRef,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  menuPos?: { top: number; left: number };
  menuRef?: React.RefObject<HTMLDivElement>;
}) {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: menuPos?.top, left: menuPos?.left }}
      className="fixed z-50 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
    >
      <ul className="py-1 divide-y divide-gray-100">
        {children}
      </ul>
    </div>
  );
}

export function MenuItem({ label, onClick, variant = "default", icon }: MenuItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors
        ${variant === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-600 hover:bg-brand-green/5 hover:text-brand-green"
        }`}
    >
      {icon && (
        <span className="w-4 h-4 flex items-center justify-center">
          {icon}
        </span>
      )}
      {label}
    </li>
  );
}