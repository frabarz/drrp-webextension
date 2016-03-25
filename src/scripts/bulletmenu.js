(function(DR, document) {
    "use strict";

    if (!RegExp("class trial", "i").test(document.title))
        return;

    function createBulletButton(target) {
        var button = document.createElement('a');

        button.href = '#';
        button.className = 'drp-button drp-insertbullet';
        button.textContent = 'Bullets';

        target = document.querySelector(target);
        if (target)
            target.appendChild(button);

        target = null;
        button = null;
    }

    function bulletSelectionHandler(evt) {
        var parent, textarea,
            text = '';

        if (evt.target.nodeName == 'LI')
            text = '[' + evt.target.textContent + '](#bullet)\n';

        else if (evt.target.matches('.drp-bulletdetail .description'))
            text = (evt.target.textContent || '').trim();

        if (text.length > 0) {
            parent = document.querySelector('.drp-targetmenu .drp-formfinder').form;
            textarea = parent.querySelector('.usertext-edit textarea');

            if (textarea.textLength > 0)
                textarea.value += "\n\n";

            textarea.value += text;
            textarea.focus();
            textarea.setSelectionRange(textarea.textLength, textarea.textLength);

            DR.hideHandbook();

            parent = null;
            textarea = null;
        }
    }

    createBulletButton('.commentarea .drp-menu');
    createBulletButton('.sitetable .drp-menu');

    DR.addListener('insertbullet', bulletSelectionHandler);

    document.querySelector('body').addEventListener('click', function(evt) {
        if (!evt.target.classList.contains('drp-insertbullet'))
            return;

        evt.preventDefault();
        evt.stopPropagation();

        var bullets = document.querySelectorAll('.drp-targetmenu'),
            n = bullets.length;
        while (n--) {
            bullets[n].classList.remove('drp-targetmenu');
        }

        evt.target.parentNode.classList.add('drp-targetmenu');

        var container = DR.handbook('BULLET SELECTOR');
        container.classList.add('drp-bulletmenu');

        bullets = document.querySelectorAll('#siteTable [href="#bullet"]');

        var bullet, descr,
            regeximg = RegExp('\\[(.+)\\]\\s?\\((.+)\\)'),
            list = document.createElement('ul');

        for (n = 0; n < bullets.length; n++) {
            bullet = document.createElement('li');

            bullet.className = 'drp-bulletitem';
            if (regeximg.test(bullets[n].title))
                bullet.className += ' has-media';

            bullet.textContent = bullets[n].textContent;

            descr = bullets[n].title || '';
            descr = descr.trim();

            if (!descr) {
                descr = bullets[n].parentNode
                    .textContent
                    .replace(bullet.textContent, '')
                    .trim();
            }

            if (!descr) {
                descr = bullets[n].parentNode.nextElementSibling
                    .textContent
                    .trim();
            }

            bullet.setAttribute('data-detail', descr);

            list.appendChild(bullet);
        }

        list.className = 'drp-bulletlist';
        list.addEventListener('mouseover', function(evt) {
            if (evt.target.nodeName != 'LI')
                return;

            var box,
                detail = this.parentNode.querySelector('.drp-bulletdetail'),
                description = evt.target.getAttribute('data-detail') || '',
                img = RegExp('\\[(.*)\\]\\s?\\((.+)\\)').exec(description);

            detail.innerHTML = '';

            if (img) {
                box = document.createElement('div');
                box.className = 'img-wrapper';
                box.appendChild(new Image);
                box.querySelector('img').src = img[2];
                detail.appendChild(box);

                description = description.replace(img[0], img[1]);
            }

            box = document.createElement('div');
            box.className = 'description';
            box.textContent = description;
            detail.appendChild(box);
        }, true);
        container.querySelector('.body').appendChild(list);

        list = document.createElement('div');
        list.className = 'drp-bulletdetail';
        container.querySelector('.body').appendChild(list);

        container.classList.add('visible');
        container = null;
    }, true);

})(window.DRreddit, document);