import * as fs from 'fs';
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
        this._globExpression = globExpression;
        this._urls = new Set();
        this.getPages();
    }

    /**
     * Get nested pages as object.
     * @param globExpression
     * @returns {{}}
     */
    getPages() {
        if (this.pages) {
            return this.pages;
        }

        const filePaths = this.getPageObjects();

        let pageCollection = {};
        for (let page of filePaths) {
            this.pages = this._applyTreeStructure(page, pageCollection);
        }

        return this.pages;
    }

    /**
     * Get page objects as flat array.
     * @returns {{file: ParsedPath, url: *, parents: string[]}[]}
     */
    getPageObjects() {
        if (this.pageObjects) {
            return this.pageObjects;
        }

        const files = glob.sync(this._globExpression);
        this.pageObjects = files.map((filePath) => {
            let obj = this._parsePath(filePath);
            let dataObject = this._getPageData(obj);

            if (dataObject) {
                obj.data = dataObject.data;
                obj.dataFile = dataObject.dataFile;
            }

            obj.url = this._createUniqueUrl(obj);

            return obj;
        });

        return this.pageObjects;
    }

    // Todo: Refactor to include "find" in method name.
    /**
     * Find page object by path.
     * @param filePath
     * @returns {{file: ParsedPath, url: *, parents: string[]}}
     */
    getPageObjectFromPath(filePath) {
        let pageObj = Array.from(this.pageObjects).find(obj => obj.filePath === filePath);

        return pageObj;
    }

    /**
     * Get page data by page object.
     * @param obj
     * @returns {{data: any, dataFile: string}}
     * @private
     */
    _getPageData(obj) {
        let filePath = `${obj.file.dir}/${obj.file.name}.json`;
        if (!fs.existsSync(filePath)) {
            return;
        }

        let buffer = fs.readFileSync(filePath);
        let jsonData = JSON.parse(buffer);

        return {
            dataFile: filePath,
            data: jsonData,
        };
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
        filePath = path.resolve(filePath);

        return {
            url,
            file,
            sourceFile: path.resolve(filePath),
            parents: directoryArray,
            parentDirectoryPath: dir,
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

        // Todo: Shorten if block. Assign key and new object.
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

    /**
     * Create unique url from page object.
     * @param obj
     * @returns {string}
     * @private
     */
    _createUniqueUrl(obj) {
        let filePath = obj.sourceFile;
        let file = path.parse(filePath);
        let arrFolders = file.dir.replace(path.resolve(this._settings.pageRoot), '')
            .replace(/^[/?]/, '')
            .split('/');

        let filePrefix = /^([_]?[0-9]*)_/;
        let urlPath = arrFolders
            .reduce((prev, current) => prev + '/' + current.replace(filePrefix, ''));

        urlPath = '/' + (urlPath ? (urlPath + '/') : '');
        let cleanFilename = file.name.replace(filePrefix, '');
        let url = `${urlPath}${cleanFilename}.html`;

        let i = 1;
        while (this._urls.has(url)) {
            url = `${urlPath}${cleanFilename}-${i++}.html`;
        }

        this._urls.add(url);

        return url;
    }
}

export default PageCollection;
