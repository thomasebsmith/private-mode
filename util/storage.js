(function(global) {
  const hasOwnProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  const areaName = "sync";
  const propName = "options";
  const area = browser.storage[areaName];
  const defaults = Object.freeze({
    features: {
      antifp: true,
      nowebgl: true,
      noreferrers: true,
      noindexeddb: true
    },
    whitelist: {}
  });

  let cache = null;

  global.storageKeys = Object.keys(defaults);
  global.featureKeys = Object.keys(defaults.features);

  global.storeOptions = (options) => {
    let toStore = {};
    for (let entry of Object.entries(defaults)) {
      if (options && hasOwnProp(options, entry[0])) {
        toStore[entry[0]] = options[entry[0]];
      }
      else {
        toStore[entry[0]] = entry[1];
      }
    }
    return area.set({[propName]: JSON.stringify(toStore)}).then(() => {
      return toStore;
    });
  };

  global.resetOptions = () => {
    return storeOptions(null);
  };

  global.retrieveOptions = () => {
    if (!cache) {
      return area.get(propName).then((settings) => {
        const options = settings[propName];
        if (!options) {
          cache = defaults;
          return resetOptions();
        }
        cache = Object.freeze(JSON.parse(options));
        return cache;
      });
    }
    return Promise.resolve(cache);
  };

  let listeners = [];

  browser.storage.onChanged.addListener((changes, changedAreaName) => {
    if (changedAreaName === areaName && changes[propName]) {
      cache = Object.freeze(JSON.parse(changes[propName].newValue));
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
