(function (DR, document) {
    "use strict";

    if (RegExp('/r/danganronpa/', 'i').test(location.href) && !RegExp("class trial", "i").test(document.title))
        return;

    function computeLocalTime(evt) {
        this.title = 'Right now it\'s '+ DR.roleList.getLocalTime(this.getAttribute('data-user')).toLocaleString() +' in their time zone.';
    }

    DR.addListener('rolesidentified', function (roles) {
        var t, tagline,
            taglines = document.querySelectorAll('.entry .tagline');

        var user, author, character,
            flair, flair_class, offset;

        for (t = 0; tagline = taglines[t]; t++) {
            author = tagline.querySelector('.author');

            if (!author)
                continue;

            user = author.textContent;
            if (roles.exists(user)) {
                tagline.classList.add('drp-participant');

                author.insertBefore(document.createTextNode(' u/'), author.firstChild);

                character = document.createElement('strong');
                character.className = 'drp-charactername';
                character.textContent = DR.NAMES[roles.get(user)];

                author.insertBefore(character, author.firstChild);

                if (roles.hasTz(user)) {
                    offset = document.createElement('strong');
                    offset.className = 'drp-localtime';
                    offset.textContent = '[' + roles.getUTCLabel(user) + ']';
                    offset.setAttribute('data-user', user);
                    offset.addEventListener('mouseenter', computeLocalTime, true);

                    author.appendChild(offset);
                }

                flair = tagline.querySelector('.flair');
                flair_class = DR.FLAIRS[roles.get(user)];
                if (flair && flair_class && flair_class.indexOf('flair-external') != 0)
                    flair.className = 'flair '+ flair_class;
            }
        }
    });

})(window.DRreddit, document);