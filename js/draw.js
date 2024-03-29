import { mapArray, scoreBoardArray, tileWidth, height } from './data.js'
import { Player } from './player.js'
import { Coin } from './coin.js'

/**
 * 
 * @param {function} callback 
 */
export const loadImages = (callback) => {
    let loadedImages = {
        tile: {},
        player: [],
        coins: []
    }

    let tile = new Image()
    tile.src = 'img/ground_1x1.png'
    tile.onload = () => {
        loadedImages.tile = tile
        for (let i = 0; i < 4; i++) {
            let coin = new Image()
            coin.src = 'img/coins/coin_' + i + '.png'
            coin.onload = () => {
                loadedImages.coins.push(coin)
                if (loadedImages.coins.length === 4) {
                    for (let i = 0; i < 4; i++) {
                        let player = new Image() 
                        player.src = 'img/player/player_' + i + '.png'
                        player.onload = () => {
                            loadedImages.player.push(player)
                            if (loadedImages.player.length === 4)
                                return callback(loadedImages)
                        }
                    }
                }
            }
        }
    }
}

/**
 * 
 * @param {Object} contextes 
 * @param {Object} loadedImages 
 * @param {Player} player 
 * @param {Array} coins 
 */
export const draw = (contextes, loadedImages, player, coins) => {
    drawMap(contextes, loadedImages)
    drawCoins(contextes, loadedImages, coins)
    drawPlayer(contextes, loadedImages, player)
    drawScoreboard(contextes.mapCtx, player, loadedImages)
}

/**
 * 
 * @param {Object} contextes 
 * @param {Object} loadedImages 
 */
const drawMap = (contextes, loadedImages) => {
    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] !== 0) {
                contextes.mapCtx.drawImage(
                    loadedImages.tile,
                    tileWidth * (mapArray[i][j] - 1), 0, // first tile 
                    tileWidth, tileWidth, // what to take from the loaded image
                    tileWidth * j, tileWidth * i, // where to put it
                    tileWidth, tileWidth // how much pixals we're gonna put it
                )
            }
        }
    }
}

/**
 * 
 * @param {Object} contextes 
 * @param {Object} loadedImages 
 * @param {Player} player 
 */
export const drawPlayer = (contextes, loadedImages, player) => {
    contextes.playerCtx.drawImage(
        loadedImages.player[player.currentPosition],
        player.positionX * tileWidth, 
        player.positionY * tileWidth,
        tileWidth, tileWidth)
}

/**
 * 
 * @param {Object} contextes 
 * @param {Object} loadedImages 
 * @param {Coin} coins 
 */
const drawCoins = (contextes, loadedImages, coins) => {
    for (let i = 0; i < coins.length; i++) {
        contextes.coinCtx.drawImage(
            loadedImages.coins[coins[i].level - 1],
            0, 0, // first tile 
            tileWidth, tileWidth, // what to take from the loaded image
            tileWidth * coins[i].positionX, tileWidth * coins[i].positionY,  // where to put it
            tileWidth, tileWidth
        )
    }
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Player} player 
 * @param {Object} loadedImages
 * @param {Number} totalCoinsToBeGenerated 
 * @param {Number} point
 */
export const drawScoreboard = (ctx, player, loadedImages, totalCoinsToBeGenerated = -1, points = 0) => {
    ctx.clearRect(0, 576, 768, 200)
    for (let i = 0; i < scoreBoardArray.length; i++) {
        for (let j = 0; j < scoreBoardArray[i].length; j++) {
            if (scoreBoardArray[i][j] !== 0) {
                ctx.drawImage(
                    loadedImages.tile,
                    tileWidth * (scoreBoardArray[i][j] - 1), 0, // first tile 
                    tileWidth, tileWidth, // what to take from the loaded image
                    tileWidth * j, tileWidth * i + height, // where to put it
                    tileWidth, tileWidth // how much pixals we're gonna put it
                )
            }
        }
    }
    ctx.fillText('P l a y e r  S c o r e    :   ' + player.score, 560, 676)

    if (points > 0) {
        ctx.clearRect(660, 680, 150, 50)

        ctx.save()
        ctx.textAlign = 'left'
        ctx.fillStyle = '#0b0'
        ctx.font = '20px Roboto thin'
        ctx.fillText('+' + points, 700, 706)
        ctx.restore()

        setTimeout(() => ctx.clearRect(620, 680, 150, 50), 500)
    }

    ctx.clearRect(100, 620, 200, 100)
    ctx.save()
    ctx.font = '16px Roboto thin'
    ctx.fillStyle = '#aa0'
    ctx.fillText('Another wave is comming', 200, 672)
    ctx.restore()
}