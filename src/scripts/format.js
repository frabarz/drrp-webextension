"use strict";

document.addEventListener('DOMContentLoaded', function () {
    if (RegExp('/r/danganronpa/', 'i').test(location.href) && !RegExp("class trial", "i").test(document.title))
        return;

    removeHeaders(document.querySelectorAll('.thing.comment h2'));

    Array.prototype.forEach.call(
        document.querySelectorAll('.thing.self, .thing.comment'),
        executeFormat
    );

    Array.prototype.forEach.call(
        document.querySelectorAll('.thing.comment blockquote'),
        formatSystemMessage
    );
}, true);

function removeHeaders(headers) {
    // Convert the H2 nodes from the post replies in P nodes.
    // This one is for you, Factorz.

    var h,
        header, paragraph, kid;

    for (h = 0; header = headers[h]; h++) {
        paragraph = document.createElement('p');

        for (kid = header.firstChild; kid; kid = kid.nextSibling)
            paragraph.appendChild(kid);

        header.parentNode.replaceChild(paragraph, header);
    }

    headers = null;
    header = null;
    paragraph = null;
    kid = null;
}

function executeFormat(entry) {
    var p, paragraph, paragraphs,
        a, anchor, anchors;

    var time,
        img, kid,
        newsrc, lastsrc;

    var comment = entry.querySelector('.entry .md');

    if (!comment)
        return;

    // New reply highlighter
    time = entry.querySelector('.edited-timestamp') || entry.querySelector('.live-timestamp');
    time = (new Date(time.getAttribute('datetime'))).getTime();

    if (time > sessionStorage.getItem(entry.dataset.fullname)) {
        entry.classList.add('new-comment');
        sessionStorage.setItem(entry.dataset.fullname, time);
    }

    // The true formatter
    paragraphs = comment.querySelectorAll('p');

    for (p = 0; paragraph = paragraphs[p]; p++) {
        lastsrc = '';
        anchors = paragraph.querySelectorAll('a');

        for (a = 0; anchor = anchors[a]; a++) {
            newsrc = anchor.href;

            // Mentions are ignored
            if (newsrc.indexOf('reddit.com/u/') > -1)
                continue;

            // TODO: Format for Rebuttal Showdown
            // if (newsrc.indexOf('mymjF4AZJrg') > -1 || newsrc.indexOf('#rebuttal') > -1) {
            //     entry.classList.add('drt-crossswords');
            //     continue;
            // }

            if (newsrc.indexOf('.wikia.') > -1) {
                newsrc = newsrc
                    .replace(/revision\/latest.+$/, '')
                    .replace(/\/$/, '');
            }

            // If the same image is linked twice in the
            // same paragraph, the second one is ignored
            if (newsrc == lastsrc)
                continue;

            img = new Image();

            img.onerror = imageError;

            if (newsrc.indexOf('#evidence') > -1) {
                img.onload = imageLoadEvidence.bind(img, paragraph, anchor);

            // } else if (anchor.textContent.length < 15) {
            //     if (anchor.textContent.indexOf('evidence') > -1 || anchor.textContent.indexOf('proof') > -1)
            //         img.onload = imageLoadEvidence.bind(img, paragraph, anchor);

            } else {
                img.onload = imageLoadSprite.bind(img, paragraph, anchor);
            }

            img.src = newsrc;

            if (img.complete)
                img.onload();

            lastsrc = newsrc;
        }
    }

    paragraph = (paragraphs = null);
    anchor = (anchors = null);
    entry = null;
    img = null;
}

function imageError() {
    var counter = parseInt(this.dataset.attempts) || 0;

    switch (counter) {
        case 0:
            this.src = this.src.replace(/^https?\:\/\//, 'https://proxy-4-web.appspot.com/');
            break;

        case 1:
            this.src = this.src.replace('://proxy-4-web.appspot.com/', '://icracks-53.appspot.com/');
            break;

        case 2:
            this.src = this.src.replace('://icracks-53.appspot.com/', '://harkproxy.appspot.com/');
            break;

        case 3:
            this.src = this.src.replace('://harkproxy.appspot.com/', '://go-go-proxy.appspot.com/');
            break;

        default:
            this.onload = null;
            this.onerror = null;
    }

    this.dataset.attempts = (counter + 1);
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

function formatSystemMessage(blockquote) {
    if (blockquote.classList.contains('drt-sysmessage'))
        return;

    if (RegExp('(?:added|updated) (?:to|in) (?:your|the) truth bullets?', 'i').test(blockquote.textContent)) {
        blockquote.classList.add('drt-sysmessage');
        blockquote.parentNode.classList.add('drt-dialogue');
    }
}
