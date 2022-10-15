/**
 * Customizable select menu.
 */
class CustomSelect {
    /**
     * Construct.
     * @param el
     */
    constructor(el) {
        this.select = el;

        this.customSelect = document.createElement('dl');
        this.current = document.createElement('dt');
        this.customOptions = document.createElement('dd');
        this.customSelect.appendChild(this.current);
        this.customSelect.appendChild(this.customOptions);

        this.menu = this._createListFromItem(this.select);
        this.customOptions.appendChild(this.menu);

        this.customSelect.setAttribute('tabindex', this.select.tabIndex);

        if (this.select.nextElementSibling) {
            this.select.parentNode.insertBefore(this.customSelect, this.select.nextElementSibling);
        } else {
            this.select.parentNode.appendChild(this.customSelect);
        }
    }

    /**
     * Create unordered list from node.
     * @param el
     * @returns {*}
     * @private
     */
    _createListFromItem(el, indexPrefix = '') {
        let children = Array.from(el.children);
        let list = document.createElement('ul');

        children.forEach((child, i) => {
            let listItem = document.createElement('li');
            listItem.dataset.index = indexPrefix + i;

            if (child.tagName.toLowerCase() === 'optgroup') {
                listItem.innerHTML = child.label;

                listItem.appendChild(this._createListFromItem(child, i + '-'));
            } else {
                listItem.dataset.value = child.value;
                listItem.innerHTML = child.innerHTML;
            }

            list.appendChild(listItem);
        });

        return list;
    }
}

export default CustomSelect;
