import React, { ReactNode } from "react";
import Container from "../Container";

type Props = {
  children: ReactNode;
  className: string;
  rest?: object;
};

export default function Layout({ children, ...rest }: Props) {
  return (
    <div className="layout-wrapper flex bg-primary-500 h-screen">
      <Container {...rest}>{children}</Container>
    </div>
  );
}
