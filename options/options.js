const form = document.getElementById("options-form");
const exceptionsEl = document.getElementById("exceptions");
const exceptionsInput = document.getElementById("new-exception-url");
const exceptionsButton = document.getElementById("add-exception");

let unsavedChanges = false;
let lastSaved = null;

const hasOwnProp = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

const hasPath = (urlString) => {
  return (/^[^:]*:\/*[^\/]+\//).test(urlString);
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

const insertSiteCheckboxesBefore = (insertBefore, el, features) => {
  let input = document.createElement("input");
  input.type = "checkbox";
  input.value = "nowebgl";
  input.name = "nowebgl";
  input.checked = features.nowebgl;
  el.insertBefore(input, insertBefore);
  let label = document.createElement("label");
  label.for = "nowebgl";
  label.textContent = "Disable WebGL";
  el.insertBefore(label, insertBefore);

  input = document.createElement("input");
  input.type = "checkbox";
  input.value = "noindexeddb";
  input.name = "noindexeddb";
  input.checked = features.noindexeddb;
  el.insertBefore(input, insertBefore);
  label = document.createElement("label");
  label.for = "noindexeddb";
  label.textContent = "Disable IndexedDB";
  el.insertBefore(label, insertBefore);
};

const appendSiteCheckboxes = (el, features) => {
  return insertSiteCheckboxesBefore(null, el, features);
};

const loadWithOptions = ({features, whitelist: exceptions}) => {
  unsavedChanges = false;
  lastSaved = features;
  while (exceptionsEl.lastChild) {
    exceptionsEl.removeChild(exceptionsEl.lastChild);
  }
  for (let entry of Object.entries(features)) {
    document.getElementsByName(entry[0])[0].checked = entry[1];
  }
  const entries = Object.entries(exceptions).sort(([key1, _], [key2, __]) => {
    return key1 < key2;
  });
  for (const [domain, siteFeatures] of entries) {
    const el = document.createElement("div");
    el.dataset.domain = domain;
    el.classList.add("domain-" + domain);
    const title = document.createElement("h5");
    title.textContent = domain;
    el.appendChild(title);
    if (siteFeatures.forDomain !== null) {
      appendSiteCheckboxes(el, siteFeatures.forDomain);
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.addEventListener("click", removeException);
      removeButton.textContent = "X";
      el.appendChild(removeButton);
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
      pathEl.classList.add("path-" + path);
      const pathTitle = document.createElement("h6");
      pathTitle.textContent = path;
      pathEl.appendChild(pathTitle);
      appendSiteCheckboxes(pathEl, pathFeatures);
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.addEventListener("click", removeException);
      removeButton.textContent = "X";
      pathEl.appendChild(removeButton);
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

const removeException = (event) => {
  const el = event.target.parentElement;
  if ("path" in el.dataset) {
    const parentEl = el.parentElement;
    parentEl.removeChild(el);
    if (parentEl.children.length === 1) {
      parentEl.parentElement.removeChild(parentEl);
    }
  }
  else {
    let toRemove = el.children[1];
    while (toRemove.tagName.toLowerCase() === "input" ||
           toRemove.tagName.toLowerCase() === "label" ||
           toRemove.tagName.toLowerCase() === "button") {
      let victim = toRemove;
      toRemove = toRemove.nextSibling;
      victim.parentElement.removeChild(victim);
    }
    if (el.children.length === 1) {
      el.parentElement.removeChild(el);
    }
  }
  unsavedChanges = true;
};

exceptionsButton.addEventListener("click", (event) => {
  let urlString = exceptionsInput.value;
  let url;
  try {
    url = new URL(urlString);
  }
  catch (e) {
    try {
      urlString = "https://" + urlString;
      url = new URL(urlString);
    }
    catch (e) {
      alert("Error: Invalid URL " + exceptionsInput.value);
      return;
    }
  }

  retrieveOptions().then(({features}) => {
    let el = document.getElementsByClassName("domain-" + url.hostname)[0];
    if (!el) {
      el = document.createElement("div");
      el.dataset.domain = url.hostname;
      el.classList.add("domain-" + url.hostname);
      const title = document.createElement("h5");
      title.textContent = url.hostname;
      el.appendChild(title);
    }
    if (hasPath(urlString)) {
      if (el.getElementsByClassName("path-" + url.pathname).length > 0) {
        alert("Error: Exception already exists for " + exceptionsInput.value);
        return;
      }
      const pathEl = document.createElement("div");
      pathEl.dataset.domain = url.hostname;
      pathEl.dataset.path = url.pathname;
      pathEl.classList.add("path-" + url.pathname);
      const pathTitle = document.createElement("h6");
      pathTitle.textContent = url.pathname;
      pathEl.appendChild(pathTitle);
      appendSiteCheckboxes(pathEl, features);
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.addEventListener("click", removeException);
      removeButton.textContent = "X";
      pathEl.appendChild(removeButton);
      el.appendChild(pathEl);
    }
    else {
      if (el.children[1] && el.children[1].type === "checkbox") {
        alert("Error: Exception already exists for " + exceptionsInput.value);
        return;
      }
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.addEventListener("click", removeException);
      removeButton.textContent = "X";
      el.insertBefore(removeButton, el.children[1]);
      insertSiteCheckboxesBefore(el.children[1], el, features);
    }
    if (!exceptionsEl.contains(el)) {
      exceptionsEl.appendChild(el);
    }
    exceptionsInput.value = "";
  });

  unsavedChanges = true;
});

loadOptions();

window.addEventListener("beforeunload", (event) => {
  if (unsavedChanges) {
    event.preventDefault();
  }
});
