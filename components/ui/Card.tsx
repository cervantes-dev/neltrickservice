import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`w-full bg-sidebar/50 border border-brand-green/20 rounded-2xl shadow-md p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="font-medium text-base text-navy">
        {children}
      </p>
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-gray-600 overflow-x-auto">
      {children}
    </div>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 pt-3 border-t border-border text-sm">
      {children}
    </div>
  );
}