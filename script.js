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
  let cellCss=0;

  function prepareParticles(){
    if(!logo?.naturalWidth||!canvas||!ctx)return;
    const rect=logo.getBoundingClientRect();
    const size=rect.width||260;
    const dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(size*dpr);
    canvas.height=Math.round(size*dpr);
    canvas.style.width=`${size}px`;
    canvas.style.height=`${size}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const grid=48;
    cellCss=size/grid;
    particles=[];
    const sw=logo.naturalWidth/grid;
    const sh=logo.naturalHeight/grid;
    for(let row=0;row<grid;row++){
      for(let col=0;col<grid;col++){
        const angle=Math.atan2(row-(grid-1)/2,col-(grid-1)/2)+(Math.random()-.5)*0.8;
        const distance=90+Math.random()*260;
        particles.push({
          sx:col*sw,
          sy:row*sh,
          sw:sw,
          sh:sh,
          x:col*cellCss,
          y:row*cellCss,
          vx:Math.cos(angle)*distance,
          vy:Math.sin(angle)*distance,
          rotation:(Math.random()-.5)*2.2,
          delay:Math.random()*0.28,
          scale:0.4+Math.random()*0.4
        });
      }
    }
  }

  function scatterLogo(){
    if(!ctx||!particles.length)return;
    const started=performance.now(),duration=1300;
    canvas.classList.add('is-active');
    logo.style.opacity='0';
    function frame(now){
      const elapsed=Math.min(1,(now-started)/duration);
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();
      const pSize=Math.max(cellCss*1.08,cellCss+0.6);
      for(let i=0;i<particles.length;i++){
        const part=particles[i];
        const progress=Math.max(0,Math.min(1,(elapsed-part.delay)/(1-part.delay)));
        const eased=1-Math.pow(1-progress,2.2);
        const curScale=Math.max(0.1,1-part.scale*eased);
        const w=pSize*curScale;
        ctx.save();
        ctx.globalAlpha=Math.max(0,1-progress);
        ctx.translate(part.x+part.vx*eased+cellCss/2,part.y+part.vy*eased+cellCss/2);
        ctx.rotate(part.rotation*eased);
        ctx.drawImage(logo,part.sx,part.sy,part.sw,part.sh,-w/2,-w/2,w,w);
        ctx.restore();
      }
      if(elapsed<1){
        requestAnimationFrame(frame);
      }else{
        canvas.classList.remove('is-active');
      }
    }
    requestAnimationFrame(frame);
  }

  if(reducedMotion)window.setTimeout(()=>intro.remove(),120);
  else{
    if(logo?.complete&&logo.naturalWidth)prepareParticles();
    else logo?.addEventListener('load',prepareParticles,{once:true});
    window.addEventListener('resize',()=>{if(!canvas?.classList.contains('is-active'))prepareParticles();},{passive:true});
    window.setTimeout(()=>{intro.classList.add('is-fracturing');scatterLogo();},850);
    window.setTimeout(()=>intro.classList.add('is-revealing'),1850);
    window.setTimeout(()=>intro.remove(),2500);
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
