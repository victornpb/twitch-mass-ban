
// ==UserScript==
// @name          TwitchMassBan - Easily ban hate raid accounts
// @description   Easily ban hate raid accounts
// @namespace     https://github.com/victornpb/twitch-mass-ban
// @version       0.5
// @match         *://*.twitch.tv/*
// @grant         none
// @run-at        document-start
// @homepageURL   https://github.com/victornpb/twitch-mass-ban
// @supportURL    https://github.com/victornpb/twitch-mass-ban/issues
// @contributionURL https://www.buymeacoffee.com/vitim
// @grant         none
// @license       MIT
// ==/UserScript==

(function() {
    var html = `
    <div class="botban" style="position: fixed; bottom: 50px; left: 50px; z-index: 99999999; background-color:#311b92; color:white; border: 1px solid white; padding:5px;">
    <div style="display: flex;">
        <button class="clear">CLEAR</button>
        <button class="extract">GRAB USERNAMES</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button class="banAll" style="background: red;">BAN ALL</button>
        <span style="flex-grow: 1;"></span>
        <button class="closeBtn">X</button>
  </div>
  <br>
  <textarea placeholder="Usernames" style="font-family:monospace; width: 500px; height: 300px; white-space: nowrap;"></textarea>
<style>
.botban{
    
}
.botban button{
    border: 1px solid white;
    padding: .5em 1em;
    margin: 1px;
}
textarea{
    background: var(--color-background-base);
    color: var(--color-text-base);
    padding: .5em;
}
</style>
</div>`;
    
    // modal
    const d = document.createElement("div");
    d.innerHTML = html;
    const textarea = d.querySelector("textarea");
    
    // activation button
    const activateBtn = document.createElement('button');
    activateBtn.innerHTML = 'MassBan';
    activateBtn.style.cssText = `
        font-weight: var(--font-weight-semibold);
        border-radius: var(--border-radius-medium);
        font-size: var(--button-text-default);
        height: var(--button-size-default);
        background-color: #e91e63;
        color: var(--color-text-button-primary);
    `;
    
    activateBtn.onclick = ()=>{
        d.style.display='';
        textarea.focus();
    }
    
    function appendActivatorBtn(){
        const modBtn = document.querySelector('[data-test-selector="mod-view-link"]');
        if (modBtn) {
            const twitchBar = modBtn.parentElement.parentElement.parentElement;
             if (twitchBar && !twitchBar.contains(activateBtn)) {
                 twitchBar.insertBefore(activateBtn, twitchBar.firstChild);
                 document.body.appendChild(d);
             }
        }
    }
    setInterval(appendActivatorBtn, 1E3);

    d.style.display = 'none';


    d.querySelector(".closeBtn").onclick = () => d.style.display='none';

    d.querySelector(".clear").onclick = function(){
        textarea.value = '';
    };
    
    d.querySelector(".extract").onclick = function(){
         let usernames = [];
         textarea.value.replace(/Thank you for following ([\w_]+) /g, (m,name)=>{
             usernames.push(name);
             return '';
         });
        usernames = [... new Set(usernames)];
        if(usernames)
            textarea.value = usernames.join('\n');
        else 
            textarea.value = 'No usernames found!'
    };

    const delay = t=>new Promise(r=>setTimeout(r,t));
    function sendMessage(msg){
      const textarea = document.querySelector("[data-a-target='chat-input']");
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeTextAreaValueSetter.call(textarea, msg);
      const event = new Event('input', { bubbles: true});
      textarea.dispatchEvent(event);
      document.querySelector("[data-a-target='chat-send-button']").click();
    }
  
    d.querySelector(".banAll").onclick = async function(){
        var lines = textarea.value.split(/\n/).map(t=>t.trim()).filter(Boolean);
        for(const line of lines){
            sendMessage('/ban '+line);
            await delay(250);
        }
        textarea.value = '';
    };


})();
