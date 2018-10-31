'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const clipboardy = require('clipboardy');
const debounce = require('debounce');
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.getPath', () => {
        var onSelect = vscode.window.onDidChangeTextEditorSelection(debounce((event) => {
            clipboardy.writeSync(generateTextToCopy(event));
            vscode.window.showInformationMessage('Path has been copied to clipboard');
            onSelect.dispose();
        }, 300));
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function generateTextToCopy(event) {
    let eol = event.textEditor.document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';
    var text = event.selections.map(selection => event.textEditor.document.getText(selection)).join(eol);
    var closingCounter = 0;
    for (var i = event.selections[0].start.line; i >= 0; i--) {
        var line = event.textEditor.document.lineAt(i);
        if (line.text.indexOf('{') > 0) {
            if (closingCounter > 0) {
                closingCounter--;
            }
            else if (line.text.indexOf('"') >= 0) {
                var start = line.text.indexOf('"');
                var end = line.text.indexOf('"', start + 1);
                var key = line.text.slice(start + 1, end);
                text = key + '.' + text;
            }
        }
        else if (line.text.indexOf('}') >= 0) {
            closingCounter++;
        }
    }
    return text;
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map