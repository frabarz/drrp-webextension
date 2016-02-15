window.DRreddit = window.DRreddit || {};

(function (DR, document) {
    "use strict";

    function insertFormFinder() {
        var container = document.querySelector('.usertext-edit .bottom-area'),
            router = document.createElement('input');

        router.type = 'hidden';
        router.className = 'drtrial-formfinder';

        container.insertBefore(router, container.firstElementChild);

        container = null;
        router = null;
    }

    Object.defineProperties(DR, {
        events: {
            value: {},
            writable: false
        },
        addListener: {
            value: function (event, func) {
                event = event.toLowerCase();

                if (!(event in this.events))
                    this.events[event] = [];

                this.events[event].push(func);
            },
            writable: false
        },
        removeListener: {
            value: function (event, func) {
                event = event.toLowerCase();

                if (event in this.events)
                    this.events[event].splice(this.events[event].indexOf(func), 1);
            },
            writable: false
        },
        triggerEvent: {
            value: function (event, detail) {
                event = event.toLowerCase();

                if (event in this.events) {
                    var n = this.events[event].length;

                    while (n--)
                        this.events[event][n](detail);
                }
            },
            writable: false
        },
        currentFlair: {
            get: function() {
                try {
                    return document.querySelector('.side span.flair').className.replace('flair flair-', '');
                } catch (e) {
                    return undefined;
                }
            }
        },
        createModal: {
            value: function (title) {
                var inter, span,
                    container = document.createElement('div');

                container.className = 'drtrial-modal';

                // TITLEBAR
                inter = document.createElement('div');
                inter.className = 'title';
                container.appendChild(inter);

                span = document.createElement('span');
                span.textContent = 'DANGANREDDIT CLASS TRIAL HELPER';
                inter.appendChild(span);

                if (title) {
                    span = document.createElement('span');
                    span.className = 'right';
                    span.textContent = title;
                    inter.appendChild(span);
                }

                // MENUBAR
                inter = document.createElement('div');
                inter.className = 'menu';
                container.appendChild(inter);

                span = document.createElement('button');
                span.textContent = 'Close';
                span.addEventListener('click', function () {
                    container.remove();
                });
                inter.appendChild(span);

                return {
                    menu: inter,
                    body: container
                };
            },
            writable: false
        }
    });

    insertFormFinder();

})(window.DRreddit, document);