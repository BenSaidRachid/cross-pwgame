import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Image, Button } from "@chakra-ui/core";
import Layout from "../../components/Layout";
import { useInput } from "../../helpers/hooks";
import game_icon from "../../assets/img/game.svg";
import toast from "../../helpers/toast";
import { urls } from "../../data";

type Props = {
  io?: SocketIOClient.Socket;
};

export default function Rooms({ io }: Props) {
  const [isNotFull, setNotFull] = useState<boolean>(true);
  const { value: nickname, bind } = useInput();
  const history = useHistory();

  useEffect(() => {
    if (io) {
      io.emit("game::validation");
      io.on("game::checkRoomCount", ({ isNotFull }: { isNotFull: boolean }) => {
        setNotFull(isNotFull);
      });
    }
  }, [io]);

  function beginGame(game?: string) {
    if (isNotFull) {
      if (nickname.length > 0) {
        if (io) {
          io.emit("game::sendNickname", JSON.stringify({ nickname }));
        }
        if(game === "magicNumber")
        history.push(urls.games.base, { nickname });
      } else {
        toast.warning("Enter a nickname");
      }
    } else {
      toast.warning("Sorry the room is full");
    }
  }

  return (
    <Layout className="justify-center items-center">
      <div className="flex flex-col shadow-lg items-center bg-white p-6 rounded-md">
        <Image src={game_icon} alt="Game" width={70} height={70} mb="4" />
        <Input placeholder="Enter your nickname" {...bind} mb="2" />
        <Button
          mt="4"
          variantColor="blue"
          width="full"
          onClick={() => beginGame("magicNumber")}
        >
          Play MagicNumber
        </Button>
        <Button
          mt="4"
          variantColor="blue"
          width="full"
          onClick={() => beginGame("quickWord")}
        >
          Play QuickWord
        </Button>
        <Button
          mt="4"
          variantColor="blue"
          width="full"
          onClick={() => beginGame("wordAndFurious")}
        >
          Play WordAndFurious
        </Button>
      </div>
    </Layout>
  );
}
