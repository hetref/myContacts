const staticCache = 'static-cache';
const dynamicCache = 'dynamic-cache';
const assets = [
  '/',
  'index.html',
  'js/app.js',
  'js/ui.js',
  'js/materialize.min.js',
  'css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'pages/fallback.html'
]
//install process
self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(staticCache).then(cache=>{
      cache.addAll(assets);
    })
  )
})

//activate
self.addEventListener('activate', e=>{
  console.log('activate');
})

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(staticRes=>{
      return staticRes||fetch(e.request).then(dynamicRes=>{
        return caches.open(dynamicCache).then(cache=>{
          cache.put(e.request.url, dynamicRes.clone());
          return dynamicRes;
        })
      })
    }).catch(()=>caches.match('pages/fallback.html'))
  )
})
