[![Code Climate](https://codeclimate.com/github/alecortega/patch-panel/badges/gpa.svg)](https://codeclimate.com/github/alecortega/patch-panel)
# Patch Panel

[1]: <https://github.com/alecortega/patch-panel>

Patch Panel makes responsive grid + panel layouts possible by displaying the corresponding panel for an item beneath the row it was clicked, regardless of items per row, width of items, or number of rows.

#### Demo

http://patchpanel.alecortega.com

![alt tag](http://oi61.tinypic.com/sp8axi.jpg)

#### Package Managers

````
// Bower
bower install patch-panel

// NPM
npm install patch-panel
````

#### Settings

| Option | Type | Deault | Description |
|--------|------|--------|-------------|
|buttonSelector | string | '.patch-button' | Changes the selector that triggers the panel animation.|
|itemSelector | string | '.patch-item' | Changes the selector for all child items that make up the grid (items that are shown).|
|panelSelector | string | '.patch-panel' | Changes the selector for all panel items (panels are automatically hidden).|
|toggleSpeed | int | 300 | Changes the speed at which panels are animated.|


#### Initialization Example

```javascript
$(element).patchpanel({
  toggleSpeed: 600
});
```

#### Gotchas

* All elements are automatically hidden upon initialization with jQuery. Since there's a delay between the DOM loading and javascript initializing, the panels may flicker from visible to hidden. You can avoid this by placing the following in your stylesheet:

````javascript
.patch-panel {
  display: none;
}
````

#### Future Updates

* Better handling of events so that only two panels are triggered at any one time.
* Callback events for panel triggered, and panel finished collapsing.
* Handling of items of multiple heights.
* Add super simple stylesheet that adds proper styling.

#### Dependencies

jQuery 2.1

#### License

Copyright (c) 2015 Alec Ortega

Licensed under the MIT license.



