import * as React from "react";

function ServiceStore({
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
      {/* Roof */}
      <path
        d="M3 10L12 4l9 6"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Store body */}
      <path
        d="M5 10v8h14v-8"
        stroke={fill}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Door */}
      <path
        d="M10 18v-4h4v4"
        stroke={fill}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ServiceStore;
