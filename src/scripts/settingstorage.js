var SettingStorage = (function() {
	"use strict";

	function SettingStorage() {}

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
			var i,
				output = {};

			// If key is a valid string, prepare it as array
			if (typeof key == "string" && key != "") key = [key];
			else if (typeof key == "object") {
				// If key is an object,
				// If it isn't an array, retrieve its keys
				if (!Array.isArray(key)) key = Object.keys(key);

				// else, leave it as is
			} else if (key == null || key == undefined) {
				// If key isn't set, retrieve everything
				key = [];
				for (i = 0; i < localStorage.length; i++) key.push(localStorage.key(i));
			} else throw new Error("Referenced key is not valid.");

			for (i = 0; i < key.length; i++)
				output[key[i]] = localStorage.getItem(key[i]);

			resolve(output);
		});
	}

	function localStorageSet(object) {
		return new Promise(function(resolve) {
			var i, value;

			if (typeof object == "string" && object.trim() != "")
				localStorage.setItem(object, JSON.stringify(value));
			else if (!Array.isArray(object) && typeof object == "object") {
				value = object;
				object = Object.keys(object);

				for (i = 0; i < object.length; i++)
					localStorage.setItem(object[i], value[object[i]]);
			}

			resolve();
		});
	}

	if ("storage" in chrome) {
		if ("sync" in chrome.storage) {
			console.debug("Using chrome.storage.sync");

			Object.defineProperties(SettingStorage, {
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
			console.debug("Using chrome.storage.local");

			Object.defineProperties(SettingStorage, {
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
		console.debug("Using localStorage");

		Object.defineProperties(SettingStorage, {
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

	return SettingStorage;
})();
