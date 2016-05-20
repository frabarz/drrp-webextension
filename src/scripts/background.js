function normalizeCharacterName(name) {
    name = name.toLowerCase();

    if (name in character_map)
        name = character_map[name];

    return Promise.resolve(name);
}

function getSpritesList(name) {
    return SettingStorage.get('sprites_sourcelist')
        .then(function (settings) {
            return fetch(settings.sprites_sourcelist);
        })
        .then(function (response) {
            return response.json();
        }, function (err) {
            return fetch('busts.json')
                .then(function (response) {
                    return response.json()
                });
        })
        .then(function (batch) {
            return batch[name];
        });
}

function filterUndefined(itm) {
    return !!itm;
}

var character_map = {
    'celestia':  'celes',
    'fujisaki':  'chihiro',
    'hagakure':  'yasuhiro',
    'ishimaru':  'kiyotaka',
    'kyoko':     'kyouko',
    'maizono':   'sayaka',
    'monokuma2': 'monokuma',
    'ikusaba':   'mukuro',
    'naegi':     'makoto',
    'toko':      'touko',
    'gundam':    'gundham',
    'hanamura':  'teruteru',
    'hinata':    'hajime',
    'koizumi':   'mahiru',
    'kuzuryuu':  'fuyuhiko',
    'nanami':    'chiaki',
    'nidaii':    'nekomaru',
    'pekoyama':  'peko',
    'saionji':   'hiyoko',
    'souda':     'kazuichi',
    'togami':    'imposter',
    'tsumiki':   'mikan'
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.openSettings) {
        chrome.runtime.openOptionsPage();
        return false;
    }

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

    function sendSpritesBack(lista) {
        return {
            sprites: lista.filter(filterUndefined)
        };
    }

    return true;
});

function install() {
    SettingStorage.get(['sprites_sourcelist'])
        .then(function(settings) {
            return {
                theme:              settings.theme              || 'default',
                bullets_bgred:      settings.bullets_bgred      || false,
                banner_paused:      settings.banner_paused      || false,
                sprites_sourcelist: settings.sprites_sourcelist || 'https://frbrz-kumo.appspot.com/postit/busts.json'
            };
        })
        .then(SettingStorage.set)
}

function installIfFirefoxStillDoesntImplementTheOnInstalledEvent() {
    var installed = localStorage.getItem('installed');

    if (installed != 'true') {
        install();
        localStorage.setItem('installed', 'true');
    }
}

if ('onInstalled' in chrome.runtime)
    chrome.runtime.onInstalled.addListener(install);
else
    installIfFirefoxStillDoesntImplementTheOnInstalledEvent();