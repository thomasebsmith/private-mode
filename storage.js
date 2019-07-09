(function(global) {
  const areaName = "sync";
  const area = browser.storage[areaName];
  const defaults = {
    antifp: true,
    nowebgl: true,
    noreferrers: true,
    noindexeddb: true
  };

  let cache = null;

  global.storageKeys = Object.keys(defaults);

  global.storeOptions = (options) => {
    return area.set({
      "features": JSON.stringify(options)
    });
  };

  global.retrieveOptions = () => {
    if (!cache) {
      return area.get("features").then((settings) => {
        const features = settings.features;
        if (!features) {
          cache = defaults;
          return storeOptions(defaults).then(() => {
            return defaults;
          });
        }
        cache = JSON.parse(features);
        return cache;
      });
    }
    return Promise.resolve(cache);
  };

  let listeners = [];

  browser.storage.onChanged.addListener((changes, changedAreaName) => {
    if (changedAreaName === areaName && changes.features) {
      cache = JSON.parse(changes.features.newValue);
      for (let listener of listeners) {
        try {
          listener(cache);
        }
        catch (e) {
          // Errors ignored
        }
      }
    }
  });

  global.onStorageChange = (listener) => {
    listeners.push(listener);
  };
})(this);
