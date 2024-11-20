import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import * as Blockly from 'blockly/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfigService } from '../core/services/config.service';
import { BlocklyService } from './blockly.service';
import { PromptComponent } from '../blockly/prompt/prompt.component';
import { DEFAULT_SAVE, DEFAULT_TOOLBOX } from './config';

@Component({
  selector: 'nice-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss'],
  standalone: true,
  imports: []
})
export class NiceBlocklyComponent implements OnInit {

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

  constructor(
    private blocklyService: BlocklyService,
    private configService: ConfigService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.blocklyService.init();
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
      tempJson = JSON.parse(JSON.stringify(DEFAULT_SAVE))
    else
      tempJson = JSON.parse(temp);
    this.loadJson(tempJson);
  }

  loadDefaultData() {
    let tempJson = JSON.parse(JSON.stringify(DEFAULT_SAVE))
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
    // this.init();
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

}

