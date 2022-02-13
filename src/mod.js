"use strict";
const modName = "CaseRejiggler";
const config = require("../config.json");

const database = DatabaseServer.tables;
const items = database.templates.items;
const global = database.locales.global; //Failed attempt to pull item names in to logging. Maybe one day.
const fleaTable = database.templates.prices;
const handbook = database.templates.handbook.Items;

class Mod {
  constructor() {
    this.mod = require("../package.json");
    Logger.info(`Loading: ${this.mod.name} : ${this.mod.version}`);
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  load() {
    //Check we're enabled in config and rejig the cases using the values in config.json
    if (config.Settings.Enabled) {
      if (config.Settings.Logging) {
        Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ----- Enabled - Begin the rejiggling -----`, "white", "green")
      }

      const containers = []; //This might be madness but I know of no better way for iterate over JSON objects
      for (let item in config.Items) {
        containers.push(item)
      }

      for (let container in containers) {
        let currentItem = config.Items[containers[container]] //setup a currentItem object to pull params from

        if (items[currentItem.id] == undefined) {
          Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Warning!!`, "white", "red"); //Not checking for logging enabled as this is catastrophic
          Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Object '${containers[container]}' with ID ${currentItem.id} is not found in SPT database - please check on https://db.sp-tarkov.com/`, "white", "red");
          continue;
        }

        //DO ALL THE THINGS
        if (config.Settings.Logging) {
          Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Rejigging '${containers[container]}', ID: ${currentItem.id}`, "white", "green");
        }
        if (currentItem.Enabled) {
          this.addtoItemFilter(currentItem.id, currentItem.filterIDs);
          this.setItemInternalSize(currentItem.id, currentItem.H_cells, currentItem.V_cells);
          this.setItemPrice(currentItem.id, currentItem.Price_Multiplier);
        } else {
          if (config.Settings.Logging) {
            Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : '${containers[container]}', ID: ${currentItem.id} is not enabled for rejigging; skipping.`, "red");
          }
        }
      }
    }


    //Work Complete.
    if (config.Settings.Logging) {
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ----- Rejiggling complete -----`, "white", "green")
    }
  }

  /** ====== Helper functions ====== */

  setItemInternalSize(id, newHorizontal, newVertical) {
    items[id]._props.Grids[0]._props.cellsH = newHorizontal;
    items[id]._props.Grids[0]._props.cellsV = newVertical;
    if (config.Settings.Logging) {
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "white", "blue");
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : -----`);
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
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ${id} flea price: : ${fleaPrice}`, "white", "blue")
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ${id} handbook price : ${hbPrice}`, "white", "blue")
    }

    //Set new prices
    this.setHandbookPrice(id, newHbPrice);
    fleaTable[id] = newFleaPrice
    if (config.Settings.Logging) {
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ${id} NEW flea price : ${newFleaPrice}`, "white", "cyan")
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : ${id} NEW handbook price : ${newHbPrice}`, "white", "cyan")
      Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : -----`)
    }
  }

  addtoItemFilter(id, additionalItems) {
    // Should add a check to make sure the additional items are valid in the items DB
    if (additionalItems === "") {
      if (config.Settings.Logging) {
        Logger.log("No extra filter items", "white", "magenta");
      }
    } else {
      if (config.Settings.Logging) {
        Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Adding ${additionalItems} to filter of ${id}`, "white", "magenta")
        Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Was ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "white", "magenta")
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
        Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : Now ${items[id]._props.Grids[0]._props.filters[0].Filter}`, "yellow", "magenta")
        Logger.log(`{[${this.mod.name} : ${this.mod.version}]} : -----`)
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