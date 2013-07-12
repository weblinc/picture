/* Picture v2.1.0 - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

// Picture
('HTMLPictureElement' in window) || (function(win) {
    'use strict';

    var _doc            = win.document,
        _eventPrefix    = '',
        _addEvent       = win.addEventListener || (_eventPrefix = 'on') && win.attachEvent,
        _removeEvent    = win.removeEventListener || win.detachEvent,
        _style          = null,
        _styleContent   = '',
        _ID             = 0,
        _srcsetExpr     = /[^\s]+/g,
        _digitExpr      = /^[0-9\.]+/g,

        /*
            init
        */
        _init       = function() {
            var head = _doc.getElementsByTagName('head')[0];

            _removeEvent(_eventPrefix + 'load', _init);

            _style      = _doc.createElement('style');
            _style.type = 'text/css';
            _style.id   = 'picturejs';
            head.insertBefore(_style, head.firstChild);

            win.Picture.parse();
        };

    win.Picture = {
        /*
            parse
        */
        parse: function() {
            var pictureCollection = _doc.getElementsByTagName('span');
            for (var i = 0, picture; typeof((picture = pictureCollection[i])) !== 'undefined'; i++) {
                if (picture.getAttribute('data-picture') !== null && !('parsed' in picture)) {
                    var sourceCollection    = picture.getElementsByTagName('span'),
                        sourceMatch         = null,
                        id                  = 'picturejs-' + _ID++,
                        defaultSrc          = picture.getElementsByTagName('img')[0].getAttribute('src');

                    picture.parsed = true;

                    picture.setAttribute('data-picturejs-id', id);

                    _styleContent += '@media all { ' + 
                                            ('[data-picturejs-id="' + id + '"] { ' + 'background-image: url("' + defaultSrc + '"); }') + 
                                        ' }\n';

                    for (var j = sourceCollection.length - 1, source; typeof((source = sourceCollection[j])) !== 'undefined'; j--) {
                        _styleContent += '@media ' + (source.getAttribute('data-media') || 'all') + ' { ' + 
                                                ('[data-picturejs-id="' + id + '"] { ' + 'background-image: url("' + source.getAttribute('data-src') + '"); }') + 
                                            ' }\n';
                    }
                }
            };

            // Add rules to style element
            if (_style.textContent !== _styleContent) {
                _style.textContent = _styleContent;
            }
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);