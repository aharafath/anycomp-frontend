import * as React from "react";

function Label({
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
      /* viewBox adjust kora hoyeche jate extra padding bad pore */
      viewBox="1 1 11 9"
      fill="none"
      {...props}
    >
      <path
        d="M3.937 4.161c.43 0 .78-.308.78-.687 0-.38-.35-.688-.78-.688-.43 0-.779.308-.779.688 0 .38.349.687.78.687z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.797.925h-.042l-3.116.197c-.726.058-1.302.565-1.367 1.206l-.228 2.75a.807.807 0 00.27.687l4.384 3.869c.185.157.434.243.69.238a1.546 1.546 0 001.04-.399l3.308-2.915c.514-.376.595-1.045.182-1.508l-4.41-3.896a1.057 1.057 0 00-.69-.238l-.021.01zm.02.738a.176.176 0 01.094 0l4.39 3.873a.43.43 0 01-.188.458l-3.319 2.93a.67.67 0 01-.42.178h-.089L1.911 5.21a.127.127 0 010-.101l.229-2.75c.04-.25.259-.447.54-.49l3.117-.198.02-.009z"
        fill={fill}
      />
    </svg>
  );
}

export default Label;
