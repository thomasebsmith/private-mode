(function() {
  const bannedContexts = [
    "webgl",
    "experimental-webgl"
  ];
  
  const oldGC = window.wrappedJSObject.HTMLCanvasElement.prototype.getContext;
  window.wrappedJSObject.HTMLCanvasElement.prototype.getContext = cloneInto(
    function(ctxt) {
      ctxt = ctxt.toString();
      if (bannedContexts.includes(ctxt)) {
        return null;
      }
      return window.HTMLCanvasElement.prototype.getContext.apply(
        this,
        arguments
      );
    },
    window,
    { cloneFunctions: true }
  );

  const oldIDB = window.wrappedJSObject.indexedDB;
  delete window.wrappedJSObject.indexedDB;

  const oldNavSW = Object.getOwnPropertyDescriptor(
    window.wrappedJSObject.Navigator.prototype,
    "serviceWorker"
  );
  delete window.wrappedJSObject.Navigator.prototype.serviceWorker;
  const oldSW = window.wrappedJSObject.ServiceWorker;
  delete window.wrappedJSObject.ServiceWorker;
  const oldSWContainer = window.wrappedJSObject.ServiceWorkerContainer;
  delete window.wrappedJSObject.ServiceWorkerContainer;
  const oldSWRegistration = window.wrappedJSObject.ServiceWorkerRegistration;
  delete window.wrappedJSObject.ServiceWorkerRegistration;

  getFeaturesForURLString(window.location.href).then((features) => {
    if (!features.nowebgl) {
      window.wrappedJSObject.HTMLCanvasElement.prototype.getContext = oldGC;
    }
    if (!features.noindexeddb) {
      window.wrappedJSObject.indexedDB = oldIDB;
    }
    if (!features.noserviceworkers) {
      Object.defineProperty(
        window.wrappedJSObject.Navigator.prototype,
        "serviceWorker",
        oldNavSW
      );
      window.wrappedJSObject.ServiceWorker = oldSW;
      window.wrappedJSObject.ServiceWorkerContainer = oldSWContainer;
      window.wrappedJSObject.ServiceWorkerRegistration = oldSWRegistration;
    }
  });
})();
