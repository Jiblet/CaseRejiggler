"use strict";
const config = require("../config.json");
const mod = require("../package.json");

const modName = mod.name;
const version = mod.version;

const JSONItems = config.Items;
const database = DatabaseServer.tables;
const items = database.templates.items;
const fleaTable = database.templates.prices;
const handbook = database.templates.handbook.Items;

class Mod {
  constructor() {
    this.mod = require("../package.json");
    Logger.info(`Loading: ${modName} : ${version}`);
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  load() {
    //Check we're enabled in config and rejig the cases using the values in config.json
    if (config.Settings.Enabled) {
      if (config.Settings.Logging) {
        Logger.log(`{[${modName} : ${version}]} : ----- Enabled - Begin the rejigging -----`, "white", "green")
      }

      for (let item in JSONItems) {
        let currentItem = JSONItems[item] //setup a currentItem object to pull params from
        if (items[currentItem.id] == undefined) {
          Logger.log(`{[${modName} : ${version}]} : ERROR! : Item '${item}' with ID ${currentItem.id} is not found in SPT database - please check ID on https://db.sp-tarkov.com/`, "white", "red");
          if (config.Settings.Logging) {
            Logger.log(`{[${modName} : ${version}]} : -----`); //I know, I know.
          }
          continue;
        }

        //DO ALL THE THINGS
        if (config.Settings.Logging) {
          Logger.log(`{[${modName} : ${version}]} : Rejigging '${item}', ID: ${currentItem.id}`, "white", "green");
        }
        if (currentItem.Enabled) {
          this.addToItemFilter(currentItem.id, currentItem.filterIDs);
          this.setItemInternalSize(currentItem.id, currentItem.H_cells, currentItem.V_cells);
          this.setItemPrice(currentItem.id, currentItem.Price_Multiplier);
        } else {
          Logger.log(`{[${modName} : ${version}]} : WARNING : '${item}', ID: ${currentItem.id} is not enabled for rejigging; skipped.`, "red"); //Warn without checking logging
        }
        if (config.Settings.Logging) {
          Logger.log(`{[${modName} : ${version}]} : Rejigging of '${item}', ID: ${currentItem.id} completed`, "white", "green");
          Logger.log(`{[${modName} : ${version}]} : -----`);
        }
      }
    } else { //config.json has Settings.Enabled flag set to false so we're out of here.
      Logger.log(`[${modName} : ${version}] : ----- Disabled in config.json - Skipping all rejigging -----`, "red")
      return;
    }

    //Work Complete.
    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : ----- Rejigging complete -----`, "white", "green")
    }
  }

  /** ============================= */
  /** ========= Functions ========= */

  setItemInternalSize(id, newHorizontal, newVertical) { //TODO Verify if integers in reasonable range (1 - 15? 20?), vomit exceptions //IF were making it smaller we should shout
    items[id]._props.Grids[0]._props.cellsH = newHorizontal;
    items[id]._props.Grids[0]._props.cellsV = newVertical;
    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "white", "blue");
    }
  }

  setItemPrice(id, priceMultiplier) { //TODO Verify positive numeric in reasonable range (0.001 - 10), vomit exceptions

    //This could be more concise, but keeping it longhand lets you log each step to see where you went wrong...
    //Get current prices
    let fleaPrice = fleaTable[id]
    let hbPrice = this.getHandbookPrice(id)

    //Modify prices using multiplier
    let newFleaPrice = Math.round(fleaPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles
    let newHbPrice = Math.round(hbPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles

    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : ${id} flea price: : ${fleaPrice}`, "white", "blue")
      Logger.log(`{[${modName} : ${version}]} : ${id} handbook price : ${hbPrice}`, "white", "blue")
    }

    //Set new prices
    this.setHandbookPrice(id, newHbPrice);
    fleaTable[id] = newFleaPrice
    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : ${id} NEW flea price : ${newFleaPrice}`, "white", "cyan")
      Logger.log(`{[${modName} : ${version}]} : ${id} NEW handbook price : ${newHbPrice}`, "white", "cyan")
    }
  }

  addToItemFilter(id, additionalItems) {
    if (additionalItems === "") { //are there any additional items?
      if (config.Settings.Logging) {
        Logger.log(`{[${modName} : ${version}]} : No additional filter items`, "white", "magenta");
        return; //nothing to do , so back we go.
      }
    } else {
      if (config.Settings.Logging) {
        Logger.log(`{[${modName} : ${version}]} : Adding ${additionalItems} to filter of ${id}`, "white", "magenta")
        Logger.log(`{[${modName} : ${version}]} : Was ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "white", "magenta")
      }
      //validate the items in the additional items list against SPT items DB
      for (const itemKey in additionalItems) {
        if (items[additionalItems[itemKey]] == undefined) {
          Logger.log(`{[${modName} : ${version}]} : ERROR! : Additional Filter Object with ID '${additionalItems[itemKey]}' is not found in SPT database; skipped - please check ID on https://db.sp-tarkov.com/`, "white", "red");
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
      if (config.Settings.Logging) {
        Logger.log(`{[${modName} : ${version}]} : Now ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "yellow", "magenta")
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
}

module.exports.Mod = Mod;