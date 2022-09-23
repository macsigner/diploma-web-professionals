import * as path from 'path';
import glob from 'glob';

/**
 * Page collection.
 */
class PageCollection {
    /**
     * Construct.
     * @param globExpression
     * @param options
     */
    constructor(globExpression, options = {
        pageRoot: 'src/pages',
    }) {
        this._settings = options;
        this.pages = this.getPages(globExpression);
    }

    /**
     * Get nested pages as object.
     * @param globExpression
     * @returns {{}}
     */
    getPages(globExpression) {
        const files = glob.sync(globExpression);
        const filePaths = files.map((filePath) => this._parsePath(filePath));

        let pageCollection = {};
        for (let page of filePaths) {
            pageCollection = this._applyTreeStructure(page, pageCollection);
        }

        return pageCollection;
    }

    /**
     * Create page object from path.
     * @param filePath
     * @returns {{file: ParsedPath, url: *, parents: string[]}}
     * @private
     */
    _parsePath(filePath) {
        let dir = path.dirname(filePath);
        dir = dir.replace(`${this._settings.pageRoot}`, '');

        let directoryArray = dir.split('/');
        directoryArray.shift();
        let file = path.parse(filePath);
        let url = filePath.replace(this._settings.pageRoot, '');

        return {
            url,
            file,
            parents: directoryArray,
        };
    }

    /**
     * Apply tree structure to object from page object.
     * @param item
     * @param obj
     * @returns {{}}
     * @private
     */
    _applyTreeStructure(item, obj = {}) {
        if (!obj.pages) {
            obj.pages = {};
        }

        if (item.parents.length === 0 || (item.parents.length === 1 && item.parents[0] === item.file.name)) {
            delete item.parents;

            item.type = 'page';

            obj.pages[item.file.name] = obj.pages[item.file.name] ? obj.pages[item.file.name] : {};

            obj.pages[item.file.name] = Object.assign(obj.pages[item.file.name], item);
        } else {
            let key = item.parents.shift();

            obj.pages[key] = obj.pages[key] ? obj.pages[key] : {};

            obj.pages[key] = Object.assign(obj.pages[key], this._applyTreeStructure(item, obj.pages[key]));
        }

        if (!item.type) {
            item.type = 'folder';
        }

        return obj;
    }
}

export default PageCollection;
