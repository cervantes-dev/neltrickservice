// components/NeltrickLogo.tsx
export default function NeltrickLogo({ width = 200, height = 60 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      width={width}
      height={height}
    >
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Open+Sans:wght@500&display=swap');`}
        </style>
      </defs>

      <text x="0" y="38" fontFamily="'Montserrat', sans-serif" fontWeight="800" fontSize="36" letterSpacing="-0.5">
        <tspan fill="#44b74a">Nel</tspan>
        <tspan fill="#1b234b">Trick</tspan>
      </text>

      <text x="75" y="52" fontFamily="'Open Sans', sans-serif" fontWeight="500" fontSize="10" fill="#0a3060" letterSpacing="2" textAnchor="middle" >
        LOGISTICS SERVICES
      </text>
    </svg>
  );
}