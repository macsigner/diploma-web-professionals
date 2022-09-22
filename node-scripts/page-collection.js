import * as path from 'path';
import {fileURLToPath} from 'url';
import * as fs from 'fs';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Handle file collections.
 */
class PageCollection {
    constructor(globExpression, options = {
        pageRoot: 'src/pages'
    }) {
        this._settings = options;
        this.pages = this.getPages(globExpression);

        console.log(this.pages);
    }

    getPages(globExpression) {
        const files = glob.sync(globExpression);

        this.pages = files.map((filePath) => this._parsePath(filePath));

        let pageCollection = [];
        for(let page of this.pages) {
            pageCollection.push(this._applyTreeStructure(page));
        }

        return this.pages;
    }

    _parsePath(filePath) {
        let dir = path.dirname(filePath);
        dir = dir.replace(`${this._settings.pageRoot}/`, '');

        let directoryArray = dir.split('/');
        let file = path.parse(filePath);
        let url = filePath.replace(this._settings.pageRoot, '');

        return {
            url,
            file,
            parents: directoryArray,
            parentsString: directoryArray.join(','),
        }
    }

    _applyTreeStructure(item) {
        return item;
    }
}

export default PageCollection;
