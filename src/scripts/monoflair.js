(function (document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    var mono, taglines, t;

    var line,
        rules = document.querySelector('.sitetable .entry .md').querySelectorAll('*'),
        r = rules.length;

    while (r--) {
        line = rules[r].textContent.toLowerCase();

        if (line.indexOf('monomi') > -1 && line.indexOf('u/') > -1) {
            line = rules[r].querySelector('a');

            console.log(line);

            if (line && line.href.indexOf('/u/') > -1) {
                mono = line.href.replace(/.+\//, '');

                taglines = document.querySelectorAll('.tagline a[href$="'+ mono +'"]');
                t = taglines.length;

                while (t--)
                    taglines[t].previousElementSibling.className = 'flair flair-Monomi';

                break;
            }
        }
    }

    rules = null;
    line = null;
    taglines = null;

    var flairs = document.querySelectorAll('.entry .flair-Junko'),
        f = flairs.length;

    while (f--) {
        flairs[f].classList.remove('flair-Junko');
        flairs[f].classList.add('flair-Monokuma2');
    }

})(document);