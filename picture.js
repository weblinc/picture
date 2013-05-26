/* Picture - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

// Picture
(function(win) {
    'use strict';

    var _doc            = win.document,
        _eventPrefix    = '',
        _addEvent       = win.addEventListener || (_eventPrefix = 'on') && win.attachEvent,
        _removeEvent    = win.removeEventListener || win.detachEvent,

        /*
            init
        */
        _init       = function() {
            _removeEvent(_eventPrefix + 'load', _init);

            win.Picture.parse();
        },

        /*
            watch
        */
        _watch = function(picture, mql) {
            var handler = function(mql) {
                var match = null;

                if (picture.parentNode === null) {
                    mql.removeListener(handler);
                }

                // Loop over all media queries associated with this 'picture' element and
                // set variable 'match' which will be the last query to eval to true
                for (var i = 0; i < picture.pictureMedia.length; i++) {
                    if (picture.pictureMedia[i].mql.matches) {
                        match = picture.pictureMedia[i];
                    }
                }

                if (match) {
                    if (picture.pictureImage) {
                        picture.pictureImage.src = match.src;
                    } else {
                        picture.pictureImage = _doc.createElement('img');
                        picture.appendChild(picture.pictureImage);
                        picture.pictureImage.src = match.src;
                    }
                }
            };

            handler(mql);

            return handler;
        };

    win.Picture = {
        /*
            parse
        */
        parse: function() {
            var picList     = _doc.getElementsByTagName('span'),
                picIndex    = picList.length - 1,
                picLength   = picIndex,
                pic         = null,

                srcList        = null,
                srcIndex    = 0,
                srcLength   = 0,
                src         = null,

                media       = '',
                mql         = null;

            if (picIndex < 0) {
                return;
            }

            do {
                pic = picList[picLength - picIndex];

                if (pic.getAttribute('data-picture') === null || 'pictureMedia' in pic) {
                    continue;
                }

                pic.pictureMedia = [];
                pic.pictureImage = pic.getElementsByTagName('img')[0];

                srcList     = pic.getElementsByTagName('span');
                srcIndex    = srcList.length - 1;
                srcLength   = srcIndex;

                if (srcIndex < 0) {
                    continue;
                }

                do {
                    src = srcList[srcLength - srcIndex];
                    media = src.getAttribute('data-media');

                    if (media && window.matchMedia) {
                        mql = window.matchMedia(media);

                        pic.pictureMedia.push({
                            mql : mql,
                            src : src.getAttribute('data-src'),
                            img : null
                        });

                        mql.addListener(_watch(pic, mql));
                    }
                } while (srcIndex--);
            } while (picIndex--);
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);