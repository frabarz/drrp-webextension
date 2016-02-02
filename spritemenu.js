(function (document) {
    "use strict";

    var character = document.querySelector('span.flair').className.replace('flair flair-', '');

    chrome.runtime.sendMessage({
        character: character.toLowerCase()
    }, function (response) {
        var container = document.querySelector('.usertext-edit .bottom-area'),
            spritemenu = document.createElement('a');

        spritemenu.href = '#';
        spritemenu.className = 'help-toggle drtrial-menubtn';
        spritemenu.textContent = 'Insert DR sprite [' + character + ']';
        spritemenu.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var w = 20 + 90 * Math.ceil(response.sprites.length / 5),
                h = 20 + 90 * (response.sprites.length % 5),
                win = window.open(null, 'sprites', 'width=' + w + ',height=' + h);

            response.sprites.forEach(function (sprite) {
                var img = new Image();
                img.src = sprite;
                win.document.body.appendChild(img);
            });

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
        }, false);

        container.insertBefore(spritemenu, container.firstElementChild);
    });
})(document);