// ui/loader/spinner.tsx

type SpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const Spinner = ({ size = 16, color = "#ebfdee", className = "" }: SpinnerProps) => {
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          border: `2px solid transparent`,  // ✅ just transparent, not ${color}30
          borderTopColor: color,             // ✅ only top is colored
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
          flexShrink: 0,                     // ✅ prevents spinner from collapsing
        }}
      />
    </>
  );
};