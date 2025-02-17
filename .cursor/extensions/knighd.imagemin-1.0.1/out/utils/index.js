"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const isFile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = yield fs.lstat(input);
    return stat.isFile();
});
exports.isFile = isFile;
const isImage = (path) => {
    const reg = /(.png|.jpg|.jpeg)$/;
    return reg.test(path);
};
exports.isImage = isImage;
// find image under folder
const findImages = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const basenames = yield fs.readdir(input);
    if (!basenames || basenames.length === 0) {
        return [];
    }
    let images = [];
    for (let i = 0; i < basenames.length; i++) {
        const basename = basenames[i];
        const _path = `${input}/${basename}`;
        const pathIsFile = yield isFile(_path);
        if (!pathIsFile) {
            // if this is a folder then go on find image
            const subImages = yield findImages(_path);
            images = [...images, ...subImages];
        }
        else if (isImage(_path)) {
            images.push(_path);
        }
    }
    return images;
});
exports.findImages = findImages;
const getCompressPercent = (size, newSize) => {
    return `${((size - newSize) / size * 100).toFixed(2)}%`;
};
exports.getCompressPercent = getCompressPercent;
// replace oldFile to newFile
const replaceFile = (oldFile, newFile) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.remove(oldFile);
    yield fs.rename(newFile, oldFile);
});
exports.replaceFile = replaceFile;
//# sourceMappingURL=index.js.map