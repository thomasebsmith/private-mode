let privateModeEnabled = false;

const enablePrivateMode = () => {
  Promise.all([
    browser.privacy.websites.referrersEnabled.set({value: false}),
    browser.privacy.websites.resistFingerprinting.set({value: true})
  ]).then((results) => {
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
};

const disablePrivateMode = () => {
  Promise.all([
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

enablePrivateMode();
