/* Picture v2.2.0 - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

// Picture
('HTMLPictureElement' in window) || (function(win) {
    'use strict';

    var _doc            = win.document,
        _eventPrefix    = '',
        _addEvent       = win.addEventListener || (_eventPrefix = 'on') && win.attachEvent,
        _removeEvent    = win.removeEventListener || win.detachEvent,
        _srcsetExpr     = /[^\s]+/g,

        /*
            init
        */
        _init       = function() {
            _removeEvent(_eventPrefix + 'DOMContentLoaded', _init);
            _removeEvent(_eventPrefix + 'load', _init);

            win.Picture.parse();
        },

        /*
            applyImage
        */
        _applyImage = function(picture, sourceData) {
            var img = picture.pictureImage;

            if (picture.parentNode === null) {
                sourceData.mql.removeListener(sourceData.listener);
                sourceData = picture = null;
            } else {
                if (!img) {
                    img     = _doc.createElement('img');
                    img.alt = picture.pictureAlt;
                }

                if (sourceData) {
                    img.src                 = picture.pictureCurrentSrc = sourceData.src;
                    picture.pictureImage    = img;
                    picture.pictureMedia    = (sourceData.mql && sourceData.mql.media) || '';
                    sourceData.element.appendChild(img);
                }
            }
        },

        /*
            applyMediaListeners
        */
        _applyMediaListeners = function() {
            var pictureCollection = _doc.getElementsByTagName('span');

            _removeEvent(_eventPrefix + 'resize', _applyMediaListeners);

            for (var i = 0, picture; typeof((picture = pictureCollection[i])) !== 'undefined'; i++) {
                if ('pictureSource' in picture) {
                    for (var j = picture.pictureSource.length - 1, source; typeof((source = picture.pictureSource[j])) !== 'undefined'; j--) {
                        if (!source.listener) {
                            source.listener = _createListener(picture, source);
                            source.mql.addListener(source.listener);
                        }
                    }
                }
            }
        },

        /*
            createListener
        */
        _createListener = function(picture, sourceData) {
            return function(mql) {
                var sourceList  = picture.pictureSource,
                    source      = sourceData;

                if (!mql.matches) {
                    source      = sourceList[sourceList.join('').lastIndexOf('1')];
                }

                source && _applyImage(picture, source);
            };
        },

        /*
            createSourceData
        */
        _createSourceData = function() {
            return   {
                mql         : null,
                src         : null,
                listener    : null,
                element     : null,
                toString    : function() {
                    return this.mql.matches ? 1 : 0;
                }
            };  
        },

        /*
            parseSrcset
        */
        _parseSrcset = function(picture, source, srcsetAttr, mediaAttr) {
            var srcsetCollection    = (srcsetAttr.indexOf(',') >= 0 && srcsetAttr.split(',')) || [srcsetAttr],
                sourceMatch         = null;

            for (var i = srcsetCollection.length - 1, srcset; typeof((srcset = srcsetCollection[i])) !== 'undefined'; i--) {
                var media       = mediaAttr || 'all',
                    hints       = srcset.match(_srcsetExpr),
                    src         = hints[0],
                    dppx        = parseFloat(hints[1], 10),
                    sourceData  = _createSourceData();

                if (dppx) {
                    media = [
                                '(-webkit-min-device-pixel-ratio: ' + dppx + ')',
                                '(min-resolution: ' + dppx + 'dppx)',
                                '(min-resolution: ' + (dppx * 96) + 'dpi)',
                                'not all'
                            ].join(' and ' + media + ', ');
                }

                if (media) {
                    sourceData.mql      = win.matchMedia(media);
                    sourceData.src      = src;
                    sourceData.element  = source;

                    sourceData.mql.matches && (sourceMatch = sourceData);

                    picture.pictureSource.push(sourceData);
                }
            }

            return sourceMatch;
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
                        srcsetAttr          = picture.getAttribute('data-srcset'),
                        srcAttr             = '',
                        sourceData          = null,
                        img                 = picture.getElementsByTagName('img')[0],
                        parsedSourceMatch   = null,
                        sourceMatch         = null;

                    picture.pictureSource       = [];
                    picture.pictureImage        = img && img.parentNode.nodeName.toLowerCase() !== 'noscript' && img; // Test for parent node is for iOS 5
                    picture.pictureAlt          = picture.getAttribute('data-alt') || (img && img.getAttribute('alt')) || 'picture';
                    picture.pictureCurrentSrc   = '';
                    picture.pictureMedia        = '';

                    if (srcsetAttr) {
                        parsedSourceMatch = _parseSrcset(picture, picture, srcsetAttr, '');
                        parsedSourceMatch && (sourceMatch = parsedSourceMatch);
                    } else {
                        srcAttr     = picture.getAttribute('data-src');
                        if (srcAttr) {
                            sourceData          = _createSourceData();
                            sourceData.src      = srcAttr;
                            sourceData.element  = picture;
                            sourceMatch         = sourceData;
                        }
                    }

                    if (!srcsetAttr && !srcAttr) {
                        for (var j = sourceCollection.length - 1, source; typeof((source = sourceCollection[j])) !== 'undefined'; j--) {
                            var mediaAttr   = source.getAttribute('data-media');

                            srcsetAttr  = source.getAttribute('data-srcset');
                            srcAttr     = '';
                            sourceData  = _createSourceData();

                            if (srcsetAttr) {
                                parsedSourceMatch = _parseSrcset(picture, source, srcsetAttr, mediaAttr);
                                parsedSourceMatch && (sourceMatch = parsedSourceMatch);
                            } else if (mediaAttr) {
                                srcAttr = source.getAttribute('data-src');

                                if (srcAttr) {
                                    sourceData.mql      = win.matchMedia(mediaAttr);
                                    sourceData.src      = srcAttr;
                                    sourceData.element  = source;

                                    sourceData.mql.matches && (sourceMatch = sourceData);

                                    picture.pictureSource.push(sourceData);
                                }
                            }
                        }
                    }

                    sourceMatch && _applyImage(picture, sourceMatch);
                }
            }

            _removeEvent(_eventPrefix + 'resize', _applyMediaListeners);
            _addEvent(_eventPrefix + 'resize', _applyMediaListeners);
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'DOMContentLoaded', _init);
    _addEvent(_eventPrefix + 'load', _init);
})(window);