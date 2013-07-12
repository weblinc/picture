picture
=======

Responsive images based on the 'picture' element proposal. See http://picture.responsiveimages.org/.

##Why?
* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera, Safari, iOS and Android
* **Speed**: Uses native or polyfilled matchMedia to evaluate each ```<span data-media="..." />```
* **Size**: 2.27KB minified (1.02KB gzipped)

###Picture example patterns

#####```noscript``` fallback which requires data-alt attribute on data-picture element.

```
<span data-picture data-alt="img alt">
    <span data-media="(min-width: 1000px)" data-srcset="lib/my_high.jpg 1x, lib/my_high_2x.jpg 2x"></span>
    <span data-media="(min-width: 800px)" data-src="lib/my_medium.jpg"></span>
    <span data-media="(min-width: 400px)" data-src="lib/my_low.jpg"></span>
    <span data-srcset="lib/my_low.jpg 1x, lib/my_high.jpg 2x"></span>

    <noscript>
        <img src="lib/my_low.jpg" alt="my fallback content" />
    </noscript>
</span>
```

#####```img``` fallback with the lowest size/quality src which does not require data-alt attribute on data-picture element as long as it is present on the img element.

```
<span data-picture>
    <span data-media="(min-width: 1000px)" data-srcset="lib/my_high.jpg 1x, lib/my_high_2x.jpg 2x"></span>
    <span data-media="(min-width: 800px)" data-src="lib/my_medium.jpg"></span>
    <span data-media="(min-width: 400px)" data-src="lib/my_low.jpg"></span>
    <span data-srcset="lib/my_low.jpg 1x, lib/my_high.jpg 2x"></span>

    <img src="lib/my_low.jpg" alt="img alt" />
</span>
```

#####```noscript``` fallback which requires data-alt attribute on data-picture element. data-picture element has data-srcset attribute.

```
<span data-picture data-srcset="lib/my_high.jpg 1x, lib/my_high_2x.jpg 2x" data-alt="img alt">
    <noscript>
        <img src="lib/my_low.jpg" alt="my fallback content" />
    </noscript>
</span>
```

#####```img``` fallback with the lowest size/quality src which does not require data-alt attribute on data-picture element as long as it is present on the img element. data-picture element has data-srcset attribute.

```
<span data-picture data-srcset="lib/my_high.jpg 1x, lib/my_high_2x.jpg 2x">
    <img src="lib/my_low.jpg" alt="img alt" />
</span>
```

#####```noscript``` fallback which requires data-alt attribute on data-picture element. data-picture element has data-src attribute.

```
<span data-picture data-src="lib/my_high.jpg" data-alt="img alt">
    <noscript>
        <img src="lib/my_low.jpg" alt="my fallback content" />
    </noscript>
</span>
```

#####```img``` fallback with the lowest size/quality src which does not require data-alt attribute on data-picture element as long as it is present on the img element. data-picture element has data-src attribute.

```
<span data-picture data-src="lib/my_high.jpg">
    <img src="lib/my_low.jpg" alt="img alt" />
</span>
```

We've chosen to use a ```span``` as our picture element because it's not as common as ```div```s, meaning it will be faster when requesting an element collection and return less results to loop over.

Fallback for users without javascript enabled will see the ```noscript``` content.

###Future improvements
* Supported v2.2.0 ~~```picture``` ```data-srcset``` attribute support (supercedes ```src``` attribute and ```source``` elements)~~
* Supported v2.2.0 ~~```picture``` ```data-src``` attribute support (supercedes ```source``` elements)~~
* Supported v2.2.0 ~~```source``` ```data-srcset``` attribute support~~
* Supported v2.2.0 ~~Content negotiation based on the previous 3 ways of setting image content~~
* ```picture``` ```data-media``` attribute support (currently matched media query)
* Supported v2.2.0 ~~```picture``` ```data-current-src``` attribute support (current src url)~~
* ```picture``` ```data-width``` attribute support
* ```picture``` ```data-height``` attribute support

###Dependencies
None, unless a polyfill is required for window.matchMedia with listener support. If your project requires support of IE <= 9 or iOS <= 5.0 or Opera <= 12, try https://github.com/weblinc/media-match. It's another of our projects focused on performance, near full CSS3 feature support and broad browser compatibility.
