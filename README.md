# Case Rejiggler
This mod combines my SICC_Intel mod with some changes I wanted to make to the THICC Weapons case.

## Docs and SICC changes

I was annoyed at having to choose between taking a Docs case or a SICC depending on what map I was going into and what I planned to do in there; often neither case was entirely appropriate. So this mod started off by enabling both Intelligence folders and the new (as of 12.12) Keycard holder cases to be stored inside a S I C C organizational pouch.

Since then I've expanded it a little to include other items that fit in a Docs case but not a SICC, and vice versa. So with all the features enabled (see Config Settings) the Docs case and SICC pouches will both take exactly the same types of items. The only differences will be size (5x5 for the SICC and 4x4 for the Docs) and of course price.

As the two cases are now so similar in function, I've added options to alter the size, shape, and price of the cases, so that you can adjust the balance how you see fit. The provided config file makes the docs case long and thin, like it very clearly should be, and adjusts the price down appropriately as you lose one square.

## T H I C C weapons case changes

TWCs are annoyingly expensive and irritatingly slim. I don't mind saving up, but since I tend to hoard guns I don't really want to have to buy 2 or 3 of these things... So let's make them a bit chunkier, and to compensate, well make them appropriately more expensive 😩

No changes are made to the filtering of items that are able to go into the TWC.

---


<a id="configsettings"></a>
## Config Settings:
```javascript
"Enabled": true,                        //  true/false - Determines if the mod does anything at all or not
"Logging": false,                       //  true/false - turn on/off debug logging to the console incase you're having trouble

"Change_THICC_Weapons": true,           //  true/false - Determines if we should make any changes to the THICC Weapons Case at all
"THICC_Weapons_H": 8,                   //  Game default 6 - Set the horizontal size of the THICC Weapons Case
"THICC_Weapons_V": 15,                  //  Game default 15 - Set the vertical size of the THICC Weapons Case
"THICC_Weapons_Price_Multiplier": 1.3,  //  Default 1.3 - Prices of the THICC WC in the Flea and the handbook will be multiplied by this to balance changes

"Change_SICC": true,                    //  true/false - Determines if we should make any changes to the SICC Organizational Pouch at all
"SICC_H": 5,                            //  integer - game default 5 - Set the horizontal size of the SICC pouch
"SICC_V": 5,                            //  integer - game default 5 - Set the vertical size of the SICC pouch
"SICC_Price_Multiplier": 1.2,           //  Default 1.2 - Prices of the SICC pouch in the Flea and the handbook will be multiplied by this to balance changes

"Change_Docs": true,                    //  true/false - Determines if we should make any changes to the Documents Case at all
"Docs_H": 3,                            //  Game default 4 - Set the horizontal size of the Documents Case
"Docs_V": 5,                            //  Game default 4 - Set the vertical size of the Documents Case
"Docs_Price_Multiplier": 0.93           //  Default 0.93 - Prices of the Docs Case in the Flea and the handbook will be multiplied by this to balance changes
```
---

#  **⚠️WARNING!⚠️**
If you have an item in one of the cases that would usually be excluded from that case, then you turn that part of the mod off, you will lose that item to the Tarkov gods.

For example, if you have an Intelligence Folder inside the SICC Pouch and you set ```"Change_SICC":false```, **Tarkov will eat your Intelligence folder** and you will be sad. And even more poor.

## You have been warned.

Also, not quite so serious as above, but this might not play well with any mods that alter the Flea Market prices top get them close to live (eg. Lua-FleaMarketPriceUpdater), as they will undo any pricing balance tweaks you've made here.
