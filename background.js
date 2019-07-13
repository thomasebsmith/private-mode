let privateModeEnabled = false;

const getEnablePromises = () => {
  return retrieveOptions().then((features) => {
    return [
      browser.privacy.websites.resistFingerprinting.set({
        value: features.antifp
      }),
      browser.privacy.websites.referrersEnabled.set({
        value: !features.noreferrers
      })
    ];
  });
};

const enablePrivateMode = () => {
  return getEnablePromises().then((promises) => {
    return Promise.all(promises).then((results) => {
      if (!results.every(x => x)) {
        console.warn("Could not enable all privacy settings");
        return;
      }
      privateModeEnabled = true;
      browser.browserAction.setIcon({
        path: {
          16: "icons/16-enabled.png",
          32: "icons/32-enabled.png"
        }
      });
    });
  });
};

const disablePrivateMode = () => {
  return Promise.all([
    browser.privacy.websites.referrersEnabled.set({value: true}),
    browser.privacy.websites.resistFingerprinting.set({value: false})
  ]).then((results) => {
    if (!results.every(x => x)) {
      console.warn("Could not disable all privacy settings");
      return;
    }
    privateModeEnabled = false;
    browser.browserAction.setIcon({
      path: {
        16: "icons/16-disabled.png",
        32: "icons/32-disabled.png"
      }
    });
  });
};

browser.browserAction.onClicked.addListener(() => {
  if (privateModeEnabled) {
    disablePrivateMode();
  }
  else {
    enablePrivateMode();
  }
});

browser.webNavigation.onCommitted.addListener((details) => {
  if (privateModeEnabled) {
    browser.tabs.executeScript(details.tabId, {
      file: "/util/storage.js",
      frameId: details.frameId,
      matchAboutBlank: true,
      runAt: "document_start"
    });

    browser.tabs.executeScript(details.tabId, {
      file: "/content.js",
      frameId: details.frameId,
      matchAboutBlank: true,
      runAt: "document_start"
    });
  }
});

enablePrivateMode();

onStorageChange(() => {
  if (privateModeEnabled) {
    enablePrivateMode();
  }
});
