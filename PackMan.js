import { board } from './PackMan.board.js'

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
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ]

    this.gameBoardArray = board
    this.gameBoard = null
    this.gameIntervalId = null
    this.direction = 'up'
    this.score = 0

    this.init()
  }

  init() {
    this.makeGameBoard()
    // this.placePackMan()
    this.render()
    this.startListeningArrowKeys()
    // this.setGameInterval()
  }

  composeBoard() {
    const boardArrayToRender = JSON.parse(JSON.stringify(this.gameBoardArray))

    boardArrayToRender[this.packManPosition.y][this.packManPosition.x] = PACKMAN

    this.ghostPositions.forEach(
      ghostPosition => {
        boardArrayToRender[ghostPosition.y][ghostPosition.x] = GHOST
      }
    )

    return boardArrayToRender
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

    this.composeBoard().forEach(row => {
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

  // gameTick() {
  //   switch (this.direction) {
  //     case 'up':
  //       this.checkIfMoveIsAvailable(-1, 0)
  //       break
  //     case 'down':
  //       this.checkIfMoveIsAvailable(1, 0)
  //       break
  //     case 'left':
  //       this.checkIfMoveIsAvailable(0, -1)
  //       break
  //     case 'right':
  //       this.checkIfMoveIsAvailable(0, 1)
  //       break
  //   }
  // }

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