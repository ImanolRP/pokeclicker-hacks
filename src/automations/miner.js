export function autoMiner() {
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