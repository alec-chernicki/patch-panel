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
      panelSelector: ".patch-panel",
      toggleSpeed: 300
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

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function() {
      this.buildCache();
      this.bindEvents();
      this.hideAllPanels();
    },

    buildCache: function () {
      this.$window = $(window);
      this.$container = $(this.element);
      this.$itemCollection = $(this.element).children(this.settings.itemSelector);
      this.$patchButton = $(this.settings.buttonSelector);

      this.windowWidth = $(window).width();
      this.itemSelector = this.settings.itemSelector;
      this.panelSelector = this.settings.panelSelector;
    },

    bindEvents: function () {
      var plugin = this;

      plugin.$patchButton.on("click", function (e) {
        // Prevent default in case the button is an anchor tag
        e.preventDefault();

        var $el = $(this);
        var $openPanel = plugin.isPanelOpen();
        var $hiddenPanel = $(plugin.panelSelector + "[data-patch-panel=" + $el.attr("data-patch-panel") + "]");

        // IF: Button clicked corresponds to a panel and no panels are already open, open panel
        if (!$openPanel) {
          plugin.appendPanel($el, $hiddenPanel);
          plugin.togglePanel($hiddenPanel);
        }

        // ELSE IF: Button clicked corresponds to a panel that is already open
        else if ($openPanel.attr("data-patch-panel") === $hiddenPanel.attr("data-patch-panel")) {
          plugin.togglePanel($openPanel);
        }

        // ELSE IF: Button clicked corresponds to a different panel and a panel is open
        else if ($openPanel.attr("data-patch-panel") !== $hiddenPanel.attr("data-patch-panel")) {
          plugin.appendPanel($el, $hiddenPanel);
          plugin.togglePanel($openPanel);
          plugin.togglePanel($hiddenPanel);
        }
      });

      plugin.$window.on("resize", function () {
        plugin.debounce( function() {
          var $openPanel = plugin.isPanelOpen();
          if($openPanel) {
            // Prevents resize event from being called on mobile when scrolling
            if(plugin.$window.width() !== plugin.windowWidth){
              $openPanel.toggleClass("open").hide();
            }
          }
        }, 250);
      });
    },

    appendPanel: function ($button, panel) {
      var plugin = this;

      // Stores the current portfolio item object
      var $item = $button.closest(plugin.itemSelector);

      // Stores the index of the current item in relation to the item collection
      var itemIndex = $(plugin.$itemCollection).index($item);

      // Calculates number of items in row by dividing container width by width of item
      var itemsInRow = Math.round(plugin.$container.width() / $item.width());

      // Calculates the number of items that follow the clicked one within the row
      var itemOffset = Math.floor($item.position().left / $item.width()) + 1;

      // Appends the panel at the items current index plus the offset
      $(plugin.$itemCollection[itemIndex + (itemsInRow - itemOffset)]).append().after(panel);
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

    isPanelOpen: function () {
      var $openPanel = $(this.panelSelector + ".open");

      // Returns panel object if a panel is open else returns false
      return $openPanel.length > 0 ? $openPanel : false;
    },

    hideAllPanels: function () {
      $(this.panelSelector).hide();
    },

    togglePanel: function($panel) {
      $panel.toggleClass("open").slideToggle(this.settings.toggleSpeed);
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
