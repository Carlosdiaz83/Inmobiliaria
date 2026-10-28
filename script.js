const intro=document.getElementById('intro');
const enter=()=>{
  if(intro.classList.contains('key-inserting'))return;
  intro.classList.add('key-inserting');
  window.setTimeout(()=>intro.classList.add('door-opening'),720);
  window.setTimeout(()=>intro.classList.add('crossing'),2050);
  window.setTimeout(()=>{intro.classList.add('is-opening');document.body.classList.remove('intro-active')},2550);
  window.setTimeout(()=>intro.remove(),3400);
};
document.getElementById('enter').addEventListener('click',enter);
document.body.classList.add('intro-active');
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.section-kicker,.about-grid,.about-bottom,.listings-heading,.empty-listing,.sales-layout,.sales-foot,.contact-inner').forEach(el=>{el.classList.add('reveal');observer.observe(el)});

