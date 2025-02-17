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
const utils_1 = require("./utils");
class ImageMin {
    constructor(inputs, outputChannel, options) {
        this.compressFile = (input) => __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.isImage(input)) {
                return;
            }
            const stat = yield fs.stat(input);
            const size = stat.size;
            this.outputChannel.show();
            this.outputChannel.appendLine(`start compress ${input}...`);
            this.outputChannel.appendLine(`file size: ${filesize(size, { round: 0 })}`);
            const [{ data }] = yield imagemin([input], {
                plugins: [imageminPngquant(), imageminMozjpeg()]
            });
            const extName = path.extname(input);
            const destinationPath = input.replace(extName, `.min${extName}`);
            yield fs.writeFile(destinationPath, data);
            const newStat = yield fs.stat(destinationPath);
            let newSize = newStat.size;
            if (newSize >= size) {
                // 无优化/负优化
                yield utils_1.replaceFile(destinationPath, input);
                newSize = size;
            }
            this.outputChannel.appendLine(`after compress file size: ${filesize(newSize, { round: 0 })}`);
            const compressPercent = utils_1.getCompressPercent(size, newSize);
            this.outputChannel.appendLine(`after compress reduce: ${compressPercent}`);
            this.outputChannel.appendLine(`compress ${input} success`);
            if (this.options.replaceOriginImage) {
                yield utils_1.replaceFile(input, destinationPath);
            }
        });
        this.compress = (input) => __awaiter(this, void 0, void 0, function* () {
            try {
                const targetIsFile = yield utils_1.isFile(input);
                if (targetIsFile) {
                    yield this.compressFile(input);
                }
                else {
                    this.outputChannel.appendLine(`start compress ${input}...`);
                    const images = yield utils_1.findImages(input);
                    for (let i = 0; i < images.length; i++) {
                        const imageFile = images[i];
                        yield this.compressFile(imageFile);
                    }
                    this.outputChannel.appendLine(`compress ${input} successful`);
                }
            }
            catch (error) {
                this.outputChannel.appendLine(error.toString());
            }
        });
        this.process = () => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.inputs.length; i++) {
                const input = this.inputs[i];
                yield this.compress(input);
            }
        });
        this.inputs = inputs;
        this.outputChannel = outputChannel;
        this.options = options;
    }
}
exports.default = ImageMin;
//# sourceMappingURL=ImageMin.js.map