import { mapArray } from './data.js'
import { Coin } from './coin.js'

export { Player }

class Player {
    /**
     * 
     * @param {Number} positionX 
     * @param {Number} positionY 
     */
    constructor(positionX, positionY) {
        this.positionX = positionX
        this.positionY = positionY
        this.currentPosition = 1 // right
        this.score = 0
    }

    /**
     * 
     * @param {String} position 
     * @returns {Boolean}
     */
    move(position) {
        switch (position) {
            case 'left': 
                if (mapArray[this.positionY][this.positionX - 1] === 0) {
                    this.positionX -= 1
                    this.currentPosition = 3
                    return true
                }
            break
            case 'right': 
                if (mapArray[this.positionY][this.positionX + 1] === 0) {
                    this.positionX += 1
                    this.currentPosition = 1
                    return true
                }
            break
            case 'top': 
                if (mapArray[this.positionY - 1][this.positionX] === 0) {
                    this.positionY -= 1
                    this.currentPosition = 0
                    return true
                }
            break
            case 'bottom': 
                if (mapArray[this.positionY + 1][this.positionX] !== 1) {
                    this.positionY += 1
                    this.currentPosition = 2
                    return true
                }
            break
        }
        return false
    }

    /**
     * 
     * @param {Array[Coin]} coins 
     * @returns {Boolean}
     */
    isThereACoin(coins) {
        return coins.find(coin => 
            coin.positionX === this.positionX 
            && coin.positionY === this.positionY
        )
    }
}