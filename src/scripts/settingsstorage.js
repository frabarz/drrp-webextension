var SettingsStorage = (function() {
	"use strict";

	function SettingsStorage() {}

	function storageSyncGet(key) {
		return new Promise(function(resolve) {
			chrome.storage.sync.get(key, resolve);
		});
	}

	function storageSyncSet(object) {
		return new Promise(function(resolve) {
			chrome.storage.sync.set(object, resolve);
		});
	}

	function storageLocalGet(key) {
		return new Promise(function(resolve) {
			chrome.storage.local.get(key, resolve);
		});
	}

	function storageLocalSet(object) {
		return new Promise(function(resolve) {
			chrome.storage.local.set(object, resolve);
		});
	}

	function localStorageGet(key) {
		return new Promise(function(resolve) {
			var i, output = {};

			if (typeof key == 'string' && key.trim() === '')
				return output;

			else if (!Array.isArray(key) && typeof key == 'object')
				key = Object.keys(key);

			else if (key == null || key == undefined) {
				key = [];
				for (i = 0; i < localStorage.length; i++)
					key.push(localStorage.key(i));
			}

			for (i = 0; i < key.length; i++)
				output[key[i]] = localStorage.getItem(key[i]);

			resolve(output);
		});
	}

	function localStorageSet(object, value) {
		return new Promise(function(resolve) {
			var i;

			if (typeof object == 'string' && object.trim() != '')
				localStorage.setItem(object, JSON.stringify(value));

			else if (!Array.isArray(object) && typeof object == 'object') {
				value = object;
				object = Object.keys(object);

				for (i = 0; i < object.length; i++)
					localStorage.setItem(object[i], value[object[i]]);
			}

			resolve();
		});
	}

	if ('storage' in chrome) {
		if ('sync' in chrome.storage) {
			Object.defineProperties(SettingsStorage, {
				get: {
					writable: false,
					value: storageSyncGet
				},
				set: {
					writable: false,
					value: storageSyncSet
				}
			});

		} else {
			Object.defineProperties(SettingsStorage, {
				get: {
					writable: false,
					value: storageLocalGet
				},
				set: {
					writable: false,
					value: storageLocalSet
				}
			});
		}

	} else {
			Object.defineProperties(SettingsStorage, {
				get: {
					writable: false,
					value: localStorageGet
				},
				set: {
					writable: false,
					value: localStorageSet
				}
			});
	}

	return SettingsStorage;
})();
