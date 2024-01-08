const vscode = require('vscode');

// 默认高亮样式
const kaipuHighlight = {
	name: "Kaipu Tag Hightlight",
	scope: ["entity.name.tag.html.kaipu.tag"],
	settings: {
		foreground: "#53aee2",
		fontStyle: "italic underline"
	}
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// 监听设置更改事件
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('kaipu.injectTagHighlightToSetting')) {
			if (getCurrentHighlightStatus()) {
				injectHighlight();
			} else {
				removeHighlight();
			}
		}
	}));

	// 注册命令
	context.subscriptions.push(vscode.commands.registerCommand('inject-tag-highlight-to-setting.kaipu', () => {
		
		if (!getCurrentHighlightStatus()) {
			return;
		}

		injectHighlight();
	}));

	// 自动执行
	vscode.commands.executeCommand('inject-tag-highlight-to-setting.kaipu');
}

// This method is called when your extension is deactivated
function deactivate() {
	return;
	// WIP: 卸载时，清除高亮样式
	const globalConfig = vscode.workspace.getConfiguration();
	const value = globalConfig.get('editor.tokenColorCustomizations');

	if (value['textMateRules']?.length) {
		value['textMateRules'] = value['textMateRules'].filter(item => item.name !== kaipuHighlight.name);
	}

	globalConfig.update('editor.tokenColorCustomizations', value, vscode.ConfigurationTarget.Global);

	console.log('卸载 kaipu tag 高亮成功');
}

/**
 * 注入高亮样式
 */
function injectHighlight() {
	const globalConfig = vscode.workspace.getConfiguration();
	const value = globalConfig.get('editor.tokenColorCustomizations');

	if (!value['textMateRules']) {
		value['textMateRules'] = [];
	} else {
		value['textMateRules'] = value['textMateRules'].filter(item => item.name !== kaipuHighlight.name);
	}
	value['textMateRules'].push(kaipuHighlight);

	globalConfig.update('editor.tokenColorCustomizations', value, vscode.ConfigurationTarget.Global);

	console.log('注入 kaipu tag 高亮成功');
}

/**
 * 清除高亮样式
 */
function removeHighlight() {
	const globalConfig = vscode.workspace.getConfiguration();
	const value = globalConfig.get('editor.tokenColorCustomizations');

	if (value['textMateRules']?.length) {
		value['textMateRules'] = value['textMateRules'].filter(item => item.name !== kaipuHighlight.name);
	}

	globalConfig.update('editor.tokenColorCustomizations', value, vscode.ConfigurationTarget.Global);

	console.log('清除 kaipu tag 高亮成功');
}

/**
 * 获取当前配置状态
 */
function getCurrentHighlightStatus(){
	return vscode.workspace.getConfiguration().get('kaipu.injectTagHighlightToSetting');
}

module.exports = {
	activate,
	deactivate
};