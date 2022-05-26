export function autoClicker() {
    // Click while in a normal battle
    if (App.game.gameState == GameConstants.GameState.fighting) {
        Battle.clickAttack();
    }
    // Click while in a gym battle
    if (App.game.gameState === GameConstants.GameState.gym) {
        GymBattle.clickAttack();
    }
    // Click while in a dungeon - will also interact with non-battle tiles (e.g. chests)
    if (App.game.gameState === GameConstants.GameState.dungeon) {
        if (DungeonRunner.fighting() && !DungeonBattle.catching()) {
            DungeonBattle.clickAttack();
        } else if (
            DungeonRunner.map.currentTile().type() ===
            GameConstants.DungeonTile.chest
        ) {
            DungeonRunner.openChest();
        } else if (
            DungeonRunner.map.currentTile().type() ===
            GameConstants.DungeonTile.boss &&
            !DungeonRunner.fightingBoss()
        ) {
            DungeonRunner.startBossFight();
        }
    }
    // Click while in Safari battles
    if (Safari.inBattle()) {
        BattleFrontierBattle.clickAttack();
    }
}