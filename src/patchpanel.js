/*
 *  patch-panel - v1.0
 *  Makes responsive grid + panel layouts possible.
 *  http://alecortega.com
 *
 *  Made by Alec Ortega
 *  Under MIT License
 */
(function($, window, document, undefined) {

    "use strict";

    // Create the default selectors
    var pluginName = "patchpanel",
        defaults = {
            buttonSelector: ".patch-button",
            itemSelector: ".patch-item",
            panelSelector: ".patch-panel",
            toggleSpeed: 300
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // JQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin

        this.settings = $.extend({}, defaults, options);

        // for multiple panels modify selectors to only take relevant elements to the current list
        if(element.hasAttribute("id")) { // Multiple containers require IDs to be given to each one for differentiation

            var idSelector    = "#" + element.id; // Container ID
            var classSelector = "#" + element.className; // Container class

            // Selection requirements require the following pattern to avoid errors when there are multiple patch panels
            // idSelector eachvalue:not("idSelector classSelector eachvalue")';
            // i = idSelector + ' ' + i + ':not("' + idSelector + ' ' + classSelector + ' ' + i + '")';
            // JavaScript really needs to get a function for formatting strings

            // For adding support for buttons and panels located outside the container.
            // currently enabling this breaks the appending process, but this could be fixed later, but may not make sense with the "content below the button" idea
            // Select linked buttons located outside their panel-container
            //this.settings["externalButtonSelector"] = this.settings["buttonSelector"]+ "[data-patch-container=" + idSelector.substring(1) + "]";
            // Select panels located outside their panel-container
            //this.settings["externalPanelSelector"] = this.settings["panelSelector"]+ "[data-patch-container=" + idSelector.substring(1) + "]";

            // Select buttons
            this.settings.buttonSelector = idSelector + " " + this.settings.buttonSelector + ":not(\"" + idSelector + " " + classSelector + " " + this.settings.buttonSelector + "\")";
            // Select items
            this.settings.itemSelector   = idSelector + " " + this.settings.itemSelector   + ":not(\"" + idSelector + " " + classSelector + " " + this.settings.itemSelector   + "\")";
            // Select panels
            this.settings.panelSelector  = idSelector + " " + this.settings.panelSelector  + ":not(\"" + idSelector + " " + classSelector + " " + this.settings.panelSelector  + "\")";
        }

        this._name = pluginName;
        this._defaults = defaults;

        this.init(); //Initializes the container by 1) Finding elements, 2) Applying events, 3) Applying formatting (closing open panels)
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {

        init: function() {
            this.buildCache(); // Find associated elements and window properties
            this.bindEvents(); // Apply on click events, and window resize events
            this.initializePanels(); //set initial panel format (all closed and relative postitioned)
        },

        //Finds buttons, items, container, and window propertie for later use
        buildCache: function() {
            this.$window = $(window);
            this.$container = $(this.element);
            this.$itemCollection = $(this.element).children(this.settings.itemSelector);

            // To support external buttons the line below becomes:
            // this.$patchButton = $(this.settings.buttonSelector).add(this.settings.externalButtonSelector);
            this.$patchButton = $(this.settings.buttonSelector);

            this.windowWidth = $(window).width();
            this.itemSelector = this.settings.itemSelector;
            this.panelSelector = this.settings.panelSelector;
        },

        // Controls click events on patch-buttons
        bindEvents: function() {
            var plugin = this;

            // Called when someone clicks a patch-button
            plugin.$patchButton.on("click", function(e) {
                // Prevent default in case the button is an anchor tag
                e.preventDefault();

                var $el = $(this);

                var $openPanel = plugin.isPanelOpen();
                var $hiddenPanel = $(plugin.panelSelector + "[data-patch-panel=" + $el.attr("data-patch-panel") + "]").add();

                // IF: Button clicked corresponds to a panel and no panels are already open, open panel
                if (!$openPanel) {
                    // Note: This line breaks the possibility of external buttons and panels.
                    // Removing it fixes external buttons, but breaks the layout process
                    plugin.appendPanel($el, $hiddenPanel);
                    plugin.togglePanel($hiddenPanel);
                }

                // ELSE IF: Button clicked corresponds to a panel that is already open
                else if ($openPanel.attr("data-patch-panel") === $hiddenPanel.attr("data-patch-panel")) {
                    plugin.togglePanel($openPanel);
                }

                // ELSE IF: Button clicked corresponds to a different panel and a panel is open
                else if ($openPanel.attr("data-patch-panel") !== $hiddenPanel.attr("data-patch-panel")) {

                    // Note: This line  breaks the possibility of external buttons and panels.
                    // Removing it fixes external buttons, but breaks the layout process
                    plugin.appendPanel($el, $hiddenPanel);

                    // To allow for nested panels, don't close panel if the panel you are opening is it's child.
                    $openPanel.each(function () { // Iterate through open panels
                        if (! $.contains($(this)[0], $hiddenPanel[0])) { // If the open panel is not an ascendant of the panel being hidden
                            plugin.togglePanel($(this)); // Close it
                        }
                    });

                    plugin.togglePanel($hiddenPanel); //open up the new panel
                }

                //Prevents event bubbling on nested panels from closing the panels as soon as they are opened
                e.stopImmediatePropagation();
            });

            // TODO: Refactor debounce, one level of abstraction too many
            var debouncedResize = plugin.hidePanel();  // Closes all open panels
            plugin.$window.on("resize", debouncedResize); // Perhaps it should reopen it again afterwords?
        },

        // closes any open panels, and reidentifies window width
        // This is called when window is resized (see binEvents::debouncedResize)
        hidePanel: function() {

            var plugin = this;
            return plugin.debounce(function() {

                var $openPanel = plugin.isPanelOpen();

                // Prevents resize from triggering on scroll on  mobile
                if ($openPanel && plugin.windowWidth !== plugin.$window.width()) {
                    $openPanel.toggleClass("open").hide(); // Closes open panels
                    plugin.windowWidth = plugin.$window.width(); // Finds new window with
                }

            }, 200);
        },

        // For determining size and position of panels
        // Note: This function breaks the possibility of external buttons and panels.
        appendPanel: function($button, panel) {
            var plugin = this;

            // Stores the current portfolio item object
            var $item = $button.closest(plugin.itemSelector);

            // Stores the index of the current item in relation to the item collection
            var itemIndex = $(plugin.$itemCollection).index($item);

            // Calculates number of items in row by dividing container width by width of item
            var itemsInRow = Math.floor(plugin.$container.width() / $item.width());

            // Calculates the number of items that follow the clicked one within the row
            var itemOffset = Math.floor(($item.position().left - 1) / $item.width());

            // Appends the panel at the items current index plus the offset
            $(plugin.$itemCollection[itemIndex + (itemsInRow - itemOffset - 1)]).append().after(panel);
        },

        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        //returns all open panels, or false if there are none
        isPanelOpen: function() {

            var $openPanel = $(this.panelSelector + ".open");

            // Returns panel object if a panel is open, else returns false
            return $openPanel.length > 0 ? $openPanel : false;
        },

        // All panels should be initialy closed, and set to relative positioning
        initializePanels: function() {
            var plugin = this;
            $(this.panelSelector).hide();
            plugin.$container.css("position", "relative");
        },

        // opens the panel if it is closed, closes it if it's open
        togglePanel: function($panel) {
            $panel.stop().toggleClass("open").slideToggle(this.settings.toggleSpeed);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);