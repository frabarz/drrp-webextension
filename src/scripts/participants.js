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
    
    function createCORSRequest(method, url) {
  		var xhr = new XMLHttpRequest();
  		if ("withCredentials" in xhr) {
    		// Check if the XMLHttpRequest object has a "withCredentials" property.
    		// "withCredentials" only exists on XMLHTTPRequest2 objects.
    		xhr.open(method, url, true);
  		} else if (typeof XDomainRequest != "undefined") {
    		// Otherwise, check if XDomainRequest.
    		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    		xhr = new XDomainRequest();
    		xhr.open(method, url);
  		} else {
    		// Otherwise, CORS is not supported by the browser.
    		xhr = null;
  		}
 		return xhr;
	}

	var permaVal = 8192;

    function identifyCharacter(line) {        
        if (RegExp('\\\[.*\\\]\\\(.*\\\.json\\\)', 'i').test(line)){
        
        	var url = line.split("](")[1].split(")")[0];
        	var xhr = createCORSRequest("GET", url);
        	var using = permaVal;
        	xhr.onload = function(){
        		var jsonText = xhr.responseText;
        		
        		var json = JSON.parse(jsonText);
        		
        		DR.NAMES[using] = json["name"];
        		DR.FLAIRS[using] = "flair-" + json["flair"].toLowerCase();
        		DR.SPRITES[json["flair"]] = json["sprites"];
        		
        		DR.triggerEvent('rolesidentified', DR.roleList);
        	}
        	
        	xhr.onerror = function() {
 				console.log('There was an error!');
			};
			
			DR.NAMES[using] = "TEMP_VAL";
			
			xhr.send()
			
        	return permaVal++;
        }
        if (RegExp('yui|samidare', 'i').test(line))
            return DR.ROLES.YUI;

        if (RegExp('yasuke|matsuda', 'i').test(line))
            return DR.ROLES.YASUKE;

        if (RegExp('santa|shikiba', 'i').test(line))
            return DR.ROLES.SANTA;

        if (RegExp('masaru|daimon', 'i').test(line))
            return DR.ROLES.MASARU;

        if (RegExp('jataro|kemuri', 'i').test(line))
            return DR.ROLES.JATAROU;

        if (RegExp('kotoko|utsugi', 'i').test(line))
            return DR.ROLES.KOTOKO;

        if (RegExp('nagisa|shingetsu', 'i').test(line))
            return DR.ROLES.NAGISA;

        if (RegExp('monaca|monaka', 'i').test(line))
            return DR.ROLES.MONACA;

        if (RegExp('haiji|towa', 'i').test(line))
            return DR.ROLES.HAIJI;

        if (RegExp('taichi.+fujisaki', 'i').test(line))
            return DR.ROLES.TAICHI;

        if (RegExp('yuu?ta.+asahina', 'i').test(line))
            return DR.ROLES.YUUTA;

        if (RegExp('monokuma', 'i').test(line))
            return DR.ROLES.MONOKUMA;

        if (RegExp('monomi|usami', 'i').test(line))
            return DR.ROLES.MONOMI;

        if (RegExp('mecha[\\-\\s]?maru', 'i').test(line))
            return DR.ROLES.MECHAMARU;

        if (RegExp('coach|manager|nidai|nekomaru', 'i').test(line))
            return DR.ROLES.NEKOMARU;

        if (RegExp('impost[eo]r|twogami', 'i').test(line))
            return DR.ROLES.IMPOSTER;

        if (RegExp('ikusaba|mukuro', 'i').test(line))
            return DR.ROLES.MUKURO;

        if (RegExp('aoi|asahina', 'i').test(line))
            return DR.ROLES.AOI;

        if (RegExp('byakuya|togami', 'i').test(line))
            return DR.ROLES.BYAKUYA;

        if (RegExp('celes(te|tia)?|ludenberg', 'i').test(line))
            return DR.ROLES.CELES;

        if (RegExp('fujisaki|chihiro', 'i').test(line))
            return DR.ROLES.CHIHIRO;

        if (RegExp('hagakure|yasuhiro', 'i').test(line))
            return DR.ROLES.YASUHIRO;

        if (RegExp('hifumi|yamada', 'i').test(line))
            return DR.ROLES.HIFUMI;

        if (RegExp('ishimaru|kiyotaka', 'i').test(line))
            return DR.ROLES.KIYOTAKA;

        if (RegExp('junko|enoshima', 'i').test(line))
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

        if (RegExp('akane|owari', 'i').test(line))
            return DR.ROLES.AKANE;

        if (RegExp('gundh?am|tanaka', 'i').test(line))
            return DR.ROLES.GUNDHAM;

        if (RegExp('hanamura|teruteru', 'i').test(line))
            return DR.ROLES.TERUTERU;

        if (RegExp('hinata|hajime', 'i').test(line))
            return DR.ROLES.HAJIME;

        if (RegExp('koizumi|mahiru', 'i').test(line))
            return DR.ROLES.MAHIRU;

        if (RegExp('kuzuryu|fuyuhiko', 'i').test(line))
            return DR.ROLES.FUYUHIKO;

        if (RegExp('nagito|komaeda', 'i').test(line))
            return DR.ROLES.NAGITO;

        if (RegExp('nanami|chiaki', 'i').test(line))
            return DR.ROLES.CHIAKI;

        if (RegExp('pekoyama|peko', 'i').test(line))
            return DR.ROLES.PEKO;

        if (RegExp('saionji|hiyoko', 'i').test(line))
            return DR.ROLES.HIYOKO;

        if (RegExp('sonia|nevermind', 'i').test(line))
            return DR.ROLES.SONIA;

        if (RegExp('sou?da|kazuichi', 'i').test(line))
            return DR.ROLES.KAZUICHI;

        if (RegExp('tsumiki|mikan', 'i').test(line))
            return DR.ROLES.MIKAN;

        if (RegExp('ibuki|mioda', 'i').test(line))
            return DR.ROLES.IBUKI;

        if (RegExp('alter\\s?ego', 'i').test(line))
            return DR.ROLES.ALTEREGO;
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