
// ==UserScript==
// @name          RaidHammer - Easily ban multiple accounts during hate raids
// @description   A tool making twitch modding easier during hate raids
// @namespace     https://github.com/victornpb/twitch-mass-ban
// @version       1.0.0
// @match         *://*.twitch.tv/*
// @grant         none
// @run-at        document-idle
// @homepageURL   https://github.com/victornpb/twitch-mass-ban
// @supportURL    https://github.com/victornpb/twitch-mass-ban/issues
// @downloadURL   https://github.com/victornpb/twitch-mass-ban/raw/master/twitchmassban.user.js
// @contributionURL https://www.buymeacoffee.com/vitim
// @grant         none
// @license       MIT
// ==/UserScript==

(function () {
    var html = /*html*/`
    <div class="raidhammer">
    <style>
        .raidhammer {
            position: fixed;
            bottom: 10px;
            right: 350px;
            z-index: 99999999;
            background-color: var(--color-background-base);
            color: var(--color-text-base);
            border: var(--border-width-default) solid var(--color-border-base);
            box-shadow: var(--shadow-elevation-2);
            padding: 5px;
            min-width: 300px;
        }
        
        .raidhammer .list {
            background: var(--color-background-body);
        }
      
        .raidhammer .logo {
            font-weight: var(--font-weight-semibold);
            min-height: 30px;
            line-height: 30px;
            color: var(--color-text-link);
        }
      
        .raidhammer h5 button {
            height: auto;
            background: none;
        }

        .raidhammer .list {
            padding: 1em;
            min-height: 8em;
            max-height: 500px;
            overflow-y: auto;
        }

        .raidhammer .empty {
            padding: 2em;
            text-align: center;
            opacity: 0.85;
        }

        .raidhammer textarea {
            background: var(--color-background-base);
            color: var(--color-text-base);
            padding: .5em;
            font-size: 10pt;
        }

        .raidhammer button {
            padding: 0 .2em;
            margin: 1px;
            font-weight: var(--font-weight-semibold);
            border-radius: var(--border-radius-medium);
            font-size: var(--button-text-default);
            height: var(--button-size-default);
            background-color: var(--color-background-button-secondary-default);
            color: var(--color-text-button-secondary);
            min-width: 30px;
            text-align: center;
        }

        .raidhammer button.ban {
            var(--color-text-button-primary);
            background: #f44336;
            min-width: 60px;
        }

        .raidhammer button.banAll {
            var(--color-text-button-primary);
            background: #f44336;
            min-width: 60px;
        }
        
        .raidhammer .import {
            border: var(--border-width-default) solid var(--color-border-base);
            padding: 3px; 
        }
      
        .raidhammer .import textarea {
            width: 100%;
            min-height: 8em;
        }
      
        .raidhammer .footer {
            font-size: 7pt;
            text-align: center;
        }
      
    </style>
    <div style="display: flex;">
        <div class="logo"><a href="https://github.com/victornpb/twitch-mass-ban" target="_blank">RaidHammer 0.11.0</a></div>
        <span style="flex-grow: 1;"></span>
        <button class="closeBtn">X</button>
    </div>
    <div class="import" style="display:none;">
      <div>Import users</div>
      <textarea placeholder="Insert one username per line"></textarea>
      <div style="text-align:right;">
        <button class="cancel">Cancel</button><button class="import">Import</button>
      </div>
    </div>
    <div class="body">
      <h5 style="display: flex;">
        Recent Users
        <span style="flex-grow: 1;"></span>
      </h5>
      <div class="list"></div>
      <div style="display: flex; margin: 5px;">
        <span style="flex-grow: 1;"></span>
        <button class="ignoreAll">Ignore All</button>
        <button class="banAll">Ban All</button>
      </div>
    </div>
    <div class="footer"><a href="https://github.com/victornpb/twitch-mass-ban/issues" target="_blank">Issues or help</a></div>
</div>
`;
    const LOGPREFIX = '[RAIDHAMMER]';

    // modal
    const d = document.createElement("div");
    d.style.display = 'none';
    d.innerHTML = html;
    const textarea = d.querySelector("textarea");

    // activation button
    const activateBtn = document.createElement('button');
    activateBtn.innerHTML = `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1280 1280" style="fill: currentcolor;">
        <path d="M517 1c-16 3-28 10-41 22l-10 10 161 160 161 161 2-2c6-4 17-19 21-25 10-19 12-44 4-64-6-14-5-13-120-129L576 17c-8-7-18-12-27-15-8-1-25-2-32-1zM249 250 77 422l161 161 161 161 74-74 74-75 18 19 18 18-2 4c-4 6-4 14-1 20a28808 28808 0 0 0 589 621c4 2 6 3 13 3 6 0 8-1 13-3 6-4 79-77 82-83 4-9 4-21-2-29l-97-93-235-223-211-200c-51-47-73-68-76-69-6-3-13-3-19 0l-5 3-18-18-18-18 74-74 74-74-161-161L422 77 249 250zM23 476a75 75 0 0 0-10 95c4 6 219 222 231 232 8 7 16 11 26 14 6 2 10 2 22 2s14 0 22-2l14-6c5-4 20-16 24-21l2-2-161-161L32 466l-9 10z"/>
      </svg>
    `;
    activateBtn.style.cssText = `
        display: inline-flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        user-select: none;
        height: var(--button-size-default);
        width: var(--button-size-default);
        border-radius: var(--border-radius-medium);
        background-color: var(--color-background-button-text-default);
        color: var(--color-fill-button-icon);
    `;
    activateBtn.setAttribute('title', 'RaidHammer');
    activateBtn.onclick = toggle;

    let enabled;
    let watchdogTimer;

    function appendActivatorBtn() {
        const modBtn = document.querySelector('[data-test-selector="mod-view-link"]');
        if (modBtn) {
            const twitchBar = modBtn.parentElement.parentElement.parentElement;
            if (twitchBar && !twitchBar.contains(activateBtn)) {
                console.log(LOGPREFIX, 'Mod tools available. Adding button...');
                twitchBar.insertBefore(activateBtn, twitchBar.firstChild);
                document.body.appendChild(d);
                if (!enabled) {
                    console.log(LOGPREFIX, 'Started chatWatchdog...');
                    watchdogTimer = setInterval(chatWatchdog, 500);
                    enabled = true;
                }
            }

        }
        else {
            if (enabled) {
                console.log(LOGPREFIX, 'Mod tools not found. Stopped chatWatchdog!');
                clearInterval(watchdogTimer);
                watchdogTimer = enabled = false;
                hide();
            }
        }
    }
    setInterval(appendActivatorBtn, 5000);


    //events
    d.querySelector(".ignoreAll").onclick = ignoreAll;
    d.querySelector(".banAll").onclick = banAll;
    d.querySelector(".closeBtn").onclick = hide;

    d.querySelector(".import button.import").onclick = importList;
    d.querySelector(".import button.cancel").onclick = toggleImport;

    // delegated events
    d.addEventListener('click', e => {
        const target = e.target;
        if (target.matches('.ignore')) ignoreItem(target.dataset.user);
        if (target.matches('.ban')) banItem(target.dataset.user);
        if (target.matches('.accountage')) accountage(target.dataset.user);
        if (target.matches('.toggleImport')) toggleImport();

    });

    const delay = t => new Promise(r => setTimeout(r, t));

    function show() {
        console.log(LOGPREFIX, 'Show');
        d.style.display = '';
        renderList();
    }

    function hide() {
        console.log(LOGPREFIX, 'Hide');
        d.style.display = 'none';
    }

    function toggle() {
        if (d.style.display !== 'none') hide();
        else show();
    }

    function toggleImport() {
        const importDiv = d.querySelector(".import");
        const body = d.querySelector(".body");
        if (importDiv.style.display !== 'none') {
            importDiv.style.display = 'none';
            body.style.display = '';
        }
        else {
            importDiv.style.display = '';
            body.style.display = 'none';
            d.querySelector(".import textarea").focus();
        }
    }

    function importList() {
        const textarea = d.querySelector(".import textarea");
        const lines = textarea.value.split(/\n/).map(line => line.trim()).filter(Boolean);
        for (const line of lines) {
            if (/^[\w_]+$/.test(line)) queueList.add(line);
        }
        textarea.value = '';
        toggleImport();
        renderList();
    }

    let ignoredList = new Set();
    let queueList = new Set();
    let bannedList = new Set();

    function chatWatchdog() {
        const recentNames = extractRecent();
        if (recentNames.length) {
            const newNames = recentNames
                .filter(name => !queueList.has(name))
                .filter(name => !ignoredList.has(name))
                .filter(name => !bannedList.has(name));

            if (newNames.length) {
                newNames.forEach(name => queueList.add(name));
                onFollower();
            }
        }
    }

    function extractRecent() {
        function findMatches(set, text, regex) {
            text.replace(regex, (m, g) => {
                set.add(g);
            });
        }

        let usernames = new Set();
        const chatArea = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');
        if (chatArea) {
            findMatches(usernames, chatArea.innerText, /Thank you for following ([\w_]+)/g);
            findMatches(usernames, chatArea.innerText, /Welcome! ([\w_]+) Thank you for following!/g);
        }
        return [...usernames];
    }

    function onFollower() {
        console.log(LOGPREFIX, 'onFollower', queueList);
        renderList();
        show();
    }

    function ignoreAll() {
        console.log(LOGPREFIX, 'Ignoring all...', queueList);
        for (const user of queueList)
            ignoreItem(user);
    }

    async function banAll() {
        console.log(LOGPREFIX, 'Banning all...', queueList);
        for (const user of queueList) {
            banItem(user);
            await delay(250);
        }
    }

    function accountage(user) {
        console.log(LOGPREFIX, 'Accountage', user);
        sendMessage('!accountage ' + user);
    }

    function ignoreItem(user) {
        console.log(LOGPREFIX, 'Ignored user', user);
        queueList.delete(user);
        ignoredList.add(user);
        renderList();
        if (queueList.size === 0) hide(); // auto hide on the last
    }

    function banItem(user) {
        console.log(LOGPREFIX, 'Ban user', user);
        queueList.delete(user);
        bannedList.add(user);
        sendMessage('/ban ' + user);
        renderList();
    }

    function sendMessage(msg) {
        const textarea = document.querySelector("[data-a-target='chat-input']");
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(textarea, msg);
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        document.querySelector("[data-a-target='chat-send-button']").click();
    }

    function renderList() {
        d.querySelector(".ignoreAll").style.display = queueList.size ? '' : 'none';
        d.querySelector(".banAll").style.display = queueList.size ? '' : 'none';
        const renderItem = item => `
        <li>
          <button class="accountage" data-user="${item}" title="Check account age">?</button>
          <button class="ignore" data-user="${item}">Ignore</button>
          <button class="ban" data-user="${item}">Ban</button>
          <span>${item}</span>
        </li>
      `;

        let inner = queueList.size ? [...queueList].map(user => renderItem(user)).join('') : `<div class="empty">Empty :)<br><br><button class="toggleImport" title="Add a list of usernames">Add names</button></div>`;

        d.querySelector('.list').innerHTML = `
        <ul>
          ${inner}
        </ul>
      `;
    }

})();
