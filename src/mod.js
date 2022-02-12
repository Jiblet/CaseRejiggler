"use strict";
const config = require("../config.json");

const database = DatabaseServer.tables;
const items = database.templates.items;
const fleaTable = database.templates.prices;
const itemsTable = database.templates.handbook.Items;

const SICC = "5d235bb686f77443f4331278";
const DOCS_CASE = "590c60fc86f77412b13fddcf";
const INFO = "5448ecbe4bdc2d60728b4568"; // includes intel, secure flash drive, sliderkey etc
const KEYCARD_HOLDER_CASE = "619cbf9e0a7c3a1a2731940a";
const MAP = "567849dd4bdc2d150f8b456e";
const PROKILL = "5c1267ee86f77416ec610f72";
const GOLD_SKULL = "5d235a5986f77443f6329bc6";
const DOGTAG_BEAR = "59f32bb586f774757e1e8442";
const DOGTAG_USEC = "59f32c3b86f77472a31742f0";
const THICC_WEAPONS_CASE = "5b6d9ce188a4501afc1b2b25";

class Mod {
  constructor() {
    this.mod = "CaseRejiggler";
    Logger.info(`Loading: ${this.mod}`)
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  load() {
    //Check we're enabled and rejig the cases using the values in config.json
    if (config.Enabled) {
      if (config.Logging) {
        Logger.log(`[CaseRejiggler] : ----- Enabled - Begin the rejiggling -----`, "white", "green")
      }
      //Check we're enabled and add the item IDs to the Filter array
      if (config.Change_SICC) {
        items[SICC]
          ._props
          .Grids[0]
          ._props
          .filters[0]
          .Filter
          .push(INFO, KEYCARD_HOLDER_CASE, MAP);
        //Now resize the case using the values in config.json
        items[SICC]._props.Grids[0]._props.cellsH = config.SICC_H
        items[SICC]._props.Grids[0]._props.cellsV = config.SICC_V
        if (config.Logging) {
          Logger.log(`[CaseRejiggler] : Resized SICC to: ${items[SICC]._props.Grids[0]._props.cellsH} x ${items[SICC]._props.Grids[0]._props.cellsV}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : -----`)
        }

        let fleaPrice = this.getFleaPrice(SICC)
        let hbPrice = this.getHandbookPrice(SICC)

        let newFleaPrice = Math.round(fleaPrice * config.Docs_Price_Multiplier) //rounding so we dont get weird numbers of rubles
        let newHbPrice = Math.round(hbPrice * config.Docs_Price_Multiplier) //rounding so we dont get weird numbers of rubles

        if (config.Logging) {
          Logger.log(`[CaseRejiggler] : SICC flea price: : ${fleaPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : SICC NEW flea price : ${newFleaPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : SICC handbook price : ${hbPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : SICC NEW handbook price : ${newHbPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : -----`)
        }

        this.setHandbookPrice(SICC, newHbPrice);
        this.setFleaPrice(SICC, newFleaPrice);
      }


      //Check we're enabled and add the item IDs to the Filter array
      if (config.Change_Docs) {
        items[DOCS_CASE]
          ._props
          .Grids[0]
          ._props
          .filters[0]
          .Filter
          .push(PROKILL, GOLD_SKULL, DOGTAG_BEAR, DOGTAG_USEC);

        //Resize the case using the values in config.json
        items[DOCS_CASE]._props.Grids[0]._props.cellsH = config.Docs_H
        items[DOCS_CASE]._props.Grids[0]._props.cellsV = config.Docs_V
        if (config.Logging) {
          Logger.log(`[CaseRejiggler] : Resized DOCS_CASE to: ${items[DOCS_CASE]._props.Grids[0]._props.cellsH} x ${items[DOCS_CASE]._props.Grids[0]._props.cellsV}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : -----`)
        }

        //Set the price using the multiplier from config.json
        let fleaPrice = this.getFleaPrice(DOCS_CASE)
        let hbPrice = this.getHandbookPrice(DOCS_CASE)

        let newFleaPrice = Math.round(fleaPrice * config.Docs_Price_Multiplier) //rounding so we dont get weird numbers of rubles
        let newHbPrice = Math.round(hbPrice * config.Docs_Price_Multiplier) //rounding so we dont get weird numbers of rubles

        if (config.Logging) {
          Logger.log(`[CaseRejiggler] : DOCS_CASE flea price: : ${fleaPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : DOCS_CASE NEW flea price : ${newFleaPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : DOCS_CASE handbook price : ${hbPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : DOCS_CASE NEW handbook price : ${newHbPrice}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : -----`)
        }
        this.setHandbookPrice(DOCS_CASE, newHbPrice);
        this.setFleaPrice(DOCS_CASE, newFleaPrice);

      }

      if (config.Change_THICC_Weapons) {
        items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsH = config.THICC_Weapons_H
        items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsV = config.THICC_Weapons_V
        if (config.Logging) {
          Logger.log(`[CaseRejiggler] : Resized THICC_WEAPONS_CASE to: ${items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsH} x ${items[THICC_WEAPONS_CASE]._props.Grids[0]._props.cellsV}`, "white", "blue")
          Logger.log(`[CaseRejiggler] : -----`)
        }
        //Get Price
        var fleaPrice = this.getFleaPrice(THICC_WEAPONS_CASE)
        var hbPrice = this.getHandbookPrice(THICC_WEAPONS_CASE)
        var newFleaPrice = Math.round(fleaPrice * config.THICC_Weapons_Price_Multiplier)
        var newHbPrice = Math.round(hbPrice * config.THICC_Weapons_Price_Multiplier)

        //Set new price
        this.setHandbookPrice(THICC_WEAPONS_CASE, newHbPrice);
        this.setFleaPrice(THICC_WEAPONS_CASE, newFleaPrice);

        //Log
        if (config.Logging) {
          //Check new values with logging
          var fleaPrice = this.getFleaPrice(THICC_WEAPONS_CASE)
          var hbPrice = this.getHandbookPrice(THICC_WEAPONS_CASE)
          if (config.Logging) {
            Logger.log(`[CaseRejiggler] : THICC_WEAPONS_CASE case flea price: : ${fleaPrice}`, "white", "blue")
            Logger.log(`[CaseRejiggler] : THICC_WEAPONS_CASE case NEW flea price : ${newFleaPrice}`, "white", "blue")
            Logger.log(`[CaseRejiggler] : THICC_WEAPONS_CASE case handbook price : ${hbPrice}`, "white", "blue")
            Logger.log(`[CaseRejiggler] : THICC_WEAPONS_CASE case NEW handbook price : ${newHbPrice}`, "white", "blue")
            Logger.log(`[CaseRejiggler] : -----`)
          }
        }
      }
    }
    if (config.Logging) {
      Logger.log(`[CaseRejiggler] : ----- Rejiggling complete -----`, "white", "green")
    }
  }


  //Useful functions for pricing
  getFleaPrice(id) {
    const result = fleaTable[id];
    // Checks Flea AVG price, if null, panic later
    return result
  }

  setFleaPrice(id, newPrice) {
    fleaTable[id] = newPrice
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