function loadAll() {
    const nodeScriptsPanel = document.createElement('div')
    nodeScriptsPanel.classList.add('card')
    nodeScriptsPanel.classList.add('mb-3')
    nodeScriptsPanel.innerHTML = ''
        + '<div id="scriptClickAutomation" class="card-header p-0" data-toggle="collapse" href="#scriptsPanelBody">'
        + '     <span>Scripts panel</span>'
        + '</div>'
        + '<div id="scriptsPanelBody" class="card-body p-0">'
        + '</div>'
    nodeScriptsPanel.setAttribute('id', 'nodeScriptsPanel')
    const middleColumn = document.getElementById('middle-column')
    middleColumn.insertBefore(nodeScriptsPanel, middleColumn.firstChild)

    loadAutoFarm()
    loadAutoClick()
    loadAutoHatch()
    loadAutoMine()
    loadAutoDungeon()
    loadAutoPersonalShopper()
}

/**
 * Utils
 */
function addButton(id, textDefault, toggle) {
    const htmlBtn = ''
        + '<button id="' + id + '" type="button" class="btn btn-danger">'
        + ' ' + textDefault
        + '</button>';
    var buttonContainer = document.createElement("span")
    buttonContainer.innerHTML = htmlBtn.trim();
    buttonContainer.firstChild.addEventListener('click', toggle, false)
    document.getElementById('scriptsPanelBody').appendChild(buttonContainer)
}

function isBreedable(caughtPokemon) {
    return !caughtPokemon.breeding && caughtPokemon.level == 100
}

function isOnCategory(caughtPokemon) {
    if (BreedingController.filter.category() == -1) {
        // -1 eq All
        return true
    } else {
        return BreedingController.filter.category() == caughtPokemon.category
    }
}

function isOnRegion(caughtPokemon) {
    if (BreedingController.filter.region() == -2) {
        // -2 eq All
        return true
    } else {
        return BreedingController.filter.region() == PokemonHelper.calcNativeRegion(caughtPokemon.name)
    }
}

function isOnShiny(caughtPokemon) {
    if (BreedingController.filter.shinyStatus() == -1) {
        // -1 eq All
        return true
    } else {
        return BreedingController.filter.shinyStatus() == +caughtPokemon.shiny
    }
}

function isOnType(caughtPokemon, typeSelector) {
    if (BreedingController.filter[typeSelector]() == -2) {
        // -2 eq All
        return true
    } else if (BreedingController.filter.type1() == -1 && BreedingController.filter.type2() == -1) {
        // if both are on none dont return anything
        return false
    } else if (BreedingController.filter[typeSelector]() == -1) {
        // -1 eq None, only returns pure type pokemon
        return true
    } else {

        const types = pokemonMap[caughtPokemon.name].type
        if (types.length < 2) {
            return BreedingController.isPureType(pokemonMap[caughtPokemon.name], BreedingController.filter[typeSelector]())
        } else {
            const type = (typeSelector == 'type1') ? types[0] : types[1]
            return type == BreedingController.filter[typeSelector]()
        }
    }
}

/**
 * Auto Farm Hack
 */
function loadAutoFarm() {
    var autoFarmEnabled = false
    function ToggleFarmAutomation() {
        autoFarmEnabled = !autoFarmEnabled
        const button = document.getElementById('btnToggleAutoFarm')
        if (autoFarmEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'Farm Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'Farm Disabled'
        }
    }

    function loopFarm() {
        var farmLoop = setInterval(function () {
            if (autoFarmEnabled) {
                App.game.farming.harvestAll()
                App.game.farming.plantAll(FarmController.selectedBerry())
            }
        }, GameConstants.TICK_TIME)
    }
    loopFarm()
    addButton('btnToggleAutoFarm', 'Farm Disabled', ToggleFarmAutomation)
}

/**
 * Auto Click Hack
 */
function loadAutoClick() {
    var autoClickEnabled = false
    function ToggleClickAutomation() {
        autoClickEnabled = !autoClickEnabled
        const button = document.getElementById('btnToggleAutoClick')
        if (autoClickEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'Click Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'Click Disabled'
        }
    }

    function loopClick() {
        var clickLoop = setInterval(function () {
            if (autoClickEnabled) {
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
        }, GameConstants.TICK_TIME);
    }
    loopClick()
    addButton('btnToggleAutoClick', 'Click Disabled', ToggleClickAutomation)
}

/**
 * Auto Hatch Hack
 */
function loadAutoHatch() {
    var autoHatchEnabled = false
    function ToggleHatchAutomation() {
        autoHatchEnabled = !autoHatchEnabled
        const button = document.getElementById('btnToggleAutoHatch')
        if (autoHatchEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'Hatch Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'Hatch Disabled'
        }
    }

    function loopHatch() {
        var hatchLoop = setInterval(function () {
            if (autoHatchEnabled) {
                // Attempt to hatch each egg. If the egg is at 100% it will succeed
                [0, 1, 2, 3].forEach((index) => App.game.breeding.hatchPokemonEgg(index));

                // Now add eggs to empty slots if we can
                while (App.game.breeding.canBreedPokemon()) {
                    // Filter the sorted hatchery list of Pokemon based on the parameters set in the Hatchery screen
                    let filteredEggList = PartyController.getHatcherySortedList()
                        .filter((caughtPokemon) => isBreedable(caughtPokemon))
                        .filter((caughtPokemon) => isOnCategory(caughtPokemon))
                        .filter((caughtPokemon) => isOnRegion(caughtPokemon))
                        .filter((caughtPokemon) => isOnShiny(caughtPokemon))
                        .filter((caughtPokemon) => isOnType(caughtPokemon, "type1"))
                        .filter((caughtPokemon) => isOnType(caughtPokemon, "type2"))

                    if (App.game.breeding.canBreedPokemon() && filteredEggList.length > 0) {
                        App.game.breeding.addPokemonToHatchery(filteredEggList[0]);
                        console.log("Added " + filteredEggList[0].name + " to the Hatchery!");
                    } else {
                        return;
                    }
                }
            }
        }, GameConstants.TICK_TIME)
    }
    loopHatch()
    addButton('btnToggleAutoHatch', 'Hatch Disabled', ToggleHatchAutomation)
}

function loadAutoMine() {
    var autoMineEnabled = false
    function ToogleMineAutomation() {
        autoMineEnabled = !autoMineEnabled
        const button = document.getElementById('btnToggleAutoMine')
        if (autoMineEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'Mine Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'Mine Disabled'
        }
    }

    function loopMine() {
        var mineLoop = setInterval(function () {
            if (autoMineEnabled) {
                const tempMineGrid = Mine.rewardGrid
                for (let x = 0; x < Underground.sizeX; x++) {
                    for (let y = 0; y < Underground.sizeY; y++) {
                        if (Mine.rewardGrid[y][x] !== 0) {
                            Mine.chisel(y, x)
                            if (tempMineGrid !== Mine.rewardGrid) {
                                break
                            }
                        }
                    }
                    if (tempMineGrid !== Mine.rewardGrid) {
                        break
                    }
                }
            }
        }, GameConstants.TICK_TIME)
    }
    loopMine()
    addButton('btnToggleAutoMine', 'Mine Disabled', ToogleMineAutomation)
}

function loadAutoDungeon() {
    var autoDungeonEnabled = false
    function ToogleDungeonAutomation() {
        autoDungeonEnabled = !autoDungeonEnabled
        const button = document.getElementById('btnToggleAutoDungeon')
        if (autoDungeonEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'Dungeon Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'Dungeon Disabled'
        }
    }

    function loopDungeon() {
        var dungeonLoop = setInterval(function () {
            if (autoDungeonEnabled) {
                if (App.game.gameState === GameConstants.GameState.dungeon) {
                    const tempDungeonGrid = DungeonRunner.map.board()
                    for (let x = 0; x < DungeonRunner.map.size; x++) {
                        for (let y = 0; y < DungeonRunner.map.size; y++) {
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
        }, GameConstants.TICK_TIME)
    }
    loopDungeon()
    addButton('btnToggleAutoDungeon', 'Dungeon Disabled', ToogleDungeonAutomation)
}

/**
 * Auto PersonalShopper Hack
 */
function loadAutoPersonalShopper() {
    var autoPersonalShopperEnabled = false
    function TogglePersonalShopperAutomation() {
        autoPersonalShopperEnabled = !autoPersonalShopperEnabled
        const button = document.getElementById('btnToggleAutoPersonalShopper')
        if (autoPersonalShopperEnabled) {
            button.classList.remove('btn-danger')
            button.classList.add('btn-success')
            button.innerText = 'PersonalShopper Enabled'
        } else {
            button.classList.remove('btn-success')
            button.classList.add('btn-danger')
            button.innerText = 'PersonalShopper Disabled'
        }
    }

    const minCash = 10000000
    const shoppingList = new Map([
        ['Lucky_incense', 500],
        ['xAttack', 500],
        ['xClick', 500],
        ['Pokeball', [0, 1000]],
        ['Greatball', [1, 500]],
        ['Ultraball', [2, 500]],
        ['SmallRestore', 999999999]
    ]);
    function loopPersonalShopper() {
        var personalShopperLoop = setInterval(function () {
            if (!autoPersonalShopperEnabled) {
                return
            }
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
        }, GameConstants.TICK_TIME)
    }
    loopPersonalShopper()
    addButton('btnToggleAutoPersonalShopper', 'PersonalShopper Disabled', TogglePersonalShopperAutomation)
}

loadAll();
