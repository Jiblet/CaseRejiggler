"use strict";
const modName = "CaseRejiggler";
const config = require("../config.json");

const database = DatabaseServer.tables;
const items = database.templates.items;
const global = database.locales.global;
const fleaTable = database.templates.prices;
const handbook = database.templates.handbook.Items;


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
    this.mod = "${modName}";
    Logger.info(`Loading: ${this.mod}`)
    ModLoader.onLoad[this.mod] = this.load.bind(this);
  }

  /**
   * refactoring will need to create functions for:
   *  Altering item filters ???
   */

  load() {
    //Check we're enabled and rejig the cases using the values in config.json
    if (config.Enabled) {
      if (config.Logging) {
        Logger.log(`[${modName}] : ----- Enabled - Begin the rejiggling -----`, "white", "green")
      }

      //----- Refactored SICC Changes -----

      if (config.Change_SICC) {
        items[SICC]
          ._props
          .Grids[0]
          ._props
          .filters[0]
          .Filter
          .push(INFO, KEYCARD_HOLDER_CASE, MAP);

        //Resize and reprice the case using the values in config.json
        this.setItemInternalSize(SICC, config.SICC_H, config.SICC_V);
        this.setItemPrice(SICC, config.SICC_Price_Multiplier);
      }

      //----- DOCS_CASE changes -----
      //Check we're enabled and add the item IDs to the Filter array
      if (config.Change_Docs) {
        items[DOCS_CASE]
          ._props
          .Grids[0]
          ._props
          .filters[0]
          .Filter
          .push(PROKILL, GOLD_SKULL, DOGTAG_BEAR, DOGTAG_USEC);

        //Resize and reprice the case using the values in config.json
        this.setItemInternalSize(DOCS_CASE, config.Docs_H, config.Docs_V);
        this.setItemPrice(DOCS_CASE, config.Docs_Price_Multiplier);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Turns out I'd need to modify the icon size as well, as this looks really weird in game when set to 1x1
        // Not today, champ. But I'll leave this here just in case.
        //
        // Change the Docs Case external size to 1x1
        // items[DOCS_CASE]._props.CanSellOnRagfair = true;
        // items[DOCS_CASE]._props.StackMaxSize = 2
        // items[DOCS_CASE]._props.Width = 1
        // items[DOCS_CASE]._props.Height = 1
        // if (config.Logging) {
        //   Logger.log(`[${modName}] : Resized DOCS_CASE icon to: ${items[DOCS_CASE]._props.Width} x ${items[DOCS_CASE]._props.Height}`, "white", "red")
        //   Logger.log(`[${modName}] : -----`)
        // }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Set the price using the multiplier from config.json


      }
      // ----- THICC_WEAPONS_CASE changes -----
      if (config.Change_THICC_Weapons) {
        //Resize and reprice the case using the values in config.json
        this.setItemInternalSize(THICC_WEAPONS_CASE, config.THICC_Weapons_H, config.THICC_Weapons_V);
        this.setItemPrice(THICC_WEAPONS_CASE, config.THICC_Weapons_Price_Multiplier);
      }
    }
    if (config.Logging) {
      Logger.log(`[${modName}] : ----- Rejiggling complete -----`, "white", "green")
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

  //Refactored Functions
  setItemInternalSize(id, newHorizontal, newVertical) {
    items[id]._props.Grids[0]._props.cellsH = newHorizontal;
    items[id]._props.Grids[0]._props.cellsV = newVertical;
    if (config.Logging) {
      Logger.log(`[${modName}] : Resized ${id} to: ${items[id]._props.Grids[0]._props.cellsH} x ${items[id]._props.Grids[0]._props.cellsV}`, "white", "blue");
      Logger.log(`[${modName}] : -----`);
    }
  }

  setItemPrice(id, priceMultiplier) {
    //Change the prices using the multiplier
    //Get current prices
    let fleaPrice = fleaTable[id]
    let hbPrice = this.getHandbookPrice(id)
    //Modify prices
    let newFleaPrice = Math.round(fleaPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles
    let newHbPrice = Math.round(hbPrice * priceMultiplier) //rounding so we dont get weird fractions of rubles

    if (config.Logging) {
      Logger.log(`[${modName}] : ${id} flea price: : ${fleaPrice}`, "white", "blue")
      Logger.log(`[${modName}] : ${id} handbook price : ${hbPrice}`, "white", "blue")
      Logger.log(`[${modName}] : -----`)
    }
    //Set new prices
    this.setHandbookPrice(id, newHbPrice);
    fleaTable[id] = newFleaPrice
    if (config.Logging) {
      Logger.log(`[${modName}] : ${id} NEW flea price : ${newFleaPrice}`, "white", "blue")
      Logger.log(`[${modName}] : ${id} NEW handbook price : ${newHbPrice}`, "white", "blue")
      Logger.log(`[${modName}] : -----`)
    }
  }

  addtoItemFilter(id, additionalItems) {
    Logger.log(`[${modName}] : -----`)
  }
}

module.exports.Mod = Mod;