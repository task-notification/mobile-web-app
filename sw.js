/**
 * file to configure service worker
 *
 * @author Michael Mueller <development@reu-network.de>
 */

var API_URL = "http://localhost/nodejs/api";
var VERSION = 'v48';

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(VERSION).then(function(cache) {
            return cache.addAll([
                './vendor/nativedroid2/css/nativedroid2.color.blue-grey.css',
                './vendor/nativedroid2/css/nativedroid2.color.teal.css',
                './vendor/nativedroid2/css/flexboxgrid.min.css',
                './vendor/nativedroid2/css/material-design-iconic-font.min.css',
                './vendor/nativedroid2/fonts/Material-Design-Iconic-Font.eot',
                './vendor/nativedroid2/fonts/Material-Design-Iconic-Font.svg',
                './vendor/nativedroid2/fonts/Material-Design-Iconic-Font.ttf?v=2.0.0',
                './vendor/nativedroid2/fonts/Material-Design-Iconic-Font.woff?v=2.0.0',
                './vendor/nativedroid2/js/nativedroid2.js',

                './vendor/font-awesome/css/font-awesome.min.css',
                './vendor/font-awesome/fonts/FontAwesome.otf',
                './vendor/font-awesome/fonts/fontawesome-webfont.eot',
                './vendor/font-awesome/fonts/fontawesome-webfont.svg',
                './vendor/font-awesome/fonts/fontawesome-webfont.ttf?v=4.6.3',
                './vendor/font-awesome/fonts/fontawesome-webfont.woff?v=4.6.3',
                './vendor/font-awesome/fonts/fontawesome-webfont.woff2?v=4.6.3',

                './vendor/jquery/jquery-3.1.1.min.js',
                './vendor/jquery/jquery-migrate-3.0.0.js',
                './vendor/jquery-mobile/jquery.mobile-1.4.5.min.js',
                './vendor/jquery-mobile/jquery.mobile-1.4.5.min.css',
                './vendor/jquery-mobile/images/ajax-loader.gif',
                './vendor/jquery-ui/jquery-ui.min.js',
                './vendor/jquery-ui/jquery-ui.min.css',

                './vendor/waves/waves.min.js',
                './vendor/waves/waves.min.js.map',
                './vendor/waves/waves.min.css',

                './vendor/wow/animate.css',
                './vendor/wow/wow.min.js',

                './config/nd2settings.js',
                './fragments/bottom.sheet.html',
                './fragments/panel.left.html',
                './fragments/page.home.html',
                './fragments/page.login.html',
                './fragments/page.register.html',
                './fragments/page.task.add.html',

                './resources/css/style.css',
                './resources/fonts/Roboto-Regular.ttf',
                './resources/img/2.jpg',
                './resources/img/8.jpg',
                './resources/img/9.jpg',
                './resources/img/10.jpg',
                './resources/img/examples/card_bg_1.jpg',
                './resources/img/examples/card_bg_2.jpg',
                './resources/img/examples/card_bg_3.jpg',
                './resources/img/examples/card_thumb_1.jpg',
                './resources/img/examples/card_thumb_2.jpg',
                './resources/img/examples/card_thumb_3.jpg',

                './resources/js/app.js',
                './manifest.json',
                './index.php'
            ]);
        })
    );
});

this.addEventListener('fetch', function(event) {

    if (event.request.method !== 'GET') { return; }
    if (event.request.url.indexOf(API_URL) !== -1) { return; }

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                //Cache hit - return response
                if (response) {
                    return response;
                }
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        //Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        var responseToCache = response.clone();

                        caches.open(VERSION)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

this.addEventListener('activate', function(event) {
    var cacheWhitelist = [VERSION];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});



// @author DavidHowon   
// Push Message with Icon and redirect to Google.de

'use strict';

	console.log('Started', self);
	
	self.addEventListener('install', function(event) {
	  self.skipWaiting();
	  console.log('Installed', event);
	});
	
	self.addEventListener('activate', function(event) {
	  console.log('Activated', event);
	});
	
	self.addEventListener('push', function(event) {
	  console.log('Push message', event);
	
	  var title = 'Push Message';
	
	  event.waitUntil(
	    self.registration.showNotification(title, {
	      'body': 'The Message',
	      'icon': 'img/icon.png'
	    }));
	});
	
	self.addEventListener('notificationclick', function(event) {
	  console.log('Notification click: tag', event.notification.tag);
	  
	  event.notification.close();
	  var url = 'https://www.google.de';
	  
	  event.waitUntil(
	    clients.matchAll({
	      type: 'window'
	    })
	    .then(function(windowClients) {
	      console.log('WindowClients', windowClients);
	      for (var i = 0; i < windowClients.length; i++) {
	        var client = windowClients[i];
	        console.log('WindowClient', client);
	        if (client.url === url && 'focus' in client) {
	          return client.focus();
	        }
	      }
	      if (clients.openWindow) {
	        return clients.openWindow(url);
	      }
	    })
	  );
	});