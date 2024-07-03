# Case Rejiggler
This mod combines my old SICC_Intel mod with some changes I wanted to make to the THICC Weapons case.

Then when I went to make one further change, I decided to rewrite and enormously over engineer it to make it extensible via the config.json file by the end user. **You're welcome!**

## Docs case and SICC pouch changes

I was annoyed at having to choose between taking a Docs case or a SICC depending on what map I was going into and what I planned to do in there; often neither case was entirely appropriate. So this mod started off by enabling both Intelligence folders and the new (as of 12.12) Keycard holder cases to be stored inside a S I C C organizational pouch.

Since then I've expanded it a little to include other items that fit in a Docs case but not a SICC, and vice versa. So with all the features enabled (see Config Settings) the Docs case and SICC pouches will both take exactly the same types of items. The only differences will be size (5x5 for the SICC and 4x4 for the Docs) and of course price.

As the two cases are now so similar in function, I've added options to alter the size, shape, and price of the cases, so that you can adjust the balance how you see fit. The provided config file makes the docs case long and thin, like it very clearly should be, and adjusts the price down appropriately as you lose one square.

## THICC weapons case changes

TWCs are annoyingly expensive and irritatingly slim. I don't mind saving up, but since I tend to hoard guns I don't really want to have to buy 2 or 3 of these things... So let's make them a bit chunkier, and to compensate, well make them appropriately more expensive 😩

No changes are made to the filtering of items that are able to go into the TWC.

## Weapons and Items case changes
I was annoyed that these were slightly too small to be really useful. So I've made them larger (yay!) and kept the same price for now (also yay!).

---


<a id="configsettings"></a>
## Config Settings:

The ```config.json``` file is split out into a few sections:

* **Settings**
  * ```"Enabled"``` | true/false | Determines if the mod does anything at all or not
  * ```"Logging"``` | true/false | turn on/off debug logging to the console incase you're having trouble - 🌈!

* **Instructions**
  * Hopefully useful instructions based on these but in situ in the file

* **Items**
  * ```"Enabled"```
    * true/false
    * Allows you to skip cases individually if you need to. Useful for debugging.
  * ```"id"```
    * Use https://items.sp-tarkov.com/ to find ID of this item you want to rejig.
  * ```"H_Cells"``` | * How wide you want the case to be internally.
    * Min 1, Max 20 - can't have you going nuts and I've no idea what Tarkov might do if you go **too** big.
    * Must be a whole number, no double quotes here or it'll think its a string.
    * Be careful if you're making it smaller than normal. See Warnings.

  * ```"V_Cells"``` | Integer
    * How high you want the case to be internally.
    * Min 1, Max 15 - can't have you going nuts and I've no idea what Tarkov might do if you go **too** big.
    * Must be a whole number, no double quotes here or it'll think its a string.
    * Be careful if you're making it smaller than normal. See Warnings.
  * ```Price_Multiplier```
    * The new price of this case will be the original price multiplied by this. Use to help balance if you make a case much bigger/more useful, or the reverse.
    * The value must be between **0.01** and **10**, just to stop you going mad.
  * ```filterIDs```
    * Make sure this is an array of comma separated IDs - Use https://items.sp-tarkov.com/ to find IDs - no trailing comma.

---

# Adding another case:
If you'd like to add another case to the list, you should be able to work out how pretty easily, but roughly:
1. Copy an existing case in the items list.
2. Add it to the end of the list - watch your commas! THe final item shouldn't have a comma after it.
3. Use https://db.sp-tarkov.com/search to get the item ID.
4. Change Settings.logging to true, or just 🤞cross your fingers🤞 and hope for the best. There's a good chance you'll get lucky, but if not there's a ton of logging that should help you.

---

#  **⚠️WARNINGS!⚠️**
* If you have an item in one of the cases that would usually be excluded from that case, then you turn that part of the mod off, you will lose that item to the Tarkov gods.
  
  For example, if you have an Intelligence Folder inside the SICC Pouch and you set ```"filterIDs"``` to not include ```'5448ecbe4bdc2d60728b4568'```, **Tarkov will eat your Intelligence folder** and you will be sad. And even more poor.

* Make sure that any case are empty before resizing them _Especially_ before reducing them in size. 
  If you have a full THICC Weapons Case that you then reduce in size... You may accidentally donate the contents to the Tarkov gods.

* Also, not quite so serious as above, but this might not play well with any mods that alter the Flea Market prices top get them close to live (eg. Lua-FleaMarketPriceUpdater), as they will undo any pricing balance tweaks you've made here.

### **You have been warned.**

Enjoy!
😍
