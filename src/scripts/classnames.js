"use strict";

/**
 * const CLASSNAMES
 *
 * Contains the list of classnames used throughout the extension.
 */
const CLASSNAMES = {
    RLENABLED: 'rolelayer-enabled',
    RLACTIVE: 'rolelayer-active',

    SCANNED: 'rl-scanned',

    STYLE_NODE: 'rl-customstyles',

    ACTIONMENU_WRAPPER: 'rl-actionmenu',
    ACTIONMENU_ROUTER: 'rl-formfinder',

    MODAL_WRAPPER: 'rl-modal',

    SPRITE_ROOT: 'rl-sprite',
    SPRITE_TABWRAPPER: 'rl-sprite-wrapper',
    SPRITE_TABITEM: 'rl-sprite-tab',
    SPRITE_TABINPUT: 'rl-sprite-radio',
    SPRITE_TABLABEL: 'rl-sprite-label',
    SPRITE_TABATTR: 'rl-sprite-attr',
    SPRITE_TABCONTENT: 'rl-sprite-list',

    COMMENT_TAGLINE: 'rl-tagline',
    COMMENT_CHARACTERNAME: 'rl-charactername',
    COMMENT_LOCALTIME: 'rl-localtime',
    COMMENT_SYSMESSAGE: 'rl-sysmessage',
    COMMENT_SHOWDOWN: 'rl-showdown',
    COMMENT_COMESFROM: 'rl-comesfrom',

    BUTTON_ROOT: 'rl-button',
    BUTTON_FORMATLISTENING: 'rl-formatlistening',

    IMAGE_SHOWDOWN: 'rl-imgshowdown',

    HANDBOOK_ROOT: 'rl-handbook',

    DIALOGUE: 'rl-dialogue',
    STATEMENT: 'rl-statement',
    STMNTSPLIT: 'rl-splitter',
    EVIDENCE: 'rl-evidence'
};

Object.defineProperties(CLASSNAMES, {
    'query': {
        writable: false,
        value: function (key) {
            return document.querySelector('.' + this[key]);
        }
    },
    'queryAll': {
        writable: false,
        value: function (key) {
            return document.querySelectorAll('.' + this[key]);
        }
    }
});

