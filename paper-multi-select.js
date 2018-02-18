import { Element, html } from '../../node_modules/@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '../../node_modules/@polymer/polymer/lib/legacy/class.js';
import '../../node_modules/@polymer/polymer/polymer.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-styles/color.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { IronButtonState } from '../../node_modules/@polymer/iron-behaviors/iron-button-state.js';
import { IronControlState } from '../../node_modules/@polymer/iron-behaviors/iron-control-state.js';
import { IronFormElementBehavior } from '../../node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import { IronValidatableBehavior } from '../../node_modules/@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import { PaperInputBehavior} from '../../node_modules/@polymer/paper-input/paper-input-behavior.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

/*
`<paper-multi-select>`

Polymer element that helps in multi selection of elements in
the form. Populates the `paper-input` based on searchable selection of options using
`paper-dialog`.

### Styling

 Custom property | Description | Default
----------------|-------------|----------
`--paper-multi-select` | Mixin to style the host element | `{}`
`--paper-multi-select-checkbox` | Mixin to style the checkbox | `{}`
`--paper-multi-select-info` | Mixin to style the info container | `{}`
`--paper-multi-select-more-text` | Mixin to style the more text | `{}`
`--paper-multi-select-disabled-text` | Mixin to style the disabled more text | `{}`
`--paper-multi-select-dialog` | Mixin to style the dialog | `{}`
`--paper-multi-select-dialog-elements` | Mixin to style all the elements within paper-dialog | `{}`
`--paper-multi-select-icon-suffix` | Mixin to style the iron-icon suffix | `{}`
`--paper-multi-select-buttons-container` | Mixin to style the button container on paper-dialog | `{}`
`--paper-multi-select-lead-string` | Mixin to style the lead string | `{}`
`--paper-multi-select-more-string` | Mixin to style the more string following the lead string | `{}`

@demo demo/index.html
*/


/**
 * 
 * @customElement
 * @polymer
 * @appliesMixin Polymer.PaperMultiSelect
 * @demo demo Sandbox snippet
 */
class PaperMultiSelect extends mixinBehaviors([
    IronButtonState,
    IronControlState,
    IronFormElementBehavior,
    IronValidatableBehavior], 
  Element) 
  {

  static get template() {
    return html`
  <style>
    :host {
      display: block;
      min-width: 300px;
      --paper-input-container-focus-color: var(--paper-green-500);
      @apply(--paper-multi-select);
    }

    paper-checkbox {
      flex-grow: 1;
      flex-basis: 100px;
      --paper-checkbox-checked-color: var(--paper-green-500);
      --paper-checkbox-checked-ink-color: var(--paper-green-500);
      --paper-checkbox-unchecked-color: var(--paper-green-900);
      --paper-checkbox-unchecked-ink-color: var(--paper-green-900);
      --paper-checkbox-label-spacing: 1px;
      --paper-checkbox-margin: 8px;
      @apply(--paper-multi-select-checkbox);
    }

    #info {
      cursor: pointer;
      font-size: 12px;
      @apply(--paper-multi-select-info);
    }

    #info #moreString {
      color: var(--paper-green-500);
      text-decoration: underline;
      @apply(--paper-multi-select-more-text);
    }

    span[disabled] {
      opacity: 0.33;
      @apply(--paper-multi-select-disabled-text);
    }

    #dialog {
      --paper-dialog-color: var(--paper-green-900);
      --paper-dialog-button-color: var(--paper-green-900);
      max-width: 300px;
      @apply(--paper-multi-select-dialog);
    }

    paper-dialog-scrollable {
      --paper-dialog-scrollable: {
        display: flex;
        flex-wrap: wrap;     
        flex-grow: 1;
        flex-basis: 1;
      }
      @apply(--layout-vertical);
    }

    paper-dialog  > * {
      margin-top: 10px;
      @apply(--paper-multi-select-dialog-elements);
    }

    iron-icon[suffix] {
      color: var(--paper-green-900);
      opacity: .8;
      @apply(--paper-multi-select-icon-suffix);
    }

    .buttons {
      @apply(--paper-multi-select-buttons-container);
    }

    paper-button {
      @apply(--paper-multi-select-button);
    }
    paper-button[dialog-confirm] {
      @apply(--paper-multi-select-button-dialog-confirm);
    }
    .lead-string {
      @apply(--paper-multi-select-lead-string);
    }
    .more-string {
      color: var(--paper-green-500);
      text-decoration: underline;
      @apply(--paper-multi-select-more-string);
    }
  </style>
  
  <paper-input
    type="text"
    invalid="[[invalid]]"
    readonly
    disabled="[[disabled]]"
    value="[[selectedItemLabel]]"
    placeholder="[[placeholder]]"
    error-message="[[errorMessage]]"
    always-float-label="[[alwaysFloatLabel]]"
    no-label-float="[[noLabelFloat]]"
    label="[[label]]"
    on-tap="trigger">
    <iron-icon icon="more-horiz" suffix></iron-icon>
  </paper-input>
  <span disabled$="[[disabled]]" id="info" on-tap="trigger">
      <span class="lead-string" inner-h-t-m-l="[[_leadString]]"></span>
      <span class="more-string" inner-h-t-m-l="[[_moreString]]"></span>
  </span>

  <paper-dialog id="dialog" no-overlap horizontal-align="left" vertical-align="top">
    <paper-input
    id="search-item"
    label="Choose {{label}}"
    type="text"
    value="{{filterVal}}">
    <iron-icon icon="search" prefix></iron-icon>
    </paper-input>

    <paper-dialog-scrollable id="scrollable-elements">
    <template is="dom-repeat" items="{{chips}}" filter="{{_filter(filterVal)}}">
        <paper-checkbox
        class="chip"
        on-change="_toggleItemState"
        value="{{getValue(item)}}">
        {{getName(item)}}
        </paper-checkbox>
    </template>

    </paper-dialog-scrollable>
    
    <div class="buttons">
    <paper-button dialog-dismiss>Cancel</paper-button>
    <paper-button dialog-confirm on-tap="_updateValues">Update</paper-button>
    </div>
  </paper-dialog>
`;
  }

  static get is() {
    return 'paper-multi-select';
  }

  static get properties() {
    return {
      /** The derived "label" of the currently selected item. */
      selectedItemLabel: {
        type: String,
        notify: true
      },

      /** List of selected items */
      selectedItems: {
        type: Array,
        notify: true
      },

      /** The label for the dropdown. */
      label: String,

      /** The placeholder for the dropdown. */
      placeholder: String,

      /** The error message to display when invalid. */
      errorMessage: String,

      /** Set to true to disable the floating label. */
      noLabelFloat: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /** Set to true to always float the label. */
      alwaysFloatLabel: {
        type: Boolean,
        value: false
      },

      /** Items that will be used to populate the options/chips. */
      chips: Array,

      /** Value that will be used to filter the items on the dialog. */
      filterVal: String,
      _leadString: String,
      _moreString: String
    };
  }

  static get observers() {
    return [
      '_setItemLabel(selectedItems, selectedItems.*)',
      '_setSelectedItems(selectedItems)'
    ];
  }

  /** Triggers the selector field. */
  trigger() 
  {
    if (this.disabled) return;

    const {selectedItems} = this;
    if (selectedItems) {
      const chips = this.shadowRoot.querySelectorAll('.chip');
      for (const chip of chips) {
        chip.checked = this.selectedItems.includes(chip.value);
      }
    }
    this.$.dialog.open();
  }

  /** @override */
  ready() {
    super.ready();
    this.state = {};
  }

  /**
   * set paper input label when there are preselected items, only on page load
   * @param {Array} selected pre selected items
   * @private
   */
  _setItemLabel(selected) {
    this.set('selectedItemLabel', selected.join(', '));
  }

  /**
   * set selection text when there are preselected items, only on page load
   * @param {Array} selected pre selected items
   * @private
   */
  _setSelectedItems(selected) {
    const chips = [];
    for (const item of selected) {
      chips.push({value: item});
    }
    this._renderChips(chips);
  }

  getValue(i) {
    if(typeof i === 'object') return i.value;
    return i;
  }
  getName(i) {
    if(typeof i === 'object') return i.name;
    return i;
  }

  /**
   * Filters the items based on the input text or checkbox state of the item.
   * @param {string} val Value of the input textbox.
   * @return {boolean} Whether or not to populate after filter.
   * @private
   */
  _filter(val) {
    return function (item) {
      if (!val) {
        return true;
      }

      if (!item) {
        return false;
      }

      const arr = Object.keys(this.state).filter(x => x === item);

      if (arr.length > 0) {
        return true;
      }

      val = val.toLowerCase();
      if(typeof item === 'object')
      {
        return (item && item.name.toLowerCase().indexOf(val) !== -1);
      }
      item = item.toLowerCase();
      return (item && item.indexOf(val) !== -1);
    }.bind(this);
  }

  /**
   * Updates the state of the checkbox on toggling.
   * @param {Event} e Event that triggered this.
   * @private
   */
  _toggleItemState(e) {
    if (e.target.checked) {
      this.state[e.target.value] = 1;
    } else {
      delete this.state[e.target.value];
    }
  }

  /**
   * Updates the value of the component based on the selection.
   * @private
   */
  _updateValues() {
    const selectedChips = this.shadowRoot.querySelectorAll('.chip[checked]');

    //reset selection string
    this._leadString = '';
    this._moreString = '';

    this._renderChips(selectedChips);
    var selectedItems = [];
    for (const chip of selectedChips) {
      selectedItems.push(chip.value);
    }
    this.set('selectedItems', selectedItems);
  }

  /**
   * Renders the information based on the selection.
   * @param {Array} items Items to be used for rendering.
   * @private
   */
  _renderChips(items) {
    const totalItems = items.length;
    if (totalItems === 0) return;
    const leadClues = [];
    for (const [index, item] of items.entries()) {
      leadClues.push(item.value);
      if (index === 1) {
        break;
      }
    }
    this._leadString = '';
    this._leadString += leadClues.join(', ');
    if (totalItems === 1) {
      this._moreString = ' has been selected';
    } else if (totalItems > 2) {
      this._moreString = ' +' + (totalItems - 2) + ' more item(s) selected';
    } else if (totalItems !== 0) {
      this._moreString = ' have been selected';
    }
  }
}

customElements.define(PaperMultiSelect.is, PaperMultiSelect);
