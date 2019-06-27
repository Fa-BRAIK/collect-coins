import { Player } from './player.js'
import { Coin } from './coin.js'
import { loadImages, draw, drawPlayer, drawScoreboard } from './draw.js'
import { tileWidth } from './data.js'

let mouvement = false

let contextes = {
    mapCtx: document.querySelector('#main_canvas').getContext('2d'),
    playerCtx: document.querySelector('#main_canvas').getContext('2d'),
    coinCtx: document.querySelector('#main_canvas').getContext('2d')
}

//setting up text styling for the canvas
contextes.mapCtx.textAlign = 'center'
contextes.mapCtx.fillStyle = '#fff'
contextes.mapCtx.font = '30px Roboto thin';

loadImages(loadedImages => {
    let totalCoinsToBeGenerated = Math.floor(Math.random() * 11) + 20
    let player = new Player(2, 8)
    let coins = Coin.generateCoins(player, Math.floor(Math.random() * 6) + 5)
    totalCoinsToBeGenerated -= coins.length
    draw(contextes, loadedImages, player, coins)
    
    for (let i = 0; i < coins.length; i++) {
        coins[i].initAnimation(contextes.coinCtx, loadedImages)
        coins[i].initCoinLifeTime(coins, contextes.coinCtx)
    }

    window.addEventListener('keydown', e => {
        try {
            if (!mouvement) {
                let oldPosX = player.positionX, oldPosY = player.positionY, moved = false
                mouvement = true
                switch (e.keyCode) {
                    case 37: // left side
                        moved = player.move('left') 
                    break
                    case 39: // right side
                        moved = player.move('right') 
                    break
                    case 38:  // top side
                        moved = player.move('top') 
                    break
                    case 40: // bottom side
                        moved = player.move('bottom') 
                    break
                }
                if (moved) {
                    let coin = player.isThereACoin(coins)
                    if (coin !== undefined) {
                        coin.consumeCoin(player)

                        for (let i = 0; i < coins.length; i++) {
                            if (coins[i].positionX === coin.positionX
                                && coins[i].positionY === coin.positionY) {
                                coins.splice(i, 1)
                            }
                        }

                        contextes.playerCtx.clearRect(
                            player.positionX * tileWidth, 
                            player.positionY * tileWidth, 
                            tileWidth, tileWidth
                        )

                        drawScoreboard(
                            contextes.mapCtx, 
                            player, 
                            loadedImages, 
                            totalCoinsToBeGenerated,
                            coin.points
                        )
                    }

                    contextes.playerCtx.clearRect(
                        oldPosX * tileWidth, 
                        oldPosY * tileWidth, 
                        tileWidth, tileWidth
                    )

                    drawPlayer(contextes, loadedImages, player)
                }
                
                mouvement = false
            }
        } catch (e) {console.log(e)}
    })

    let coinsCounter = window.setInterval(() => {
        if (coins.length === 0) {
            if (totalCoinsToBeGenerated > 0) {
                coins = regerateCoins(player, loadedImages)
                totalCoinsToBeGenerated -= coins.length
            } else {
                clearInterval(coinsCounter)
                contextes.mapCtx.clearRect(100, 620, 200, 100)
                contextes.mapCtx.save()
                contextes.mapCtx.font = '16px Roboto thin'
                contextes.mapCtx.fillStyle = '#b00'
                contextes.mapCtx.fillText('Game Over', 200, 672)
                contextes.mapCtx.restore()
            } 
        }
    }, 1000)
})

/**
 * 
 * @param {Player} player 
 * @returns {Array[Coin]}
 */
const regerateCoins = (player, loadedImages) => {
    let coins =  Coin.generateCoins(player, Math.floor(Math.random() * 6) + 5)

    for (let i = 0; i < coins.length; i++) {
        coins[i].initAnimation(contextes.coinCtx, loadedImages)
        coins[i].initCoinLifeTime(coins, contextes.coinCtx)
    }

    return coins
}