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
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const filesize = require('filesize');
const isFile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = yield fs.lstat(input);
    return stat.isFile();
});
// find image under folder
const findImages = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const basenames = yield fs.readdir(input);
    const test = /(.png|.jpg|.jpeg)$/;
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
        else if (test.test(_path)) {
            images.push(_path);
        }
    }
    return images;
});
const compressFile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const dirname = path.dirname(input);
    const stat = yield fs.stat(input);
    const size = stat.size;
    console.log(`start compress ${input}...`);
    console.log(`file size: ${filesize(size, { round: 0 })}`);
    yield imagemin([input], {
        destination: dirname,
        plugins: [imageminPngquant(), imageminMozjpeg()]
    });
    const newStat = yield fs.stat(input);
    const newSize = newStat.size;
    console.log(`after compress file size: ${filesize(newSize, { round: 0 })}`);
    const compressPercent = getCompressPercent(size, newSize);
    console.log(`after compress reduce: ${compressPercent}`);
    console.log(`compress ${input} success`);
});
const getCompressPercent = (size, newSize) => {
    return `${((size - newSize) / size * 100).toFixed(2)}%`;
};
const compress = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const targetIsFile = yield isFile(input);
    if (targetIsFile) {
        compressFile(input);
    }
    else {
        const images = yield findImages(input);
        for (let i = 0; i < images.length; i++) {
            const imageFile = images[i];
            yield compressFile(imageFile);
        }
    }
});
exports.default = compress;
//# sourceMappingURL=compress.js.map