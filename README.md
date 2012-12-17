picture
=======

Responsive images based on the 'picture' element proposal. See http://picture.responsiveimages.org/.

###Picture example html
```
<object data-picture title="img alt">
    <param name="low" data-src="my_low.jpg" data-media="(max-width: 400px)" />
    <param name="medium" data-src="my_medium.jpg" data-media="(max-width: 750px)" />
    <param name="high" data-src="my_high.jpg" data-media="(max-width: 1000px)" />
    <param name="default" data-srcset="my-1.jpg 1x, my-2.jpg 2x" />
    
    <!-- Fallback content -->
    <noscript>
        <img src="my-1.jpg" alt="my fallback content" />
    </noscript>
</object>
```

We've chosen to use an ```object``` as our picture element for a few reasons.
* Not as common as ```div```s, meaning it will be faster when requesting an element collection and return less results to loop over
* The ```object``` has been associated with media long before ```video``` and ```audio``` elements
* Contains ```param``` elements, which adds symantic value and stands in nicely for ```source```

The ```param```'s ```name``` attribute adds a friendly name association to the media query and src grouping. It currently has no effect with in the code base and is merely for user sanity.

Fallback for users without javascript enabled will see the ```noscript``` content.
