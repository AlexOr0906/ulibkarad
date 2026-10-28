export function initHeaderNavigation() {
  document.querySelectorAll<HTMLElement>('[data-hn-header]').forEach(root => {
    if(root.dataset.hnReady) return;
    root.dataset.hnReady='true';
    const disclosure=root.querySelector<HTMLDetailsElement>('[data-hn-disclosure]')!;
    const toggle=disclosure.querySelector<HTMLElement>('summary')!;
    const panel=disclosure.querySelector<HTMLElement>('.hn-panel')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const desktop=matchMedia('(min-width: 1100px)');
    let menuHadFocus=false;
    let desired=false, sequence=0, animation: Animation | null=null;
    async function setOpen(open: boolean, instant=false) {
      const request=++sequence;desired=open;animation?.cancel();animation=null;
      toggle.setAttribute('aria-expanded',String(open));
      if(open) disclosure.open=true;
      if(!disclosure.open)return;
      if(!instant&&!reduced.matches&&'animate' in panel){
        animation=panel.animate(open?[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}],{duration:open?230:160,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
        await animation.finished.catch(()=>{});
      }
      if(request!==sequence)return;
      if(!open)disclosure.open=false;
      animation?.cancel();animation=null;
    }
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',e=>{e.preventDefault();void setOpen(!desired);});
    root.addEventListener('keydown',async e=>{
      if(e.key==='Escape'&&(desired||disclosure.open)){e.preventDefault();await setOpen(false);toggle.focus();}
    });
    disclosure.addEventListener('focusin',()=>{menuHadFocus=true;});
    disclosure.addEventListener('focusout',e=>{if(e.relatedTarget instanceof Node&&!disclosure.contains(e.relatedTarget)){menuHadFocus=false;void setOpen(false);}});
    document.addEventListener('pointerdown',e=>{if(e.target instanceof Node&&!root.contains(e.target)&&disclosure.open)void setOpen(false);},{passive:true});
    panel.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link=>link.addEventListener('click',async e=>{
      const href=link.getAttribute('href')!;
      const target=href.startsWith('#')?document.getElementById(href.slice(1)):null;
      if(!target){void setOpen(false,true);return;}
      e.preventDefault();await setOpen(false);
      const added=!target.hasAttribute('tabindex');if(added)target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      if(added)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
      history.pushState(null,'',href);target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
    }));
    desktop.addEventListener('change',()=>{
      if(!desktop.matches)return;
      const moveFocus=menuHadFocus||disclosure.contains(document.activeElement);
      void setOpen(false,true);
      if(moveFocus)root.querySelector<HTMLAnchorElement>('.hn-cta')?.focus();
    });
    reduced.addEventListener('change',()=>{if(reduced.matches)void setOpen(desired,true);});
    window.addEventListener('pageshow',e=>{if(e.persisted)void setOpen(false,true);});
  });
}
