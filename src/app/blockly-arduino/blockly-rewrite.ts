// 重写blockly函数
import * as Blockly from 'blockly/core';

export class CustomCategory extends Blockly.ToolboxCategory {
    // cssConfig_
    /**
     * Constructor for a custom category.
     * @override
     */
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }

    // 自定义toolbox category的icon
    override createIconDom_() {
        // console.log(this.cssConfig_['icon']);
        let toolboxIcon
        if (this.cssConfig_['icon'].includes('http://') || this.cssConfig_['icon'].includes('https://')) {
            toolboxIcon = document.createElement('img');
            toolboxIcon.src = this.cssConfig_['icon'];
            toolboxIcon.style.width = '32px';
            toolboxIcon.style.height = '32px';
        } else {
            toolboxIcon = document.createElement('i');
            Blockly.utils.dom.addClass(toolboxIcon, this.cssConfig_['icon']);
        }

        return toolboxIcon;
    }
}

// 重写blockly核心函数
export function rewtireFunc() {
    // this.workspace.registerButtonCallback('CREATE_VARIABLE', (button) => {
    //   console.log('CREATE_VARIABLE');
    //   Blockly.Variables.createVariableButtonHandler(this.workspace, () => {
    //     console.log('变量创建成功');
    //   }, 'b4aVariable')
    // });
    // this.workspace.registerButtonCallback('CREATE_OBJECT', (button) => {
    //   console.log('CREATE_OBJECT');

    // });

    // Blockly.Variables.createVariableButtonHandler = (workspace, opt_callback, opt_type) => {
    //   let modal = this.modal.create({
    //     nzTitle: '添加变量',
    //     nzWidth: '350px',
    //     nzContent: NewVarModalComponent,
    //     nzData: {
    //       varType: opt_type
    //     },
    //     nzOnOk: (e) => {
    //       if (opt_callback)
    //         opt_callback(e.varName);
    //     }
    //   })
    //   modal.triggerOk
    // };

    // Blockly.Variables.flyoutCategoryBlocks = function (workspace) {
    //   let variableModelList = []
    //   VAR_TYPE.forEach(item => {
    //     variableModelList = variableModelList.concat(workspace.getVariablesOfType(item.value))
    //   })

    //   let xmlList: any[] = [];
    //   if (variableModelList.length > 0) {
    //     // New variables are added to the end of the variableModelList.
    //     const mostRecentVariable = variableModelList[variableModelList.length - 1];
    //     // if (Blocks['variables_set']) {
    //     const block = Blockly.utils.xml.createElement('block');
    //     block.setAttribute('type', 'variables_set');
    //     block.setAttribute('gap', '8');
    //     block.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
    //     xmlList.push(block);
    //     // }
    //     // if (Blocks['variables_get']) {
    //     variableModelList.sort(Blockly.VariableModel.compareByName);
    //     for (let i = 0, variable; (variable = variableModelList[i]); i++) {
    //       const block = Blockly.utils.xml.createElement('block');
    //       block.setAttribute('type', 'variables_get');
    //       block.setAttribute('gap', '8');
    //       block.appendChild(Blockly.Variables.generateVariableFieldDom(variable));
    //       xmlList.push(block);
    //     }
    //     // }
    //   }
    //   return xmlList;
    // };

    // Blockly.FieldVariable.dropdownCreate = function () {
    //   if (!this.variable_) {
    //     throw Error(
    //       'Tried to call dropdownCreate on a variable field with no' +
    //       ' variable selected.');
    //   }
    //   const name = this.getText();
    //   let variableModelList: any[] = [];
    //   if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    //     const variableTypes = this.getVariableTypes_();
    //     // Get a copy of the list, so that adding rename and new variable options
    //     // doesn't modify the workspace's list.
    //     for (let i = 0; i < variableTypes.length; i++) {
    //       const variableType = variableTypes[i];
    //       const variables = this.sourceBlock_.workspace.getVariablesOfType(variableType);
    //       variableModelList = variableModelList.concat(variables);
    //     }
    //   }
    //   variableModelList.sort(Blockly.VariableModel.compareByName);

    //   const options: any[] = [];
    //   for (let i = 0; i < variableModelList.length; i++) {
    //     // Set the UUID as the internal representation of the variable.
    //     options[i] = [variableModelList[i].name, variableModelList[i].getId()];
    //   }
    //   options.push([Blockly.Msg['RENAME_VARIABLE'], 'RENAME_VARIABLE_ID']);
    //   if (Blockly.Msg['DELETE_VARIABLE']) {
    //     options.push([Blockly.Msg['DELETE_VARIABLE'].replace('%1', name), 'DELETE_VARIABLE_ID']);
    //   }
    //   options.push(['新建变量', 'CREATE_VARIABLE_ID']);
    //   return options;
    // };

    // @ts-ignore
    Blockly.FieldVariable.prototype.onItemSelected_ = function (menu, menuItem) {
        const id = menuItem.getValue();
        // Handle special cases.
        if (this.sourceBlock_ && this.sourceBlock_.workspace) {
            if (id === 'RENAME_VARIABLE_ID') {
                // Rename variable.
                Blockly.Variables.renameVariable(this.sourceBlock_.workspace, (this.variable_));
                return;
            } else if (id === 'DELETE_VARIABLE_ID') {
                // Delete variable.
                this.sourceBlock_.workspace.deleteVariableById(this.variable_.getId());
                return;
            } else if (id === 'CREATE_VARIABLE_ID') {
                // console.log('CREATE_VARIABLE_ID');
                let workspace = this.sourceBlock_.workspace;
                let selectedValueType = workspace.getVariableById(this.getValue()).type;
                console.log(selectedValueType);

                Blockly.Variables.createVariableButtonHandler(workspace,
                    (text) => {
                        let variable = workspace.getVariable(text, selectedValueType);
                        this.setValue(variable.getId());
                    }, selectedValueType);
                return;
            }
        }
        // Handle unspecial case.
        this.setValue(id);
    };
}

// electron用不了Prompt，这里替换成ng组件
export function replacePrompt() {
    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
        this.modal.create({
            nzTitle: message,
            nzWidth: '300px',
            // nzContent: PromptComponent,
            nzData: {
                value: defaultValue
            },
            nzOnOk: e => {
                callback(e.value)
            }
        })
    });
}