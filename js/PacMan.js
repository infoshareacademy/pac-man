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
    this.eatenFood = []
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

    this.eatenFood.forEach(
      eatenFoodPosition => {
        this.gameBoardArray[eatenFoodPosition.y][eatenFoodPosition.x] = EMPTY
      }
    )

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
        // cellElement.style.backgroundColor = 'grey'
        break
      case FOOD:
        cellElement.className = 'food'
        // cellElement.style.backgroundColor = 'green'
        break
      case PACMAN:
        cellElement.className = 'pacman ' + this.direction
        // cellElement.style.backgroundColor = 'yellow'
        break
      case GHOST:
        cellElement.className = 'ghost'
        // cellElement.style.backgroundColor = 'violet'
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
    const coords = { x: x, y: y }
    const newPosition = this.checkWhatMoveDoForPacMan(coords)
    if (newPosition !== 'DONTMOVE') {
      this.movePacMan(coords)
    }
    if (newPosition === 'MOVEANDSCORE') {
      this.scoreUp()
      this.eatFood(coords)
    }
    if (newPosition === 'ENDGAME') {
      this.endGame()
    }
  }

  tryToMoveGhosts() {
    this.ghostPositions.forEach((elem, index) => {
      this.tryToMoveGhost(index)
    })
  }

  tryToMoveGhost(indexOfGhost) {
    const ghost = this.ghostPositions[indexOfGhost]
    const randomNum = getRandomInt(0, 3);
    const newCoords = {};
    if (randomNum === 0) {
      newCoords.x = ghost.x + 1,
      newCoords.y = ghost.y
    } else if (randomNum === 1) {
      newCoords.x = ghost.x - 1,
      newCoords.y = ghost.y
    } else if (randomNum === 2) {
      newCoords.x = ghost.x,
      newCoords.y = ghost.y + 1
    } else if (randomNum === 3) {
      newCoords.x = ghost.x,
      newCoords.y = ghost.y - 1
    }

    const newPosition = this.checkWhatMoveDoForGhost(newCoords)
    console.log(newPosition)
    if (newPosition === 'MOVE') {
      this.moveGhost(indexOfGhost, newCoords)
    }
    if (newPosition === 'ENDGAME') {
      this.moveGhost(indexOfGhost, newCoords)
      this.endGame()
    }
  }

  moveGhost(indexOfGhost, newPosition) {
    this.ghostPositions[indexOfGhost] = newPosition
  }

  movePacMan(newPosition) {
    this.pacManPosition = newPosition
  }

  eatFood(newPosition) {
    this.eatenFood.push(newPosition)
  }

  scoreUp() {
    this.score++
  }

  endGame() {
    this.isGameEnded = true
    clearInterval(this.gameIntervalId)
    alert('Game over. Try again!')
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

        this.tryToMovePacMan(
          this.pacManPosition.y - 1,
          this.pacManPosition.x,
        )

        break
      case 'down':
        this.tryToMovePacMan(
          this.pacManPosition.y + 1,
          this.pacManPosition.x,
        )

        break
      case 'left':
        this.tryToMovePacMan(
          this.pacManPosition.y,
          this.pacManPosition.x - 1,
        )

        break
      case 'right':
        this.tryToMovePacMan(
          this.pacManPosition.y,
          this.pacManPosition.x + 1,
        )

        break
    }

    // @TODO
    this.tryToMoveGhosts()

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
