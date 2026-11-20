// Génère des remplaçants : logo JP (assets/logo.png) et photo voiture (assets/voiture-photo.jpg).
// À remplacer par le vrai logo et une vraie photo.
import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const b=await chromium.launch();
const p=await b.newPage({deviceScaleFactor:1});
await p.setViewportSize({width:1200,height:700});
await p.setContent(`<html><body style="margin:0;background:transparent">
<div id="l" style="width:1200px;height:700px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Inter">
 <div style="position:relative;font-weight:900;font-size:380px;letter-spacing:-22px;color:#0E0E10;line-height:.9">JP
   <div style="position:absolute;left:-30px;right:-10px;top:52%;height:34px;background:#D7141A;transform:skewX(-28deg);mix-blend-mode:normal;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1"></div>
 </div>
 <div style="margin-top:34px;font-weight:700;font-size:54px;letter-spacing:14px;color:#0E0E10">SERVICE EXPRESS</div>
 <div style="margin-top:8px;font-weight:500;font-size:40px;letter-spacing:22px;color:#0E0E10">URBAINE</div>
</div></body></html>`);
await p.locator('#l').screenshot({path:'assets/logo.png',omitBackground:true});
await p.setViewportSize({width:1080,height:1920});
await p.setContent(`<html><body style="margin:0">
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset=".55" stop-color="#4a4f55"/><stop offset="1" stop-color="#1c1e21"/></linearGradient>
 <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d42"/><stop offset=".35" stop-color="#121315"/><stop offset="1" stop-color="#050506"/></linearGradient>
 <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d737a"/><stop offset="1" stop-color="#15171a"/></linearGradient>
 <filter id="b1"><feGaussianBlur stdDeviation="22"/></filter><filter id="b2"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="grain"><feTurbulence baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer></filter>
 <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
</defs>
<rect width="1080" height="1920" fill="url(#sky)"/>
<g filter="url(#b1)" opacity=".75">
 ${Array.from({length:26},(_,i)=>{const x=(i*173)%1100,y=420+((i*97)%520),r=30+(i*37)%70;const c=['#d9c9a8','#e8e2d6','#a9b4bf','#f0d9b0'][i%4];return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${.25+(i%5)*.1}"/>`}).join('')}
</g>
<rect y="1180" width="1080" height="740" fill="#17181a"/>
<rect y="1180" width="1080" height="740" fill="#2a2c2f" opacity=".5" filter="url(#b2)"/>
<g transform="translate(-60,860) scale(.8)">
 <ellipse cx="760" cy="520" rx="700" ry="40" fill="#000" opacity=".7" filter="url(#b2)"/>
 <path d="M90 430 Q100 360 200 345 L420 320 Q520 230 640 215 L960 210 Q1080 215 1180 320 L1370 345 Q1440 360 1450 420 L1450 470 Q1440 500 1400 500 L120 500 Q90 495 90 470Z" fill="url(#body)"/>
 <path d="M450 322 Q540 245 650 232 L800 228 L800 322Z" fill="url(#glass)"/>
 <path d="M820 228 L960 226 Q1060 232 1140 322 L820 322Z" fill="url(#glass)"/>
 <path d="M110 395 L1440 395" stroke="#8c9096" stroke-width="2" opacity=".5"/>
 <path d="M200 350 Q600 330 1370 352" stroke="#b9bdc2" stroke-width="3" opacity=".45" fill="none"/>
 <rect x="1395" y="372" width="48" height="20" rx="6" fill="#f2efe6"/>
 <rect x="95" y="378" width="40" height="18" rx="6" fill="#bfb9b0"/>
 ${[330,1180].map(x=>`<circle cx="${x}" cy="495" r="92" fill="#0a0a0b"/><circle cx="${x}" cy="495" r="58" fill="#55595e"/><circle cx="${x}" cy="495" r="20" fill="#202225"/>`).join('')}
</g>
<rect width="1080" height="1920" fill="url(#vig)"/>
<rect width="1080" height="1920" filter="url(#grain)"/>
</svg></body></html>`);
await p.screenshot({path:'assets/voiture-photo.jpg',type:'jpeg',quality:90});
await b.close();
