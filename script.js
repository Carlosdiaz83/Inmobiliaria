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
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const vw=window.innerWidth;
    const vh=window.innerHeight;
    canvas.width=Math.round(vw*dpr);
    canvas.height=Math.round(vh*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const logoSize=rect.width||260;
    const grid=48;
    cellCss=logoSize/grid;
    particles=[];

    const sw=logo.naturalWidth/grid;
    const sh=logo.naturalHeight/grid;
    const startX=rect.left;
    const startY=rect.top;
    const maxRadius=Math.hypot(vw,vh)*0.85;

    for(let row=0;row<grid;row++){
      for(let col=0;col<grid;col++){
        const pStartX=startX+col*cellCss;
        const pStartY=startY+row*cellCss;
        const dx=pStartX+cellCss/2-vw/2;
        const dy=pStartY+cellCss/2-vh/2;
        const baseAngle=Math.atan2(dy,dx);
        const angle=baseAngle+(Math.random()-0.5)*0.75;
        const travelDist=maxRadius*(0.75+Math.random()*0.55);

        particles.push({
          sx:col*sw,
          sy:row*sh,
          sw:sw,
          sh:sh,
          startX:pStartX,
          startY:pStartY,
          targetDx:Math.cos(angle)*travelDist,
          targetDy:Math.sin(angle)*travelDist,
          spin:(Math.random()-0.5)*5,
          delay:Math.random()*0.32,
          fadeStart:0.45+Math.random()*0.4
        });
      }
    }
  }

  function scatterLogo(){
    if(!ctx||!particles.length)return;
    const started=performance.now();
    const duration=2200;
    canvas.classList.add('is-active');
    logo.style.opacity='0';

    function frame(now){
      const elapsed=Math.min(1,(now-started)/duration);
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();

      const pSize=cellCss+0.8;
      for(let i=0;i<particles.length;i++){
        const part=particles[i];
        const progress=Math.max(0,Math.min(1,(elapsed-part.delay)/(1-part.delay)));
        if(progress<=0){
          ctx.drawImage(logo,part.sx,part.sy,part.sw,part.sh,part.startX,part.startY,pSize,pSize);
          continue;
        }

        const eased=Math.pow(progress,1.6);
        const curX=part.startX+part.targetDx*eased;
        const curY=part.startY+part.targetDy*eased;

        let alpha=1;
        if(progress>part.fadeStart){
          alpha=Math.max(0,1-(progress-part.fadeStart)/(1-part.fadeStart));
        }
        if(alpha<=0)continue;

        ctx.save();
        ctx.globalAlpha=alpha;
        ctx.translate(curX+cellCss/2,curY+cellCss/2);
        ctx.rotate(part.spin*eased);
        ctx.drawImage(logo,part.sx,part.sy,part.sw,part.sh,-pSize/2,-pSize/2,pSize,pSize);
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
    window.setTimeout(()=>{intro.classList.add('is-fracturing');scatterLogo();},1850);
    window.setTimeout(()=>intro.classList.add('is-revealing'),3300);
    window.setTimeout(()=>intro.remove(),4200);
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
