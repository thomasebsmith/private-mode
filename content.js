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

  getFeaturesForURLString(window.location.href).then((features) => {
    if (!features.nowebgl) {
      window.wrappedJSObject.HTMLCanvasElement.prototype.getContext = oldGC;
    }
    if (!features.noindexeddb) {
      window.wrappedJSObject.indexedDB = oldIDB;
    }
  });
})();
