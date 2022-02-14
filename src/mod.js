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
        Logger.log(`{[${modName} : ${version}]} : ----- Enabled - Begin the rejiggling -----`, "white", "green")
      }

      for (let item in JSONItems) {
        let currentItem = JSONItems[item] //setup a currentItem object to pull params from

        if (items[currentItem.id] == undefined) {
          Logger.log(`{[${modName} : ${version}]} : ERROR! : Object '${item}' with ID ${currentItem.id} is not found in SPT database - please check ID on https://db.sp-tarkov.com/`, "white", "red");
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
          Logger.log(`{[${modName} : ${version}]} : WARNING : '${item}', ID: ${currentItem.id} is not enabled for rejigging; skipping.`, "red"); //Warn without checking logging
        }
      }
    }

    //Work Complete.
    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : ----- Rejiggling complete -----`, "white", "green")
    }
  }

  /** ============================== */
  /** ====== Helper functions ====== */

  setItemInternalSize(id, newHorizontal, newVertical) {
    items[id]._props.Grids[0]._props.cellsH = newHorizontal;
    items[id]._props.Grids[0]._props.cellsV = newVertical;
    if (config.Settings.Logging) {
      Logger.log(`{[${modName} : ${version}]} : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "white", "blue");
      Logger.log(`{[${modName} : ${version}]} : -----`);
    }
  }

  setItemPrice(id, priceMultiplier) {
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
      Logger.log(`{[${modName} : ${version}]} : -----`)
    }
  }

  addToItemFilter(id, additionalItems) {
    // Should add a check to make sure the additional items are valid in the items DB
    if (additionalItems === "") {
      if (config.Settings.Logging) {
        Logger.log("No extra filter items", "white", "magenta");
      }
    } else {
      if (config.Settings.Logging) {
        Logger.log(`{[${modName} : ${version}]} : Adding ${additionalItems} to filter of ${id}`, "white", "magenta")
        Logger.log(`{[${modName} : ${version}]} : Was ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "white", "magenta")
      }
      for (const itemKey in additionalItems) {
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
        Logger.log(`{[${modName} : ${version}]} : -----`)
      }
    }
  }
  //functions for Handbook pricing
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