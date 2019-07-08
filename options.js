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

const loadOptions = () => {
  retrieveOptions().then((options) => {
    for (let entry of Object.entries(options)) {
      document.getElementsByName(entry[0])[0].checked = entry[1];
    }
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveOptions();
  return false;
});

loadOptions();
