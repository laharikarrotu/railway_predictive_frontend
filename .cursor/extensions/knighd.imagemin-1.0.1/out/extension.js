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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const ImageMin_1 = require("./ImageMin");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.imagemin', (node, nodes) => __awaiter(this, void 0, void 0, function* () {
        if (!node && (!nodes || nodes.length === 0)) {
            return;
        }
        let inputs = [];
        if (nodes && nodes.length) {
            // multi select
            inputs = nodes.map((_node) => _node.path);
        }
        else {
            inputs = [node.path];
        }
        const outputChannel = vscode.window.createOutputChannel('imagemin');
        const replaceOriginImage = vscode.workspace
            .getConfiguration()
            .get('imagemin.replaceOriginImage');
        const imagemin = new ImageMin_1.default(inputs, outputChannel, {
            replaceOriginImage
        });
        yield imagemin.process();
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map