(function (DR, document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    function createSpriteMenuBtn(target) {
        var container = document.querySelector(target),
            button = document.createElement('button');

        button.href = '#';
        button.className = 'drtrial-menubtn drtrial-insertsprite';
        button.textContent = 'Insert Sprite';

        container.insertBefore(button, container.firstElementChild);

        return button;
    }

    function createSpoilerCheckmark() {
        var label = document.createElement('label'),
            check = document.createElement('input'),
            text = document.createElement('span');

        label.className = 'help-toggle drtrial-menuopt';
        check.className = 'drtrial-showspoilers';

        check.type = 'checkbox';

        text.textContent = 'Show spoiler sprites';

        label.appendChild(check);
        label.appendChild(text);

        return {
            box: check,
            body: label
        };
    }

    function spriteSelectionHandler(button, evt) {
        if (evt.target.nodeName != 'IMG')
            return;

        var index = 0,
            parent = button.parentNode.querySelector('input.drtrial-formfinder').form,
            textarea = parent.querySelector('.usertext-edit textarea');

        if (textarea.textLength > 0)
            textarea.value += "\n\n";

        index = textarea.textLength;

        textarea.value += '[A few words of the](' + evt.target.src + ') comment';
        textarea.focus();
        textarea.setSelectionRange(index + 1, index + 19),

        this.remove();

        button = null;
        parent = null;
        textarea = null;
    }

    function spritesSpoilerApprovalHandler(evt) {
        var spoilers = document.querySelectorAll('.drtrial-spritespoiler'),
            n = spoilers.length;

        while(n--)
            spoilers[n].hidden = !this.checked;

        spoilers = null;
    }

    createSpriteMenuBtn('.usertext-edit .bottom-area');

    document.querySelector('.commentarea').addEventListener('click', function (e) {
        if (!e.target.classList.contains('drtrial-insertsprite'))
            return;

        e.preventDefault();
        e.stopPropagation();

        var container = document.querySelectorAll('.drtrial-modal'),
            n = container.length;

        while (n--)
            container[n].remove();

        chrome.runtime.sendMessage({
            character: DR.currentFlair
        }, function (response) {
            var container = DR.createModal('SPRITE SELECTOR'),
                marker = createSpoilerCheckmark();

            marker.box.disabled = !response.spoilers.length;
            marker.box.addEventListener('change', spritesSpoilerApprovalHandler, false);
            container.menu.appendChild(marker.body);

            response.total = response.sprites.length + response.spoilers.length;

            container.body.classList.add('drtrial-spritemenu');
            container.body.style.width = (94 * Math.min(8, Math.ceil(response.total / 5))) + 'px';
            container.body.addEventListener('click', spriteSelectionHandler.bind(container.body, e.target), true);
            document.body.appendChild(container.body);

            [].concat(response.sprites, response.spoilers).forEach(function (sprite, i) {
                var img = new Image();
                img.src = sprite;
                img.className = 'drtrial-sprite';

                if (i >= response.sprites.length) {
                    img.classList.add('drtrial-spritespoiler');
                    img.hidden = true;
                }

                container.body.appendChild(img);
            });

            container = null;
            marker = null;
        });
    }, false);

})(window.DRreddit, document);
