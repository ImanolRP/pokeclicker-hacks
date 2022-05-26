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

export function autoHatcher() {
    // Attempt to hatch each egg. If the egg is at 100% it will succeed
    [0, 1, 2, 3].forEach((index) => App.game.breeding.hatchPokemonEgg(index));

    // Now add eggs to empty slots if we can
    while (App.game.breeding.canBreedPokemon()) {
        // Filter the sorted hatchery list of Pokemon based on the parameters set in the Hatchery screen
        const filteredEggList = PartyController.getHatcherySortedList()
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
