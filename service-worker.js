import { precacheAndRoute } from 'workbox-precaching';
import { skipWaiting, clientsClaim, cacheNames } from 'workbox-core';

import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// The Service Worker is activated as soon as it is downloaded
skipWaiting()
// ClientsClaim forces all tabs in the scope of the service worker to be immediately controlled by this service worker
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST);

// self.addEventListener('fetch', event => {
//   if (event.request.url.indexOf('dl.airtable.com') && event.request.method === 'GET') {
//     console.log("Service Worker call to get from Airtable data")
//     event.respondWith(fetch(event.request))
//   }
// })

registerRoute(({request}) => 
  request.destination === "image",
  new CacheFirst()
);

self.addEventListener('message', async (event) => {
  let sw_client = await self.clients.matchAll();
  switch (event.data.type) {
    case 'ping':
      // console.log('event received for a ping message : ', event);
      event.source.postMessage({ message: 'nbs Service worker is pinged', port: 'port01' });
      break;
    case 'RELOAD': 
      console.log('Service worker is asked to reload windows');
      let clients = await self.clients.matchAll();
      console.log('current clients : ', clients);
      break;
    case 'BEFORE UNLOAD':
      // console.log('event received for a BEFORE UNLOAD message : ', event);
      console.log('all caches : ', caches);
      if (sw_client.length == 2) {
        caches.keys().then( cacheList => {
          console.log('filter through cache names');
          cacheList.forEach(name => {
            console.log('cache : ', name);
            if (name == cacheNames.runtime) {
              caches.delete(name);
            }
          });
        })
      }

      console.log("caches names : ", await caches.keys());
      let deleteState = (await caches.keys()).indexOf(cacheNames.runtime) == -1 ? "runtime cache is deleted" : "runtime cache is not deleted";
      console.log('delete state : ', deleteState);
      event.source.postMessage({ message: deleteState });
      break;
    case 'CLOSING':
      // console.log('event received for a CLOSING message : ', event);
      console.log('client subscribing to the service worker : ', sw_client.length);
      if (sw_client.length == 0) {
        self.registration.unregister();
      }
      break;
    case 'UNREGISTER':
      console.log('event received for an UNREGISTER message : ', event);
      self.registration.unregister()
        .then( () => event.source.postMessage({ message: 'OK' }) )
        .then( () => self.clients.matchAll() )
        .then( clients => clients.forEach(client => client.navigate(client.url)) )
        .catch( () => event.source.postMessage( { message : "KO"}) )
      break;
  }

})