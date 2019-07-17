let privateModeEnabled = false;

const getEnablePromises = () => {
  return getGlobalFeatures().then((features) => {
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

const getPrivateModeMenu = (enabled, isUpdate) => {
  let result = {
    id: "private-mode-enabled",
    checked: enabled,
    command: "_execute_browser_action",
    contexts: ["all"],
    icons: {
      "16": "icons/16.png",
      "32": "icons/32.png"
    },
    title: "Private Mode",
    type: "checkbox"
  };
  if (isUpdate) {
    delete result.icons;
    delete result.id;
    delete result.command;
  }
  return result;
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
      browser.menus.update(
        "private-mode-enabled",
        getPrivateModeMenu(true, true)
      );
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
    browser.menus.update(
      "private-mode-enabled",
      getPrivateModeMenu(false, true)
    );
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
      file: "/util/features.js",
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

browser.menus.create(getPrivateModeMenu(true, false));
enablePrivateMode();

onStorageChange(() => {
  if (privateModeEnabled) {
    enablePrivateMode();
  }
});
