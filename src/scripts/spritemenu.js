(function (document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    var container = document.querySelector('.usertext-edit .bottom-area'),
        spritemenu = createSpriteMenuBtn(container);

    spritemenu.addEventListener('mouseover', function (e) {
        this.textContent = 'Insert DR sprite [' + getFlairCharacter() + ']';
    }, false);

    spritemenu.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var container = document.querySelectorAll('drtrial-spritemenu'),
            n = container.length;

        while (n--)
            container[n].remove();

        chrome.runtime.sendMessage({
            character: getFlairCharacter(),
            spoilers: getSpoilerApproval()
        }, function (response) {
            var total = response.sprites.length + response.spoilers.length,
                w = Math.min(8, Math.ceil(total / 5)),
                container = createSpriteContainer(94 * w);

            document.body.appendChild(container);

            container.querySelector('.drtrial-showspoilers').disabled = !response.spoilers.length;

            response.sprites.forEach(function (sprite) {
                if (!sprite)
                    return;

                var img = new Image();
                img.src = sprite;
                img.className = 'drtrial-sprite';
                container.appendChild(img);
            });

            response.spoilers.forEach(function (sprite) {
                if (!sprite)
                    return;

                var img = new Image();
                img.src = sprite;
                img.className = 'drtrial-sprite drtrial-spritespoiler';
                img.hidden = true;
                container.appendChild(img);
            });

            container.addEventListener('click', function (evt) {
                if (evt.target.nodeName != 'IMG')
                    return;

                var index = 0,
                    textarea = document.querySelector('.usertext-edit textarea');

                if (textarea.textLength > 0)
                    textarea.value += "\n\n";

                index = textarea.textLength;

                textarea.value += '[{Sprite}](' + evt.target.src + ') ';
                textarea.focus();
                textarea.setSelectionRange(index + 1, index + 9),

                this.remove();
            }, true);
        });
    }, false);

    spritemenu = null;
    container = null;

    function createSpriteMenuBtn(container) {
        var spritemenu = document.createElement('a');

        spritemenu.href = '#';
        spritemenu.className = 'help-toggle drtrial-menubtn';
        spritemenu.textContent = 'Insert DR sprite';

        container.insertBefore(spritemenu, container.firstElementChild);

        return spritemenu;
    }

    function createSpriteContainer(width) {
        var inter,
            container = document.createElement('div');

        container.className = 'drtrial-modal drtrial-spritemenu';

        container.style.width = width + 'px';

        inter = document.createElement('div');
        inter.className = 'title';
        inter.textContent = 'DANGANREDDIT CLASS TRIAL HELPER';
        container.appendChild(inter);

        inter = document.createElement('div');
        inter.className = 'menu';
        createModalCloseButton(inter);

        createSpoilerCheckmark(inter);

        container.appendChild(inter);

        return container;
    }

    function createSpoilerCheckmark(container) {
        var label = document.createElement('label'),
            check = document.createElement('input'),
            text = document.createElement('span');

        label.className = 'help-toggle drtrial-menuopt';
        check.className = 'drtrial-showspoilers';

        check.type = 'checkbox';

        check.addEventListener('change', function(evt) {
            var spoilers = document.querySelectorAll('.drtrial-spritespoiler'),
                n = spoilers.length;

            while(n--)
                spoilers[n].hidden = !this.checked;

            spoilers = null;
        });

        text.textContent = 'Show spoiler sprites';

        label.appendChild(check);
        label.appendChild(text);

        container.insertBefore(label, container.firstElementChild);
    }

    function createModalCloseButton(container) {
        var button = document.createElement('button');

        button.textContent = 'Close';

        button.addEventListener('click', function () {
            this.parentNode.parentNode.remove();
        });

        container.appendChild(button);
    }

    function getFlairCharacter() {
        return document.querySelector('span.flair').className.replace('flair flair-', '');
    }

    function getSpoilerApproval() {
        try {
            return document.querySelector('.drtrial-spoilersprites').checked;
        } catch (e) {
            return false;
        }
    }
})(document);
