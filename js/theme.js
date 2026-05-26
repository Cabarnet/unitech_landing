(function(){
  const html=document.documentElement;
  const btn=document.getElementById('themeToggle');
  const sun=document.getElementById('iconSun');
  const moon=document.getElementById('iconMoon');
  function getTheme(){const s=localStorage.getItem('theme');if(s)return s;return window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
  function apply(t){html.dataset.theme=t;if(t==='dark'){sun.style.display='none';moon.style.display='block'}else{sun.style.display='block';moon.style.display='none'}}
  apply(getTheme());
  btn.addEventListener('click',()=>{const n=html.dataset.theme==='dark'?'light':'dark';localStorage.setItem('theme',n);apply(n)});
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',e=>{if(!localStorage.getItem('theme'))apply(e.matches?'dark':'light')});
})();
