(function() {
    var html = `<div class="botban" style="position: fixed; bottom: 50px; left: 50px; z-index: 99999999; background-color:#311b92; color:white; border: 1px solid white; padding:5px;">
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
    backgoo
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

    var d = document.createElement("div");
    d.innerHTML = html;
    var textarea = d.querySelector("textarea");
    document.body.appendChild(d);
    textarea.focus();

    d.querySelector(".closeBtn").onclick = () => document.body.removeChild(d);

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
            await delay(100);
        }
        textarea.value = '';
    };


})();
