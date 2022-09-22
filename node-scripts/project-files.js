import * as path from 'path';
import glob from 'glob';

/**
 * Handle file collections.
 */
class ProjectFiles {
    getPages() {
        const arr = glob.sync(`src/pages/**/*.js`).map((item) => {

        });

        console.log(arr);

        return arr;
    }

    _parsePath(filePath) {
        let file = path.parse(filePath);

        console.log(file);

        return {
            path: filePath,
            file
        }
    }
}

export default new ProjectFiles();
