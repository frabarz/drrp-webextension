(function (DR, document) {
    "use strict";

    if (RegExp('/r/danganronpa/', 'i').test(location.href) && !RegExp("class trial", "i").test(document.title))
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
                    return this.characters[user.toLowerCase()];
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
                this.characters[user.toLowerCase()] = role;
            }
        },
        'setExternal': {
            writable: false,
            value: function (username, url) {
                // Load the JSON
                return DR.fetch('GET', url)
                    .then(function (data) {
                        // Get a new Role Slot
                        var role = DR.ROLES.assign(data.name);
                        // and assign it to the new guy
                        this.set(username, role.code);
                        // along with their resources
                        DR.NAMES[role.code] = data.name;
                        DR.FLAIRS[role.code] = 'flair-external' + role.key.toLowerCase();
                        DR.SPRITES[role.code] = data.sprites;

                        // Now for their flair
                        return new Promise(function (resolve, reject) {
                            // download it
                            var flair = new Image();
                            flair.src = data.flair;
                            flair.onload = resolve;
                            flair.onerror = reject;
                        }).then(function (evt) {
                            DR.FLAIRS[role.code] = 'flair-' + role.key.toLowerCase();

                            var style = document.createElement('style');
                            // get the flair size and prepare to...
                            style.textContent = '.flair.flair-' + role.key.toLowerCase() + '{background-image:url(' + evt.target.src + ');background-position:center;width:' + evt.target.naturalWidth + 'px;height:' + evt.target.naturalHeight + 'px}';
                            // ...put it in the sub
                            document.querySelector('head').appendChild(style);
                        });
                    }.bind(this))
                    .then(null, function (err) {
                        console.warn('An external character failed to load:', username, err);
                    });
            }
        },
        'exists': {
            writable: false,
            value: function (user) {
                if (typeof user == 'string')
                    return (user.toLowerCase() in this.characters);
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
        line = ' ' + line + ' ';

        if (RegExp('\\W(yui|samidare)\\W', 'i').test(line))
            return DR.ROLES.YUI;

        if (RegExp('\\W(yasuke|matsuda)\\W', 'i').test(line))
            return DR.ROLES.YASUKE;

        if (RegExp('\\W(santa|shikiba)\\W', 'i').test(line))
            return DR.ROLES.SANTA;

        if (RegExp('\\W(masaru|daimon)\\W', 'i').test(line))
            return DR.ROLES.MASARU;

        if (RegExp('\\W(jataro|kemuri)\\W', 'i').test(line))
            return DR.ROLES.JATAROU;

        if (RegExp('\\W(kotoko|utsugi)\\W', 'i').test(line))
            return DR.ROLES.KOTOKO;

        if (RegExp('\\W(nagisa|shingetsu)\\W', 'i').test(line))
            return DR.ROLES.NAGISA;

        if (RegExp('\\Wmona[ck]a\\W', 'i').test(line))
            return DR.ROLES.MONACA;

        if (RegExp('\\W(haiji|towa)\\W', 'i').test(line))
            return DR.ROLES.HAIJI;

        if (RegExp('\\Wtaichi.+fujisaki\\W', 'i').test(line))
            return DR.ROLES.TAICHI;

        if (RegExp('\\Wyuu?ta.+asahina\\W', 'i').test(line))
            return DR.ROLES.YUUTA;

        if (RegExp('\\Wmonokuma\\W', 'i').test(line))
            return DR.ROLES.MONOKUMA;

        if (RegExp('\\W(monomi|usami)\\W', 'i').test(line))
            return DR.ROLES.MONOMI;

        if (RegExp('\\Wmecha[-\\s]?maru\\W', 'i').test(line))
            return DR.ROLES.MECHAMARU;

        if (RegExp('\\W(nidai|nekomaru)\\W', 'i').test(line))
            return DR.ROLES.NEKOMARU;

        if (RegExp('\\W(impost[eo]r|twogami)\\W', 'i').test(line))
            return DR.ROLES.IMPOSTER;

        if (RegExp('\\W(ikusaba|mukuro)\\W', 'i').test(line))
            return DR.ROLES.MUKURO;

        if (RegExp('\\W(aoi|asahina)\\W', 'i').test(line))
            return DR.ROLES.AOI;

        if (RegExp('\\W(byakuya|togami)\\W', 'i').test(line))
            return DR.ROLES.BYAKUYA;

        if (RegExp('\\W(celes(te|tia)?|ludenberg)\\W', 'i').test(line))
            return DR.ROLES.CELES;

        if (RegExp('\\W(fujisaki|chihiro)\\W', 'i').test(line))
            return DR.ROLES.CHIHIRO;

        if (RegExp('\\W(hagakure|yasuhiro)\\W', 'i').test(line))
            return DR.ROLES.YASUHIRO;

        if (RegExp('\\W(hifumi|yamada)\\W', 'i').test(line))
            return DR.ROLES.HIFUMI;

        if (RegExp('\\W(ishimaru|kiyotaka)\\W', 'i').test(line))
            return DR.ROLES.KIYOTAKA;

        if (RegExp('\\W(junko|enoshima)\\W', 'i').test(line))
            return DR.ROLES.JUNKO;

        if (RegExp('\\W(kyou?ko|kirigiri)\\W', 'i').test(line))
            return DR.ROLES.KYOUKO;

        if (RegExp('\\W(leon|kuwata)\\W', 'i').test(line))
            return DR.ROLES.LEON;

        if (RegExp('\\W(maizono|sayaka)\\W', 'i').test(line))
            return DR.ROLES.SAYAKA;

        if (RegExp('\\W(mondo|o[oh]?wada)\\W', 'i').test(line))
            return DR.ROLES.MONDO;

        if (RegExp('\\Wkomaru\\W', 'i').test(line))
            return DR.ROLES.KOMARU;

        if (RegExp('\\Wmakoto\\W', 'i').test(line))
            return DR.ROLES.MAKOTO;

        if (RegExp('\\W(sakura|o[oh]?gami)\\W', 'i').test(line))
            return DR.ROLES.SAKURA;

        if (RegExp('\\W(tou?ko|fukawa|genocider)\\W', 'i').test(line))
            return DR.ROLES.TOUKO;

        if (RegExp('\\W(akane|owari)\\W', 'i').test(line))
            return DR.ROLES.AKANE;

        if (RegExp('\\W(gundh?am|tanaka)\\W', 'i').test(line))
            return DR.ROLES.GUNDHAM;

        if (RegExp('\\W(hanamura|teruteru)\\W', 'i').test(line))
            return DR.ROLES.TERUTERU;

        if (RegExp('\\W(hinata|hajime)\\W', 'i').test(line))
            return DR.ROLES.HAJIME;

        if (RegExp('\\W(koizumi|mahiru)\\W', 'i').test(line))
            return DR.ROLES.MAHIRU;

        if (RegExp('\\W(kuzuryu|fuyuhiko)\\W', 'i').test(line))
            return DR.ROLES.FUYUHIKO;

        if (RegExp('\\W(nagito|komaeda)\\W', 'i').test(line))
            return DR.ROLES.NAGITO;

        if (RegExp('\\W(nanami|chiaki)\\W', 'i').test(line))
            return DR.ROLES.CHIAKI;

        if (RegExp('\\W(pekoyama|peko)\\W', 'i').test(line))
            return DR.ROLES.PEKO;

        if (RegExp('\\W(saionji|hiyoko)\\W', 'i').test(line))
            return DR.ROLES.HIYOKO;

        if (RegExp('\\W(sonia|nevermind)\\W', 'i').test(line))
            return DR.ROLES.SONIA;

        if (RegExp('\\W(sou?da|kazuichi)\\W', 'i').test(line))
            return DR.ROLES.KAZUICHI;

        if (RegExp('\\W(tsumiki|mikan)\\W', 'i').test(line))
            return DR.ROLES.MIKAN;

        if (RegExp('\\W(ibuki|mioda)\\W', 'i').test(line))
            return DR.ROLES.IBUKI;

        if (RegExp('\\Walter\\s?ego\\W', 'i').test(line))
            return DR.ROLES.ALTEREGO;
    }

    function processRoleList(text) {
        var promises = [],
            roles = new RoleHandler(),
            // The regex matches a whole line if it contains a reddit username [u/user-name_0]
            regex = /^(.*)u\/([A-Za-z0-9-_]+)(.*)$/igm;

        var result,
            promise,
            line, username,
            character, offset,
            url, url_start, url_end;

        while (result = regex.exec(text)) {
            line = result[0];
            username = result[2];

            // Find an external role assignment
            url_start = line.indexOf('http');
            url_end = line.indexOf('.json');

            if (url_start > -1 && url_end > -1 && url_start < url_end) {
                url = line.slice(url_start, url_end + 5);

                promise = roles.setExternal(username, url);
                promises.push(promise);

            } else {
                character = identifyCharacter(result[3]) || identifyCharacter(result[1]);

                if (character > 0) {
                    roles.set(result[2], character);

                    offset = parseTimezone(result[0]);
                    if (offset != null)
                        roles.setTz(result[2], offset);
                }
            }
        }

        return Promise.all(promises)
            .then(function () {
                return roles;
            });
    }

    DR.fetch('GET', './this.json').then(function (media) {
        var info = media[0].data.children[0].data;

        processRoleList(info.selftext)
            .then(function (roles) {
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
    });

    DR.identifyCharacter = identifyCharacter;
})(window.DRreddit, document);