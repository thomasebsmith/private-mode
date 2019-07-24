(function() {
  const assert = (value) => {
    if (!value) {
      throw "Assertion failed in content.js";
    }
  };
  const hasOwnProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  const removedValues = {};
  const remove = (path, grouping) => {
    assert(Array.isArray(path) && path.length >= 1);
    let object = window.wrappedJSObject;
    for (let i = 0; i < path.length - 1; ++i) {
      object = object[path[i]];
    }
    if (!hasOwnProp(removedValues, grouping)) {
      removedValues[grouping] = [];
    }
    removedValues[grouping].push([path, Object.getOwnPropertyDescriptor(
        object,
        path[path.length - 1]
      )
    ]);
    delete object[path[path.length - 1]];
  };
  const restore = (grouping) => {
    assert(hasOwnProp(removedValues, grouping));
    for (let [path, descriptor] of removedValues[grouping]) {
      let object = window.wrappedJSObject;
      for (let i = 0; i < path.length - 1; ++i) {
        object = object[path[i]];
      }
      Object.defineProperty(object, path[path.length - 1], descriptor);
    }
  };

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
