// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

var JS = ( function() {

    var attachAnchors = function() {

        var anchors = document.querySelectorAll( 'ol > li' );
        var a  = null;
        var h1 = null;

        anchors.forEach( function( anchor, index ){
            anchor.id = 'anchor-' + ( index + 1);
            h1 = anchor.querySelector( 'h2' );
            if ( h1 ) {
                a = document.createElement( 'a' );
                a.href = window.location.origin + window.location.pathname + '#anchor-' + ( index + 1 );
                a.innerHTML = h1.innerHTML;
                h1.innerHTML = '';
                h1.appendChild( a );
            }
        } );

    };

    var attachCollapsible = function() {

        var collapsibles = document.querySelectorAll( '.collapsible' );

        collapsibles.forEach( function( collapsible ){
            collapsible.addEventListener( 'click', toggleCollapsible );
        } );

    };

    var convertVideoLinks = function() {

        var videos = document.querySelectorAll( '[data-video]' );

        videos.forEach( function( video ) {
            var type = video.dataset.video
            if ( type ) {
                type = type.trim();
                switch ( type.toUpperCase() ) {
                    case 'YOUTUBE':
                        processVideo( 'YOUTUBE', video );
                        break;
                }
            }
        } );

    };

    /**
     * Vanilla Javascript DOM Ready function supporting IE 8+.
     *
     * @param {function} fn A function to call when the DOM is ready.
     * @see {@link http://youmightnotneedjquery.com/>}
     * @author adamfschwartz
     * @author zackbloom
     */
    var domReady = function( fn ) {
        if (document.readyState != 'loading'){
            fn();
        } else if (document.addEventListener) {
            document.addEventListener( 'DOMContentLoaded', fn );
        } else {
            document.attachEvent( 'onreadystatechange', function(){
                if (document.readyState != 'loading'){
                    fn();
                }
            });
        }
    };

    var initialize = function() {
        
        attachAnchors();

        setTimeout( function(){
            scrollToAnchor();
        }, 500 );

        attachCollapsible();

        convertVideoLinks();

        // Initialize Highlight.js to format all code examples on the page.
        hljs.initHighlightingOnLoad();

    };

    var processVideo = function( type, link ) {

        switch ( type ) {
            case 'YOUTUBE':
                // Get the video source or bail.
                var src = link.href;
                if ( src ) {
                    src = src.substring( src.lastIndexOf( '/' ) + 1 );
                    if ( src.length < 5 ) {
                        return;
                    }
                }
                // Build the iframe.
                var frame = document.createElement( 'IFRAME' );
                frame.setAttribute( 'allowFullScreen', '' );
                frame.setAttribute( 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' );
                frame.setAttribute( 'frameborder', '0' );
                frame.setAttribute( 'src', 'https://www.youtube-nocookie.com/embed/' + src );
                // Make a new link.
                var a = document.createElement( 'A' );
                a.setAttribute( 'href', link.href );
                a.setAttribute( 'target', '_blank' );
                // Make the fallback link div and add it after the existing link.
                var fallback = document.createElement( 'DIV' );
                fallback.classList.add( 'video-fallback' );
                fallback.innerHTML = '&mdash;&nbsp;&nbsp;<a href="' + link.href + '" target="_blank">&#x2139;&nbsp;&nbsp;' + link.innerHTML + '</a>';
                fallback.appendChild( a );
                link.parentElement.insertBefore( fallback, link.nextSibling );
                // Swap out the link and replace with the video and fallback divs.
                var html = document.createElement( 'DIV' );
                html.classList.add( 'video' );
                html.appendChild( frame );
                link.parentElement.replaceChild( html, link );
                break;
        }
    };

    var scrollToAnchor = function() {

        var anchor = window.location.hash;

        if ( anchor.length > 1 ) {
            anchor = anchor.substring( 1 );
            anchor = document.getElementById( anchor );
            if ( anchor ) {

                anchor.scrollIntoView( {
                    'behavior': 'smooth',
                    'block': 'center'
                } );

                anchor.classList.add( 'highlight' );

                setTimeout( function() {
                    var anchor = document.querySelector( 'li.highlight' );
                    if ( anchor ) {
                        anchor.classList.remove( 'highlight' );
                    }
                }, 3000 );
            }
        }



    };

    var toggleCollapsible = function() {
        this.classList.toggle( 'open' );
    };

    domReady( initialize );
    
} )();