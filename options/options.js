const form = document.getElementById("options-form");

let unsavedChanges = false;
let lastSaved = null;

const getFormData = () => {
  let object = {};
  for (let key of featureKeys) {
    object[key] = document.getElementsByName(key)[0].checked;
  }
  return object;
};

const saveOptions = () => {
  const newOptions = getFormData();
  storeOptions({features: newOptions});
};

const loadWithOptions = ({features: features}) => {
  unsavedChanges = false;
  lastSaved = features;
  for (let entry of Object.entries(features)) {
    document.getElementsByName(entry[0])[0].checked = entry[1];
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
