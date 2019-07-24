(function() {
  const assert = (value) => {
    if (!value) {
      throw new Error("Assertion failed in content.js");
    }
  };
  const hasOwnProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  const removedValues = {};
  const remove = (path, grouping) => {
    assert(Array.isArray(path) && path.length >= 1);
    let object = window.wrappedJSObject;
    for (let i = 0; i < path.length - 1; ++i) {
      object = object[path[i]];
    }
    if (!hasOwnProp(removedValues, grouping)) {
      removedValues[grouping] = [];
    }
    removedValues[grouping].push([path, Object.getOwnPropertyDescriptor(
        object,
        path[path.length - 1]
      )
    ]);
    delete object[path[path.length - 1]];
  };
  const restore = (grouping) => {
    assert(hasOwnProp(removedValues, grouping));
    for (let [path, descriptor] of removedValues[grouping]) {
      if (descriptor === undefined) {
        // Don't try to restore properties that were already gone
        continue;
      }
      let object = window.wrappedJSObject;
      for (let i = 0; i < path.length - 1; ++i) {
        object = object[path[i]];
      }
      Object.defineProperty(object, path[path.length - 1], descriptor);
    }
  };

  const bannedContexts = [
    "webgl",
    "experimental-webgl"
  ];
  
  remove(["HTMLCanvasElement", "prototype", "getContext"], "webgl");
  window.wrappedJSObject.HTMLCanvasElement.prototype.getContext = cloneInto(
    function(ctxt) {
      ctxt = ctxt.toString();
      if (bannedContexts.includes(ctxt)) {
        return null;
      }
      return window.HTMLCanvasElement.prototype.getContext.apply(
        this,
        arguments
      );
    },
    window,
    { cloneFunctions: true }
  );

  remove(["indexedDB"], "indexeddb");
  remove(["IDBEnvironment"], "indexeddb");
  remove(["IDBFactory"], "indexeddb");
  remove(["IDBOpenDBRequest"], "indexeddb");
  remove(["IDBDatabase"], "indexeddb");
  remove(["IDBTransaction"], "indexeddb");
  remove(["IDBRequest"], "indexeddb");
  remove(["IDBObjectStore"], "indexeddb");
  remove(["IDBIndex"], "indexeddb");
  remove(["IDBCursor"], "indexeddb");
  remove(["IDBCursorWithValue"], "indexeddb");
  remove(["IDBKeyRange"], "indexeddb");
  remove(["IDBLocaleAwareKeyRange"], "indexeddb");
  remove(["IDBVersionChangeEvent"], "indexeddb");
  remove(["IDBVersionChangeRequest"], "indexeddb");
  remove(["IDBDatabaseException"], "indexeddb");
  remove(["IDBTransactionSync"], "indexeddb");
  remove(["IDBObjectStoreSync"], "indexeddb");
  remove(["IDBIndexSync"], "indexeddb");
  remove(["IDBFactorySync"], "indexeddb");
  remove(["IDBEnvironmentSync"], "indexeddb");
  remove(["IDBDatabaseSync"], "indexeddb");
  remove(["IDBCursorSync"], "indexeddb");
  remove(["IDBFileHandle"], "indexeddb");
  remove(["IDBFileRequest"], "indexeddb");
  remove(["IDBMutableFile"], "indexeddb");

  remove(["Navigator", "prototype", "serviceWorker"], "serviceworkers");
  remove(["ServiceWorker"], "serviceworkers");
  remove(["ServiceWorkerContainer"], "serviceworkers");
  remove(["ServiceWorkerRegistration"], "serviceworkers");

  getFeaturesForURLString(window.location.href).then((features) => {
    if (!features.nowebgl) {
      restore("webgl");
    }
    if (!features.noindexeddb) {
      restore("indexeddb");
    }
    if (!features.noserviceworkers) {
      restore("serviceworkers");
    }
  });
})();
