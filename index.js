const modules = [];
var defaultModuleName = 'app';
var defaultModulePrefix = '$';
var apiMethod = ['use', 'getModules', 'getData'];

function isString(f) {
  return Object.prototype.toString.call(f) === '[object String]';
}


class Store {
  constructor(moduleName, prefix) {
    if (Store.instance === undefined) {
      if (!(this instanceof Store)) return new Store(moduleName);
      if (isString(moduleName)) defaultModuleName = moduleName.trim();
      if (isString(prefix)) defaultModulePrefix = prefix.trim();
      modules.push(defaultModuleName);
      this[defaultModuleName] = {}

      Store.instance = new Proxy(this, {
        get: function (target, key) {
          if (key.charAt(0) === defaultModulePrefix && key.length > 1) {
            return target[key.slice(1)];
          } else if (apiMethod.indexOf(key) === -1) {
            return target[defaultModuleName][key];
          } else {
            return target[key];
          }
        },
        set: function (target, key, value) {
          if (key.charAt(0) === defaultModulePrefix && key.length > 1) {
            let moduleName = key.slice(1);
            if (modules.indexOf(moduleName) === -1) modules.push(moduleName);
            target[moduleName] = value;
          } else {
            target[defaultModuleName][key] = value;
          }
          return true;
        }
      })
    }


    return Store.instance;
  }

  use(moduleName) {
    if (isString(moduleName)) {
      if (modules.indexOf(moduleName) > 0) defaultModuleName = moduleName;
    }
  }

  getModules() {
    console.log(modules.join(','))
  }

  getData() {
    console.log(this)
  }
}

export default Store;