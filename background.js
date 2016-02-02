chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var req = new XMLHttpRequest();
    req.open('GET', 'sprites.json', true);

    req.onload = function() {
        var character = character_map[request.character],
            output = [],
            lista = JSON.parse(this.response);

        output = output.concat(lista[character]);

        if (request.spoilers)
            output = output.concat(lista[character + '_spoiler']);

        sendResponse({
            sprites: output
        });
    };

    req.send();

    return true;
});

var character_map = {
    'Aoi': 'asahina',
    'Byakuya': 'togami',
    'Celes': 'celes',
    'Fujisaki': 'fujisaki',
    'Hagakure': 'hagakure',
    'Hifumi': 'yamada',
    'Ishimaru': 'ishimaru',
    'Junko': 'enoshima',
    'Kyouko': 'kirigiri',
    'Leon': 'kuwata',
    'Maizono': 'maizono',
    'Mondo': 'oowada',
    'Naegi': 'naegi',
    'Sakura': 'oogami',
    'Touko': 'fukawa',
    'Ikusaba': 'ikusaba',
    'Akane': 'owari',
    'Gundam': 'tanaka',
    'Hanamura': 'hanamura',
    'Hinata': 'hinata',
    'Ibuki': 'mioda',
    'Koizumi': 'koizumi',
    'Kuzuryuu': 'kuzuryuu',
    'Nagito': 'komaeda',
    'Nanami': 'nanami',
    'Nidaii': 'nidai',
    'Pekoyama': 'pekoyama',
    'Saionji': 'saionji',
    'Sonia': 'sonia',
    'Souda': 'souda',
    'Togami': 'twogami',
    'Tsumiki': 'tsumiki'
};