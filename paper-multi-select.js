Polymer({
  is: 'paper-multi-select',

  behaviors: [
    Polymer.IronFormElementBehavior,
  ],

  properties: {
    /** Label to be displayed on the trigger. */
    label: {
      type: String,
    },

    /** Value of the component. */
    value: {
      type: String,
    },

    /** Items that will be used to populate the options/chips. */
    chips: {
      type: Array,
    },
  },

  /** Triggers the selector field. */
  trigger: function() {
    this.$.dialog.open();
  },

  /** @override */
  ready: function() {
    this.state = {};
  },

  /**
   * Filters the items based on the input text or checkbox state of the item.
   * @param {string} val Value of the input textbox.
   * @return {boolean} Whether or not to populate after filter.
   * @private
   */
  filter_: function(val) {
    return function(item) {
      if (!val) {
        return true;
      }

      if (!item) {
        return false;
      }

      var arr = Object.keys(this.state).filter(x => x == item);
      if (arr.length > 0) {
        return true;
      }

      val = val.toLowerCase();
      item = item.toLowerCase();
      return (item && ~item.indexOf(val));
    }.bind(this);
  },

  /**
   * Updates the state of the checkbox on toggling.
   * @param {Event} e Event that triggered this.
   * @private
   */
  toggleItemState_: function(e) {
    if (e.target.checked) {
      this.state[e.target.value] = 1;
    } else {
      delete this.state[e.target.value];
    }
  },

  /**
   * @param {string} item Checkbox value.
   * @return {boolean} State of the checkbox.
   * @private
   */
  fetchState_: function(item) {
    return (item in this.state);
  },

  /**
   * Updates the value of the component based on the selection.
   * @private
   */
  updateValues_: function() {
    selectedChips = this.querySelectorAll('.chip[checked]');
    this.renderChips_(selectedChips);
    var updatedValues = [];
    for (var i = 0; i < selectedChips.length; i++) {
      updatedValues.push(selectedChips[i].value);
    }
    this.value = updatedValues.join(',');
  },

  /**
   * Renders the information based on the selection.
   * @param {Array} items Items to be used for rendering.
   * @private
   */
  renderChips_: function(items) {
    var totalItems = items.length;
    var leadClues = [];
    for (var i = 0; i < totalItems; i++) {
      leadClues.push(items[i].value);
      if (i == 1) {
        break;
      }
    }

    var infoSnippet = '';
    var moreString = '';
    infoSnippet += leadClues.join(', ');
    if (totalItems == 1) {
      moreString = ' has been selected';
    } else if (totalItems > 2) {
      moreString = ' +' + (totalItems - 2) + ' more item(s) selected';
    } else if (totalItems != 0) {
      moreString = ' have been selected';
    }

    this.$['lead-string'].innerText = infoSnippet;
    this.$['more-string'].innerText = moreString;
  }
});