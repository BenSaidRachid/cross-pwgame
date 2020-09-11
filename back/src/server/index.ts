import express from 'express'
import dotenv from 'dotenv'
import chalk from 'chalk'
import fs from 'fs'
import io, { Socket } from 'socket.io'
import { isNull, display, getEnv } from '../helpers/utils'
import gameJson from  '../db/game.json'

const LOCAL_DATABASE = '../db/game.json';
interface User {
  nickname?: string
}

interface Player {
  name?: string
  points?: number
}

interface Score {
  beg?: string,
  end?: string,
  players: Player[]
}

interface Game {
  magicNumber?: Score[],
}

// prelude -- loading environment variable
dotenv.config()

const port = parseInt(getEnv("PORT")) || 8080
const app = express()

const server = app.listen(port, () => {
  display(chalk.magenta(`crossPWAGame server is running on 0.0.0.0:${port}`))
})

const socketio = io(server)

const users: Record<string, User> = {}
let i: number = 1;
let countParticipant: number = 0;
let randomNumber: number = 0;
let score: Score;
let game: Game = gameJson ;
let magicNumber: Array<Score> = game.magicNumber || []

function setRandomNumber() {
  randomNumber = Math.floor(Math.random() * 1338)
}

function initScore(players: Player[]) {
  score = {
    beg: new Date().toISOString(),
    end: new Date().toISOString(),
    players
  }
  magicNumber.push(score);
}

function getNewScore(score: Score,  winner: string) : Score {
  let { players }: {players: Player[]} = score
  const indexPlayer = players.findIndex(player => player.name === winner)
  players[indexPlayer] = {
    ...players[indexPlayer],
    points: players[indexPlayer].points + 1
  }
  return {
    ...score,
    players
  };
}

function getIndexScore(players: Player[]) : number {
  return magicNumber.findIndex((score: Score) => {
    for (let i = 0; i < players.length; i++) {
      if(players[i] !== score.players[i].name) return false
      else if(score.players[i].points === 3) return false;
      
    }
    return true
  })
}

socketio.on('connection', (socket: Socket) => {
  socket.join(`room_${i}`);

  display(chalk.cyan(`Connection opened for ( ${socket.id} )`))
  socket.on('disconnect', () => {
    if (users[socket.id]?.nickname) {
      const { nickname } = users[socket.id]
      display(chalk.yellow(`Goodbye ${nickname}`))
      countParticipant--;
      delete users[socket.id]
    }
    socket.broadcast.emit('game::checkRoomCount', {
      isNotFull: Object.keys(users).length < 2,
    })
    display(chalk.cyan(`Connection closed for ( ${socket.id} )`))
  })

  
  socket.on('game::sendNickname', payload => {
    const { nickname } = JSON.parse(payload)
    display(chalk.yellow(`Here comes a new challenger : ${nickname} ( from ${socket.id} )`))
    users[socket.id] = { nickname }
    countParticipant++;
    if (countParticipant == 2) {
      setRandomNumber()
      const players: Player[] = Object.values(users).map(user => {
        return {"name": user.nickname, "points": 0}
      })
     
      initScore(players)
    }
  })

  socket.on('game::validation', () => {
    socket.broadcast.emit('game::checkRoomCount', {
      isNotFull: Object.keys(users).length < 2,
    })

  })

  socket.on('game::magicNumber::start', () => {
    socket.broadcast.emit('game::magicNumber::data', {
      number: randomNumber,
      players: users,
      id: socket.id,
      turn: 0
    })
  })

  socket.on('game::magicNumber::checkNumber', (playload) => {
    const { number } = JSON.parse(playload)
    socket.emit('game::magicNumber::numberChecked', {
      isRightNumber: number == randomNumber,
      rightNumber: randomNumber
    })
  })

  socket.on('game::magicNumber::win', (payload) => {
    const { players, winner } = JSON.parse(payload)
    const indexScore = getIndexScore(players);
    setRandomNumber()
    console.log(indexScore, magicNumber, players)
    if (indexScore >= 0) {
      magicNumber[indexScore] = getNewScore(magicNumber[indexScore], winner);
      game = {
        ...game,
        magicNumber
      }

      socketio.emit('game::magicNumber::displayWinner', {
        winner,
        players: magicNumber[indexScore].players
      })
      if (fs.existsSync(`${__dirname}/${LOCAL_DATABASE}`)) {
        fs.writeFileSync(`${__dirname}/${LOCAL_DATABASE}`, JSON.stringify(game, null, 4))
      }
      socketio.emit('game::magicNumber::data', {
        number: randomNumber,
        turn: 0
      })
    }
  })

  socket.on('game::magicNumber::updateTurn', payload => {
    const { id } = JSON.parse(payload)
    socket.broadcast.emit('game::magicNumber::newTurn', {
      turn: Object.keys(users).findIndex(key => key !== id)
    })
  })

  socket.on('game::QuickWord::start', () => {
    socket.emit('game::QuickWord::data', {
      isNotFull: countParticipant < 2,
    })
  })

  socket.on('game::WordAndFurious::start', () => {
    socket.emit('game::WordAndFurious::data', {
      isNotFull: countParticipant < 2,
    })
  })

})
