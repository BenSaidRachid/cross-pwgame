import React, { ReactNode } from "react";
type Props = {
  children: ReactNode;
  className?: string;
  rest?: object;
};

export default function Container({
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <div className={`container flex flex-col mx-auto  px-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
