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
  window.setTimeout(()=>intro.classList.add('is-fracturing'),750);
  window.setTimeout(()=>intro.classList.add('is-revealing'),1450);
  window.setTimeout(()=>intro.remove(),2350);
}
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});

