const form = document.getElementById("options-form");
const exceptionsEl = document.getElementById("exceptions");

let unsavedChanges = false;
let lastSaved = null;

const hasOwnProp = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

const getFormData = () => {
  let features = {};
  let whitelist = {};
  for (const key of featureKeys) {
    const elements = document.getElementsByName(key);
    for (const element of elements) {
      if ("path" in element.parentElement.dataset) {
        const path = element.parentElement.dataset.path;
        const domain = element.parentElement.dataset.domain;
        if (!hasOwnProp(whitelist, domain)) {
          whitelist[domain] = {
            forDomain: null,
            byPath: {}
          };
        }
        const siteFeatures = whitelist[domain];
        if (!hasOwnProp(siteFeatures.byPath, path)) {
          siteFeatures.byPath[path] = {};
        }
        siteFeatures.byPath[path][element.value] = element.checked;
      }
      else if ("domain" in element.parentElement.dataset) {
        const domain = element.parentElement.dataset.domain;
        if (!hasOwnProp(whitelist, domain)) {
          whitelist[domain] = {
            forDomain: null,
            byPath: {}
          };
        }
        const siteFeatures = whitelist[domain];
        if (siteFeatures.forDomain === null) {
          siteFeatures.forDomain = {};
        }
        siteFeatures.forDomain[element.value] = element.checked;
      }
      else {
        features[key] = element.checked;
      }
    }
  }
  return {
    features: features,
    whitelist: whitelist
  };
};

const saveOptions = () => {
  const newOptions = getFormData();
  storeOptions(newOptions);
};

const appendSiteCheckboxes = (el, features) => {
  let input = document.createElement("input");
  input.type = "checkbox";
  input.value = "nowebgl";
  input.name = "nowebgl";
  input.checked = features.nowebgl;
  el.appendChild(input);
  let label = document.createElement("label");
  label.for = "nowebgl";
  label.textContent = "Disable WebGL";
  el.appendChild(label);

  input = document.createElement("input");
  input.type = "checkbox";
  input.value = "noindexeddb";
  input.name = "noindexeddb";
  input.checked = features.noindexeddb;
  el.appendChild(input);
  label = document.createElement("label");
  label.for = "noindexeddb";
  label.textContent = "Disable IndexedDB";
  el.appendChild(label);
};

const loadWithOptions = ({features, whitelist: exceptions}) => {
  unsavedChanges = false;
  lastSaved = features;
  for (let entry of Object.entries(features)) {
    document.getElementsByName(entry[0])[0].checked = entry[1];
  }
  const entries = Object.entries(exceptions).sort(([key1, _], [key2, __]) => {
    return key1 < key2;
  });
  for (const [domain, siteFeatures] of entries) {
    const el = document.createElement("div");
    el.dataset.domain = domain;
    const title = document.createElement("h5");
    title.textContent = domain;
    el.appendChild(title);
    if (siteFeatures.forDomain !== null) {
      appendSiteCheckboxes(el, siteFeatures.forDomain);
    }
    const pathEntries = Object.entries(siteFeatures.byPath).sort(
      ([key1, _], [key2, __]) => {
        return key1 < key2;
      }
    );
    for (const [path, pathFeatures] of pathEntries) {
      const pathEl = document.createElement("div");
      pathEl.dataset.domain = domain;
      pathEl.dataset.path = path;
      const pathTitle = document.createElement("h6");
      pathTitle.textContent = path;
      pathEl.appendChild(pathTitle);
      appendSiteCheckboxes(pathEl, pathFeatures);
      el.appendChild(pathEl);
    }
    exceptionsEl.appendChild(el);
  }
};

const loadOptions = () => {
  retrieveOptions().then(loadWithOptions);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  unsavedChanges = false;
  saveOptions();
  return false;
});

form.addEventListener("reset", (event) => {
  event.preventDefault();
  unsavedChanges = false;
  resetOptions().then(loadWithOptions);
});

form.addEventListener("input", (event) => {
  const currentChanges = getFormData();
  unsavedChanges = false;
  for (let entry of Object.entries(currentChanges)) {
    if (entry[1] !== lastSaved[entry[0]]) {
      unsavedChanges = true;
    }
  }
}, true);

loadOptions();

window.addEventListener("beforeunload", (event) => {
  if (unsavedChanges) {
    event.preventDefault();
  }
});
