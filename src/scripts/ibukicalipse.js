(function() {
    "use strict";

    // April Fools - Don't spoil it

    var now = Date.now();
    if (localStorage.getItem('dont-ibukify') || now < 1459418400000 || now > 1459512000000)
        return;

    function getButtonMessage() {
        var msg = [
            'I don\'t want to.',
            'Enough Ibuki for this year.',
            'Nope. Go back to normal.',
            'I think I\'ll pass.',
            'Sorry, I won\'t betray my waifu.',
            'I don\'t follow false gods.'
        ];

        return msg[Math.floor(msg.length * Math.random())];
    }

    function buildOptionalPanel() {
        var target, container, item, label;

        container = document.createElement('ul');
        container.className = 'spacer';

        item = document.createElement('li');
        item.className = 'title';
        item.textContent = 'All Hail Ibuki 2k16';
        container.appendChild(item);

        item = document.createElement('li');
        item.className = 'text-normal';
        item.textContent = 'From April 1st, 0:00:00 UTC+14 to April 1st, 23:59:59 UTC-12 is Ibuki Mioda day on r/danganronpa and r/danganroleplay!';
        container.appendChild(item);

        item = document.createElement('li');
        item.className = 'text-small';
        item.textContent = '(Participation is mandatory for users of the danganreddit class trial extension.)';
        container.appendChild(item);

        item = document.createElement('li');
        item.className = 'text-small';
        item.textContent = '(Or not.)';
        container.appendChild(item);

        item = document.createElement('li');
        item.title = 'Warning: Non reversible.';
        item.className = 'stop-ibukification';
        item.textContent = getButtonMessage();
        item.addEventListener('click', stopIbukification, true);

        container.appendChild(item);

        target = document.querySelector('div.side');
        target.insertBefore(container, target.firstElementChild);

        target = null;
        label = null;
        item = null;
    }

    function stopIbukification() {
        localStorage.setItem('dont-ibukify', 'true');
        this.textContent = 'Ibukification stopped. You will back go to normal on the next refresh.';
        this.className = 'text-normal';
        this.removeEventListener('click', stopIbukification, true);
    }

    function ibukify() {
        var ibuki, style;

        ibuki = '.side ul.spacer { padding:0 10px;margin-bottom:10px }';
        ibuki += '.side ul.spacer .title { font-size:15px;text-transform:uppercase }';
        ibuki += '.side ul.spacer .text-normal { margin-bottom:4px; font-size:14px; line-height:18px; }';
        ibuki += '.side ul.spacer .text-small { margin-bottom:2px; font-size:12px; line-height:14px; }';
        ibuki += '.side ul.spacer .stop-ibukification { margin: 6px 0; font-size: 14px; line-height: 30px; cursor: pointer; border: 1px solid #036; border-radius: 3px; text-align: center; font-weight: bold; color: #036; background-color: #08c; }';
        ibuki += '.side ul.spacer .stop-ibukification:hover { background-color: #07a }';

        if ( RegExp('/r/danganronpa', 'i').test(location.href) ) {
            ibuki += 'body .flair { background-position:0 -1342px!important;width:26px!important;height:31px!important }';
            document.querySelector('.side .titlebox .flair').className = 'flair flair-Ibuki';

        } else {
            ibuki += 'body .flair { background-position:0 -272px!important;width:25px!important;height:29px!important }';
            ibuki += 'body #header { background-image:url(http://i.imgur.com/8Ndwccp.png),url(http://i.imgur.com/8Ndwccp.png);background-position: 0 0,490px 0;animation-name: dr12reloadibuki;}';
            ibuki += '@-webkit-keyframes dr12reloadibuki{0%{background-position:0 0, 490px 0}100%{background-position:0 280px, 490px -280px}}';
            ibuki += '@keyframes dr12reloadibuki{0%{background-position:0 0, 490px 0}100%{background-position:0 280px, 490px -280px}}';
            document.querySelector('.side .titlebox .flair').className = 'flair flair-ibuki';
        }

        style = document.createElement('style');
        style.textContent = ibuki;
        document.querySelector('head').appendChild(style);

        ibuki = document.querySelector('#header-img');
        ibuki.src = 'https://i.imgur.com/bPTWbD5.png';
        ibuki.width = 128;
        ibuki.height = 148;

        buildOptionalPanel();

        ibuki = null;
        style = null;

        document.removeEventListener('DOMContentLoaded', ibukify, false);
    }

    document.addEventListener('DOMContentLoaded', ibukify, false);
})();