import { scriptsPanel, appendToggleButton } from '~/core/builder'
import { autoHatcher } from '~/automations/hatcher'
import { autoFarmer } from '~/automations/farmer'
import { autoMiner } from '~/automations/miner'
import { autoClicker } from '~/automations/clicker'
import { autoDungeon } from '~/automations/dungeon'
import { autoShopper } from '~/automations/shopper'
import { autoGymnast } from '~/automations/gymnast'
import { autoCoach } from '~/automations/coach'

const middleColumn = document.getElementById('middle-column');
middleColumn.insertBefore(scriptsPanel, middleColumn.firstChild);

appendToggleButton('Hatcher', autoHatcher);
appendToggleButton('Farmer', autoFarmer);
appendToggleButton('Miner', autoMiner);
appendToggleButton('Clicker', autoClicker);
appendToggleButton('Shopper', autoShopper);
appendToggleButton('Coach', autoCoach);
appendToggleButton('Gymnast', autoGymnast);
appendToggleButton('Dungeon', autoDungeon);
