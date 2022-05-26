export function autoDungeon() {
    if (App.game.gameState === GameConstants.GameState.dungeon) {
        const tempDungeonGrid = DungeonRunner.map.board()
        for (const x = 0; x < DungeonRunner.map.size; x++) {
            for (const y = 0; y < DungeonRunner.map.size; y++) {
                if (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.chest) {
                    DungeonRunner.openChest();
                } else if (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.boss && !DungeonRunner.fightingBoss()) {
                    DungeonRunner.startBossFight();
                } else {
                    DungeonRunner.map.moveToCoordinates(x, y)
                }
                if (tempDungeonGrid !== DungeonRunner.map.board()) {
                    break
                }
            }
            if (tempDungeonGrid !== DungeonRunner.map.board()) {
                break
            }
        }
    } else if (App.game.gameState === GameConstants.GameState.town) {
        DungeonRunner.initializeDungeon(player.town().dungeon)
    }
}