import React from "react";
import { Image } from "@chakra-ui/core";
import trophy_empty from "../assets/img/trophy_empty.svg";
import trophy_fill from "../assets/img/trophy_fill.svg";

type Props = {
  score?: number;
};

export default function Score({ score = 0 }: Props) {
  let total = [...new Array(3)];
  total = total.map((value, index) => index <= score - 1 && score >= 0);
  return (
    <div className={`flex self-center`}>
      {total.map((value, index) => {
        const icon = value ? trophy_fill : trophy_empty;
        return (
          <Image
            key={`icon_${index}`}
            src={icon}
            alt="Score"
            width={50}
            height={50}
          />
        );
      })}
    </div>
  );
}
