import { board } from './PackMan.board.js'

export default class PackMan {
  constructor(selector, boardDimension) {
    this.container = selector ? document.querySelector(selector) : document.body

    this.boardDimension = boardDimension + 'px'
    this.cellDimension = (100 / board.length) + '%'

    this.timeOfTick = 200

    this.packManPosition = { x: 1, y: 1 }

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

  placePackMan() { }

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

    this.placePackMan()

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
      case 0:
        cellElement.style.backgroundColor = 'black'
        break
      case 1:
        cellElement.style.backgroundColor = 'grey'
        break
      case 'X':
        cellElement.style.backgroundColor = 'green'
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