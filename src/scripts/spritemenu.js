(function (DR, document) {
    "use strict";

    var now = Date.now(),
        title = RegExp("class trial|whodunnit", "i").test(document.title),
        ibuki_optout = !!localStorage.getItem('dont-ibukify'),
        ibuki_day = (now > 1459418400000 && now < 1459512000000);

    if (!title && (ibuki_optout || !ibuki_day))
        return;

    function createSpriteButton(target) {
        var button = document.createElement('a');

        button.href = '#';
        button.className = 'drp-button drp-insertsprite';
        button.textContent = 'Sprite';

        target = document.querySelector(target);
        if (target)
            target.appendChild(button);

        target = null;
        button = null;
    }

    function spriteSelectionHandler(evt) {
        if (evt.target.nodeName != 'IMG')
            return;

        var index = 0,
            parent = document.querySelector('.drp-targetmenu .drp-formfinder').form,
            textarea = parent.querySelector('.usertext-edit textarea');

        if (textarea.textLength > 0)
            textarea.value += "\n\n";

        index = textarea.textLength;

        textarea.value += '[A few words of the](' + evt.target.src + ') comment';
        textarea.focus();
        textarea.setSelectionRange(index + 1, index + 19),

        DR.hideHandbook();

        parent = null;
        textarea = null;
    }

    function removeLoadingGif() {
        this.classList.remove('loading');
        this.onload = null;
    }

    function spriteListReceiver(response) {
        var container = DR.handbook('SPRITE SELECTOR');
        container.classList.add('drp-spritemenu');

        [].concat(response.sprites).forEach(function (sprite) {
            var img = new Image();

            img.onload = removeLoadingGif;
            img.src = sprite;
            img.className = 'loading drp-sprite';

            container.querySelector('.body').appendChild(img);
            img = null;
        });

        container.classList.add('visible');
        container = null;
    }

    createSpriteButton('.commentarea .drp-menu');
    createSpriteButton('.sitetable .drp-menu');

    DR.addListener('insertsprite', spriteSelectionHandler);

    document.querySelector('body').addEventListener('click', function (evt) {
        if (!evt.target.classList.contains('drp-insertsprite'))
            return;

        evt.preventDefault();
        evt.stopPropagation();

        var span = document.querySelectorAll('.drp-targetmenu'),
            n = span.length;
        while (n--) {
            span[n].classList.remove('drp-targetmenu');
        }

        evt.target.parentNode.classList.add('drp-targetmenu');

        chrome.runtime.sendMessage({ character: DR.currentFlair }, spriteListReceiver);
    }, true);

})(window.DRreddit, document);
