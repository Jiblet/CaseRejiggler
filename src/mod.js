"use strict";
const config = require("../config.json");
const mod = require("../package.json");

const modName = mod.name;
const version = mod.version;
const logging = config.Settings.Logging;

const JSONItems = config.Items;
const database = DatabaseServer.tables;
const items = database.templates.items;
const fleaTable = database.templates.prices;
const handbook = database.templates.handbook.Items;


class Mod {
  constructor() {
    this.mod = modName;
    Logger.log(`Loading: ${modName} : ${version}`);
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  load() {
    //Check we're enabled in config and rejig the cases using the values in config.json
    if (config.Settings.Enabled) {
      if (logging) {
        Logger.log(`[${modName} : ${version}] : ----- Enabled - Begin the rejiggling -----`, "white", "green")
      }

      for (let item in JSONItems) {
        let currentItem = JSONItems[item] //setup a currentItem object to pull params from
        if (items[currentItem.id] == undefined) {
          Logger.log(`[${modName} : ${version}] : ERROR : Item '${item}' with ID ${currentItem.id} is not found in SPT database - please check ID on https://db.sp-tarkov.com/`, "white", "red");
          if (logging) {
            Logger.log(`[${modName} : ${version}] : -----`); //I know, I know.
          }
          continue;
        }

        //DO ALL THE THINGS
        if (logging) {
          Logger.log(`[${modName} : ${version}] : Rejiggling '${item}', ID: ${currentItem.id}`, "green");
        }
        if (currentItem.Enabled) {
          this.addToItemFilter(currentItem.id, currentItem.filterIDs);
          this.setItemInternalSize(currentItem.id, currentItem.H_cells, currentItem.V_cells);
          this.setItemPrice(currentItem.id, currentItem.Price_Multiplier);
        } else {
          Logger.log(`[${modName} : ${version}] : WARNING : '${item}', ID: ${currentItem.id} is not enabled for rejiggling; skipped.`, "red"); //Warn without checking logging
        }
        //if (logging) {
          Logger.log(`[${modName} : ${version}] : Rejiggling of '${item}', ID: ${currentItem.id} completed`, "green");
          //Logger.log(`[${modName} : ${version}] : -----`);
        //}
      }
    } else { //config.json has Settings.Enabled flag set to false so we're out of here.
      Logger.log(`[${modName} : ${version}] : ----- Disabled in config.json - Skipping all rejiggling -----`, "red")
      return;
    }

    //Work Complete.
    Logger.log(`[${modName} : ${version}] : ----- Rejiggling complete -----`, "white", "green")
  }

  /** ============================= */
  /** ========= Functions ========= */

  setItemInternalSize(id, newHorizontal, newVertical) { //TODO Verify if integers in reasonable range (1 - 15? 20?), vomit exceptions //IF were making it smaller we should shout
    //Verify inputs
    if (
      this.checkCellSize(items[id]._props.Grids[0]._props.cellsH, newHorizontal) &&
      this.checkCellSize(items[id]._props.Grids[0]._props.cellsV, newVertical)) {

      if (logging) {
        Logger.log(`[${modName} : ${version}] : Resized ${id} from: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "blue");
      }
      items[id]._props.Grids[0]._props.cellsH = newHorizontal;
      items[id]._props.Grids[0]._props.cellsV = newVertical;
      if (logging) {
        Logger.log(`[${modName} : ${version}] : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "cyan");
      }
    } else {
      Logger.log(`[${modName} : ${version}] : ERROR : Skipping resize for ${id}! Turn on logging in config.json for more details.`, "white", "red");
    }
  }

  setItemPrice(id, priceMultiplier) {
    // Verify the multiplier is a number in reasonable range (0.001 - 10).
    if (this.checkPriceMultiplier(priceMultiplier)) {

      //This could be more concise, but keeping it longhand lets you log each step to see where you went wrong...
      //Get current prices
      let fleaPrice = fleaTable[id]
      let hbPrice = this.getHandbookPrice(id)

      //Modify prices using multiplier
      let newFleaPrice = Math.round(fleaPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles
      let newHbPrice = Math.round(hbPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles

      if (logging) {
        Logger.log(`[${modName} : ${version}] : ${id} flea price: : ${fleaPrice}`, "blue")
        Logger.log(`[${modName} : ${version}] : ${id} handbook price : ${hbPrice}`, "blue")
        Logger.log(`[${modName} : ${version}] : x ${priceMultiplier} price multiplier, gives:`, "blue")
      }

      //Set new prices
      this.setHandbookPrice(id, newHbPrice);
      fleaTable[id] = newFleaPrice
      if (logging) {
        Logger.log(`[${modName} : ${version}] : ${id} NEW flea price : ${newFleaPrice}`, "cyan")
        Logger.log(`[${modName} : ${version}] : ${id} NEW handbook price : ${newHbPrice}`, "cyan")
      }
    } else {
      Logger.log(`[${modName} : ${version}] : ERROR : Skipping Price Multiplier for ${id}! Turn on logging in config.json for more details.`, "white", "red");
    }
  }

  addToItemFilter(id, additionalItems) {
    if (additionalItems === "") { //are there any additional items?
      if (logging) {
        Logger.log(`[${modName} : ${version}] : No additional filter items`, "magenta");
        return; //nothing to do , so back we go.
      }
    } else {
      if (logging) {
        Logger.log(`[${modName} : ${version}] : Adding ${additionalItems} to filter of ${id}`, "magenta")
        Logger.log(`[${modName} : ${version}] : Was ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "magenta")
      }
      //validate the items in the additional items list against SPT items DB
      for (const itemKey in additionalItems) {
        if (items[additionalItems[itemKey]] == undefined) {
          Logger.log(`[${modName} : ${version}] : ERROR : Additional Filter Object with ID '${additionalItems[itemKey]}' is not found in SPT database; skipped this one - please check ID on https://db.sp-tarkov.com/`, "white", "red");
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
        Logger.log(`[${modName} : ${version}] : Now ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "magenta")
      }
    }
  }
  //Helper functions for Handbook pricing
  getHandbookPrice(id) {
    for (let i in handbook) {
      if (handbook[i].Id === id) {
        return handbook[i].Price
      }
    }
  }

  setHandbookPrice(id, newPrice) {
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
            Logger.log(`[${modName} : ${version}] : WARNING: New Cell Size value of ${newVal} is equal to or larger than old Value of ${oldVal}, be careful or be poor!`, "red");
          }
          return true
        }
      } else {
        Logger.log(`[${modName} : ${version}] : ERROR : Cell Size value: ${newVal} is out of range 1-20, preventing this from getting silly. Skipped.`, "white", "red");
        return false
      }
    } else {
      Logger.log(`[${modName} : ${version}] : ERROR : Cell Size value: ${newVal} is NOT a number; skipping.`, "white", "red");
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
          Logger.log(`[${modName} : ${version}] : WARNING: Price Multiplier value: ${val} is out of range 0.001-10, preventing this from getting silly. Skipped.`, "red");
        }
        return false
      }
    } else {
      if (logging) {
        Logger.log(`[${modName} : ${version}] : WARNING: Price Multiplier value: ${val} is NOT a number; skipping.`, "red");
      }
      return false
    }
  }
}
module.exports.Mod = Mod;