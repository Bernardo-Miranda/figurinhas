(function(){
  let total=9*60+47;
  const el=document.getElementById('timer');
  const iv=setInterval(()=>{
    if(total<=0){clearInterval(iv);el.textContent='00:00';return;}
    total--;
    const m=Math.floor(total/60).toString().padStart(2,'0');
    const s=(total%60).toString().padStart(2,'0');
    el.textContent=m+':'+s;
  },1000);
})();

(function(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}); 
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();

const proofs=[
  {name:'Lucas M.',city:'São Paulo, SP',action:'acabou de comprar o Pack Premium ⚡',emoji:'👨',time:'há 1 minuto'},
  {name:'Amanda R.',city:'Rio de Janeiro, RJ',action:'acabou de liberar acesso completo 🏆',emoji:'👩',time:'há 2 minutos'},
  {name:'João P.',city:'Curitiba, PR',action:'adicionou o pack completo agora 🎉',emoji:'🧑',time:'há 3 minutos'},
  {name:'Felipe S.',city:'Belo Horizonte, MG',action:'comprou as figurinhas especiais ✨',emoji:'😎',time:'há 1 minuto'},
  {name:'Mariana C.',city:'Porto Alegre, RS',action:'acabou de completar o álbum 🎊',emoji:'👧',time:'há 4 minutos'},
  {name:'Carlos E.',city:'Fortaleza, CE',action:'garantiu o Pack Premium agora ⚽',emoji:'🧔',time:'há 2 minutos'},
  {name:'Bianca T.',city:'Salvador, BA',action:'baixou o pack completo agora 📥',emoji:'👩',time:'há 1 minuto'},
  {name:'Rafael N.',city:'Recife, PE',action:'comprou o Pack Premium com desconto 💥',emoji:'👨',time:'há 3 minutos'},
];
let proofIdx=0;
const popup=document.getElementById('socialProof');
function showProof(){
  const p=proofs[proofIdx%proofs.length];proofIdx++;
  document.getElementById('spAvatar').textContent=p.emoji;
  document.getElementById('spName').textContent=p.name;
  document.getElementById('spAction').textContent=p.action;
  document.getElementById('spTime').textContent=p.time+' · '+p.city;
  popup.classList.add('show');
  setTimeout(()=>popup.classList.remove('show'),4200);
}
setTimeout(()=>{showProof();setInterval(showProof,7500);},3000);

const overlay=document.getElementById('upsellOverlay');
const FBCLID_STORAGE_KEY='checkout_fbclid';

function getStoredFbclid(){
  try{
    return sessionStorage.getItem(FBCLID_STORAGE_KEY)||'';
  }catch(e){
    return '';
  }
}

function storeFbclid(value){
  if(!value)return;
  try{
    sessionStorage.setItem(FBCLID_STORAGE_KEY,value);
  }catch(e){}
}
storeFbclid(new URLSearchParams(window.location.search).get('fbclid'));

function withPageParams(targetUrl){
  const pageParams=new URLSearchParams(window.location.search);
  const currentFbclid=pageParams.get('fbclid');
  if(currentFbclid){
    storeFbclid(currentFbclid);
  }

  const url=new URL(targetUrl,window.location.href);
  const storedFbclid=currentFbclid||getStoredFbclid();
  if(storedFbclid&&!url.searchParams.has('fbclid')){
    url.searchParams.append('fbclid',storedFbclid);
  }

  if(!pageParams.toString())return url.toString();

  pageParams.forEach((value,key)=>{
    if(!url.searchParams.has(key)){
      url.searchParams.append(key,value);
    }
  });

  return url.toString();
}

function isCheckoutUrl(targetUrl){
  if(!targetUrl||targetUrl.charAt(0)==='#')return false;
  try{
    const url=new URL(targetUrl,window.location.href);
    return url.hostname==='pay.lowify.com.br'||url.pathname.indexOf('/checkout')!==-1;
  }catch(e){
    return false;
  }
}

function updateCheckoutDestinations(root){
  root.querySelectorAll('a[href]').forEach(function(link){
    const href=link.getAttribute('href');
    if(isCheckoutUrl(href)){
      setAttrWithPageParams(link,'href',href);
    }
  });

  root.querySelectorAll('form[action]').forEach(function(form){
    const action=form.getAttribute('action');
    if(isCheckoutUrl(action)){
      setAttrWithPageParams(form,'action',action);
    }
  });

  root.querySelectorAll('iframe[src]').forEach(function(iframe){
    const src=iframe.getAttribute('src');
    if(isCheckoutUrl(src)){
      setAttrWithPageParams(iframe,'src',src);
    }
  });
}

function setAttrWithPageParams(element,attr,value){
  const nextValue=withPageParams(value);
  if(nextValue!==value){
    element.setAttribute(attr,nextValue);
  }
}

function goToCheckout(url){
  window.location.href=withPageParams(url);
}

function openUpsell(){overlay.classList.add('active');}
function closeUpsell(){overlay.classList.remove('active');}
function goBasic(){closeUpsell();goToCheckout('https://pay.lowify.com.br/checkout?product_id=m466jk');}
function goPremium(){goToCheckout('https://pay.lowify.com.br/checkout?product_id=GDVywd');}
function goPremiumDiscount(){closeUpsell();goToCheckout('https://pay.lowify.com.br/checkout?product_id=22K1oV');}
window.openUpsell=openUpsell;
window.closeUpsell=closeUpsell;
window.goBasic=goBasic;
window.goPremium=goPremium;
window.goPremiumDiscount=goPremiumDiscount;
window.withPageParams=withPageParams;
window.goToCheckout=goToCheckout;
updateCheckoutDestinations(document);
document.addEventListener('click',function(e){
  const link=e.target.closest&&e.target.closest('a[href]');
  if(link&&isCheckoutUrl(link.getAttribute('href'))){
    setAttrWithPageParams(link,'href',link.getAttribute('href'));
  }
},true);
document.addEventListener('submit',function(e){
  const form=e.target;
  if(form&&isCheckoutUrl(form.getAttribute&&form.getAttribute('action'))){
    const action=form.getAttribute('action');
    setAttrWithPageParams(form,'action',action);
  }
},true);
new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    if(mutation.type==='attributes'){
      updateCheckoutNode(mutation.target);
      return;
    }

    mutation.addedNodes.forEach(function(node){
      if(node.nodeType!==1)return;
      updateCheckoutNode(node);
      updateCheckoutDestinations(node);
    });
  });
}).observe(document.documentElement,{attributes:true,attributeFilter:['href','action','src'],childList:true,subtree:true});

function updateCheckoutNode(node){
  if(!node.getAttribute)return;

  if(isCheckoutUrl(node.getAttribute('href'))){
    setAttrWithPageParams(node,'href',node.getAttribute('href'));
  }

  if(isCheckoutUrl(node.getAttribute('action'))){
    setAttrWithPageParams(node,'action',node.getAttribute('action'));
  }

  if(isCheckoutUrl(node.getAttribute('src'))){
    setAttrWithPageParams(node,'src',node.getAttribute('src'));
  }
}
overlay.addEventListener('click',function(e){if(e.target===overlay)closeUpsell();});
