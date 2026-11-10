/* Service worker : rend le site installable comme une application.
   Toujours la version en ligne en priorité (mises à jour immédiates), copie de secours hors ligne.
   Firebase (autres domaines) : jamais intercepté. */
const CACHE='agirs-v1';
const ASSETS=['./','./index.html','./test.html','./manifest.json','./manifest-test.json','./icon-192.png','./icon-512.png','./icon-test-192.png','./icon-test-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
