(function() {
  const bannedContexts = [
    "webgl",
    "experimental-webgl"
  ];
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
  delete window.wrappedJSObject.indexedDB;
})();
