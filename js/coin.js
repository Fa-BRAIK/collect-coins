import { mapArray, tileWidth, coinFrames } from './data.js'
import { Player } from './player.js'

export { Coin }

class Coin {
    /**
     * 
     * @param {Number} positionX 
     * @param {Number} positionY 
     * @param {Object} ctx
     */
    constructor(positionX, positionY) {
        this.positionX = positionX
        this.positionY = positionY
        this.currentFrame = 0
        this.level = Math.floor(Math.random() * 3) + 1 
        this.frameRate = 10 * this.level
        this.points = (Math.floor(Math.random() * 100) + 100) * this.level
        this.coinAnimation
        this.lifeTime = 5 - this.level
        this.lifeTimeTimer 
        this.coinOpacity = 1
    }

    /**
     * 
     * @param {Player} player
     * @param {Number} numOfCoins 
     */
    static generateCoins(player, numOfCoins) {
        const coins = []
        let posX, posY
        for (let i = 0; i < numOfCoins; i++) {
            let obst = true, placedCoin = false
            do {
                placedCoin = false, obst = true
                posX = Math.floor(Math.random() * mapArray.length + 1) - 1
                posY = Math.floor(Math.random() * mapArray[0].length + 1) - 1

                if (mapArray[posX][posY] === 0) 
                    obst = false
                
                if (!obst)
                    for (let i = 0; i < coins.length; i++) 
                        if (coins[i].positionX === posY && coins[i].positionY === posX)
                            placedCoin = true

            } while ((posX === player.positionY && posY === player.positionX) || obst || placedCoin) 
            obst = true
            coins.push(new Coin(posY, posX))
        }
        return coins
    }
    
    /**
     * 
     * @param {CanvasRenderingContext2D} coinCtx 
     * @param {Object} loadedImages 
     */
    initAnimation(coinCtx, loadedImages) {
        this.coinAnimation = window.setInterval(() => {
            coinCtx.clearRect(
                this.positionX * tileWidth, 
                this.positionY * tileWidth,
                tileWidth, tileWidth
            )
            coinCtx.globalAlpha = this.coinOpacity;
            coinCtx.drawImage(
                loadedImages.coins,
                this.currentFrame * tileWidth, 0,
                tileWidth, tileWidth,
                tileWidth * this.positionX, tileWidth * this.positionY,
                tileWidth, tileWidth
            )
            coinCtx.globalAlpha = 1;
            if (this.currentFrame === 5) this.currentFrame = 0
            else this.currentFrame++
        }, 1000 / this.frameRate)
    }

    removeAnimation() { clearInterval(this.coinAnimation) }

    /**
     * init the counter of the coin lifetime
     * 
     * @param {Array[Coin]} coins
     * @param {CanvasRenderingContext2D} coinCtx
     */
    initCoinLifeTime(coins, coinCtx) {
        this.lifeTimeTimer = window.setInterval(() => {
            this.lifeTime--
            this.coinOpacity = (this.lifeTime + 1) / (5 - this.level)
            if (this.lifeTime === -1) {
                this.removeAnimation()
                for (let i = 0; i < coins.length; i++) {
                    if (coins[i].positionX === this.positionX
                        && coins[i].positionY === this.positionY) {
                        coins.splice(i, 1)
                    }
                }
                coinCtx.clearRect(
                    this.positionX * tileWidth, 
                    this.positionY * tileWidth, 
                    tileWidth, tileWidth
                )
                clearInterval(this.lifeTimeTimer)
            }
        }, 3000)
    }

    /**
     * 
     * @param {Player} player 
     */
    consumeCoin(player) {
        player.score += this.points
        console.log('player has consume this coin his score is added by ', this.points)
        console.log('his score is now :', player.score)
        clearInterval(this.lifeTimeTimer)
        this.removeAnimation()
    }
}