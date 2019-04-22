import { board } from './PackMan.board.js'
import { getRandomInt } from './PackMan.utils.js'

const WALL = 0
const EMPTY = 1
const FOOD = 2
const PACKMAN = 3
const GHOST = 4

export default class PackMan {
  constructor(selector, boardDimension) {
    this.container = selector ? document.querySelector(selector) : document.body

    this.boardDimension = boardDimension + 'px'
    this.cellDimension = (100 / board.length) + '%'

    this.timeOfTick = 200

    this.packManPosition = { x: 1, y: 1 }
    this.ghostPositions = [
      { x: 1, y: 2 },
      { x: 3, y: 3 },
    ]

    this.gameBoardArray = []
    this.gameBoard = null
    this.gameIntervalId = null
    this.direction = 'up'
    this.score = 0

    this.checkWhatMoveDoForPackMan = this.checkWhatMoveDo(
      [GHOST],
      [EMPTY],
      [FOOD],
      [WALL]
    )

    this.checkWhatMoveDoForGhost = this.checkWhatMoveDo(
      [PACKMAN],
      [EMPTY, FOOD],
      [],
      [WALL, GHOST]
    )

    this.init()
  }


  init() {
    this.makeGameBoard()
    this.startListeningArrowKeys()

    this.render()

    this.setGameInterval()
  }

  composeBoard() {
    this.gameBoardArray = JSON.parse(JSON.stringify(board))

    this.gameBoardArray[this.packManPosition.y][this.packManPosition.x] = PACKMAN

    this.ghostPositions.forEach(
      ghostPosition => {
        this.gameBoardArray[ghostPosition.y][ghostPosition.x] = GHOST
      }
    )
  }

  makeGameBoard() {
    const boardElement = document.createElement('div')

    boardElement.style.width = this.boardDimension
    boardElement.style.height = this.boardDimension
    boardElement.style.margin = '0 auto'
    boardElement.style.display = 'flex'
    boardElement.style.flexWrap = 'wrap'

    this.gameBoard = boardElement

    this.container.appendChild(boardElement)
  }

  render() {
    this.gameBoard.innerHTML = ''

    this.composeBoard()

    this.gameBoardArray.forEach(row => {
      row.forEach(cell => {
        this.renderSingleCell(cell)
      })
    })
  }

  renderSingleCell(cell) {
    const cellElement = document.createElement('div')
    cellElement.style.width = this.cellDimension
    cellElement.style.height = this.cellDimension

    switch (cell) {
      case WALL:
        cellElement.style.backgroundColor = 'black'
        break
      case EMPTY:
        cellElement.style.backgroundColor = 'grey'
        break
      case FOOD:
        cellElement.style.backgroundColor = 'green'
        break
      case PACKMAN:
        cellElement.style.backgroundColor = 'yellow'
        break
      case GHOST:
        cellElement.style.backgroundColor = 'violet'
        break
    }

    this.gameBoard.appendChild(cellElement)
  }

  checkWhatMoveDo(endGame, move, moveAndScore, dontMove) {
    return newPosition => {
      if (
        this.gameBoardArray[newPosition.y] === undefined ||
        this.gameBoardArray[newPosition.y][newPosition.x] === undefined
      ) {
        return 'DONTMOVE'
      }

      const newPositionContent = this.gameBoardArray[newPosition.y][newPosition.x]

      if (endGame.includes(newPositionContent)) {
        return 'ENDGAME'
      }
      if (move.includes(newPositionContent)) {
        return 'MOVE'
      }
      if (moveAndScore.includes(newPositionContent)) {
        return 'MOVEANDSCORE'
      }
      if (dontMove.includes(newPositionContent)) {
        return 'DONTMOVE'
      }
    }
  }

  tryToMovePackMan(y, x) {
    const newPosition = {
      x: this.packManPosition.x + x,
      y: this.packManPosition.y + y,
    }

    const whatToDo = this.checkWhatMoveDoForPackMan(newPosition)

    switch (whatToDo) {
      case 'ENDGAME':
        this.endGame()
        break
      case 'MOVE':
        this.movePackMan(newPosition)
        break
      case 'MOVEANDSCORE':
        this.movePackMan(newPosition)
        this.eatFood(newPosition)
        this.scoreUp()
        break
      case 'DONTMOVE':
        break
    }

    this.render()
  }

  tryToMoveGhosts(){
    this.ghostPositions.forEach(
      (ghost, indexOfGhost) => this.tryToMoveGhost(indexOfGhost)
    )
  }

  tryToMoveGhost(indexOfGhost) {
    const currentGhostPosition = this.ghostPositions[indexOfGhost]

    const newPosition = {
      x: currentGhostPosition.x + getRandomInt(-1, 1),
      y: currentGhostPosition.y + getRandomInt(-1, 1),
    }

    const whatToDo = this.checkWhatMoveDoForGhost(newPosition)

    switch (whatToDo) {
      case 'ENDGAME':
        this.endGame()
        break
      case 'MOVE':
        this.moveGhost(indexOfGhost, newPosition)
        break
      case 'MOVEANDSCORE':
        break
      case 'DONTMOVE':
        break
    }

    this.render()
  }

  endGame() {
    clearInterval(this.gameIntervalId)
    alert('GAME OVER! \n YOUT SCORE - ' + this.score + ' !!!')
    window.location = ''
  }

  movePackMan(newPosition) {
    this.packManPosition = newPosition
  }

  moveGhost(indexOfGhost, newPosition) {
    this.ghostPositions[indexOfGhost] = newPosition
  }

  eatFood(newPosition) {
    board[newPosition.y][newPosition.x] = EMPTY
  }

  scoreUp() {
    this.score += 1
  }

  setGameInterval() {
    this.gameIntervalId = setInterval(
      () => this.gameTick(),
      this.timeOfTick
    )
  }

  gameTick() {
    switch (this.direction) {
      case 'up':
        this.tryToMovePackMan(-1, 0)
        break
      case 'down':
        this.tryToMovePackMan(1, 0)
        break
      case 'left':
        this.tryToMovePackMan(0, -1)
        break
      case 'right':
        this.tryToMovePackMan(0, 1)
        break
    }

    this.tryToMoveGhosts()
  }

  startListeningArrowKeys() {
    window.addEventListener(
      'keydown',
      event => {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault()
            this.direction = 'up'
            break
          case 'ArrowDown':
            event.preventDefault()
            this.direction = 'down'
            break
          case 'ArrowLeft':
            event.preventDefault()
            this.direction = 'left'
            break
          case 'ArrowRight':
            event.preventDefault()
            this.direction = 'right'
            break
        }
      }
    )
  }
}