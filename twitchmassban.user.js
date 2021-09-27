
// ==UserScript==
// @name          RaidHammer - Easily ban multiple accounts during hate raids
// @description   A tool making twitch modding easier during hate raids
// @namespace     https://github.com/victornpb/twitch-mass-ban
// @version       0.9.2
// @match         *://*.twitch.tv/*
// @grant         none
// @run-at        document-idle
// @homepageURL   https://github.com/victornpb/twitch-mass-ban
// @supportURL    https://github.com/victornpb/twitch-mass-ban/issues
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
            padding: 5px;
            min-width: 300px;
        }

        .raidhammer .logo {
            font-weight: var(--font-weight-semibold);
            min-height: 30px;
            line-height: 30px;
            color: var(--color-text-link);
        }

        .raidhammer .list {
            padding: 1em;
            min-height: 8em;
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
            font-size: 12pt;
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

        .raidhammer .footer {
            font-size: 7pt;
            text-align: center;
        }
    </style>
    <div style="display: flex;">
        <div class="logo">RaidHammer</div>
        &nbsp;&nbsp;
        <button class="ignoreAll">IGNORE ALL</button>
        <button class="banAll">BAN ALL</button>
        <span style="flex-grow: 1;"></span>
        <button class="closeBtn">X</button>
    </div>
    <br>
    <h5>Recent Users</h5>
    <div class="list"></div>
    <div class="footer">
        <a href="https://github.com/victornpb/twitch-mass-ban" target="_blank">github.com/victornpb/twitch-mass-ban</a>
    </div>
</div>
`;

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
    activateBtn.onclick = show;


    function appendActivatorBtn() {
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


    function show() {
        d.style.display = '';
        renderList();
    }

    function hide() {
        d.style.display = 'none';
    }

    //events
    d.querySelector(".ignoreAll").onclick = ignoreAll;
    d.querySelector(".banAll").onclick = banAll;
    d.querySelector(".closeBtn").onclick = hide;

    // delegated events
    d.addEventListener('click', e => {
        const target = e.target;
        if (target.matches('.ignore')) ignoreItem(target.dataset.user);
        if (target.matches('.ban')) banItem(target.dataset.user);
        if (target.matches('.accountage')) accountage(target.dataset.user);
    });

    setInterval(watchdog, 500);

    const delay = t => new Promise(r => setTimeout(r, t));

    let ignoredList = new Set();
    let queueList = new Set();
    let bannedList = new Set();

    function extractRecent() {
        const chatArea = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');
        if (!chatArea) return;

        let usernames = [];
        chatArea.innerText.replace(/Thank you for following ([\w_]+) /g, (m, name) => {
            usernames.push(name);
            return '';
        });
        usernames = [...new Set(usernames)];
        return usernames;
    }


    function watchdog() {
        const recentNames = extractRecent();
        if (recentNames) {
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

    function onFollower() {
        console.log('onFollower', queueList);
        renderList();
        show();
    }

    function ignoreAll() {
        for (const user of queueList)
            ignoreItem(user);
    }

    async function banAll() {
        for (const user of queueList) {
            banItem(user);
            await delay(250);
        }
    }

    function accountage(item) {
        console.log('Accountage', item);
        sendMessage('!accountage ' + item);
    }

    function ignoreItem(item) {
        console.log('Ignored user', item);
        queueList.delete(item);
        ignoredList.add(item);
        renderList();
    }

    function banItem(item) {
        console.log('Ban user', item);
        queueList.delete(item);
        bannedList.add(item);
        sendMessage('/ban ' + item);
        renderList();
    }

    function renderList() {
        const renderItem = item => `
        <li>
          <button class="accountage" data-user="${item}" title="Check account age">?</button>
          <button class="ignore" data-user="${item}">IGNORE</button>
          <button class="ban" data-user="${item}">BAN</button>
          <span>${item}</span>
        </li>
      `;

        let inner = queueList.size ? [...queueList].map(user => renderItem(user)).join('') : `<div class="empty">Empty :)</div>`;

        d.querySelector('.list').innerHTML = `
        <ul>
          ${inner}
        </ul>
      `;
    }

    function sendMessage(msg) {
        const textarea = document.querySelector("[data-a-target='chat-input']");
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextAreaValueSetter.call(textarea, msg);
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        document.querySelector("[data-a-target='chat-send-button']").click();
    }
})();
