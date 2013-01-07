/* Picture - Picture element polyfill for responsive images. Authors & copyright (c) 2012: WebLinc, David Knight. */
/* NOTE: Depends on Media object. See https://github.com/weblinc/media-match */

// Picture
(function(win) {
    'use strict';

    var _doc        = win.document,
        _picl       = 0,
        _ratioExpr  = /\s+[\d\.]+x\s*,?/g,
        _srcExpr    = /[^\s]+/g,
        _res        = win.Media.features.resolution,
        _timer      = 0;

    /*
        parseSrcSet
    */
    function parseSrcSet(src, precise) {
        var ratios  = src.match(_ratioExpr) || [],
            ratiol  = ratios.length,
            srcList = src.replace(_ratioExpr, ' ').match(_srcExpr);

        while (ratiol--) {
            var dppx = parseFloat(ratios[ratiol]) * 96;

            if (_res === dppx || (precise === false && Math.floor(_res / 96) === Math.floor(dppx / 96))) {
                return srcList[ratiol];
            }
        }

        if (typeof precise === 'undefined') {
            return parseSrcSet(src, false);
        }

        return null;
    }

    win.Picture = {
        // Properties
        pictures: [],

        // Methods

        /*
            parse
        */
        parse: function() {
            win.Picture.pictures = [];

            var pics    = _doc.getElementsByTagName('span'),
                picl    = pics.length,
                pic     = null;

            while (picl-- && (pic = pics[picl])) {
                if (pic.getAttribute('data-picture') === null) {
                    continue;
                }

                var srcs        = pic.getElementsByTagName('span'),
                    srcl        = srcs.length,
                    src         = null,
                    mql         = '',
                    srcList     = {},
                    mediaAttr   = '',
                    srcAttr     = '',
                    srcDef      = '',
                    width       = '',
                    height      = '';

                while (srcl-- && (src = srcs[srcl])) {
                    mediaAttr   = src.getAttribute('data-media');
                    srcAttr     = src.getAttribute('data-src') || parseSrcSet(src.getAttribute('data-srcset') || '');

                    width       = src.getAttribute('data-width') || '';
                    height      = src.getAttribute('data-height') || '';

                    if (mediaAttr && srcAttr) {
                        srcList[mediaAttr] = {
                            uri: srcAttr,
                            width: width,
                            height: height
                        };
                        mql += (mql.length ? ', ' : '') + mediaAttr;
                    } else if (srcAttr) {
                        srcDef = {
                            uri: srcAttr,
                            width: width,
                            height: height
                        };
                    }
                }

                Picture.pictures.push({
                    element     : pic,
                    media       : mql,
                    src         : srcList,
                    srcDefault  : srcDef,
                    matches     : false
                });

                _picl++;
            }
        },

        /*
            watch
        */
        watch: function(evt) {
            clearTimeout(_timer);

            _timer = setTimeout(function() {
                var id = _picl;

                do {
                    var pic     = win.Picture.pictures[id],
                        imgs    = [],
                        img     = null,
                        hasImg  = false,
                        src     = '',
                        width   = '',
                        height  = '',
                        prev    = null,
                        match   = false;

                    if (typeof pic === 'undefined') { continue; }

                    match = win.Media.parseMatch(pic.media, true);

                    if (match && !(pic.matches === match.media) || !match && pic.srcDefault.uri) {
                        pic.matches = (match && match.media) || match;

                        imgs = pic.element.getElementsByTagName('img');

                        if (match.media && pic.src[match.media].uri) {
                            src     = (match.media && pic.src[match.media].uri);
                            width   = pic.src[match.media].width;
                            height  = pic.src[match.media].height;
                        } else {
                            src     = pic.srcDefault.uri;
                            width   = pic.srcDefault.width;
                            height  = pic.srcDefault.height;
                        }

                        if (src) {
                            for (var i = 0, il = imgs.length; i < il; i++) {
                                img = imgs[i];
                                if (img.getAttribute('src') === src) {
                                    img.className = 'match';
                                    hasImg = true;
                                } else if (img.className !== 'unmatch') {
                                    img.className = 'unmatch';
                                }
                            }

                            if (!hasImg) {
                                img             = document.createElement('img');
                                img.alt         = pic.element.getAttribute('data-title') || 'picture';
                                if (width) {
                                    img.width = width;
                                }
                                if (height) {
                                    img.height = height;
                                }
                                img.className   = 'match';

                                pic.element.appendChild(img);

                                img.src = src;
                            }
                        }
                    } else if (!match) {
                        pic.matches = false;
                    }

                } while(id--);
            }, 10);
        },

        /*
            init
        */
        init: function() {
            win.Picture.parse();
            win.Picture.watch();

            win.Media.listen(win.Picture.watch);
        }
    };

    if (win.addEventListener) {
        win.addEventListener('load', win.Picture.init);
    } else {
        win.attachEvent('onload', win.Picture.init);
    }
})(window);