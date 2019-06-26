import { mapArray, tileWidth } from './data.js'
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
        coins: {}
    }

    let tile = new Image()
    tile.src = 'img/ground_1x1.png'
    tile.onload = () => {
        loadedImages.tile = tile
        let coins = new Image()
        coins.src = 'img/coin.png'
        coins.onload = () => {
            loadedImages.coins = coins
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
}

/**
 * 
 * @param {Object} contextes 
 * @param {Object} loadedImages 
 */
const drawMap = (contextes, loadedImages) => {
    for (let i = 0; i < mapArray.length; i++) {
        for (let j = 0; j < mapArray[i].length; j++) {
            switch (mapArray[i][j]) {
                case 1:
                    contextes.mapCtx.drawImage(
                        loadedImages.tile,
                        0, 0, // first tile 
                        tileWidth, tileWidth, // what to take from the loaded image
                        tileWidth * j, tileWidth * i, // where to put it
                        tileWidth, tileWidth // how much pixals we're gonna put it
                    )
                break
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
        loadedImages.coins,
        0, 0, // first tile 
        tileWidth, tileWidth, // what to take from the loaded image
        tileWidth * coins[i].positionX, tileWidth * coins[i].positionY,  // where to put it
        tileWidth, tileWidth
    )
    }
}