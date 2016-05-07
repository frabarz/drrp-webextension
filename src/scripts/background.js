function normalizeCharacterName(name) {
    name = name.toLowerCase();

    if (name in character_map)
        name = character_map[name];

    return Promise.resolve(name);
}

function getSpritesList(name) {
	return fetch('busts.json')
        .then(function (response) { return response.json() })
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

	if("custom_sprites" in request){
		Promise.resolve(request["custom_sprites"])
			.then(sendSpritesBack)
			.then(sendResponse);
	}
	else{
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
