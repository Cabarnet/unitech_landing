// ── Theme ─────────────────────────────────────────────────────
(function(){
  const h=document.documentElement,btn=document.getElementById('themeToggle'),
        sun=document.getElementById('iSun'),moon=document.getElementById('iMoon');
  function get(){const s=localStorage.getItem('theme');return s||( window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}
  function set(t){h.dataset.theme=t;sun.style.display=t==='dark'?'none':'block';moon.style.display=t==='dark'?'block':'none'}
  set(get());
  btn.addEventListener('click',()=>{const n=h.dataset.theme==='dark'?'light':'dark';localStorage.setItem('theme',n);set(n)});
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',e=>{if(!localStorage.getItem('theme'))set(e.matches?'dark':'light')});
})();

// ── Burger ────────────────────────────────────────────────────
const burger=document.getElementById('burgerBtn'),mNav=document.getElementById('mobileNav');
burger.addEventListener('click',()=>{
  const o=burger.classList.toggle('open');
  mNav.classList.toggle('open',o);
  burger.setAttribute('aria-expanded',o);
  document.body.style.overflow=o?'hidden':'';
});
mNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  burger.classList.remove('open');mNav.classList.remove('open');
  burger.setAttribute('aria-expanded','false');document.body.style.overflow='';
}));

// ── Preloader → reveal sequence ───────────────────────────────
const pl=document.getElementById('preloader'),plLogo=document.getElementById('plLogo'),
      hdr=document.getElementById('header'),heroInner=document.getElementById('heroInner'),
      partners=document.getElementById('partners'),arcsEl=document.getElementById('heroArcs');
let arcsActivated=false;

const arcPD=[
  {d:'M43.4,47.7c-0.4,0-0.8,0-1.1-.4l-17.8-20.1c-2.1-2.5-1.9-6.2.5-8.3l1.2-1.2c1.1-1.1,2.8-1.5,4.3-1.5s3.1.8,4,1.9l8,9c.6.6.5,1.5-.2,2.1s-1.5.5-2.1-.2l-8-9c-0.5-0.5-1.3-0.8-2-1-0.8,0-1.5.2-2,.7l-1.2,1.3c-1.1,1.1-1.3,3-0.2,4.1l17.9,20.1c.6.6.5,1.5-.2,2.1-0.3,0.4-0.7,0.6-1.1,0.5h0Z',y:true,sz:80},
  {d:'M42.6,77.4c-17.8-0.5-33-13-37-30.3-0.2-0.8.3-1.6,1.2-1.8.8-0.2,1.6.3,1.8,1.2,3.6,16,17.7,27.6,34.2,28.1,13.5.4,26-6.7,32.7-18.5.4-0.7,1.3-1,2-0.5.7.4,1,1.3.5,2-7.1,12.6-20.7,20.3-35.4,19.8Z',y:true,sz:110}
];

function buildArcs(){
  arcsEl.innerHTML='';
  const W=window.innerWidth,H=window.innerHeight;
  for(let i=0;i<8;i++){
    const a=arcPD[i%2];
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 86 85');svg.classList.add('arc');
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',a.d);p.classList.add('arc-path');if(a.y)p.classList.add('y');
    svg.appendChild(p);
    const sx=(Math.random()>.5?-1:2)*W*(.3+Math.random()*.4),sy=(Math.random()-.5)*H*.8;
    const mx=(Math.random()-.5)*W*.35,my=(Math.random()-.5)*H*.35;
    const ex=(Math.random()>.5?2:-1)*W*(.3+Math.random()*.4),ey=(Math.random()-.5)*H*.8;
    svg.style.cssText=`width:${a.sz}px;height:${a.sz}px;left:50%;top:50%;margin-left:${-a.sz/2}px;margin-top:${-a.sz/2}px`;
    const cv=(k,v)=>svg.style.setProperty(k,v);
    cv('--sx',sx+'px');cv('--sy',sy+'px');cv('--mx',mx+'px');cv('--my',my+'px');
    cv('--ex',ex+'px');cv('--ey',ey+'px');
    cv('--sr',Math.random()*360+'deg');cv('--mr',(Math.random()*360+180)+'deg');cv('--er',(Math.random()*360+360)+'deg');
    cv('--sc',180);cv('--op',(.04+Math.random()*.07).toString());
    cv('--dur',(20+Math.random()*14)+'s');cv('--del',Math.random()*5+'s');
    arcsEl.appendChild(svg);
  }
  if(arcsActivated)arcsEl.querySelectorAll('.arc').forEach(a=>a.classList.add('on'));
}

window.addEventListener('load',()=>{
  setTimeout(()=>plLogo.classList.add('out'),1400);
  setTimeout(()=>pl.classList.add('hidden'),2200);
  setTimeout(()=>hdr.classList.add('visible'),2300);
  setTimeout(()=>{
    buildArcs();
    arcsActivated=true;
    document.querySelectorAll('.arc').forEach((a,i)=>setTimeout(()=>a.classList.add('on'),i*250));
  },2800);
  setTimeout(()=>{
    heroInner.classList.add('hero-visible');
    partners.classList.add('vis');
    initIO();
  },3000);
});

// ── Scroll reveal ─────────────────────────────────────────────
function initIO(){
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -32px 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
}

// ── Problems carousel ─────────────────────────────────────────
document.querySelectorAll('.c-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const tr=document.getElementById(btn.dataset.track);
    if(!tr)return;
    const card=tr.querySelector('.pb-card');
    const w=card?(card.offsetWidth+16):360;
    tr.scrollBy({left:parseInt(btn.dataset.dir)*w,behavior:'smooth'});
  });
});
document.querySelectorAll('.c-track').forEach(tr=>{
  tr.addEventListener('keydown',e=>{
    const card=tr.querySelector('.pb-card');
    const w=card?(card.offsetWidth+16):360;
    if(e.key==='ArrowRight')tr.scrollBy({left:w,behavior:'smooth'});
    if(e.key==='ArrowLeft')tr.scrollBy({left:-w,behavior:'smooth'});
  });
});

// ── Projects slideshow ────────────────────────────────────────
(function(){
  const slides=document.querySelectorAll('.pj-slide');
  if(!slides.length)return;
  let cur=0,timer;
  function goTo(n){
    slides[cur].classList.remove('active');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');
  }
  function startAuto(){timer=setInterval(()=>goTo(cur+1),6000)}
  function resetAuto(){clearInterval(timer);startAuto()}
  startAuto();
  document.getElementById('pjPrev').addEventListener('click',()=>{goTo(cur-1);resetAuto()});
  document.getElementById('pjNext').addEventListener('click',()=>{goTo(cur+1);resetAuto()});
  document.querySelector('.pj-slider').addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){goTo(cur+1);resetAuto()}
    if(e.key==='ArrowLeft'){goTo(cur-1);resetAuto()}
  });
})();

// ── Magnetic effect ───────────────────────────────────────────
document.querySelectorAll('.mag').forEach(card=>{
  let rf;
  card.addEventListener('mousemove',e=>{
    cancelAnimationFrame(rf);
    rf=requestAnimationFrame(()=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/r.width*10;
      const dy=(e.clientY-r.top-r.height/2)/r.height*8;
      card.style.transform=`translate(${dx}px,${dy}px) scale(1.015)`;
    });
  });
  card.addEventListener('mouseleave',()=>{cancelAnimationFrame(rf);card.style.transform=''});
});

// ── Phone mask ────────────────────────────────────────────────
const ph=document.getElementById('fp');
ph.addEventListener('input',function(){
  let v=this.value.replace(/\D/g,'');
  if(v.startsWith('8'))v='7'+v.slice(1);
  if(v.length>0&&!v.startsWith('7'))v='7'+v;
  v=v.slice(0,11);
  let o='';
  if(v.length>0)o='+7';
  if(v.length>1)o+=' ('+v.slice(1,4);
  if(v.length>4)o+=') '+v.slice(4,7);
  if(v.length>7)o+='-'+v.slice(7,9);
  if(v.length>9)o+='-'+v.slice(9,11);
  this.value=o;
});
ph.addEventListener('focus',function(){if(!this.value)this.value='+7 ('});
ph.addEventListener('blur',function(){if(this.value==='+7 ('||this.value==='+7')this.value=''});

// ── Form ──────────────────────────────────────────────────────
const form=document.getElementById('contactForm'),
      fOk=document.getElementById('formOk'),
      fBtn=document.getElementById('fBtn');
const vEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const vPhone=v=>v.replace(/\D/g,'').length>=11;

form.addEventListener('submit',e=>{
  e.preventDefault();
  const nm=document.getElementById('fn'),em=document.getElementById('fe'),pn=document.getElementById('fp');
  [nm,em,pn].forEach(f=>f.classList.remove('err'));
  let ok=true;
  if(!nm.value.trim()){nm.classList.add('err');ok=false}
  if(!vEmail(em.value)){em.classList.add('err');ok=false}
  if(!vPhone(pn.value)){pn.classList.add('err');ok=false}
  if(!ok)return;
  fBtn.disabled=true;fBtn.textContent='Отправляем...';
  setTimeout(()=>{form.style.display='none';fOk.classList.add('show');fOk.scrollIntoView({behavior:'smooth',block:'center'})},900);
});
['fn','fe','fp'].forEach(id=>document.getElementById(id).addEventListener('input',function(){this.classList.remove('err')}));

// ── Resize arcs ───────────────────────────────────────────────
let rsT;
window.addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(buildArcs,350)});
document.addEventListener('visibilitychange',()=>{
  document.querySelectorAll('.arc').forEach(a=>{a.style.animationPlayState=document.hidden?'paused':'running'});
});
