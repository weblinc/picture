picture
=======

Responsive images based on the 'picture' element proposal. See http://picture.responsiveimages.org/.

##Why?
* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera, Safari, iOS and Android
* **Speed**: Uses native or polyfilled matchMedia to evaluate each ```<span data-media="..." />```
* **Size**: 1.02KB minified (534 bytes gzipped)

###Picture example pattern
```
<span data-picture title="img alt">
    <span data-src="my_low.jpg" data-media="(max-width: 400px)"></span>
    <span data-src="my_medium.jpg" data-media="(max-width: 750px)"></span>
    <span data-src="my_high.jpg" data-media="(max-width: 1000px)"></span>
    <!--
    Not currently supported as of v2.1.0
    <span data-srcset="my-1.jpg 1x, my-2.jpg 2x" />
    -->
    
    <!-- Fallback content -->
    <noscript>
        <img src="my-1.jpg" alt="my fallback content" />
    </noscript>
</span>
```

We've chosen to use a ```span``` as our picture element because it's not as common as ```div```s, meaning it will be faster when requesting an element collection and return less results to loop over.

Fallback for users without javascript enabled will see the ```noscript``` content.

###Dependencies
None, unless a polyfill is required for window.matchMedia with listener support. If your project requires support of IE <= 8 or iOS <= 5.0 or Opera <= 12, try https://github.com/weblinc/media-match. It's another of our projects focused on performance, near full CSS3 feature support and broad browser compatibility.
