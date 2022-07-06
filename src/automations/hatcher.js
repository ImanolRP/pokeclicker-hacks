function isBreedable(caughtPokemon) {
    return !caughtPokemon.breeding && caughtPokemon.level == 100
}

function isMatchingName(caughtPokemon) {
    return BreedingFilters.search.value().test(caughtPokemon.name)
}

function isOnCategory(caughtPokemon) {
    if (BreedingFilters.category.value() == -1) {
        // -1 eq All
        return true
    } else {
        return BreedingFilters.category.value() == caughtPokemon.category
    }
}

function isOnRegion(caughtPokemon) {
    if (BreedingFilters.region.value() == -2) {
        // -2 eq All
        return true
    } else {
        return BreedingFilters.region.value() == PokemonHelper.calcNativeRegion(caughtPokemon.name)
    }
}

function isOnShiny(caughtPokemon) {
    if (BreedingFilters.shinyStatus.value() == -1) {
        // -1 eq All
        return true
    } else {
        return BreedingFilters.shinyStatus.value() == +caughtPokemon.shiny
    }
}

function isOnType(caughtPokemon, typeSelector) {
    if (BreedingFilters[typeSelector].value() == -2) {
        // -2 eq All
        return true
    } else if (BreedingFilters.type1.value() == -1 && BreedingFilters.type2.value() == -1) {
        // if both are on none dont return anything
        return false
    } else if (BreedingFilters[typeSelector].value() == -1) {
        // -1 eq None, only returns pure type pokemon
        return true
    } else {
        const types = pokemonMap[caughtPokemon.name].type
        if (types.length < 2) {
            return BreedingFilters.isPureType(pokemonMap[caughtPokemon.name], BreedingFilters[typeSelector].value())
        } else {
            const type = (typeSelector == 'type1') ? types[0] : types[1]
            return type == BreedingFilters[typeSelector].value()
        }
    }
}

export function autoHatcher() {
    // Attempt to hatch each egg. If the egg is at 100% it will succeed
    [0, 1, 2, 3].forEach((index) => App.game.breeding.hatchPokemonEgg(index));

    // Now add eggs to empty slots if we can
    while (App.game.breeding.canBreedPokemon()) {
        // Filter the sorted hatchery list of Pokemon based on the parameters set in the Hatchery screen
        PartyController.hatcherySortedList = [...App.game.party.caughtPokemon]
        const filteredEggList = PartyController.hatcherySortedList
            .sort(PartyController
                .compareBy(Settings.getSetting('hatcherySort').observableValue(), Settings.getSetting('hatcherySortDirection').observableValue()))
            .filter((caughtPokemon) => isBreedable(caughtPokemon))
            .filter((caughtPokemon) => isMatchingName(caughtPokemon))
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
