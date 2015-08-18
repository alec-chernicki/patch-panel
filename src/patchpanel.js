// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {

  "use strict";

  // Create the defaults once
  var pluginName = "patchpanel",
    defaults = {
      buttonSelector: ".patch-button",
      itemSelector: ".patch-item",
      panelSelector: ".patch-panel"
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don"t want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    // Object collections to iterate over
    this.$itemCollection = $(this.element).children(this._defaults.itemSelector);

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function() {
      this.hideAllPanels();
      this.bindPatchButton(this.isPanelOpen, this.appendPanel, this.element, this.$itemCollection, this.togglePanel);
      this.bindCloseOnResize(this.togglePanel, this.isPanelOpen);
    },

    bindPatchButton: function (isPanelOpen, appendPanel, container, itemCollection, togglePanel) {
      // Bind event handlers
      $(defaults.buttonSelector).on("click", function() {
        var $el = this;
        var $panel = $(defaults.panelSelector + "[data-patch-panel=" + $el.getAttribute("data-patch-panel") + "]");

        // IF: Button clicked corresponds to a panel and no panels are already open, open panel
        if (!isPanelOpen()) {
          appendPanel($el, $panel, container, itemCollection);
          togglePanel($panel);
        }

        // ELSE IF: Button clicked corresponds to a panel that is already open
        else if (isPanelOpen().attr("data-patch-panel") === $panel.attr("data-patch-panel")) {
          togglePanel($panel);
        }

        // ELSE IF: Button clicked corresponds to a different panel and a panel is open
        else if (isPanelOpen().attr("data-patch-panel") !== $panel.attr("data-patch-panel")) {
          appendPanel($el, $panel, container, itemCollection);
          $(isPanelOpen()).toggleClass("open").slideToggle(300, function() {
            togglePanel($panel);
          });
        }
      });
    },

    bindCloseOnResize: function (togglePanel, isPanelOpen) {
      $(window).on("resize", function () {
        if(isPanelOpen()) { togglePanel(isPanelOpen()); }
      });
    },

    isPanelOpen: function() {
      var $openPanel = $(defaults.panelSelector + ".open");

      // Returns panel object if a panel is open else returns false
      return ($openPanel.length > 0) ? ($openPanel) : (false);
    },

    hideAllPanels: function () {
      $(defaults.panelSelector).hide();
    },

    appendPanel: function (button, panel, container, itemCollection) {

      // Stores the closest portfolio item object
      var $item = $(button).closest(defaults.itemSelector);

      var itemIndex = $(itemCollection).index($item);

      // Calculates number of items in row by dividing container width by width of item
      var itemsInRow = Math.floor($(container).width() / $item.width());

      // Finds the row by dividing the index of the item by the number of items in a row and rounding up
      // var rowOfItem = Math.ceil((itemCollection.index($item) + 1) / itemsInRow);

      // var itemContext = (itemCollection.length - 1) / (itemsInRow - 1);

      var itemPosition = $item.position();

      var itemOffset = Math.floor(itemPosition.left / $item.width()) + 1;
      console.log(itemsInRow - itemOffset)

      $(itemCollection[itemIndex + (itemsInRow - itemOffset)]).append().after(panel);


      // Find the project correct item to append to within the item array and append the panel
      // $(itemCollection[itemsInRow * rowOfItem - 1]).append().after(panel);
    },

    togglePanel: function(panel) {
      panel.toggleClass("open").slideToggle(300);
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
