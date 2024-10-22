import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ArduinoCliService } from '../core/services/arduino-cli.service';


@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule,
    NzIconModule
  ],
  exports: [
    ShellComponent
  ],
  providers: [
    ArduinoCliService
  ]
})
export class ShellModule { }
