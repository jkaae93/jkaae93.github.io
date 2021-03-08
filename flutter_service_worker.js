'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "c3aa51add6821d79952e7bd6c3dbc94c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"assets/lib/l10n/en.json": "358708f202fcb68313f22fb2c4c07835",
"assets/lib/l10n/ko.json": "358708f202fcb68313f22fb2c4c07835",
"assets/lib/l10n/l10n.yaml": "f399bc7da82ae89244973478b51e5d55",
"assets/NOTICES": "97ceeceb7b26e062af21eeff01d556fd",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/FontManifest.json": "cd09817bf2497528770ad6ad86b0bffd",
"assets/AssetManifest.json": "29bef3dca62163abc80d1e5e8e9a8e0d",
"assets/assets/icons/logos_flutter.svg": "30dae580e91f9a1487c54dd879c2668d",
"assets/assets/icons/logos_js.svg": "47120c214e1a6ed2de5baad59c520b58",
"assets/assets/icons/logos_twitter.svg": "90da0afba860501dc98ec0ebf97b39de",
"assets/assets/icons/logos_kotlin.svg": "f9733a51d8c46504372e54dcf56ae31f",
"assets/assets/icons/bubble.svg": "0f2712903a68ecdf60f87fdc75014a47",
"assets/assets/icons/logos_c.svg": "aff6720c061b9295c6354af6a944c89f",
"assets/assets/icons/mdi_marker-check.svg": "20fbc0623ec1b300e99ee425e47234ee",
"assets/assets/icons/logos_c-plusplus.svg": "3c56772549724c0c8fbfa244ae99eced",
"assets/assets/icons/logos_instagram.svg": "51195501bec2514dbdae16859a749c55",
"assets/assets/icons/logos_android.svg": "bc50fcfafeb2e3ce47ab33c7b2422b67",
"assets/assets/icons/logos_java.svg": "34411516b1b9a34ef83b0b67d522f1e7",
"assets/assets/icons/logos_facebook.svg": "f522ec2b9c86cad79869825abf538809",
"assets/assets/fonts/CuteFont-Regular.ttf": "0e37db92fcbdcff26d1d78928e2d0a8b",
"assets/assets/fonts/UbuntuMono-Regular.ttf": "e097b71641f2524e09820d9122b7e910",
"assets/assets/images/firmware.png": "17e252fe4decfdc2ce3dacc9add3fcd1",
"assets/assets/images/component3.png": "9eb6530cba2748b9997e164bb35bf15f",
"assets/assets/images/component2.png": "09b644069dab54455d81b6f8da3d6fe4",
"assets/assets/images/this.png": "d32a16cebc1e270849d7a06875691e2a",
"assets/assets/images/iot_clock.png": "07064032442b8e0dbd5ce6e22c0f1b8c",
"assets/assets/images/component1.png": "82ad0cb8c07721b437eeec560fb65610",
"assets/assets/images/profile.jpg": "0d4d02fb17563488252307da81027895",
"assets/assets/images/pet.png": "a6d893ff05c01022202e08fed703e947",
"assets/assets/images/profile.png": "84020628da031457538391a0513965fb",
"assets/assets/images/smart_home.png": "6d79e6d34903ea9f3d18c006b55c6605",
"assets/assets/images/android.png": "6098aa0726debd81cc6bde8f48d6394a",
"assets/assets/images/rfid.png": "353e57e87ff34a32201ce4ebf72c604a",
"assets/packages/easy_localization/i18n/ar.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en-US.json": "5bd908341879a431441c8208ae30e4fd",
"assets/packages/easy_localization/i18n/en.json": "5bd908341879a431441c8208ae30e4fd",
"assets/packages/easy_localization/i18n/ar-DZ.json": "acc0a8eebb2fcee312764600f7cc41ec",
"version.json": "341c101d4b678f29adc2e2fa68fd71f3",
"manifest.json": "ae9655eab081f587e641b9806817474b",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "b88f53cbc14947275c77e8144927ffff",
"/": "b88f53cbc14947275c77e8144927ffff"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
