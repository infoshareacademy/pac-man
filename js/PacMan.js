import { board, ghostPositions, pacManPosition } from './PacMan.board.js'
import { getRandomInt } from './PacMan.utils.js'

const WALL = 0
const EMPTY = 1
const FOOD = 2
const PACMAN = 3
const GHOST = 4

export default class PacMan {
  constructor(selector, boardDimension) {
    // HTML containers and game settings
    this.container = selector ? document.querySelector(selector) : document.body
    this.gameBoard = null

    this.boardDimension = boardDimension + 'px'

    this.timeOfTick = 300

    // game variables that DONT depends of level
    this.gameIntervalId = null
    this.gameBoardArray = []
    this.direction = 'up'
    this.isGameEnded = false
    this.score = 0

    // game variables that depends of level
    this.pacManPosition = JSON.parse(JSON.stringify(pacManPosition))
    this.ghostPositions = JSON.parse(JSON.stringify(ghostPositions))
    this.initialGameBoardArray = JSON.parse(JSON.stringify(board))
    this.cellDimension = (100 / this.initialGameBoardArray.length) + '%'

    // bind interactions with moves
    this.checkWhatMoveDoForPacMan = this.checkWhatMoveDo(
      [GHOST], // stepping on ghost ends game
      [EMPTY], // stepping on empty moves pacman
      [FOOD], // stepping on food moves pacman and score
      [WALL] // cant go on walls
    )
    this.checkWhatMoveDoForGhost = this.checkWhatMoveDo(
      [PACMAN], // stepping on pacman ends game
      [EMPTY, FOOD], // stepping on empty or food moves ghost
      [], // ghost cant score
      [WALL, GHOST] // ghosts cant go on other ghosts and walls
    )

    // functions to start game
    this.init()
  }

  init() {
    this.makeGameBoard()
    this.startListeningArrowKeys()

    this.render()

    this.setGameInterval()
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

  composeBoard() {
    this.gameBoardArray = JSON.parse(JSON.stringify(this.initialGameBoardArray))

    this.gameBoardArray[this.pacManPosition.y][this.pacManPosition.x] = PACMAN

    this.ghostPositions.forEach(
      ghostPosition => {
        this.gameBoardArray[ghostPosition.y][ghostPosition.x] = GHOST
      }
    )
  }

  render() {
    this.gameBoard.innerHTML = ''

    this.composeBoard()

    this.renderScore()

    this.gameBoardArray.forEach(row => {
      row.forEach(cell => {
        this.renderSingleCell(cell)
      })
    })
  }

  renderScore() {
    const scoreDiv = document.createElement('div')

    scoreDiv.style.width = '100%'

    scoreDiv.innerText = this.score

    this.gameBoard.appendChild(scoreDiv)
  }

  renderSingleCell(cell) {
    const cellElement = document.createElement('div')
    cellElement.style.width = this.cellDimension
    cellElement.style.height = this.cellDimension

    switch (cell) {
      case WALL:
        cellElement.className = 'wall'
        cellElement.style.backgroundColor = 'black'
        break
      case EMPTY:
        cellElement.className = 'empty'
        cellElement.style.backgroundColor = 'grey'
        break
      case FOOD:
        cellElement.className = 'food'
        cellElement.style.backgroundColor = 'green'
        break
      case PACMAN:
        cellElement.className = 'pacman ' + this.direction
        cellElement.style.backgroundColor = 'yellow'
        break
      case GHOST:
        cellElement.className = 'ghost'
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

  tryToMovePacMan(y, x) {
    // @TODO
  }

  tryToMoveGhosts() {
    // @TODO
  }

  tryToMoveGhost(indexOfGhost) {
    // @TODO
  }

  movePacMan(newPosition) {
    // @TODO
  }

  moveGhost(indexOfGhost, newPosition) {
    // @TODO
  }

  eatFood(newPosition) {
    // @TODO
  }

  scoreUp() {
    // @TODO
  }

  endGame() {
    this.isGameEnded = true
    clearInterval(this.gameIntervalId)
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
        // @TODO
        break
      case 'down':
        // @TODO
        break
      case 'left':
        // @TODO
        break
      case 'right':
        // @TODO
        break
    }

    // @TODO

    this.render()
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