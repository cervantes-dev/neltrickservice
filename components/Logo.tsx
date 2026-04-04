export function NeltrickLogo({ size = 60 }: { size?: number }) {
    return <svg
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

}

export function NeltrickIcon({
    width = 200,
    height = 60,
}: {
    width?: number
    height?: number
}) {
    return <svg
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
}