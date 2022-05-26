export function autoShopper() {
    const minCash = 10000000
    const shoppingList = new Map([
        ['Lucky_incense', 500],
        ['xAttack', 500],
        ['xClick', 500],
        ['Lucky_egg', 500],
        ['Token_collector', 500],
        ['Item_magnet', 500],
        ['Pokeball', [0, 1000]],
        ['Greatball', [1, 500]],
        ['Ultraball', [2, 500]],
        ['SmallRestore', Infinity]
    ]);
    const actualMoney = App.game.wallet.currencies[GameConstants.Currency.money]()
    if (actualMoney < minCash) {
        return
    }
    for (const [key, value] of shoppingList.entries()) {
        const priceIncrement = ItemList[key].price() - ItemList[key].basePrice
        if ((priceIncrement > 0)) {
            return
        }
        const isPokeball = key.endsWith('ball')
        const isBuyItem = !isPokeball && player.itemList[key]() < value
        const isBuyPokeball = isPokeball && App.game.pokeballs.pokeballs[value[0]].quantity() < value[1]
        if (isBuyItem || isBuyPokeball) {
            ItemList[key].buy(1)
            console.log('1 ' + ItemList[key].name + ' bought!')
            return
        }
    }
}