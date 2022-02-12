"use strict";
const config = require("../config.json");

const database = DatabaseServer.tables;
const items = database.templates.items;
//const handbook = database.templates.handbook.Items;

const liveTable = database.templates.prices;
const itemsTable = database.templates.handbook.Items;

const THICC_WEAPONS_CASE = "5b6d9ce188a4501afc1b2b25";

class Mod {
  constructor() {
    this.mod = "CaseResizer";
    Logger.info(`Loading: ${this.mod}`)
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  load() {
    //Check we're enabled and rejig the cases using the values in config.json
    if (config.Enabled) {
      items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsH = config.THICC_Weapons_H
      items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsV = config.THICC_Weapons_V

      //Get
      var fleaPrice = this.getFleaPrice(THICC_WEAPONS_CASE)
      var hbPrice = this.getHandbookPrice(THICC_WEAPONS_CASE)
      var newFleaPrice = Math.round(fleaPrice * config.THICC_Weapons_Price_Multiplier)
      var newHbPrice = Math.round(hbPrice * config.THICC_Weapons_Price_Multiplier)

      //Log - Show old and new values
      if (config.Logging) {
        Logger.log(`[CaseResizer] : Vars : ${fleaPrice}`, "white", "blue")
        Logger.log(`[CaseResizer] : Vars : ${newFleaPrice}`, "white", "blue")
        Logger.log(`[CaseResizer] : Vars : ${hbPrice}`, "white", "blue")
        Logger.log(`[CaseResizer] : Vars : ${newHbPrice}`, "white", "blue")
      }

      //Set
      this.setHandbookPrice(THICC_WEAPONS_CASE, newHbPrice);
      this.setFleaPrice(THICC_WEAPONS_CASE, newFleaPrice);

      //Log
      if (config.Logging) {
        //Check new values with logging
        var fleaPrice = this.getFleaPrice(THICC_WEAPONS_CASE)
        var hbPrice = this.getHandbookPrice(THICC_WEAPONS_CASE)
        Logger.log(`[CaseResizer] : Vars : ${fleaPrice}`, "white", "red")     // show current, altered price
        Logger.log(`[CaseResizer] : Vars : ${newFleaPrice}`, "white", "red")  // show current, altered price
      }
    }
  }


  //Useful functions for pricing
  getFleaPrice(id) {
    const result = liveTable[id];
    // Checks Flea AVG price, if null, panic later
    return result
  }

  setFleaPrice(id, newPrice) {
    liveTable[id] = newPrice
  }

  getHandbookPrice(id) {
    for (let i in itemsTable) {
      if (itemsTable[i].Id === id) {
        return itemsTable[i].Price
      }
    }
  }

  setHandbookPrice(id, newPrice) {
    for (let i in itemsTable) {
      if (itemsTable[i].Id === id) {
        itemsTable[i].Price = newPrice
      }
    }
  }

}

module.exports.Mod = Mod;