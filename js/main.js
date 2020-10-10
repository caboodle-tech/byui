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

    var attachcollapsible = function() {

        var collapsibles = document.querySelectorAll( '.collapsible' );

        collapsibles.forEach( function( collapsible ){
            collapsible.addEventListener( 'click', toggleCollapsible );
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

        attachcollapsible();

        // Initialize Highlight.js to format all code examples on the page.
        hljs.initHighlightingOnLoad();

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