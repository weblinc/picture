/* Picture - Picture element polyfill for responsive images. Authors & copyright (c) 2012: WebLinc, David Knight. */
/* NOTE: Depends on Media object. See https://github.com/weblinc/media-match */

// Picture
(function(win) {

    var _doc        = win.document,
        _picl       = 0,
        _ratioExpr  = /\b[\d\.]+x\b/g,
        _srcExpr    = /[^\s]+/g,
        _res        = Media.features.resolution;
        _timer      = 0;

    /*
        parseSrcSet
    */
    function parseSrcSet(src) {
        var ratios  = src.match(_ratioExpr) || [],
            ratiol  = ratios.length;

        while (ratiol--) {
            var dppx = parseFloat(ratios[ratiol]) * 96;

            // Math.floor supports the situations when using values such as 1.5x or 1.3x (equals 1)
            if (_res === dppx || Math.floor(_res) === Math.floor(dppx)) {
                return src.match(_srcExpr)[(ratiol % 2) * 2];
            }
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
            Picture.pictures = [];

            var pics    = _doc.getElementsByTagName('object'),
                picl    = pics.length,
                pic     = null;

            while (picl-- && (pic = pics[picl])) {
                if (pic.getAttribute('data-picture') === null) {
                    continue;
                }

                var srcs        = pic.getElementsByTagName('param'),
                    srcl        = srcs.length,
                    src         = null,
                    mql         = '',
                    srcList     = {},
                    mediaAttr   = '',
                    srcAttr     = '',
                    srcDef      = '';

                while (srcl-- && (src = srcs[srcl])) {
                    mediaAttr   = src.getAttribute('data-media');
                    srcAttr     = src.getAttribute('data-src') || parseSrcSet(src.getAttribute('data-srcset') || '');

                    if (mediaAttr && srcAttr) {
                        srcList[mediaAttr] = srcAttr;
                        mql += (mql.length ? ', ' : '') + mediaAttr;
                    } else if (srcAttr) {
                        srcDef = srcAttr;
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
                    var pic     = Picture.pictures[id],
                        img     = null,
                        prev    = null,
                        match   = false;

                    if (typeof pic === 'undefined') { continue; }

                    match = Media.parseMatch(pic.media, true);

                    if (match && !(pic.matches === match.media) || !match && pic.srcDefault) {
                        pic.matches = (match && match.media) || match;

                        img = pic.element.getElementsByTagName('img')[0];
                        prev = (img && img.getAttribute('src')) || '';

                        if (!img) {
                            img = document.createElement('img');
                            img.alt = pic.element.getAttribute('title');
                            pic.element.appendChild(img);
                        }

                        Picture.imageError(img, pic, prev);

                        img.src = (match.media && pic.src[match.media]) || pic.srcDefault;
                    } else if (!match) {
                        pic.matches = false;

                        if (pic.srcDefault && (img = pic.element.getElementsByTagName('img')[0])) {
                            pic.element.removeChild(img);
                        }
                    }

                } while(id--);
            }, 10);
        },

        /*
            imageError
        */
        imageError: function(img, pic, src) {
            img.onerror = function() {
                pic.srcDefault = src;
                src && (this.src = src);
                this.onerror = null;
            };
        },

        /*
            init
        */
        init: function() {
            Picture.parse();
            Picture.watch();

            Media.listen(Picture.watch);
        }
    };

    if (win.addEventListener) {
        win.addEventListener('load', win.Picture.init);
    } else {
        win.attachEvent('onload', win.Picture.init);
    }
})(window);