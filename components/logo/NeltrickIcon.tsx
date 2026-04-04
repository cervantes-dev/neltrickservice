// components/NeltrickIcon.tsx
export default function NeltrickIcon({ size = 40 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      width={size}
      height={size}
    >
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');`}
        </style>
        <clipPath id="neltrick-left">
          <rect x="0" y="0" width="30" height="60" />
        </clipPath>
        <clipPath id="neltrick-right">
          <rect x="30" y="0" width="30" height="60" />
        </clipPath>
      </defs>

      {/* Rounded square background */}
      <rect x="0" y="0" width="60" height="60" rx="12" ry="12" fill="#ffffff" />

      {/* Left half of N in green */}
      <text
        x="30"
        y="46"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="46"
        textAnchor="middle"
        fill="#44b74a"
        clipPath="url(#neltrick-left)"
      >
        N
      </text>

      {/* Right half of N in white */}
      <text
        x="30"
        y="46"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="46"
        textAnchor="middle"
        fill="#1b234b"
        clipPath="url(#neltrick-right)"
      >
        N
      </text>
    </svg>
  );
}