(function (DR) {
    "use strict";

    if (!RegExp('^\/r\/\\w+\/comments\/$', 'i').test(location.pathname))
        return;

    document.querySelectorAll('.linklisting .thing.comment').forEach(loadBackground);

    function loadBackground(thing) {
        let parent_url = thing.querySelector('.flat-list .bylink').href,
            parent_id = parent_url.replace(/.+\/comments\/(\w+)\/.*/, '$1');

        Promise.resolve('classname_' + parent_id)
            .then(getFromSessionStorage)
            .then(null, function (err) {
                console.log(parent_url, DR.fetch);
                return DR.fetch('GET', parent_url + '.json')
                    .then(function (root) {
                        let classname = root[0].data.children[0].data.link_flair_css_class;
                        console.log(parent_id, classname);
                        sessionStorage.setItem('classname_' + parent_id, classname);
                        return classname;
                    });
            })
            .then(function (classname) {
                console.log('Inserting', classname);
                thing.classList.add('linkflair-' + classname);
            });
    }

    function getFromSessionStorage(key) {
        console.log(key, key in sessionStorage);
        if (key in sessionStorage) {
            return sessionStorage.getItem(key);
        } else {
            throw new Error("Key doesn't exist in sessionStorage: " + key);
        }
    }

})(window.DRreddit);
