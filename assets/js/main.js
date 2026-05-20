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
function openUpsell(){overlay.classList.add('active');}
function closeUpsell(){overlay.classList.remove('active');}
function goBasic(){closeUpsell();window.location.href='https://zuckpay.com.br/checkout/pack-basico';}
function goPremium(){window.location.href='https://zuckpay.com.br/checkout/pack-premium';}
function goPremiumDiscount(){closeUpsell();window.location.href='https://zuckpay.com.br/checkout/premium-com-desconto';}
window.openUpsell=openUpsell;
window.closeUpsell=closeUpsell;
window.goBasic=goBasic;
window.goPremium=goPremium;
window.goPremiumDiscount=goPremiumDiscount;
overlay.addEventListener('click',function(e){if(e.target===overlay)closeUpsell();});
