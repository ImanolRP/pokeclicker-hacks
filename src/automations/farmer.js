export function autoFarmer() {
    App.game.farming.harvestAll()
    App.game.farming.plantAll(FarmController.selectedBerry())
}