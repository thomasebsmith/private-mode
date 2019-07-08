(function(global) {
  const area = browser.storage.sync;
  const defaults = {
    antifp: true,
    nowebgl: true,
    noreferrers: true,
    noindexeddb: true
  };

  this.storageKeys = Object.keys(defaults);

  this.storeOptions = (options) => {
    return area.set({
      "features": JSON.stringify(options)
    });
  };

  this.retrieveOptions = () => {
    return area.get("features").then((settings) => {
      const features = settings.features;
      if (!features) {
        return storeOptions(defaults).then(() => {
          return defaults;
        });
      }
      return JSON.parse(features);
    });
  };
})(this);
