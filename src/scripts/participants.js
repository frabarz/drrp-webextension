(function (DR, document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    var NAMES = [null,
        "Monokuma",
        "Monomi",
        "Aoi Asahina",
        "Celestia Ludenberg",
        "Junko Enoshima",
        "Chihiro Fujisaki",
        "Touko Fukawa",
        "Yasuhiro Hagakure",
        "Mukuro Ikusaba",
        "Kiyotaka Ishimaru",
        "Kyouko Kirigiri",
        "Leon Kuwata",
        "Sayaka Maizono",
        "Makoto Naegi",
        "Sakura Oogami",
        "Mondo Oowada",
        "Byakuya Togami",
        "Hifumi Yamada",
        "Teruteru Hanamura",
        "Hajime Hinata",
        "Mahiru Koizumi",
        "Nagito Komaeda",
        "Fuyuhiko Kuzuryuu",
        "Ibuki Mioda",
        "Chiaki Nanami",
        "Nekomaru Nidai",
        "Akane Owari",
        "Peko Pekoyama",
        "Hiyoko Saionji",
        "Sonia Nevermind",
        "Kazuichi Souda",
        "Gundham Tanaka",
        "Mikan Tsumiki",
        "Byakuya Twogami"
    ];

    var FLAIRS = [null,
        "flair-Monokuma2",
        "flair-Monomi",
        "flair-Aoi",
        "flair-Celes",
        "flair-Junko",
        "flair-Fujisaki",
        "flair-Touko",
        "flair-Hagakure",
        "flair-Ikusaba",
        "flair-Ishimaru",
        "flair-Kyouko",
        "flair-Leon",
        "flair-Maizono",
        "flair-Naegi",
        "flair-Sakura",
        "flair-Mondo",
        "flair-Byakuya",
        "flair-Hifumi",
        "flair-Hanamura",
        "flair-Hinata",
        "flair-Koizumi",
        "flair-Nagito",
        "flair-Kuzuryuu",
        "flair-Ibuki",
        "flair-Nanami",
        "flair-Nidaii",
        "flair-Akane",
        "flair-Pekoyama",
        "flair-Saionji",
        "flair-Sonia",
        "flair-Souda",
        "flair-Gundam",
        "flair-Tsumiki",
        "flair-Togami"
    ];

    var ROLES = {
        MONOKUMA: 1,
        MONOMI: 2,
        ASAHINA: 3,
        CELES: 4,
        ENOSHIMA: 5,
        FUJISAKI: 6,
        FUKAWA: 7,
        HAGAKURE: 8,
        IKUSABA: 9,
        ISHIMARU: 10,
        KIRIGIRI: 11,
        KUWATA: 12,
        MAIZONO: 13,
        NAEGI: 14,
        OOGAMI: 15,
        OOWADA: 16,
        TOGAMI: 17,
        YAMADA: 18,
        HANAMURA: 19,
        HINATA: 20,
        KOIZUMI: 21,
        KOMAEDA: 22,
        KUZURYUU: 23,
        MIODA: 24,
        NANAMI: 25,
        NIDAI: 26,
        OWARI: 27,
        PEKOYAMA: 28,
        SAIONJI: 29,
        SONIA: 30,
        SOUDA: 31,
        TANAKA: 32,
        TSUMIKI: 33,
        TWOGAMI: 34
    }

    function identifyCharacter(line) {
        if (RegExp('monokuma', 'i').test(line))
            return ROLES.MONOKUMA;

        if (RegExp('monomi|usami', 'i').test(line))
            return ROLES.MONOMI;

        if (RegExp('swim|aoi|asahina', 'i').test(line))
            return ROLES.ASAHINA;

        if (RegExp('heir|affluent|byakuya|togami', 'i').test(line))
            return ROLES.TOGAMI;

        if (RegExp('gambler|celes(?:te|tia)?|ludenberg', 'i').test(line))
            return ROLES.CELES;

        if (RegExp('programmer|fujisaki|chihiro', 'i').test(line))
            return ROLES.FUJISAKI;

        if (RegExp('clairvoyant|hagakure|yasuhiro', 'i').test(line))
            return ROLES.HAGAKURE;

        if (RegExp('doujin|hifumi|yamada', 'i').test(line))
            return ROLES.YAMADA;

        if (RegExp('hall|monitor|ishimaru|kiyotaka', 'i').test(line))
            return ROLES.ISHIMARU;

        if (RegExp('fashion|junko|enoshima', 'i').test(line))
            return ROLES.ENOSHIMA;

        if (RegExp('kyou?ko|kirigiri', 'i').test(line))
            return ROLES.KIRIGIRI;

        if (RegExp('baseball|leon|kuwata', 'i').test(line))
            return ROLES.KUWATA;

        if (RegExp('idol|maizono|sayaka', 'i').test(line))
            return ROLES.MAIZONO;

        if (RegExp('biker|mondo|oowada|ohwada', 'i').test(line))
            return ROLES.OOWADA;

        if (RegExp('naegi|makoto', 'i').test(line))
            return ROLES.NAEGI;

        if (RegExp('fighter|sakura|oogami|ohgami', 'i').test(line))
            return ROLES.OOGAMI;

        if (RegExp('literar|tou?ko|fukawa|genocider', 'i').test(line))
            return ROLES.FUKAWA;

        if (RegExp('soldier|ikusaba|mukuro', 'i').test(line))
            return ROLES.IKUSABA;

        if (RegExp('gymnast|akane|owari', 'i').test(line))
            return ROLES.OWARI;

        if (RegExp('breeder|gundh?am|tanaka', 'i').test(line))
            return ROLES.TANAKA;

        if (RegExp('cook|hanamura|teruteru', 'i').test(line))
            return ROLES.HANAMURA;

        if (RegExp('reserve|hinata|hajime', 'i').test(line))
            return ROLES.HINATA;

        if (RegExp('music club|ibuki|mioda', 'i').test(line))
            return ROLES.MIODA;

        if (RegExp('photo|koizumi|mahiru', 'i').test(line))
            return ROLES.KOIZUMI;

        if (RegExp('yakuza|kuzuryu|fuyuhiko', 'i').test(line))
            return ROLES.KUZURYUU;

        if (RegExp('nagito|komaeda', 'i').test(line))
            return ROLES.KOMAEDA;

        if (RegExp('gamer|nanami|chiaki', 'i').test(line))
            return ROLES.NANAMI;

        if (RegExp('coach|manager|nidai|nekomaru', 'i').test(line))
            return ROLES.NIDAI;

        if (RegExp('sword|pekoyama|peko', 'i').test(line))
            return ROLES.PEKOYAMA;

        if (RegExp('dancer|saionji|hiyoko', 'i').test(line))
            return ROLES.SAIONJI;

        if (RegExp('princess|sonia|nevermind', 'i').test(line))
            return ROLES.SONIA;

        if (RegExp('mechanic|sou?da|kazuichi', 'i').test(line))
            return ROLES.SOUDA;

        if (RegExp('impost[eo]r|twogami', 'i').test(line))
            return ROLES.TWOGAMI;

        if (RegExp('nurse|tsumiki|mikan', 'i').test(line))
            return ROLES.TSUMIKI;
    }

    function processRoleList(text) {
        var result, character,
            roles = {},
            regex = /^\*\s(.*)u\/([A-Za-z0-9-_]+)(.*)$/igm;

        while (result = regex.exec(text)) {
            character = identifyCharacter(result[3]) || identifyCharacter(result[1]);

            if (character > 0) {
                roles[result[2]] = character;
                roles[character] = result[2];
            }
        }

        return roles;
    }

    fetch('this.json')
        .then(function (res) {
            return res.json()
        })
        .then(function (media) {
            var info = media[0].data.children[0].data,
                roles = processRoleList(info.selftext);

            if ( !(ROLES.MONOKUMA in roles) && !(info.author in roles) ) {
                roles[info.author] = ROLES.MONOKUMA;
                roles[ROLES.MONOKUMA] = info.author;
            }

            DR.roleList = roles;
            DR.triggerEvent('rolesidentified', roles);
        });

    DR.ROLES = ROLES;
    DR.NAMES = NAMES;
    DR.FLAIRS = FLAIRS;
    DR.identifyCharacter = identifyCharacter;

})(window.DRreddit, document);