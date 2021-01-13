import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

// self.addEventListener('fetch', event => {
//   if (event.request.url.indexOf('dl.airtable.com') && event.request.method === 'GET') {
//     console.log("Service Worker call to get from Airtable data")
//     event.respondWith(fetch(event.request))
//   }
// })