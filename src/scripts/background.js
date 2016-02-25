function normalizeCharacterName(name) {
    name = name.toLowerCase();

    if (name in character_map)
        name = character_map[name];

    return Promise.resolve(name);
}

function getSpritesList(name) {
    return new Promise(function (resolve) {
        var req = new XMLHttpRequest();
        req.open('GET', 'busts.json', true);
        req.responseType = 'application/json';
        req.onload = function () {
            var batch = JSON.parse(this.response);
            resolve(batch[name]);
            batch = null;
        };
        req.send();
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
    'junko':     'monokuma',
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

    normalizeCharacterName(request.character)
        .then(getSpritesList)
        .then(sendSpritesBack)
        .then(sendResponse);

    function sendSpritesBack(lista) {
        return {
            sprites: lista.filter(filterUndefined)
        };
    }

    return true;
});
