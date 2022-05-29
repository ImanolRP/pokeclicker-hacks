export function autoCoach() {
    // Drink energy potions
    if (App.game.underground.energy <= 50 && player._itemList['SmallRestore']() > 100) {
        ItemList['SmallRestore'].use()
    }
}