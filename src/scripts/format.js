"use strict";

document.addEventListener('DOMContentLoaded', executeFormat, true);

var uri_showdown = RegExp('mymjF4AZJrg|\#rebuttal'),
    uri_https = RegExp('i\.imgur\.com|media\.tumblr\.com'),
    uri_continue = RegExp('reddit\.com\/r\/\w+\/comments\/[a-z0-9]+\/\w+\/[a-z0-9]+'),
    uri_ignored = RegExp([
        '\#ignore',
        '\.json',
        'youtu\.?be',
        'discord',
        'redd\.it\/',
        'reddit\.com\/',
        'localhost'
    ].join('|'));

function executeFormat() {
    if (RegExp('/r/danganronpa/', 'i').test(location.href) && !RegExp("class trial", "i").test(document.title))
        return;

    document.body.classList.add(CLASSNAMES.RLACTIVE);

    // Transform the H2 nodes in P nodes, in thread comments.
    document.querySelectorAll('.thing.comment h2')
        .forEach(function (h2) {
            let paragraph = document.createElement('p');

            for (let kid = h2.firstChild; kid; kid = kid.nextSibling)
                paragraph.appendChild(kid);

            h2.parentNode.replaceChild(paragraph, h2);
        });

    // Format system messages
    document.querySelectorAll('.thing.comment .usertext-body blockquote')
        .forEach(function (blockquote) {
            if (blockquote.classList.contains(CLASSNAMES.COMMENT_SYSMESSAGE))
                return;

            let sysmsg = RegExp('(?:added|updated) (?:to|in) (?:your|the) truth bullets?', 'i');

            if (sysmsg.test(blockquote.textContent)) {
                blockquote.parentNode.classList.add(CLASSNAMES.DIALOGUE);
                blockquote.classList.add(CLASSNAMES.COMMENT_SYSMESSAGE);
            }
        });

    // Insert sprites for comments loaded dynamically
    document.querySelectorAll('.morecomments a.button')
        .forEach(function (button) {
            if (button.classList.contains(CLASSNAMES.SCANNED))
                return;

            button.classList.add(CLASSNAMES.SCANNED);
            button.classList.add(CLASSNAMES.BUTTON_FORMATLISTENING);
            button.addEventListener('click', function () {
                // I know. But there's no other way.
                setTimeout(executeFormat, 3000);
            }, true);
        });

    document.querySelectorAll('.thing.self, .thing.comment')
        .forEach(loadSprites);
}

function normalizeImageSource(uri) {
    // Ensure certain domains are loaded through https
    if (uri_https.test(uri)) {
        return uri.replace('http://', 'https://');
    }

    // Normalize Wikia images
    if (uri.indexOf('.wikia.') > -1) {
        return uri
            .replace(/revision\/latest.+$/, '')
            .replace(/\/$/, '');
    }

    return uri;
}

function loadSprites(thing) {
    if (thing.classList.contains(CLASSNAMES.SCANNED))
        return;

    thing.classList.add(CLASSNAMES.SCANNED);

    let comment = thing.querySelector('.entry .md');
    if (!comment)
        return;

    // New reply highlighter
    let time = thing.querySelector('.edited-timestamp') || thing.querySelector('.live-timestamp');
    time = (new Date(time.getAttribute('datetime'))).getTime();

    if (time > sessionStorage.getItem(thing.dataset.fullname)) {
        thing.classList.add('new-comment');
        sessionStorage.setItem(thing.dataset.fullname, time);
    }

    // The true formatter
    let paragraphs = comment.querySelectorAll('p');

    for (let paragraph of paragraphs) {
        let anchors = paragraph.querySelectorAll('a');

        for (let anchor of anchors) {
            let uri = anchor.href;

            if (uri.trim() == '')
                continue;

            // IGNORED URL PATTERNS
            if (uri_ignored.test(uri))
                continue;

            // REBUTTAL SHOWDOWN!
            if (uri_showdown.test(uri)) {
                console.log('rebuttal', thing);
                thing.querySelector('.entry').classList.add(CLASSNAMES.COMMENT_SHOWDOWN);
                continue;
            }

            if (uri_continue.test(uri)) {
                paragraph.classList.add(CLASSNAMES.COMMENT_COMESFROM);
                continue;
            }

            let src = normalizeImageSource(anchor.href),
                img = new Image();

            if (src.indexOf('#evidence') > -1)
                img.onload = loadEvidenceImage.bind(img, anchor, paragraph);
            else
                img.onload = loadSpriteImage.bind(img, anchor, paragraph);

            img.onerror = errorLoadingImage;
            img.src = src;

            if (img.complete)
                img.onload();
        }
    }
}

function errorLoadingImage(err) {
    let counter = parseInt(this.dataset.attempts) || 0;

    console.debug('ROLELAYER:FORMAT_SPRITELOAD_ATTEMPTFAILED', counter, this.src);

    switch (counter) {
        case 0:
            this.src = this.src.replace(/^https?\:\/\//, 'https://proxy-4-web.appspot.com/');
            break;

        case 1:
            this.src = this.src.replace('://proxy-4-web.appspot.com/', '://icracks-53.appspot.com/');
            break;

        case 2:
            this.src = this.src.replace('://icracks-53.appspot.com/', '://fresh-proxy.appspot.com/');
            break;

        case 3:
            this.src = this.src.replace('://fresh-proxy.appspot.com/', '://go-go-proxy.appspot.com/');
            break;

        default:
            this.onload = null;
            this.onerror = null;
            return;
    }

    this.dataset.attempts = (counter + 1);
}

function loadSpriteImage(a, p) {
    p.parentNode.classList.add(CLASSNAMES.DIALOGUE);

    p.classList.add(CLASSNAMES.STATEMENT);

    let hr = document.createElement('hr');
    hr.classList.add(CLASSNAMES.STMNTSPLIT);
    a.parentNode.insertBefore(hr, a);

    this.classList.add(CLASSNAMES.SPRITE_ROOT);
    a.parentNode.insertBefore(this, a);

    this.onload = null;
    this.onerror = null;
}

function loadEvidenceImage(a, p) {
    p.parentNode.classList.add(CLASSNAMES.DIALOGUE);

    this.classList.add(CLASSNAMES.EVIDENCE);
    p.parentNode.insertBefore(this, p.nextSibling);

    this.onload = null;
    this.onerror = null;
}
