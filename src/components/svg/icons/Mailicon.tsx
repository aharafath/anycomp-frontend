import * as React from "react";

function MailIcon({
  width = 21,
  height = 21,
  fill = "#454545",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 9"
      fill="none"
      {...props}
    >
      <path
        d="M0.449219 1.59208C0.449219 1.28897 0.569627 0.998281 0.783954 0.783954C0.998281 0.569627 1.28897 0.449219 1.59208 0.449219H9.59208C9.89518 0.449219 10.1859 0.569627 10.4002 0.783954C10.6145 0.998281 10.7349 1.28897 10.7349 1.59208V7.30636C10.7349 7.60947 10.6145 7.90016 10.4002 8.11448C10.1859 8.32881 9.89518 8.44922 9.59208 8.44922H1.59208C1.28897 8.44922 0.998281 8.32881 0.783954 8.11448C0.569627 7.90016 0.449219 7.60947 0.449219 7.30636V1.59208Z"
        stroke={fill}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.449219 1.5918L5.59208 5.02037L10.7349 1.5918"
        stroke={fill}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MailIcon;
