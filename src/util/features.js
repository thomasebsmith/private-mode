// NB: This script requires that util/storage.js is already loaded.

(function(global) {
  const hasOwnProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  global.getFeaturesForURLString = (urlString) => {
    const url = new URL(urlString);
    return global.retrieveOptions().then((options) => {
      const whitelist = options.whitelist;
      if (!hasOwnProp(whitelist, url.hostname)) {
        return options.features;
      }
      const siteFeatures = whitelist[url.hostname];
      if (!hasOwnProp(siteFeatures.byPath, url.pathname)) {
        if (siteFeatures.forDomain === null) {
          return options.features;
        }
        return siteFeatures.forDomain;
      }
      return siteFeatures.byPath[url.pathname];
    });
  };

  global.getGlobalFeatures = (urlString) => {
    return global.retrieveOptions().then(({features: features}) => {
      return features;
    });
  };
})(this);
