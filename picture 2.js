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

        /*
            watch
        */
        _watch = function(picture) {
            return function(mql) {
                var sourceMatch     = null,
                    hasParent       = picture.parentNode !== null,
                    sourceLength    = picture.pictureSource.length;
//console.log(picture.pictureSource.join(''));
                // Loop over all media queries associated with this 'picture' element and
                // set variable 'sourceMatch' which will be the last query to eval to true
                /*for (var i = 0; i < sourceLength; i++) {
                    var pictureSource = picture.pictureSource[i];
                    if (!hasParent) {
                        pictureSource.mql.removeListener(pictureSource.mqlListener);
                    } else if (pictureSource.mql.matches) {
                        sourceMatch = pictureSource;
                    }
                }*/
                /*for (var i = 0, pictureSource; 'undefined' !== typeof((pictureSource = picture.pictureSource[i])); i++) {
                    if (!hasParent) {
                        pictureSource.mql.removeListener(pictureSource.mqlListener);
                    } else if (pictureSource.mql.matches) {
                        sourceMatch = pictureSource;
                    }
                };*/
sourceMatch = picture.pictureSource[picture.pictureSource.join('').lastIndexOf('1')];

//console.log(picture.pictureSource);
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

                if (hasParent) {
                    //picture.setAttribute('data-current-src', ((sourceMatch && sourceMatch.src) || ''));
                    //picture.setAttribute('data-media', (sourceMatch.mql.matches ? sourceMatch.mql.media : ''));
                }
            };
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
            var picList     = _doc.getElementsByTagName('span'),
                picIndex    = picList.length - 1,
                picLength   = picIndex,
                pic         = null,
                width       = '',
                height      = '',

                srcList        = null,
                srcIndex    = 0,
                srcLength   = 0,
                src         = null,

                mediaAttr   = '',
                srcAttr     = '',
                srcsetAttr  = '',
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
                if (pic.getAttribute('data-picture') === null/* || 'pictureSource' in pic*/) {
                    continue;
                }

                pic.pictureSource   = [];
                pic.pictureImage    = pic.getElementsByTagName('img')[0];
                pic.pictureAlt      = pic.getAttribute('data-alt') || 'picture';
/*
                width   = pic.getAttribute('data-width');
                height  = pic.getAttribute('data-height');

                width && (pic.style.width = isNaN(width) ? width : width + 'px');
                height && (pic.style.height = isNaN(height) ? height : height + 'px');

                srcsetAttr  = pic.getAttribute('data-srcset');
*/
//console.log(_formatSrcset('', 400, 500, 2));
/*
                if (srcsetAttr) {
                    //'(-webkit-max-device-pixel-ratio: ' +  + '), (min--max-device-pixel-ratio:  ' +  + '), (-webkit-max-device-pixel-ratio: ' +  + '), (max-resolution:  ' +  + 'dppx), (max-resolution:  ' +  + 'dpi)'

                    continue;
                }

                srcAttr     = pic.getAttribute('data-src');

                if (srcAttr) {
                    pic.pictureImage = pic.pictureImage || _doc.createElement('img');
                    pic.pictureImage.alt = pic.pictureAlt;
                    pic.appendChild(pic.pictureImage);
                    pic.pictureImage.src = srcAttr;

                    continue;
                }
*/
                // <span data-src="my" data-media="(min-width: 400px)"></span>
                srcList     = pic.getElementsByTagName('span');
                srcIndex    = srcList.length - 1;
                srcLength   = srcIndex;

                if (srcIndex < 0) {
                    continue;
                }

                var mqlListener = _watch(pic);
/*
                do {
                    src         = srcList[srcLength - srcIndex];
                    mediaAttr   = src.getAttribute('data-media');
                    srcAttr     = src.getAttribute('data-src');

                    if (mediaAttr && srcAttr) {
                        mql         = win.matchMedia(mediaAttr);
                        mqlListener = _watch(pic, mql);

                        pic.pictureSource.push({
                            mql         : mql,
                            mqlListener : mqlListener,
                            src         : srcAttr,
                            toString    : function() {
                                return this.mql.matches ? 1 : 0;
                            }
                        });

                        //mqlListener(mql);
                        //mql.addListener(mqlListener);
                    }
                } while (srcIndex--);
*/

                for (var j = 0, src; 'undefined' !== typeof((src = srcList[j])); j++) {
                    mediaAttr   = src.getAttribute('data-media');
                    srcAttr     = src.getAttribute('data-src');

                    if (mediaAttr && srcAttr) {
                        pic.pictureSource.push({
                            media       : mediaAttr,
                            mql         : null,
                            src         : srcAttr,
                            toString    : function() {
                                if (!this.mql) {
                                    this.mql = win.matchMedia(this.media);
                                }

                                return this.mql.matches ? 1 : 0;
                            }
                        });

                        //mqlListener(mql);
                        //mql.addListener(mqlListener);
                    }
                };

                //pic.pictureSource.join('');
                mqlListener();

            } while (picIndex--);
        }
    };

    // Set up listeners
    _addEvent(_eventPrefix + 'load', _init);
})(window);