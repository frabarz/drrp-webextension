function normalizeCharacterName(name) {
	name = name.toLowerCase();
	name = name.split("-")[0];

	if (name in character_map) name = character_map[name];

	return Promise.resolve(name);
}

function getSpritesList(name) {
	return SettingStorage.get("sprites_sourcelist")
		.then(function(settings) {
			return fetch(settings.sprites_sourcelist);
		})
		.then(
			function(response) {
				return response.json();
			},
			function(err) {
				return fetch("busts.json").then(function(response) {
					return response.json();
				});
			}
		)
		.then(function(batch) {
			return batch[name];
		});
}

var character_map = {
	celestia: "celes",
	fujisaki: "chihiro",
	hagakure: "yasuhiro",
	ishimaru: "kiyotaka",
	kyoko: "kyouko",
	maizono: "sayaka",
	monokuma2: "monokuma",
	ikusaba: "mukuro",
	naegi: "makoto",
	toko: "touko",
	gundam: "gundham",
	hanamura: "teruteru",
	hinata: "hajime",
	koizumi: "mahiru",
	kuzuryuu: "fuyuhiko",
	nanami: "chiaki",
	nidaii: "nekomaru",
	pekoyama: "peko",
	saionji: "hiyoko",
	souda: "kazuichi",
	togami: "imposter",
	tsumiki: "mikan"
};

function localStoragePromise(key) {
	const value = localStorage.getItem(key);
	return value !== null
		? Promise.resolve(value)
		: Promise.reject("Key doesn't exists in localStorage: " + key);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
		case "SETTINGS_OPEN":
			if ("runtime" in chrome && "openOptionsPage" in chrome.runtime)
				chrome.runtime.openOptionsPage();
			else chrome.tabs.create({ url: chrome.extension.getURL("options.html") });

			return false;

		case "SPRITES_RESOLVE":
			const url = new URL(request.uri);
			const key = url.pathname.replace("characters/", "");

			localStoragePromise(key)
				.catch(function(err) {
					return fetch(request.uri, {
						mode: "cors"
					}).then(function(response) {
						localStorage.setItem(key, response.url);
						return response.url;
					}, err => null);
				})
				.then(function(uri) {
					sendResponse(uri ? uri + url.hash : '');
				});

			return true;

		case "SPRITES_GETLIST":
			if (Array.isArray(request.custom_sprites)) {
				Promise.resolve(request.custom_sprites)
					.then(sendSpritesBack)
					.then(sendResponse);
			} else {
				normalizeCharacterName(request.character)
					.then(getSpritesList)
					.then(sendSpritesBack)
					.then(sendResponse);
			}

			return true;

		default:
			return false;
	}

	function sendSpritesBack(lista) {
		return {
			sprites: lista.filter(Boolean).map(function(img) {
				img = img.replace("#sprite", "");
				return img + "#sprite";
			})
		};
	}

	return true;
});

function getOption(first, defecto) {
	return first != null ? first : defecto;
}

function install() {
	SettingStorage.get()
		.then(function(settings) {
			return {
				theme: getOption(settings.theme, "default"),
				bullets_bgred: getOption(settings.bullets_bgred, false),
				banner_paused: getOption(settings.banner_paused, true),
				sprites_sourcelist: getOption(
					settings.sprites_sourcelist,
					"https://frbrz-kumo.appspot.com/postit/busts.json"
				)
			};
		})
		.then(SettingStorage.set);
}

function installIfFirefoxStillDoesntImplementTheOnInstalledEvent() {
	var installed = localStorage.getItem("installed");

	if (installed != "true") {
		install();
		localStorage.setItem("installed", "true");
	}
}

if ("onInstalled" in chrome.runtime)
	chrome.runtime.onInstalled.addListener(install);
else installIfFirefoxStillDoesntImplementTheOnInstalledEvent();
