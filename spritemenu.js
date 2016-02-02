(function (document) {
    "use strict";

    var container = document.querySelector('.usertext-edit .bottom-area'),
        spritemenu = createSpriteMenuBtn(container);

    createSpoilerCheckmark(container);

    spritemenu.addEventListener('mouseover', function (e) {
        this.textContent = 'Insert DR sprite [' + getFlairCharacter() + ']';
    }, false);

    spritemenu.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        chrome.runtime.sendMessage({
            character: getFlairCharacter(),
            spoilers: getSpoilerApproval()
        }, function (response) {
            var w = Math.min(8, Math.ceil(response.sprites.length / 5)),
                h = 20 + 94 * Math.ceil(response.sprites.length / w),
                win = window.open(null, 'sprites', 'width=' + (20 + 94 * w) + ',height=' + h);

            response.sprites.forEach(function (sprite) {
                var img = new Image();
                img.src = sprite;
                img.style.margin = '2px';
                win.document.body.appendChild(img);
            });

            win.document.body.style.textAlign = 'center';

            win.document.body.addEventListener('click', function (evt) {
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

                win.close();
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

    function createSpoilerCheckmark(container) {
        var label = document.createElement('label'),
            check = document.createElement('input'),
            text = document.createTextNode('Spoiler sprites');

        label.className = 'help-toggle drtrial-menuopt';
        check.className = 'drtrial-spoilersprites';

        check.type = 'checkbox';

        label.appendChild(check);
        label.appendChild(text);

        container.insertBefore(label, container.firstElementChild);
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
