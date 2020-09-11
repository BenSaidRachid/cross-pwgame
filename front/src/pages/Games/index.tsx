import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Text, Spinner, Input, Button } from "@chakra-ui/core";
import Layout from "../../components/Layout";
import Player from "../../components/Player";
import { useInput } from "../../helpers/hooks";
import Score from "../../components/Score";

type Props = {
  io?: SocketIOClient.Socket;
  rest?: object;
};

type Player = {
  nickname: string;
};

type Players = {
  name: string;
  points: number;
};

export default function Games({ io, ...rest }: Props) {
  const [isNotFull, setNotFull] = useState<boolean>(true);
  const [instruction, setInstruction] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [players, setPlayers] = useState<object>({});
  const [playerId, setPlayerId] = useState<string>("");
  const [turn, setTurn] = useState<number>(-1);
  const [isInputValid, setInputValidity] = useState<boolean>(true);
  const [scores, setScores] = useState<Array<number>>([0,0]);
  const { value: number, bind, reset } = useInput();

  const history = useHistory();
  const { state } = history.location;
  const { nickname }: { nickname?: string } = state || {};

  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1 && io) {
        io.emit("game::sendNickname", JSON.stringify({ nickname }));
      }
    }
    if (io) {
      io.emit("game::validation");
      io.on("game::checkRoomCount", ({ isNotFull }: { isNotFull: boolean }) => {
        setNotFull(isNotFull);
      });
      io.on(
        "game::magicNumber::displayWinner",
        ({ winner, players }: { winner: string; players: Players[] }) => {
          const player1 = players.find(
            (player: Players) => player.name === nickname
          );
          const player2 = players.find(
            (player: Players) => player.name !== nickname
          );
          if (player1 && player2) setScores([player1.points, player2.points]);
          setInfo(`${winner} won !!!`);
          setTimeout(() => {
            setInfo("");
          }, 2000);
        }
      );

      io.on(
        "game::magicNumber::data",
        ({
          players,
          id,
          turn,
        }: {
          players?: object;
          id?: string;
          turn: number;
        }) => {
          if (players) setPlayers(players);
          if (id) setPlayerId(id);
          setTurn(turn);
        }
      );
      io.on("game::magicNumber::newTurn", ({ turn }: { turn: number }) => {
        checkTurn(turn);
        setTurn(turn);
      });

      io.on(
        "game::magicNumber::numberChecked",
        ({
          isRightNumber,
          rightNumber,
        }: {
          isRightNumber: boolean;
          rightNumber: number;
        }) => {
          console.log(rightNumber);
          if (isRightNumber) {
            setInfo(`${nickname} won !!!`);
            setTimeout(() => {
              io.emit(
                "game::magicNumber::win",
                JSON.stringify({
                  players: Object.values(players).map(
                    (player: Player) => player.nickname
                  ),
                  winner: nickname,
                })
              );
              setInfo("");
            }, 2000);
          } else {
            const index = checkPlayerId(playerId);
            setNumberIndication(rightNumber);
            updateTurn(playerId);
            if (index >= 0) {
              io.emit(
                "game::magicNumber::updateTurn",
                JSON.stringify({ id: playerId })
              );
            }
          }
        }
      );
    }
  });

  useEffect(() => {
    if (!isNotFull && io) {
      io.emit("game::magicNumber::start", JSON.stringify({ nickname }));
    }
  }, [isNotFull]);

  useEffect(() => {
    if (playerId.length > 0 && turn >= 0) {
      checkTurn(turn);
    }
  }, [playerId, turn]);

  function checkPlayerId(id: string) {
    return Object.keys(players).findIndex((key) => key === id);
  }

  function updateTurn(id: string) {
    const turn = Object.keys(players).findIndex((key) => key !== id);
    setTurn(turn);
  }

  function checkTurn(turn: number) {
    const index = checkPlayerId(playerId);
    if (turn === index) {
      setInfo("Your turn");
    } else {
      setInfo("Your opponent's turn");
    }
  }

  function isInputDisabled() {
    const index = checkPlayerId(playerId);
    return turn !== index;
  }

  function setNumberIndication(rightNumber: number) {
    if (rightNumber < Number(number)) {
      setInstruction("Too big");
    } else {
      setInstruction("Too small");
    }
    setTimeout(() => {
      setInstruction("");
      reset();
    }, 2000);
  }

  function checkTheNumber() {
    if (isNaN(Number(number))) {
      setInputValidity(false);
    } else if (io) {
      setInputValidity(true);
      io.emit(
        "game::magicNumber::checkNumber",
        JSON.stringify({
          number: Number(number),
        })
      );
    }
  }

  return (
    <Layout className="items-center">
      {!isNotFull && Object.keys(players).length > 0 && (
        <div className=" flex mt-10 mb-24 justify-between">
          {Object.values(players).map((player, index) => (
            <div key={`info_${index}`} className="flex flex-col">
              <Player nickname={player.nickname} number={index + 1} />
              <Score score={scores[index]}/>
            </div>
          ))}
        </div>
      )}
      {info.length > 0 && (
        <Text
          fontSize="4xl"
          textAlign="center"
          fontWeight="semibold"
          color="white"
          mb="6"
        >
          {info}
        </Text>
      )}
      <div className="flex flex-col shadow-lg items-center bg-white p-6 rounded-md mt-10">
        {isNotFull ? (
          <>
            {" "}
            <Text
              fontSize="3xl"
              textAlign="center"
              whiteSpace="pre-line"
              fontWeight="semibold"
              color="primary.700"
              mb="4"
            >
              Waiting for another player to enter ther room
            </Text>
            <Spinner color="primary.700" size="lg" />
          </>
        ) : (
          <>
            <Text
              fontSize="xl"
              textAlign="center"
              whiteSpace="pre-line"
              fontWeight="semibold"
              color="primary.700"
              mb="4"
            >
              Find the random number between 0 and 1337
            </Text>
            <Input
              placeholder="Enter the number"
              mb="2"
              isDisabled={isInputDisabled()}
              isInvalid={!isInputValid}
              errorBorderColor="crimson"
              {...bind}
            />
            {!isInputValid && (
              <Text
                fontSize="base"
                textAlign="center"
                fontWeight="medium"
                color="crimson"
                mt="2"
              >
                Entry should be a number
              </Text>
            )}
            <Button
              mt="4"
              variantColor="blue"
              width="full"
              onClick={() => checkTheNumber()}
              isDisabled={isInputDisabled()}
            >
              Check my number
            </Button>
            {instruction.length > 0 && (
              <Text
                fontSize="xl"
                textAlign="center"
                fontWeight="medium"
                color="primary.500"
                mt="6"
              >
                {instruction}
              </Text>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
