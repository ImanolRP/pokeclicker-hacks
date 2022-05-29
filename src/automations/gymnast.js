export function autoGymnast() {
    if (App.game.gameState === GameConstants.GameState.town) {
        GymRunner.startGym(player.town().content[0], false)
    }
}