import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import * as Blockly from 'blockly/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfigService } from '../core/services/config.service';
// import { initArduinoGenerator } from './arduino/arduino';
import { PromptComponent } from './prompt/prompt.component';
import { NewVarModalComponent } from './new-var-modal/new-var-modal.component';
import { BlocklyService } from './blockly.service';
import { initArduinoGenerator } from './generator/arduino';

@Component({
  selector: 'clz-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements OnInit {

  // @ViewChild('blocklyDiv') blocklyDiv: any;

  code: string;
  generator: Blockly.Generator;

  get workspace() {
    return this.blocklyService.workspace;
  }

  set workspace(value) {
    this.blocklyService.workspace = value;
  }

  @Output() public codeChange: EventEmitter<string> = new EventEmitter<string>();

  defaultJsonStr = `{
    "dependencies": {
    },
    "blocks": {
      "languageVersion": 0, "blocks": [
        { "type": "arduino_setup", "id": "arduino_setup_id0", "x": 30, "y": 30 },
        { "type": "arduino_loop", "id": "arduino_loop_id0", "x": 330, "y": 30 }
      ]
    }
  }`

  constructor(
    private blocklyService: BlocklyService,
    private configService: ConfigService,
    private modal: NzModalService,
    // private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.replacePrompt()
  }

  ngAfterViewInit(): void {
    this.configService.loaded.subscribe(async (state) => {
      if (state) {
        // console.log('config loaded');
        this.init()
      }
    })
    this.blocklyService.reinit.subscribe(async (state) => {
      if (state) {
        this.reinit()
      }
    })
  }

  async init() {
    this.generator = initArduinoGenerator()
    await this.blocklyService.init()

    this.workspace.addChangeListener(event => this.onWorkspaceChange(event))

    this.rewtireFunc()
    this.loadTempData()

    this.updateCode()
  }

  onWorkspaceChange(event) {
    if (event instanceof Blockly.Events.BlockMove ||
      event instanceof Blockly.Events.BlockDelete ||
      event instanceof Blockly.Events.BlockChange ||
      event instanceof Blockly.Events.VarRename
    ) {
      this.updateCode()
      this.save();
    }
  }

  updateCode() {
    // this.code = this.generator.workspaceToCode(this.workspace);
    // this.codeChange.emit(this.code);
  }

  loadTempData() {
    let temp = localStorage.getItem('temp');
    let tempJson;
    if (temp == null)
      tempJson = JSON.parse(this.defaultJsonStr)
    else
      tempJson = JSON.parse(temp);
    this.loadJson(tempJson);
  }

  loadDefaultData() {
    let tempJson = JSON.parse(this.defaultJsonStr)
    this.loadJson(tempJson)
  }

  save() {
    let datajson = Blockly.serialization.workspaces.save(this.workspace)
    localStorage.setItem('temp', JSON.stringify(datajson))
  }

  getJson() {
    let datajson = Blockly.serialization.workspaces.save(this.workspace)
    datajson["dependencies"] = {}
    return JSON.stringify(datajson)
  }

  loadJson(json) {
    // console.log(json);
    Blockly.serialization.workspaces.load(json, this.workspace)
  }

  reinit() {
    if (typeof this.workspace !== 'undefined')
      this.workspace.dispose();
    this.init();
  }

  // electron用不了Prompt，这里替换成ng组件
  replacePrompt() {
    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
      this.modal.create({
        nzTitle: message,
        nzWidth: '300px',
        nzContent: PromptComponent,
        nzData: {
          value: defaultValue
        },
        nzOnOk: e => {
          callback(e.value)
        }
      })
    });
  }

  // 重写blockly核心函数
  rewtireFunc() {
    this.workspace.registerButtonCallback('CREATE_VARIABLE', (button) => {
      console.log('CREATE_VARIABLE');
      Blockly.Variables.createVariableButtonHandler(this.workspace, () => {
        console.log('变量创建成功');
      }, 'b4aVariable')
    });
    this.workspace.registerButtonCallback('CREATE_OBJECT', (button) => {
      console.log('CREATE_OBJECT');

    });

    Blockly.Variables.createVariableButtonHandler = (workspace, opt_callback, opt_type) => {
      let modal = this.modal.create({
        nzTitle: '添加变量',
        nzWidth: '350px',
        nzContent: NewVarModalComponent,
        nzData: {
          varType: opt_type
        },
        nzOnOk: (e) => {
          if (opt_callback)
            opt_callback(e.varName);
        }
      })
      modal.triggerOk
    };

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

}

