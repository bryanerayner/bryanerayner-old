/**
*   Export Controller
*
*   Handles exporting the canvas in various formats
*
*   @since   2013-01-09
*   @author  Pete Hawkins <pete.hawkins@typecast.com>
*/
(function() {
    "use strict";

    var exportStyling = "#%rootElementId% > .fragment:first-child { margin: 0 !important; }" +
                        "#%rootElementId% { width: auto !important; }" +
                        ".controls{ display: none; }";

    var exportedStyles = "body{ background: url('"+ window.location.origin +"/images/transparency.png'); margin: 16px; }";


    var Export = function(args) {
        // Setup eventAggregator
        if (!args || !args.eventAggregator) throw new Error('You must pass in args.eventAggregator.');
        this.eventAggregator = args.eventAggregator;

        this.initialize.apply(this, arguments);
    };



    Export.prototype.initialize = function() {
        // Bind to export events
        this.eventAggregator.bind('export:png', this.exportPng, this);
    };



    /**
    *   exportPng(wndw, includeBackgroundColour, rootElementId)
    *
    *   Uses html2canvas to render a PNG representation
    *   of the page and opens it in a new window.
    */
    Export.prototype.exportPng = function(wndw, includeBackgroundColour, rootElementId) {
        var _this = this,
            element, style;

        if (!rootElementId) rootElementId = "fragments";
        if (!wndw) return false;

        // Cache window object
        this.wndw = wndw;

        // Deselect all the things
        this.eventAggregator.trigger('typecast:deslect:all');

        // Load up the canvas
        element = document.getElementById(rootElementId);

        if (!element) return false;

        _this.setup(includeBackgroundColour, rootElementId);

        // Generate screenshot of the canvas
        html2canvas( [ element ], {
            onrendered: $.proxy(this, "renderComplete"),
            proxy: false
        });
    };



    /**
    *   setup(includeBackgroundColour, rootElementId)
    *
    *   Runs before the image is generated
    */
    Export.prototype.setup = function(includeBackgroundColour, rootElementId) {
        // Add temporary styles to the DOM to remove fragments margins etc
        this.tempStyle = document.createElement('style');
        exportStyling = exportStyling.replace(/%rootElementId%/g, rootElementId);
        this.tempStyle.innerText = exportStyling;

        // Add background colour if it is set
        if (includeBackgroundColour) {
            var body = document.getElementsByTagName('body')[0],
                bodyStyles = window.getComputedStyle(body),
                bodyBackgroundColor = bodyStyles['background-color'];

            // If a background has not been selected set it to white
            if ( ! bodyBackgroundColor || bodyBackgroundColor === 'rgba(0, 0, 0, 0)') {
                bodyBackgroundColor = "rgb(255,255,255)";
            }

            // Apply extra styles for background colour to #fragments
            this.tempStyle.innerText = this.tempStyle.innerText + ' #'+ rootElementId +'{ background-color: '+ bodyBackgroundColor +'; } ';
        }

        // Add the style to page
        document.body.appendChild(this.tempStyle);
        $('body').addClass('rendering-image');
    };



    /**
    *   teardown()
    *
    *   Runs after the image is generated to cleanup temp styles
    */
    Export.prototype.teardown = function() {
        // Remove the temp styling
        this.tempStyle.parentElement.removeChild(this.tempStyle);
        $('body').removeClass('rendering-image');
    };



    /**
    *   renderComplete(canvas)
    *
    *   Runs when the image generation completes
    */
    Export.prototype.renderComplete = function(canvas) {
        var img = canvas.toDataURL();

        // Create an image tag using the PNG
        var imgTag = document.createElement('img');
        imgTag.src = img;

        // Create styles for the new window
        var wndwStyles = document.createElement('style');
        wndwStyles.innerText = exportedStyles;

        this.wndw.document.body.appendChild(wndwStyles);
        this.wndw.document.body.appendChild(imgTag);

        this.teardown();
    };



    Export.prototype.destroy = function(args) {
        // Unbind all events
        this.eventAggregator.unbind(null, null, this);
    };



    app.namespace("app.Controllers.Export");
    app.Controllers.Export = Export;

}());
