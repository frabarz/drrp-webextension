(function() {
    "use strict";

    var settings = {
        anibanner: localStorage.getItem('drtrial-anibanner'),
        bulletcolor: localStorage.getItem('drtrial-bulletcolor')
    };

    function applySettings() {
        var target = document.querySelector('body');

        if (settings.bulletcolor)
            target.classList.add(settings.bulletcolor);

        if (settings.anibanner)
            target.classList.add(settings.anibanner);

        target = null;
    }

    function setAnibannerHandler() {
        if (document.querySelector('body').classList.toggle('banner-static'))
            settings.anibanner = 'banner-static';
        else
            settings.anibanner = '';

        localStorage.setItem('drtrial-anibanner', settings.anibanner);
    }

    function setBulletcolorHandler() {
        if (document.querySelector('body').classList.toggle('red-bullet'))
            settings.bulletcolor = 'red-bullet';
        else
            settings.bulletcolor = '';

        localStorage.setItem('drtrial-bulletcolor', settings.bulletcolor);

        applySettings();
    }

    function buildSettingsPanel() {
        var target, container, item, label;

        applySettings();

        container = document.createElement('ul');
        container.className = 'spacer';

        item = document.createElement('li');
        item.className = 'title';
        item.textContent = 'Extension settings';
        container.appendChild(item);

        label = document.createElement('span');
        label.textContent = 'Pause banner animation';
        item = document.createElement('li');
        item.className = 'switch anibanner';
        item.addEventListener('click', setAnibannerHandler, false);
        item.appendChild(label);
        container.appendChild(item);

        label = document.createElement('span');
        label.textContent = 'Use red bullets instead of yellow';
        item = document.createElement('li');
        item.className = 'switch bulletcolor';
        item.addEventListener('click', setBulletcolorHandler, false);
        item.appendChild(label);
        container.appendChild(item);

        target = document.querySelector('div.side');
        target.insertBefore(container, target.firstElementChild);

        target = null;
        label = null;
        item = null;

        document.removeEventListener('DOMContentLoaded', buildSettingsPanel, false);
    }

    document.addEventListener('DOMContentLoaded', buildSettingsPanel, false);
})();