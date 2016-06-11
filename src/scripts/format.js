document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    if (RegExp('/r/danganronpa/', 'i').test(location.href) && !RegExp("class trial", "i").test(document.title))
        return;

    var img, kid,
        newsrc, lastsrc,
        c, comment,
        h, header,
        p, paragraph,
        a, anchor,
        b, blockquote;

    var headers,
        anchors,
        paragraphs,
        blockquotes,
        comments = document.querySelectorAll('.thing.self, .thing.comment');

    var read, time;

    for (c = 0; c < comments.length; c++) {
        comment = comments[c].querySelector('.entry .md');

        if (!comment)
            continue;

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

        time = comments[c].querySelector('.edited-timestamp') || comments[c].querySelector('.live-timestamp');
        time = (new Date(time.getAttribute('datetime'))).getTime();

        if ( time > sessionStorage.getItem(comments[c].dataset.fullname) ) {
            comments[c].classList.add('new-comment');
            sessionStorage.setItem(comments[c].dataset.fullname, time);
        }

        paragraphs = comment.querySelectorAll('p');

        for (p = 0; paragraph = paragraphs[p]; p++) {
            lastsrc = '';
            anchors = paragraph.querySelectorAll('a');

            for (a = 0; anchor = anchors[a]; a++) {

                if (anchor.href.indexOf('mymjF4AZJrg') > -1
                    || anchor.href.indexOf('#rebuttal') > -1) {
                    comments[c].classList.add('drp-crossswords');
                    continue;
                }

                newsrc = anchor.href
                    .replace(/revision\/latest.+$/, '')
                    .replace(/\/$/, '');

                if (newsrc == lastsrc)
                    continue;

                img = new Image();

                img.onerror = imageErrorOne;

                if (newsrc.indexOf('#evidence') > -1
                    || RegExp('evidence|proof', 'i').test(anchor.textContent)
                    ) {
                    img.onload = imageLoadEvidence.bind(img, paragraph, anchor);
                } else {
                    img.onload = imageLoadSprite.bind(img, paragraph, anchor);
                }

                img.src = newsrc;
                lastsrc = newsrc;
            }
        }

        blockquotes = comment.querySelectorAll('blockquote');

        for (b = 0; blockquote = blockquotes[b]; b++) {
            if (RegExp('added to (?:your|the) truth bullets?', 'i').test(blockquote.textContent)) {
                blockquote.classList.add('drp-newbullet');
                comment.classList.add('drp-dialogue');
            }
        }
    }

    comments = (c = (comment = null));
    headers = (h = (header = null));
    anchors = (p = (paragraph = null));
    paragraphs = (a = (anchor = null));
    blockquotes = (b = (blockquote = null));

    function imageErrorOne() {
        this.onerror = imageErrorTwo;
        this.src = this.src.replace(/^https?\:\/\//, 'https://proxy-4-web.appspot.com/');
    }

    function imageErrorTwo() {
        this.onerror = imageErrorThree;
        this.src = this.src.replace('://proxy-4-web.appspot.com/', '://icracks-53.appspot.com/');
    }

    function imageErrorThree() {
        this.onerror = imageErrorFour;
        this.src = this.src.replace('://icracks-53.appspot.com/', '://harkproxy.appspot.com/');
    }

    function imageErrorFour() {
        this.onerror = imageErrorLast;
        this.src = this.src.replace('://harkproxy.appspot.com/', '://go-go-proxy.appspot.com/');
    }

    function imageErrorLast() {
        this.onerror = null;
        this.onload = null;
    }

    function imageLoadSprite(p, a) {
        if (!this.naturalWidth && !this.naturalHeight) {
            this.onerror();
            return;
        }

        this.className = 'drp-sprite';

        p.insertBefore(document.createElement('br'), a);

        p.classList.add('drp-statement');
        p.insertBefore(this, a);

        p.parentNode.classList.add('drp-dialogue');
    }

    function imageLoadEvidence(p, a) {
        if (!this.naturalWidth && !this.naturalHeight) {
            this.onerror();
            return;
        }

        this.className = 'drp-evidence';

        p.parentNode.classList.add('drp-dialogue');
        p.parentNode.insertBefore(this, p.nextSibling);
    }

}, false);
