/* Picture v2.1.0 - Picture element polyfill for responsive images. Authors & copyright (c) 2013: WebLinc, David Knight. */

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
                var sourceMatch     = null,
                    hasParent       = picture.parentNode !== null,
                    sourceLength    = picture.pictureSource.length;

                // Loop over all media queries associated with this 'picture' element and
                // set variable 'sourceMatch' which will be the last query to eval to true
                for (var i = 0; i < sourceLength; i++) {
                    var pictureSource = picture.pictureSource[i];
                    if (!hasParent) {
                        pictureSource.mql.removeListener(pictureSource.mqlListener);
                    } else if (pictureSource.mql.matches) {
                        sourceMatch = pictureSource;
                    }
                }

                // Create img element or supply proper src
                if (sourceMatch && hasParent) {
                    if (picture.pictureImage) {
                        picture.pictureImage.src = sourceMatch.src;
                        picture.pictureImage.style.display = '';
                    } else {
                        picture.pictureImage = _doc.createElement('img');
                        picture.pictureImage.alt = picture.pictureAlt;
                        picture.appendChild(picture.pictureImage);
                        picture.pictureImage.src = sourceMatch.src;
                    }
                } else if (!sourceMatch && picture.pictureImage) {
                    picture.pictureImage.style.display = 'none';
                }
            };

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

                mediaAttr   = '',
                srcAttr     = '',
                mql         = null,
                mqlListener = null;

            if (picIndex < 0) {
                return;
            }

            do {
                pic = picList[picLength - picIndex];

                // Format for each 'source' element: <span data-picture data-alt=""></span>
                // 'pictureSource' is an array of 'source' elements with the following format.
                /*
                    {
                        mql         : MediaQueryList,
                        mqlListener : MediaQueryListListener,
                        src         : 'imgfile.ext'
                    }
                */
                if (pic.getAttribute('data-picture') === null || 'pictureSource' in pic) {
                    continue;
                }

                pic.pictureSource   = [];
                pic.pictureImage    = pic.getElementsByTagName('img')[0];
                pic.pictureAlt      = pic.getAttribute('data-alt') || 'picture';

                // <span data-src="my" data-media="(min-width: 400px)"></span>
                srcList     = pic.getElementsByTagName('span');
                srcIndex    = srcList.length - 1;
                srcLength   = srcIndex;

                if (srcIndex < 0) {
                    continue;
                }

                do {
                    src         = srcList[srcLength - srcIndex];
                    mediaAttr   = src.getAttribute('data-media');
                    srcAttr     = src.getAttribute('data-src');

                    if (mediaAttr && srcAttr && win.matchMedia) {
                        mql         = win.matchMedia(mediaAttr);
                        mqlListener = _watch(pic, mql);

                        pic.pictureSource.push({
                            mql         : mql,
                            mqlListener : mqlListener,
                            src         : srcAttr
                        });

                        mqlListener(mql);
                        mql.addListener(mqlListener);
                    }
                } while (srcIndex--);
            } while (picIndex--);
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);