# Case Rejiggler
T H I C C Weapons cases are annoyingly expensive and annoyingly slim. I don't mind saving up, but since I tend to hoarde guns I don't really want to ahve to buy 2 or 3 of these things... So lets make them a bit chunkier.

----------

<a id="configsettings"></a>
## Config Settings:
```javascript
"Enabled": true,                      //  true/false - Determines if the mod does anythign at all or not
"Logging": true,                      //  true/false - turn on/off debug logging to the console incase you're having trouble

"Change_THICC_Weapons": true,         //  true/false - Determines if we should make any changes to the THICC Weapons Case at all
"THICC_Weapons_H": 8,                 //  integer - game default 5 - Set the horizontal size of the THICC Weapons Case
"THICC_Weapons_V": 15,                //  integer - game default 5 - Set the vertical size of the THICC Weapons Case
"THICC_Weapons_Price_Multiplier": 1,  //  Default 1 - Prices of the THICC WC in the Flea and the handbook will be multiplied by this

"Change_SICC": true,                  //  true/false - Determines if we should make any changes to the SICC Organizational Pouch at all
"SICC_H": 5,                         //  integer - game default 5 - Set the horizontal size of the SICC pouch
"SICC_V": 5,                         //  integer - game default 5 - Set the vertical size of the SICC pouch
"SICC_Price_Multiplier": 1,           //  Default 1 - Prices of the SICC pouch in the Flea and the handbook will be multiplied by this

"Change_Docs": true,                  //  true/false - Determines if we should make any changes to the Documents Case at all
"Docs_H": 3,                          //  Game default 5 - Set the horizontal size of the Documents Case
"Docs_V": 5,                          //  Game default 4 - Set the vertical size of the Documents Case
"Docs_Price_Multiplier": 100          //  Default 1 - Prices of the Docs Case in the Flea and the handbook will be multiplied by this

```
----
  
#  **WARNING!**
If you have an item in one of the cases that would usually be excluded from that case, then you turn that part of the mod off, you will lose that item to the Tarkov gods.

For example, if you have an Intelligence Folder inside the SICC Pouch and you set ```"Change_SICC":false```, Tarkov will eat your Intelligence folder and you will be sad. And poorer.

## You have been warned.

Also, this might not play well with any mods that alter the Flea Market prices top get them close to live, as they will undo any pricing balance tweaks you've made here.