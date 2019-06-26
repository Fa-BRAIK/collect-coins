import { Player } from './player.js'
import { Coin } from './coin.js'
import { loadImages, draw, drawPlayer } from './draw.js'
import { tileWidth } from './data.js'

let mouvement = false

let contextes = {
    mapCtx: document.querySelector('#main_canvas').getContext('2d'),
    playerCtx: document.querySelector('#main_canvas').getContext('2d'),
    coinCtx: document.querySelector('#main_canvas').getContext('2d')
}

loadImages(loadedImages => {
    let player = new Player(2, 8)
    const coins = Coin.generateCoins(player, 5)
    draw(contextes, loadedImages, player, coins)
    
    for (let i = 0; i < coins.length; i++) 
        coins[i].initAnimation(contextes.coinCtx, loadedImages)

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
})