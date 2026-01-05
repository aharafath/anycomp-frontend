import * as React from "react";

function DollarCoin({
  width = 21,
  height = 21,
  fill = "#000",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* Coin */}
      <circle cx="12" cy="12" r="8" stroke={fill} strokeWidth="2" />

      {/* Dollar sign */}
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill={fill}
      >
        $
      </text>
    </svg>
  );
}

export default DollarCoin;
