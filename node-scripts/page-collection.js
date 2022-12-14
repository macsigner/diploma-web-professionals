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
        filePrefix: /^([_]?[0-9]*)_/,
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
     * Find specified path in subpages.
     * @param filePath
     * @param collection
     * @returns {*}
     */
    findInPageObjectsFromPath(filePath, collection = this.pages) {
        let obj;
        for (let key of Object.keys(collection)) {
            if (collection[key].sourceFile === filePath) {
                obj = collection[key].pages;

                if (obj) {
                    break;
                }
            }

            if (collection.pages) {
                obj = this.findInPageObjectsFromPath(filePath, collection.pages);

                if (obj) {
                    break;
                }
            }
        }

        return obj;
    }

    /**
     * Get page objects as flat array.
     * @returns {}
     */
    getPageObjects() {
        if (this.pageObjects) {
            return this.pageObjects;
        }

        const files = glob.sync(this._globExpression);
        this.pageObjects = files.map((filePath) => {
            let obj = this._parsePath(filePath);
            let dataObject = this._getPageData(obj);

            obj.data = {};

            if (dataObject) {
                Object.assign(obj.data, dataObject.data);
                obj.data = dataObject.data;
                obj.dataFile = dataObject.dataFile;
            }

            obj.title = this.getPageTitleFromObject(obj);
            obj.url = this._createUniqueUrl(obj);
            obj.public = obj.file.name[0] !== '_';

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
        let pageObj = Array.from(this.pageObjects).find(obj => {
            return obj.sourceFile === filePath;
        });

        pageObj.subpages = this.findInPageObjectsFromPath(filePath);

        return pageObj;
    }

    /**
     * Get page title from page object.
     * @param obj
     * @returns {string|string}
     */
    getPageTitleFromObject(obj) {
        if (obj.data.title) {
            return obj.data.title;
        }

        let filename = this._removePrefixFromPartial(obj.file.name);

        filename = filename.split('_').join(' ').split('-').join(' ');
        filename = filename[0].toUpperCase() + filename.substring(1);

        return filename;
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
        jsonData = this._parseSpecialJsonFields(jsonData);

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

        let urlPath = arrFolders
            .reduce((prev, current) => {
                return prev + '/' + this._removePrefixFromPartial(current);
            }, '');

        urlPath = urlPath.length > 1 ? urlPath + '/' : '/';
        let cleanFilename = this._removePrefixFromPartial(file.name);
        let url = `${urlPath}${cleanFilename}.html`;

        let i = 1;
        while (this._urls.has(url)) {
            url = `${urlPath}${cleanFilename}-${i++}.html`;
        }

        this._urls.add(url);

        return url;
    }

    /**
     * Remove prefix from string for clean urls.
     * @param str
     * @returns {*}
     * @private
     */
    _removePrefixFromPartial(str) {
        return str.replace(this._settings.filePrefix, '');
    }

    /**
     * Parse fields from json data if necessary.
     * @param obj
     * @returns {{date}|*}
     * @private
     */
    _parseSpecialJsonFields(obj) {
        if (obj.date) {
            let date = new Date(obj.date);
            obj.date = {
                datetime: date.toJSON(),
                locale: date.toLocaleDateString('de-CH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
                ),
            };
        }

        return obj;
    }
}

export default PageCollection;
