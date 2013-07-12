/* Picture v2.1.0 - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

// Picture
(function(win) {
    'use strict';

    // Test if 'picture' element is available
    if ('HTMLPictureElement' in win) {
        return;
    }

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

        _applyImage = function(picture, sourceData) {
            if (!picture.pictureImage) {
                picture.pictureImage = _doc.createElement('img');
                picture.pictureImage.alt = picture.pictureAlt;
                picture.appendChild(picture.pictureImage);
            }

            picture.pictureImage.src = sourceData.src;
        },

        /*
            watch
        */
        _watch = function(picture, sourceData) {
            return function(mql) {
                if (mql.matches) {
                    _applyImage(picture, sourceData);
                } else {
                    _applyImage(picture, picture.pictureSource[picture.pictureSource.join('').lastIndexOf('1')] || sourceData);
                }
            };
        },

        _addMediaListeners = function() {
            _removeEvent(_eventPrefix + 'resize', _addMediaListeners);
            _removeEvent(_eventPrefix + 'orientationchange', _addMediaListeners);

            var pictureCollection = _doc.getElementsByTagName('span');
            for (var i = 0, picture; typeof((picture = pictureCollection[i])) !== 'undefined'; i++) {
                if ('pictureSource' in picture) {
                    for (var j = 0, source; typeof((source = picture.pictureSource[j])) !== 'undefined'; j++) {
                        source.mql.addListener(source.listener);
                    }
                }
            }
        },

        _formatSrcset = function(media, w, h, x) {
            var mqlList = [],
                mql     = '',
                dppx    = x ? [
                    '(-webkit-max-device-pixel-ratio: ' + x + ')', 
                    '(min--max-device-pixel-ratio: ' + x + ')', 
                    '(max-device-pixel-ratio: ' + x + ')', 
                    '(max-resolution: ' + x + 'dppx)', 
                    '(max-resolution: ' + (x * 96) + 'dpi)',
                    '' // Leave open for proper join
                ] : [];

            media && mqlList.push(media);

            w && mqlList.push('(max-width: ' + w + 'px)');

            h && mqlList.push('(max-height: ' + h + 'px)');

            mqlList.length && (mql = mqlList.join(' and '));

            //return dppx.join((mql.length ? ' and ' + mql.join(' and ') + ', ' : ', '));
        };

    win.Picture = {
        /*
            parse
        */
        parse: function() {
            var pictureCollection = _doc.getElementsByTagName('span');
            for (var i = 0, picture; typeof((picture = pictureCollection[i])) !== 'undefined'; i++) {
                if (picture.getAttribute('data-picture') !== null && !('pictureSource' in picture)) {
                    var sourceCollection    = picture.getElementsByTagName('span'),
                        sourceMatch         = null;

                    picture.pictureSource   = [];
                    picture.pictureImage    = picture.getElementsByTagName('img')[0];
                    picture.pictureAlt      = picture.getAttribute('data-alt') || 'picture';

                    for (var j = 0, source; typeof((source = sourceCollection[j])) !== 'undefined'; j++) {
                        var mediaAttr   = source.getAttribute('data-media'),
                            srcsetAttr  = source.getAttribute('data-srcset'),
                            srcAttr     = null,
                            sourceData  = {
                                mql         : null,
                                src         : null,
                                listener    : null,
                                element     : picture,
                                toString    : function() {
                                    if (this.element.parentNode === null) {
                                        this.element = null;
                                        this.mql.removeListener(this.listener);

                                        return 0;
                                    }

                                    return this.mql.matches ? 1 : 0;
                                }
                            };

                        if (mediaAttr && !srcsetAttr) {
                            sourceData.mql      = win.matchMedia(mediaAttr);
                            sourceData.listener = _watch(picture, sourceData);
                            sourceData.mql.addListener(sourceData.listener);

                            sourceData.mql.matches && (sourceMatch = sourceData);
                        }

                        if (srcsetAttr) {
                            // TODO: Add srcset support
                        } else {
                            srcAttr = source.getAttribute('data-src');
                            if (srcAttr) {
                                sourceData.src = srcAttr;
                            }
                        }

                        picture.pictureSource.push(sourceData);
                    };

                    sourceMatch && _applyImage(picture, sourceMatch);
                }
            };

            //_addEvent(_eventPrefix + 'resize', _addMediaListeners);
            //_addEvent(_eventPrefix + 'orientationchange', _addMediaListeners);
        },
        test: _watch,
        test2: _addMediaListeners
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);