import React from "react";
import { Text } from "@chakra-ui/core";

type Props = {
  number?: number;
  nickname?: string;
  className?: string;
};

export default function Container({
  nickname,
  number,
  className = "",
}: Props) {
  return (
    <div
      className={`text-xl text-white font-semibold capitalize mx-40 bg-dark-500 p-6 rounded-md whitespace-pre mb-6 ${className}`}
    >
      <Text>
        Player {number}: {nickname}
      </Text>
    </div>
  );
}
