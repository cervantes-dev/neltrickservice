import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  hidden?: "sm" | "lg";
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  hidden?: "sm" | "lg";
}

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table
        className={`min-w-full border-collapse ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "", ...props }: TableHeaderProps) {
  return (
    <thead {...props}>
      <tr className={`border-b border-brand-green/20 bg-brand-green/5 ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody
      className={`divide-y divide-brand-green/10 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, hoverable = true, className = "", ...props }: TableRowProps) {
  return (
    <tr
      className={`
        transition-colors duration-150
        ${hoverable ? "hover:bg-brand-green/5" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, hidden, className = "", ...props }: TableHeadProps) {
  return (
    <th
      className={`
        px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-400 uppercase
        ${hidden === "sm" ? "hidden sm:table-cell" : ""}
        ${hidden === "lg" ? "hidden lg:table-cell" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, hidden, className = "", ...props }: TableCellProps) {
  return (
    <td
      className={`
        px-4 py-3 whitespace-nowrap text-sm text-gray-600
        ${hidden === "sm" ? "hidden sm:table-cell" : ""}
        ${hidden === "lg" ? "hidden lg:table-cell" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </td>
  );
}