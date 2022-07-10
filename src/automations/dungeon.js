// global variable
let bossTyle

// help function
function findBossTyle() {
    for (let x = 0; x < DungeonRunner.map.size; x++) {
        for (let y = 0; y < DungeonRunner.map.size; y++) {
            if (DungeonRunner.map.board()[y][x].type() == GameConstants.DungeonTile.boss) {
                bossTyle = new Point(x, y)
                console.log(bossTyle)
            }
        }
    }
}

// automator
export function autoDungeon() {
    if (!player.town().dungeon) {
        // Secure return for not bug the game if dungeon dosent exist
        return
    }
    if (App.game.gameState === GameConstants.GameState.dungeon) {
        // actions on dungeon
        if (bossTyle.y < DungeonRunner.map.playerPosition().y) {
            DungeonRunner.map.moveUp()
        } else if (bossTyle.x < DungeonRunner.map.playerPosition().x) {
            DungeonRunner.map.moveLeft()
        } else if (bossTyle.x > DungeonRunner.map.playerPosition().x) {
            DungeonRunner.map.moveRight()
        } else {
            DungeonRunner.startBossFight()
        }
        // default action for open chest on the way 
        DungeonRunner.openChest()
    } else if (App.game.gameState === GameConstants.GameState.town) {
        // reset dungeon when finished
        DungeonRunner.initializeDungeon(player.town().dungeon)
        findBossTyle()
    }
}
