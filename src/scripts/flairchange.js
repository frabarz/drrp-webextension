(function (DR, document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    DR.addListener('rolesidentified', function (roles) {
        var t, tagline,
            taglines = document.querySelectorAll('.entry .tagline');

        var user, author, character, flair;

        for (t = 0; tagline = taglines[t]; t++) {
            author = tagline.querySelector('.author');

            if (!author)
                continue;

            user = author.textContent;
            if (roles.exists(user)) {
                character = document.createElement('strong');
                character.className = 'drp-charactername';
                character.textContent = DR.NAMES[roles.get(user)];

                author.parentNode.insertBefore(character, author);
                author.parentNode.insertBefore(document.createTextNode(' / '), author);

                flair = tagline.querySelector('.flair');
                if (flair) {
                    flair.className = 'flair';
                    flair.classList.add(DR.FLAIRS[roles.get(user)]);
                }
            }
        }
    });

})(window.DRreddit, document);