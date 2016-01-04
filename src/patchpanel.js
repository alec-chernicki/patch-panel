/*
 *  patch-panel - v1.0
 *  Makes responsive grid + panel layouts possible.
 *  http://alecortega.com
 *
 *  Made by Alec Ortega
 *  Under MIT License
 */
(function($, window, document, undefined) {

        else if ($openPanel.attr("data-patch-panel") === $hiddenPanel.attr("data-patch-panel")) {
    "use strict";

    // Create the default selectors
    var pluginName = "patchpanel",
        defaults = {
            itemSelector: ".patch-item",
            panelSelector: ".patch-panel",
            toggleSpeed: 300
        };

    function Plugin(element, options) {
        this.element = element;
        // JQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin

        this.settings = $.extend({}, defaults, options);

        // for multiple panels modify selectors to only take relevant elements to the current list
        if(element.hasAttribute('id')) { // Multiple containers require IDs to be given to each one for differentiation

            var idSelector    = "#" + element.id; // Container ID
            var classSelector = "#" + element.className; // Container class

            // Selection requirements require the following pattern to avoid errors when there are multiple patch panels
        }
      });

      // TODO: Refactor debounce, one level of abstraction too many
      var debouncedResize = plugin.hidePanel();

      plugin.$window.on("resize", debouncedResize);
    },

    hidePanel: function() {
      var plugin = this;
      return plugin.debounce(function() {
        var $openPanel = plugin.isPanelOpen();
        // Prevents resize from triggering on scroll on  mobile
        if ($openPanel && plugin.windowWidth !== plugin.$window.width()) {
          $openPanel.toggleClass("open").hide();
    appendPanel: function($button, panel) {

      // Stores the current portfolio item object
        this._name = pluginName;

      // Stores the index of the current item in relation to the item collection
      // Calculates the number of items that follow the clicked one within the row
        this.init(); //Initializes the container by 1) Finding elements, 2) Applying events, 3) Applying formatting (closing open panels)
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {

        init: function() {
            this.buildCache(); // Find associated elements and window properties
            this.bindEvents(); // Apply on click events, and window resize events
            this.initializePanels(); //set initial panel format (all closed and relative postitioned)
        },

      // Returns panel object if a panel is open, else returns false
      return $openPanel.length > 0 ? $openPanel : false;
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







        isPanelOpen: function() {

            var $openPanel = $(this.panelSelector + ".open");

            // Returns panel object if a panel is open, else returns false
            return $openPanel.length > 0 ? $openPanel : false;
        },

        }
    });

})(jQuery, window, document);