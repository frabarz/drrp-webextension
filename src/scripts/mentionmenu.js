(function (DR, document) {
    "use strict";

    if (document.title.toLowerCase().indexOf('class trial') == -1)
        return;

    function createMentionMenuBtn(target) {
        var container = document.querySelector(target),
            button = document.createElement('button');

        button.href = '#';
        button.className = 'drtrial-menubtn drtrial-insertmention';
        button.textContent = 'Mention';

        container.insertBefore(button, container.firstElementChild);

        return button;
    }

    function userSelectionHandler(button, evt) {
        var target = evt.target;

        if (target.matches('.drtrial-mention span'))
            target = target.parentNode;

        if (!target.matches('.drtrial-mention'))
            return;

        var index = 0,
            character = target.querySelector('.character-name').textContent,
            user = target.querySelector('.user-name').textContent,
            parent = button.parentNode.querySelector('input.drtrial-formfinder').form,
            textarea = parent.querySelector('.usertext-edit textarea');

        if (textarea.value.substr(textarea.textLength - 1, 1) != ' ')
            textarea.value += " ";

        index = textarea.textLength;

        textarea.value += character + '^^' + user +' ';
        textarea.focus();
        textarea.setSelectionRange(index, index + character.length),

        this.remove();

        parent = null;
        textarea = null;
    }

    createMentionMenuBtn('.usertext-edit .bottom-area');

    DR.addListener('rolesidentified', function(roles) {
        document.querySelector('.commentarea').addEventListener('click', function (e) {
            if (!e.target.classList.contains('drtrial-insertmention'))
                return;

            e.preventDefault();
            e.stopPropagation();

            var container = document.querySelectorAll('.drtrial-modal'),
                n = container.length;

            while (n--)
                container[n].remove();

            container = DR.createModal('MENTION SELECTOR');

            container.body.classList.add('drtrial-mentionmenu');
            container.body.addEventListener('click', userSelectionHandler.bind(container.body, e.target), true);
            document.body.appendChild(container.body);

            var item, span;

            for (n = 0; n < DR.NAMES.length; n++) {
                if (n in roles && roles[n] in roles && n == roles[roles[n]]) {
                    item = document.createElement('a');
                    item.className = 'drtrial-mention';
                    container.body.appendChild(item);

                    span = document.createElement('span');
                    span.className = 'flair ' + DR.FLAIRS[n];
                    item.appendChild(span);

                    span = document.createElement('span');
                    span.className = 'character-name';
                    span.textContent = DR.NAMES[n];
                    item.appendChild(span);

                    span = document.createElement('span');
                    span.className = 'user-name';
                    span.textContent = '/u/' + roles[n];
                    item.appendChild(span);
                }
            }
        }, true);
    });

})(window.DRreddit, document);