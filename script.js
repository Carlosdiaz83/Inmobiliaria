const intro=document.getElementById('intro');
const views=[...document.querySelectorAll('.view')];
const tabs=[...document.querySelectorAll('.nav-tab')];
function showView(id){
  const target=document.getElementById(id);
  if(!target||!target.classList.contains('view'))return;
  views.forEach(view=>view.classList.toggle('is-active',view===target));
  tabs.forEach(tab=>{const active=tab.dataset.view===id;tab.classList.toggle('active',active);if(active)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')});
  document.getElementById('nav').classList.remove('open');
  document.getElementById('menu-toggle').setAttribute('aria-expanded','false');
  history.replaceState(null,'',`#${id}`);
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));
document.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=link.getAttribute('href').slice(1);if(document.getElementById(id)?.classList.contains('view')){event.preventDefault();showView(id)}}));
showView('inicio');
if(intro){
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const logo=document.querySelector('.reveal-main');
  const canvas=document.querySelector('.logo-particles');
  const ctx=canvas?.getContext('2d');
  let particles=[];

  function prepareParticles(){
    if(!logo?.naturalWidth||!canvas||!ctx)return;
    const size=logo.getBoundingClientRect().width;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(size*ratio);
    canvas.height=Math.round(size*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const grid=48,cell=size/grid;
    particles=[];
    for(let row=0;row<grid;row++)for(let col=0;col<grid;col++){
      const angle=Math.atan2(row-(grid-1)/2,col-(grid-1)/2)+(Math.random()-.5)*.8;
      const distance=65+Math.random()*190;
      particles.push({sx:col*logo.naturalWidth/grid,sy:row*logo.naturalHeight/grid,sw:logo.naturalWidth/grid+1,sh:logo.naturalHeight/grid+1,x:col*cell,y:row*cell,vx:Math.cos(angle)*distance,vy:Math.sin(angle)*distance,rotation:(Math.random()-.5)*1.4,delay:Math.random()*.24,scale:.25+Math.random()*.35});
    }
  }

  function scatterLogo(){
    if(!ctx||!particles.length)return;
    const started=performance.now(),duration=1250;
    canvas.classList.add('is-active');
    function frame(now){
      const elapsed=Math.min(1,(now-started)/duration);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cell=canvas.clientWidth/48;
      for(const part of particles){
        const progress=Math.max(0,Math.min(1,(elapsed-part.delay)/(1-part.delay)));
        const eased=1-Math.pow(1-progress,2.2),width=cell*(1-part.scale*eased);
        if(width<.25)continue;
        ctx.save();ctx.globalAlpha=1-eased;
        ctx.translate(part.x+part.vx*eased+cell/2,part.y+part.vy*eased+cell/2);
        ctx.rotate(part.rotation*eased);
        ctx.drawImage(logo,part.sx,part.sy,part.sw,part.sh,-width/2,-width/2,width,width);
        ctx.restore();
      }
      if(elapsed<1)requestAnimationFrame(frame);else canvas.classList.remove('is-active');
    }
    requestAnimationFrame(frame);
  }

  if(reducedMotion)window.setTimeout(()=>intro.remove(),120);
  else{
    if(logo?.complete)prepareParticles();else logo?.addEventListener('load',prepareParticles,{once:true});
    window.setTimeout(()=>{intro.classList.add('is-fracturing');scatterLogo()},750);
    window.setTimeout(()=>intro.classList.add('is-revealing'),1750);
    window.setTimeout(()=>intro.remove(),2400);
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
