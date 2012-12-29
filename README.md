picture
=======

Responsive images based on the 'picture' element proposal. See http://picture.responsiveimages.org/.

###Picture example pattern
```
<span data-picture title="img alt">
    <span data-src="my_low.jpg" data-media="(max-width: 400px)"></span>
    <span data-src="my_medium.jpg" data-media="(max-width: 750px)"></span>
    <span data-src="my_high.jpg" data-media="(max-width: 1000px)"></span>
    <span data-srcset="my-1.jpg 1x, my-2.jpg 2x" />
    
    <!-- Fallback content -->
    <noscript>
        <img src="my-1.jpg" alt="my fallback content" />
    </noscript>
</span>
```

We've chosen to use a ```span``` as our picture element because it's not as common as ```div```s, meaning it will be faster when requesting an element collection and return less results to loop over.

Fallback for users without javascript enabled will see the ```noscript``` content.

###Dependancies
https://github.com/weblinc/media-match is the only dependancy thus far and we hope to keep it that way. Media is used to parse the ```data-media``` and ```srcset``` attributes.

####NOTE
Use ```(min-resolution: 2dppx)``` instead of ```(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)``` to query devices with a ```device-pixel-ratio``` of 2 or greater such as iOS devices. For 1. it's much shorter and 2. it's more standard than Apple's creation. Browsers will natively support resolution dppx in the future.
