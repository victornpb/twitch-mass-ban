# 🧑‍⚖️ Twitch RaidHammer - An utility for Easily banning multiple hate raid accounts
Everytime someone follows the window should appear, then you can choose to:
- <kbd>?</kbd> view account age
- <kbd>IGNORE</kbd> legit users
- <kbd>BAN</kbd> accounts
- <kbd>BAN ALL</kbd> to give them all the **🚷 BAN HAMMER**!

![](https://user-images.githubusercontent.com/3372598/134840805-af6eef0e-898e-4b74-867e-add1f53edc93.gif)  

# Instructions


1. First you need a Browser Extension for managing UserScripts[[1]][userscrips_faq] (skip if you already have one):  
   * Chrome: [Violentmonkey][chrome_violentmonkey] or [Tampermonkey][chrome_tampermonkey]
   * Brave: [Violentmonkey][chrome_violentmonkey] or [Tampermonkey][chrome_tampermonkey]
   * Firefox: [Greasemonkey][firefox_greasemonkey], [Tampermonkey][firefox_tampermonkey], or [Violentmonkey][firefox_violentmonkey]  
   * Opera: [Tampermonkey][opera_tampermonkey] or [Violentmonkey][opera_violentmonkey]   
   * Edge: [Tampermonkey][edge_tampermonkey]  
   * Safari: ~[Tampermonkey][safari_tampermonkey]~ 
    
1. Install Twitch RaidHammer:  
  [![][greasyfork_icon]][greasyfork_url] or [![][openuserjs_icon]][openuserjs_url]

1. (Optional) The feature that monitors new followers as they come,  
  requires that you have [StreamElements](https://streamelements.com/features/chatbot) or [StreamLabs](https://streamlabs.com/content-hub/tag/chatbot) Bot announcing follow alerts in the chat:  
  (This is not required if you just want to use the mass banning feature).  
    You should have the bots announce one of these messages:
    - > **Streamlabs**: Thank you for following `username`!
    - > **StreamElements**: Welcome! `username` Thank you for following!  
    


1. You're all set!
 
Look for the hammer icon next to Twitch chat. [see notes](#notes)

Note: It will ONLY appear on streams you have moderation privilegies.

----

# Import List of Bots

You can also import a list of users and ban all of them with only 3 clicks!  
No more coping and pasting hundreds of /ban commands.

![Mass banning list of bots](https://user-images.githubusercontent.com/3372598/165885461-a997f0f1-e880-4390-8b9e-77a95e707833.gif)

            
----

If you have issues or just need help [open a discussion here](https://github.com/victornpb/twitch-mass-ban/discussions)


<!-- links -->
  [userscrips_faq]: https://en.wikipedia.org/wiki/Userscript
  [greasyfork_icon]: https://user-images.githubusercontent.com/3372598/166113712-1bc3d654-1342-4f1e-9845-21c3b21524b1.png
  [openuserjs_icon]: https://user-images.githubusercontent.com/3372598/166113714-5a2ede39-8d66-43a8-b5da-8f1897cb3121.png
  
  [chrome_violentmonkey]: https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag
  [chrome_tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
  [firefox_greasemonkey]: https://addons.mozilla.org/firefox/addon/greasemonkey/
  [firefox_tampermonkey]: https://addons.mozilla.org/firefox/addon/tampermonkey/
  [firefox_violentmonkey]: https://addons.mozilla.org/firefox/addon/violentmonkey/
  [safari_tampermonkey]: https://github.com/victornpb/undiscord/issues/91#issuecomment-654514364
  [edge_tampermonkey]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd
  [opera_tampermonkey]: https://addons.opera.com/extensions/details/tampermonkey-beta/
  [opera_violentmonkey]: https://addons.opera.com/extensions/details/violent-monkey/

<!-- Download links -->
  [greasyfork_url]: <https://greasyfork.org/en/scripts/432982-twitchmassban-easily-ban-hate-raid-accounts> "Get Twitch RaidHammer from GreasyFork"
  [openuserjs_url]: <https://openuserjs.org/scripts/victornpb/TwitchMassBan_-_Easily_ban_hate_raid_accounts> "Get Twitch RaidHammer from OpenUserJS"
