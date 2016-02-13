(function (document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    var img, kid,
        newsrc, lastsrc,
        c, comment,
        h, header,
        p, paragraph,
        a, anchor;

    var headers,
        anchors,
        paragraphs,
        comments = document.querySelectorAll('.entry .md');

    for (c = 0; comment = comments[c]; c++) {
        if (c > 0) {
            headers = comment.querySelectorAll('h2');

            for (h = 0; header = headers[h]; h++) {
                paragraph = document.createElement('p');

                for (kid = header.firstChild; kid; kid = kid.nextSibling)
                    paragraph.appendChild(kid);

                comment.replaceChild(paragraph, header);
                header = null;
            }
        }

        paragraphs = comment.querySelectorAll('p');

        for (p = 0; paragraph = paragraphs[p]; p++) {
            lastsrc = '';
            anchors = paragraph.querySelectorAll('a');

            for (a = 0; anchor = anchors[a]; a++) {
                newsrc = anchor.href
                    .replace(/revision\/latest.+$/, '')
                    .replace(/\/$/, '');

                if (newsrc == lastsrc)
                    continue;

                img = new Image();

                img.onerror = imageErrorOne;

                if (paragraph.textContent.length < 14
                    && RegExp('evidence|proof', 'i').test(anchor.textContent)
                    ) {
                    img.onload = imageLoadEvidence.bind(img, paragraph, anchor);
                } else {
                    img.onload = imageLoadSprite.bind(img, paragraph, anchor);
                }

                img.src = newsrc;
                lastsrc = newsrc;
            }
        }
    }

    function imageErrorOne() {
        if (this.src.indexOf('postimg.org') > -1) {
            this.onerror = imageErrorTwo;
            this.src = this.src.replace('://', '://proxy-4-web.appspot.com/');
        } else {
            this.onerror = null;
            this.onload = null;
        }
    }

    function imageErrorTwo() {
        if (this.src.indexOf('postimg.org') > -1) {
            this.onerror = imageErrorLast;
            this.src = this.src.replace('://proxy-4-web.appspot.com/', '://icracks-53.appspot.com/');
        } else {
            this.onerror = null;
            this.onload = null;
        }
    }

    function imageErrorLast() {
        this.onerror = null;
        this.onload = null;
    }

    function imageLoadSprite(p, a) {
        this.className = 'drtrial-sprite';

        p.insertBefore(document.createElement('br'), a);

        p.classList.add('drtrial-statement');
        p.insertBefore(this, a);

        p.parentNode.classList.add('drtrial-dialogue');
    }

    function imageLoadEvidence(p, a) {
        this.className = 'drtrial-evidence';

        p.parentNode.classList.add('drtrial-dialogue');
        p.parentNode.insertBefore(this, p.nextSibling);
    }

})(document);
