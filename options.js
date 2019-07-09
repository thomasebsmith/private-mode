const form = document.getElementById("options-form");

const getFormData = () => {
  let object = {};
  for (let key of storageKeys) {
    object[key] = document.getElementsByName(key)[0].checked;
  }
  return object;
};

const saveOptions = () => {
  const newOptions = getFormData();
  storeOptions(newOptions);
};

const loadWithOptions = (options) => {
  for (let entry of Object.entries(options)) {
    document.getElementsByName(entry[0])[0].checked = entry[1];
  }
};

const loadOptions = () => {
  retrieveOptions().then(loadWithOptions);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveOptions();
  return false;
});

form.addEventListener("reset", (event) => {
  event.preventDefault();
  resetOptions().then(loadWithOptions);
});

loadOptions();
