/* Device-local header clock, independent of PDF editor initialization. */
(()=>{'use strict';
  const clock=document.getElementById('lvTime');
  if(!clock)return;
  const format=n=>String(n).padStart(2,'0');
  function tick(){
    const now=new Date();
    clock.textContent=`${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;
    clock.setAttribute('datetime',now.toISOString());
  }
  tick();
  setInterval(tick,1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  window.addEventListener('focus',tick);
})();
