/* Picture v2.1.0 - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

// Picture
('HTMLPictureElement' in window) || (function(win) {
    'use strict';

    var _doc            = win.document,
        _eventPrefix    = '',
        _addEvent       = win.addEventListener || (_eventPrefix = 'on') && win.attachEvent,
        _removeEvent    = win.removeEventListener || win.detachEvent,
        _style          = null,
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
        },

        /*
            applyImage
        */
        _applyImage = function(picture, sourceData) {
            var img = picture.pictureImage;

            if (!img) {
                img     = _doc.createElement('img');
                img.alt = picture.pictureAlt;
                picture.appendChild(img);
                picture.pictureImage = img;
            }

            if (sourceData) {
                img.src = sourceData.src;

                //picture.setAttribute('data-current-src', (sourceData.src || ''));
                //picture.setAttribute('data-media', ((sourceData.mql.matches && sourceData.mql.media) || ''));
            }
        },

        /*
            watch
        */
        _watch = function(picture, sourceData) {
            return function(mql) {
                var source;
                if (mql.matches && picture.parentNode !== null) {
                    _applyImage(picture, sourceData);
                } else {
                    source = picture.pictureSource[picture.pictureSource.join('').lastIndexOf('1')];
                    source && _applyImage(picture, source);
                }
            };
        },

        _createSourceData = function() {
          return   {
                mql         : null,
                src         : null,
                listener    : null,
                element     : null,
                toString    : function() {
                    if (this.element.parentNode === null) {
                        this.element = null;
                        this.mql.removeListener(this.listener);

                        return 0;
                    }

                    return this.mql.matches ? 1 : 0;
                }
            };  
        },

        _parseSrcset = function(str, picture, mediaAttr) {
            var srcsetCollection    = (str.indexOf(',') !== -1 && str.split(',')) || [str],
                srcsetHints         = [''],
                viewportHints       = [],
                dppxHint            = '',
                sourceData          = null,
                sourceMatch         = null;

            for (var i = 0, srcset; typeof((srcset = srcsetCollection[i])) !== 'undefined'; i++) {
                srcsetHints         = srcset.match(_srcsetExpr);
                sourceData          = _createSourceData();
                sourceData.element  = picture;
                sourceData.src      = srcsetHints[0]; // First index should always be the src url. Spec shows "url w h x, url w h x".

                for (var j = 1, hint; typeof((hint = srcsetHints[j])) !== 'undefined'; j++) {
                    viewportHints.push(
                        (hint.lastIndexOf('w') !== -1 && ('(min-width: ' + hint.match(_digitExpr) + 'px)')) || 
                        (hint.lastIndexOf('h') !== -1 && ('(min-height: ' + hint.match(_digitExpr) + 'px)')) || 
                        //(hint.lastIndexOf('x') !== -1 && ('(-webkit-min-device-pixel-ratio: ' + hint.match(_digitExpr) + ')'))
                        (hint.lastIndexOf('x') !== -1 && ('(min-resolution: ' + (hint.match(_digitExpr) * 96) + 'dpi)'))
                    );
                };

                //sourceData.mql      = win.matchMedia((mediaAttr ? mediaAttr + ' and ' : '') + viewportHints.join(' and '));
                //sourceData.listener = _watch(picture, sourceData);

                // May want to trigger this via resize or orientation change for performance
                //sourceData.mql.addListener(sourceData.listener);

                //sourceData.mql.matches && (sourceMatch = sourceData);

                picture.pictureSource.push(sourceData);
            };

            return sourceMatch;
        },

        _formatSrcset = function(x, media) {
            return [
                    '(-webkit-min-device-pixel-ratio: ' + x + ')' + (media ? ' and ' + media : ''), 
                    '(min-resolution: ' + x + 'dppx)' + (media ? ' and ' + media : ''), 
                    '(min-resolution: ' + (x * 96) + 'dpi)' + (media ? ' and ' + media : '')
                ].join(', ');
        };

    win.Picture = {
        /*
            parse
        */
        parse: function(context) {
            var pictureCollection = (context || _doc).getElementsByTagName('span');
            for (var i = 0, picture; typeof((picture = pictureCollection[i])) !== 'undefined'; i++) {
                if (picture.getAttribute('data-picture') !== null/* && !('pictureSource' in picture)*/) {
                    var sourceCollection    = picture.getElementsByTagName('span'),
                        sourceMatch         = null/*,
                        id                  = 'picturejs-' + _ID++,
                        width               = picture.getAttribute('data-width') || 'auto',
                        height              = picture.getAttribute('data-height') || 'auto'*/;

                    picture.pictureSource   = [];
                    picture.pictureImage    = picture.getElementsByTagName('img')[0];
                    //picture.pictureAlt      = picture.getAttribute('data-alt') || 'picture';

                    //picture.setAttribute('data-picturejs-id', id);

                    //_style.textContent += '[data-picturejs-id="' + id + '"] { ' + 'width: ' + (isNaN(width) ? width : width + 'px') + '; ' + 'height: ' + (isNaN(height) ? height : height + 'px') + '; ' + '} \n';

                    for (var j = sourceCollection.length - 1, source; typeof((source = sourceCollection[j])) !== 'undefined'; j--) {
                        var mediaAttr   = source.getAttribute('data-media'),
                            srcsetAttr  = source.getAttribute('data-srcset'),
                            srcAttr     = null,
                            sourceData  = _createSourceData();

                        sourceData.element = picture;

                        if (mediaAttr && !srcsetAttr) {
                            sourceData.mql      = win.matchMedia(mediaAttr);
                            sourceData.listener = _watch(picture, sourceData);

                            // May want to trigger this via resize or orientation change for performance
                            //sourceData.mql.addListener(sourceData.listener);

                            sourceData.mql.matches && (sourceMatch = sourceData);

                            picture.pictureSource.push(sourceData);
                        }

                        if (srcsetAttr) {
                            var parsedSourceMatch = _parseSrcset(srcsetAttr, picture, mediaAttr);
                            parsedSourceMatch && (sourceMatch = parsedSourceMatch);
                        } else {
                            srcAttr = source.getAttribute('data-src');
                            if (srcAttr) {
                                sourceData.src = srcAttr;
                            }

                            picture.pictureSource.push(sourceData);
                        }
                    };

                    sourceMatch && _applyImage(picture, sourceMatch);
                }
            };
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);