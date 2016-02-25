(function (DR, document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    function RoleHandler() {
        this.users = [];
        this.characters = {};
    }

    Object.defineProperties(RoleHandler.prototype, {
        'length': {
            get: function () {
                return Object.keys(this.characters).length;
            }
        },
        'add': {
            value: function (user, role) {
                if (this.exists(user) || this.exists(role))
                    console.error('Parsing gave duplicated role:', user, role);

                this.users[role] = user;
                this.characters[user] = role;
            }
        },
        'exists': {
            value: function (who) {
                if (typeof who == 'string')
                    return (who in this.characters);
                else
                    return (who in this.users);
            }
        },
        'get': {
            value: function (who) {
                if (typeof who == 'string')
                    return this.characters[who];
                else
                    return this.users[who];
            }
        }
    });

    function identifyCharacter(line) {
        if (RegExp('monokuma', 'i').test(line))
            return DR.ROLES.MONOKUMA;

        if (RegExp('monomi|usami', 'i').test(line))
            return DR.ROLES.MONOMI;

        if (RegExp('swim|aoi|asahina', 'i').test(line))
            return DR.ROLES.AOI;

        if (RegExp('heir|affluent|byakuya|togami', 'i').test(line))
            return DR.ROLES.BYAKUYA;

        if (RegExp('gambler|celes(?:te|tia)?|ludenberg', 'i').test(line))
            return DR.ROLES.CELES;

        if (RegExp('programmer|fujisaki|chihiro', 'i').test(line))
            return DR.ROLES.CHIHIRO;

        if (RegExp('clairvoyant|hagakure|yasuhiro', 'i').test(line))
            return DR.ROLES.YASUHIRO;

        if (RegExp('doujin|hifumi|yamada', 'i').test(line))
            return DR.ROLES.HIFUMI;

        if (RegExp('hall|monitor|ishimaru|kiyotaka', 'i').test(line))
            return DR.ROLES.KIYOTAKA;

        if (RegExp('fashion|junko|enoshima', 'i').test(line))
            return DR.ROLES.JUNKO;

        if (RegExp('kyou?ko|kirigiri', 'i').test(line))
            return DR.ROLES.KYOKO;

        if (RegExp('baseball|leon|kuwata', 'i').test(line))
            return DR.ROLES.LEON;

        if (RegExp('idol|maizono|sayaka', 'i').test(line))
            return DR.ROLES.SAYAKA;

        if (RegExp('biker|mondo|oowada|ohwada', 'i').test(line))
            return DR.ROLES.MONDO;

        if (RegExp('naegi|makoto', 'i').test(line))
            return DR.ROLES.MAKOTO;

        if (RegExp('fighter|sakura|oogami|ohgami', 'i').test(line))
            return DR.ROLES.SAKURA;

        if (RegExp('literar|tou?ko|fukawa|genocider', 'i').test(line))
            return DR.ROLES.TOKO;

        if (RegExp('soldier|ikusaba|mukuro', 'i').test(line))
            return DR.ROLES.MUKURO;

        if (RegExp('gymnast|akane|owari', 'i').test(line))
            return DR.ROLES.AKANE;

        if (RegExp('breeder|gundh?am|tanaka', 'i').test(line))
            return DR.ROLES.GUNDHAM;

        if (RegExp('cook|hanamura|teruteru', 'i').test(line))
            return DR.ROLES.TERUTERU;

        if (RegExp('reserve|hinata|hajime', 'i').test(line))
            return DR.ROLES.HAJIME;

        if (RegExp('music club|ibuki|mioda', 'i').test(line))
            return DR.ROLES.IBUKI;

        if (RegExp('photo|koizumi|mahiru', 'i').test(line))
            return DR.ROLES.MAHIRU;

        if (RegExp('yakuza|kuzuryu|fuyuhiko', 'i').test(line))
            return DR.ROLES.FUYUHIKO;

        if (RegExp('nagito|komaeda', 'i').test(line))
            return DR.ROLES.NAGITO;

        if (RegExp('gamer|nanami|chiaki', 'i').test(line))
            return DR.ROLES.CHIAKI;

        if (RegExp('mecha[-\s]?maru', 'i').test(line))
            return DR.ROLES.MECHAMARU;

        if (RegExp('coach|manager|nidai|nekomaru', 'i').test(line))
            return DR.ROLES.NEKOMARU;

        if (RegExp('sword|pekoyama|peko', 'i').test(line))
            return DR.ROLES.PEKO;

        if (RegExp('dancer|saionji|hiyoko', 'i').test(line))
            return DR.ROLES.HIYOKO;

        if (RegExp('princess|sonia|nevermind', 'i').test(line))
            return DR.ROLES.SONIA;

        if (RegExp('mechanic|sou?da|kazuichi', 'i').test(line))
            return DR.ROLES.KAZUICHI;

        if (RegExp('impost[eo]r|twogami', 'i').test(line))
            return DR.ROLES.IMPOSTER;

        if (RegExp('nurse|tsumiki|mikan', 'i').test(line))
            return DR.ROLES.MIKAN;
    }

    function processRoleList(text) {
        var result, character,
            roles = new RoleHandler(),
            regex = /^(.*)u\/([A-Za-z0-9-_]+)(.*)$/igm;

        while (result = regex.exec(text)) {
            character = identifyCharacter(result[3]) || identifyCharacter(result[1]);

            if (character > 0)
                roles.add(result[2], character);
        }

        return roles;
    }

    DR.fetch('GET', './this.json').then(function (media) {
        var info = media[0].data.children[0].data,
            roles = processRoleList(info.selftext);

        if (!(/summary/i).test(document.title)
            && roles.length > 10
            && !roles.exists(DR.ROLES.MONOKUMA)
            && !roles.exists(info.author)
            ) {
            roles.add(info.author, DR.ROLES.MONOKUMA);
        }

        console.debug('Identified roles:', roles);

        DR.roleList = roles;
        DR.triggerEvent('rolesidentified', roles);
    });

    DR.identifyCharacter = identifyCharacter;
})(window.DRreddit, document);