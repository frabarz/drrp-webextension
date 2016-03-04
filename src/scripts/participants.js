(function (DR, document) {
    "use strict";

    if ( !RegExp("class trial|whodunnit", "i").test(document.title) )
        return;

    function RoleHandler() {
        this.users = [];
        this.characters = {};
        this.timezones = {};
    }

    Object.defineProperties(RoleHandler.prototype, {
        'length': {
            get: function () {
                return Object.keys(this.characters).length;
            }
        },
        'get': {
            writable: false,
            value: function (user) {
                if (typeof user == 'string')
                    return this.characters[user];
                else
                    return this.users[user];
            }
        },
        'set': {
            writable: false,
            value: function (user, role) {
                if (this.exists(user) || this.exists(role))
                    console.warn('Duplicated role:', user, DR.NAMES[role]);

                this.users[role] = user;
                this.characters[user] = role;
            }
        },
        'exists': {
            writable: false,
            value: function (user) {
                if (typeof user == 'string')
                    return (user in this.characters);
                else
                    return (user in this.users);
            }
        },
        'getTz': {
            writable: false,
            value: function (user) {
                return this.timezones[user] || 0;
            }
        },
        'setTz': {
            writable: false,
            value: function (user, offset) {
                this.timezones[user] = offset;
            }
        },
        'hasTz': {
            writable: false,
            value: function (user) {
                return (user in this.timezones);
            }
        },
        'getUTCLabel': {
            writable: false,
            value: function (user) {
                var offset = this.getTz(user),
                    output = 'UTC';

                if (offset !== 0) {
                    output += offset > 0 ? '+' : '';
                    output += Math[offset < 0 ? 'ceil' : 'floor'](offset);

                    if (offset % 1 !== 0)
                        output += ':' + (Math.abs(offset % 1) * 60).toString().slice(0, 2);
                }

                return output;
            }
        },
        'getLocalTime': {
            writable: false,
            value: function (user) {
                var here = new Date();
                return new Date(here.getTime() + (here.getTimezoneOffset() + this.getTz(user) * 60) * 60 * 1000);
            }
        }
    });

    function parseTimezone(line) {
        var offset;

        line = line.replace(/\s/g, '');
        offset = RegExp('[\\[\\(](UTC|GMT)([\\+\\-]\\d{1,2})\\:?(\\d\\d)?[\\]\\)]', 'i').exec(line);

        if (offset && offset[2]) {
            line = parseInt(offset[2]);

            if (offset[3]) {
                line += (line < 0 ? -1 : 1) * parseInt(offset[3]) / 60;
            }

            return line;
        }

        else if (offset && offset[1])
            return 0;
    }

    function identifyCharacter(line) {
        if (RegExp('monokuma', 'i').test(line))
            return DR.ROLES.MONOKUMA;

        if (RegExp('monomi|usami', 'i').test(line))
            return DR.ROLES.MONOMI;

        if (RegExp('swim|aoi|asahina', 'i').test(line))
            return DR.ROLES.AOI;

        if (RegExp('heir|affluent|byakuya|togami', 'i').test(line))
            return DR.ROLES.BYAKUYA;

        if (RegExp('gambler|celes(te|tia)?|ludenberg', 'i').test(line))
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
            return DR.ROLES.KYOUKO;

        if (RegExp('baseball|leon|kuwata', 'i').test(line))
            return DR.ROLES.LEON;

        if (RegExp('idol|maizono|sayaka', 'i').test(line))
            return DR.ROLES.SAYAKA;

        if (RegExp('biker|mondo|oo?wada|ohwada', 'i').test(line))
            return DR.ROLES.MONDO;

        if (RegExp('komaru', 'i').test(line))
            return DR.ROLES.KOMARU;

        if (RegExp('makoto', 'i').test(line))
            return DR.ROLES.MAKOTO;

        if (RegExp('sakura|oo?gami|ohgami', 'i').test(line))
            return DR.ROLES.SAKURA;

        if (RegExp('tou?ko|fukawa|genocider', 'i').test(line))
            return DR.ROLES.TOUKO;

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

        if (RegExp('mecha[\\-\\s]?maru', 'i').test(line))
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
        var result, character, offset,
            roles = new RoleHandler(),
            regex = /^(.*)u\/([A-Za-z0-9-_]+)(.*)$/igm;

        while (result = regex.exec(text)) {
            character = identifyCharacter(result[3]) || identifyCharacter(result[1]);

            if (character > 0) {
                roles.set(result[2], character);

                offset = parseTimezone(result[0]);
                if (offset != null)
                    roles.setTz(result[2], offset);
            }
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
            roles.set(info.author, DR.ROLES.MONOKUMA);
        }

        console.debug('Identified roles:', roles);

        DR.roleList = roles;
        DR.triggerEvent('rolesidentified', roles);
    });

    DR.identifyCharacter = identifyCharacter;
})(window.DRreddit, document);