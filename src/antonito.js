
export function templateNode(html) {
    const template = document.createElement('template');

    html = html.trim();
    template.innerHTML = html;

    return template.content.firstChild;
}

const awesomeBox = templateNode(`
    <div
        class="card mb-3"
        style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
        "
    ></div>
`);

const middleColumn = document.getElementById('middle-column');
middleColumn.insertBefore(awesomeBox, middleColumn.firstChild);

const intervals = {};

function toggleScript(callable) {
    const button = document.getElementById(callable.name);

    if (intervals[callable.name]) {
        clearInterval(intervals[callable.name]);
        intervals[callable.name] = undefined;
        button.classList.remove('btn-primary');
    } else {
        intervals[callable.name] = setInterval(callable);
        button.classList.add('btn-primary');
    }
}

function appendToggleButton(label, callable) {
    const button = templateNode(`
        <button
            id="${callable.name}"
            class="btn"
            onclick="toggleScript(${callable.name})"
        >
            ${label}
        </button>
    `);
    awesomeBox.appendChild(button);
}

let currentMine = null;
let mineXIndex = 0;
let mineYIndex = 0;
function autoMine() {
    if (App.game.underground.energy < Underground.CHISEL_ENERGY) {
        return;
    }

    if (
        currentMine !== Mine.rewardGrid ||
        Mine.rewardGrid[mineYIndex] === undefined
    ) {
        currentMine = Mine.rewardGrid;
        mineXIndex = 0;
        mineYIndex = 0;
        return;
    }

    if (Mine.rewardGrid[mineYIndex][mineXIndex] === undefined) {
        mineXIndex = 0;
        mineYIndex++;
        return;
    }

    if (Mine.rewardGrid[mineYIndex][mineXIndex] !== 0) {
        Mine.chisel(mineYIndex, mineXIndex)
        currentMine = Mine.rewardGrid;
    }

    mineXIndex++;
}
appendToggleButton('Auto Mine', autoMine);

function autoFarm() {
    App.game.farming.harvestAll();
    App.game.farming.plantAll(FarmController.selectedBerry());
}
appendToggleButton('Auto Farm', autoFarm);

function clickEnemies() {
    const enemy = document.querySelector('.enemy');

    if (enemy) {
        enemy.click();
    }
}
appendToggleButton('Click Enemies', clickEnemies);

function clickChests() {
    const chest = document.querySelector('.chest-button');

    if (chest) {
        chest.click();
    }
}
appendToggleButton('Click Chests', clickChests);

const minCash = 10_000_000
const shoppingList = {
    'Lucky_incense': 1_000,
    'xAttack': 1_000,
    'xClick': 1_000,
    'Lucky_egg': 1_000,
    'Token_collector': 1_000,
    'Item_magnet': 1_000,
    'Pokeball': 2_000,
    'Greatball': 2_000,
    'Ultraball': 2_000,
    'SmallRestore': 100,
};
function personalShopper() {
    if (App.game.wallet.currencies[GameConstants.Currency.money]() < minCash) {
        return;
    }

    for (const [item, amount] of Object.entries(shoppingList)) {
        if ((ItemList[item].price() - ItemList[item].basePrice) > 0) {
            continue;
        }

        let mustBuy = false;

        if (item.endsWith('ball')) {
            let pokeballItem;

            switch (item) {
                case 'Pokeball':
                    pokeballItem = 0;
                    break;
                case 'Greatball':
                    pokeballItem = 1;
                    break;
                case 'Ultraball':
                    pokeballItem = 2;
                    break;
            }

            mustBuy = App.game.pokeballs.pokeballs[pokeballItem].quantity() < amount;
        } else {
            mustBuy = player.itemList[item]() < amount;
        }

        if (mustBuy) {
            ItemList[item].buy(1);
        }
    }
}
appendToggleButton('Personal Shopper', personalShopper);

// DungeonRunner.map.size
const path = [
    'Start', 'Wait', 'ArrowRight', 'Wait', 'ArrowRight', 'Wait',
    'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowDown', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowUp', 'Wait', 'ArrowLeft', 'Wait', 'ArrowLeft', 'Wait',
    'GoToBoss', 'Wait', 'StartBoss',
];
let dungeonStep = 0;
function exploreDungeon() {
    let start = document.querySelector('#townView .btn-success');
    if (start && !start.textContent.includes('Start')) {
        start = undefined;
    }

    if (path[dungeonStep] === 'Start') {
        if (start) {
            start.click();
            dungeonStep++;
        }

        return;
    }

    if (!path[dungeonStep]) {
        dungeonStep = 0;
        return;
    }

    if (path[dungeonStep] === 'Wait') {
        if (document.querySelector('.no-gutters.clickable')
            ?.querySelectorAll('.enemy, .chest-button, .catchChance')
            .length === 0
        ) {
            dungeonStep++;
        }

        return;
    }

    if (path[dungeonStep] === 'GoToBoss') {
        document.querySelector('.tile-boss')?.click();
        dungeonStep++;
        return;
    }

    if (path[dungeonStep] === 'StartBoss') {
        const bossFightButton = document.querySelector('.btn-danger.dungeon-button');

        if (!bossFightButton) {
            return;
        }

        bossFightButton.click();
        dungeonStep++;
        return;
    }

    document.dispatchEvent(new KeyboardEvent(
        'keydown',
        { key: path[dungeonStep] }
    ));

    dungeonStep++;
}
appendToggleButton('Explore Dungeon', exploreDungeon);

function autoGym(index) {
    const gymButton = document.querySelectorAll('#townView .btn-success')[index];

    if (gymButton) {
        gymButton.click();
    }
}
function auto1stGym() { autoGym(0); }
function auto2ndGym() { autoGym(1); }
function auto3rdGym() { autoGym(2); }
function auto4thGym() { autoGym(3); }
function auto5thGym() { autoGym(4); }
appendToggleButton('Auto 1st Gym', auto1stGym);
appendToggleButton('Auto 2nd Gym', auto2ndGym);
appendToggleButton('Auto 3rd Gym', auto3rdGym);
appendToggleButton('Auto 4th Gym', auto4thGym);
appendToggleButton('Auto 5th Gym', auto5thGym);