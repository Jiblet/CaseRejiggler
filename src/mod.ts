import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

//Pull in config
import * as config from "../config.json";
const logging = config.Settings.Logging;
const JSONItems = config.Items;

class Mod implements IPostDBLoadMod, IPreAkiLoadMod {
    logger: ILogger
    modName: string
    modVersion: string

    constructor() {
        this.modName = "CaseRejiggler"; // Set name and version of the mod so we can log it to console later
        this.modVersion = "4.0";
    }

    // Code added here will load BEFORE the server has started loading
    public postDBLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();
        const items = tables.templates.items;

        //Check we're enabled in config and rejig the cases using the values in config.json
        if (config.Settings.Enabled) {
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ----- Enabled - Begin the rejiggling -----`, "white", "green")
            }

            for (let item in JSONItems) {
                let currentItem = JSONItems[item] //setup a currentItem object to pull params from
                if (items[currentItem.id] == undefined) {
                    this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Item '${item}' with ID ${currentItem.id} is not found in SPT database - please check ID on https://db.sp-tarkov.com/`, "white", "red");
                    if (logging) {
                        this.logger.log(`[${this.modName} : ${this.modVersion}] : -----`); //I know, I know.
                    }
                    continue;
                }

                //DO ALL THE THINGS
                if (logging) {
                    this.logger.log(`[${this.modName} : ${this.modVersion}] : Rejiggling '${item}', ID: ${currentItem.id}`, "green");
                }
                if (currentItem.Enabled) {
                    this.addToItemFilter(items, currentItem.id, currentItem.filterIDs);
                    this.setItemInternalSize(items, currentItem.id, currentItem.H_cells, currentItem.V_cells);
                    this.setItemPrice(tables, currentItem.id, currentItem.Price_Multiplier);
                } else {
                    this.logger.log(`[${this.modName} : ${this.modVersion}] : WARNING : '${item}', ID: ${currentItem.id} is not enabled for rejiggling; skipped.`, "red"); //Warn without checking logging
                }
                //if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Rejiggling of '${item}', ID: ${currentItem.id} completed`, "green");
                //logger.log(`[${this.modName} : ${this.modVersion}] : -----`);
                //}
            }
        } else { //config.json has Settings.Enabled flag set to false so we're out of here.
            this.logger.log(`[${this.modName} : ${this.modVersion}] : ----- Disabled in config.json - Skipping all rejiggling -----`, "red")
            return;
        }

        //Work Complete.
        this.logger.log(`[${this.modName} : ${this.modVersion}] : ----- Rejiggling complete -----`, "white", "green")
    }

    /** ============================= */
    /** ========= Functions ========= */

    setItemInternalSize(items, id, newHorizontal, newVertical) { //TODO Verify if integers in reasonable range (1 - 15? 20?), vomit exceptions //IF were making it smaller we should shout
        //Verify inputs
        if (
            this.checkCellSize(items[id]._props.Grids[0]._props.cellsH, newHorizontal) &&
            this.checkCellSize(items[id]._props.Grids[0]._props.cellsV, newVertical)) {

            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Resized ${id} from: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "blue");
            }
            items[id]._props.Grids[0]._props.cellsH = newHorizontal;
            items[id]._props.Grids[0]._props.cellsV = newVertical;
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "cyan");
            }
        } else {
            this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Skipping resize for ${id}! Turn on logging in config.json for more details.`, "white", "red");
        }
    }

    setItemPrice(tables, id, priceMultiplier) {
        // Verify the multiplier is a number in reasonable range (0.001 - 10).
        if (this.checkPriceMultiplier(priceMultiplier)) {
            const fleaTable = tables.templates.prices;
            const handbook = tables.templates.handbook.Items;
            //This could be more concise, but keeping it longhand lets you log each step to see where you went wrong...
            //Get current prices
            let fleaPrice = fleaTable[id]
            let hbPrice = this.getHandbookPrice(handbook, id)

            //Modify prices using multiplier
            let newFleaPrice = Math.round(fleaPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles
            let newHbPrice = Math.round(hbPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles

            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ${id} flea price: : ${fleaPrice}`, "blue")
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ${id} handbook price : ${hbPrice}`, "blue")
                this.logger.log(`[${this.modName} : ${this.modVersion}] : x ${priceMultiplier} price multiplier, gives:`, "blue")
            }

            //Set new prices
            this.setHandbookPrice(handbook, id, newHbPrice);
            fleaTable[id] = newFleaPrice
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ${id} NEW flea price : ${newFleaPrice}`, "cyan")
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ${id} NEW handbook price : ${newHbPrice}`, "cyan")
            }
        } else {
            this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Skipping Price Multiplier for ${id}! Turn on logging in config.json for more details.`, "white", "red");
        }
    }

    addToItemFilter(items, id, additionalItems) {
        if (additionalItems === "") { //are there any additional items?
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : No additional filter items`, "magenta");
                return; //nothing to do , so back we go.
            }
        } else {
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Adding ${additionalItems} to filter of ${id}`, "magenta")
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Was ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "magenta")
            }
            //validate the items in the additional items list against SPT items DB
            for (const itemKey in additionalItems) {
                if (items[additionalItems[itemKey]] == undefined) {
                    this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Additional Filter Object with ID '${additionalItems[itemKey]}' is not found in SPT database; skipped this one - please check ID on https://db.sp-tarkov.com/`, "white", "red");
                    continue; //log the error then skip this undefined item
                }
                items[id]
                    ._props
                    .Grids[0]
                    ._props
                    .filters[0]
                    .Filter
                    .push(additionalItems[itemKey]);
            }
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : Now ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "magenta")
            }
        }
    }
    //Helper functions for Handbook pricing
    getHandbookPrice(handbook, id) {
        for (let i in handbook) {
            if (handbook[i].Id === id) {
                return handbook[i].Price
            }
        }
    }

    setHandbookPrice(handbook, id, newPrice) {
        for (let i in handbook) {
            if (handbook[i].Id === id) {
                handbook[i].Price = newPrice
            }
        }
    }

    checkCellSize(oldVal, newVal) {
        if (Number.isInteger(newVal)) {
            if ((newVal >= 1) && (newVal <= 20)) {
                if (newVal >= oldVal) {
                    return true
                } else {
                    if (logging) {
                        this.logger.log(`[${this.modName} : ${this.modVersion}] : WARNING: New Cell Size value of ${newVal} is equal to or larger than old Value of ${oldVal}, be careful or be poor!`, "red");
                    }
                    return true
                }
            } else {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Cell Size value: ${newVal} is out of range 1-20, preventing this from getting silly. Skipped.`, "white", "red");
                return false
            }
        } else {
            this.logger.log(`[${this.modName} : ${this.modVersion}] : ERROR : Cell Size value: ${newVal} is NOT a number; skipping.`, "white", "red");
            return false
        }
    }

    checkPriceMultiplier(val) {
        //Verify the multiplier is a number in reasonable range (0.001 - 10).
        if (Number.isFinite(val)) {
            if ((val >= 0.001) && (val <= 10)) {
                return true
            } else {
                if (logging) {
                    this.logger.log(`[${this.modName} : ${this.modVersion}] : WARNING: Price Multiplier value: ${val} is out of range 0.001-10, preventing this from getting silly. Skipped.`, "red");
                }
                return false
            }
        } else {
            if (logging) {
                this.logger.log(`[${this.modName} : ${this.modVersion}] : WARNING: Price Multiplier value: ${val} is NOT a number; skipping.`, "red");
            }
            return false
        }
    }
}

module.exports = { mod: new Mod() }