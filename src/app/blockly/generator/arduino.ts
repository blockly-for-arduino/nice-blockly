// import {ArduinoGenerator} from './arduino/arduino_generator';
// // import * as lists from './arduino/lists';
// import * as logic from './arduino/logic';
// import * as loops from './arduino/loops';
// import * as math from './arduino/math';
// import * as procedures from './arduino/procedures';
// import * as text from './arduino/text';
// import * as variables from './arduino/variables';
// import * as variablesDynamic from './arduino/variables_dynamic';

// export * from './arduino/arduino_generator';

// /**
//  * Arduino code generator instance.
//  * @type {!ArduinoGenerator}
//  */
// export const arduinoGenerator = new ArduinoGenerator();

// // Install per-block-type generator functions:
// const generators: typeof arduinoGenerator.forBlock = {
//   // ...lists,
//   ...logic,
//   ...loops,
//   ...math,
//   ...procedures,
//   ...text,
//   ...variables,
//   ...variablesDynamic,
// };
// for (const name in generators) {
//   arduinoGenerator.forBlock[name] = generators[name];
// }
import * as Blockly from 'blockly';

export function initArduinoGenerator() {
  const arduinoGenerator = new Blockly.Generator('ARDUINO');
  // 暴露给全局对象，用以添加库时使用
  window['ArduinoGenerator'] = arduinoGenerator;
  let ArduinoCodeStack = {};
  // window['ARDUINO'] = arduinoGenerator.forBlock;
  // window['STATEMENT_TO_CODE'] = arduinoGenerator.statementToCode;
  arduinoGenerator.addReservedWords(
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
    'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
    'detachInterrupt,interrupts,noInterrupts'
  );

  arduinoGenerator.init = (workspace) => {
    // 宏定义  
    ArduinoCodeStack['macros'] = Object.create(null);
    // 库引用
    ArduinoCodeStack['libraries'] = Object.create(null);
    // 变量
    ArduinoCodeStack['variables'] = Object.create(null);
    // 对象
    ArduinoCodeStack['objects'] = Object.create(null);
    // 函数
    ArduinoCodeStack['functions'] = Object.create(null);
    // setup
    ArduinoCodeStack['setups'] = Object.create(null);
    // 用户自定义setup
    ArduinoCodeStack['userSetups'] = Object.create(null);
    // loop
    ArduinoCodeStack['loops'] = Object.create(null);
  }

  arduinoGenerator.scrubNakedValue = function (line) {
    return line + ';\n';
  };

  window['addMacro'] = (tag, code) => {
    if (ArduinoCodeStack['macros'][tag] === undefined) {
      ArduinoCodeStack['macros'][tag] = code;
    }
  };

  window['addLibrary'] = (tag, code) => {
    if (ArduinoCodeStack['libraries'][tag] === undefined) {
      ArduinoCodeStack['libraries'][tag] = code;
    }
  };

  window['addVariable'] = (tag, code) => {
    if (ArduinoCodeStack['variables'][tag] === undefined) {
      ArduinoCodeStack['variables'][tag] = code;
    }
  };

  window['addObject'] = (tag, code) => {
    if (ArduinoCodeStack['objects'][tag] === undefined) {
      ArduinoCodeStack['objects'][tag] = code;
    }
  };

  window['addFunction'] = (tag, code) => {
    if (ArduinoCodeStack['functions'][tag] === undefined) {
      ArduinoCodeStack['functions'][tag] = code;
    }
  };

  window['addSetup'] = (tag, code) => {
    if (ArduinoCodeStack['setups'][tag] === undefined) {
      ArduinoCodeStack['setups'][tag] = code;
    }
  };

  window['addUserSetup'] = (tag, code) => {
    if (ArduinoCodeStack['userSetups'][tag] === undefined) {
      ArduinoCodeStack['userSetups'][tag] = code;
    }
  };

  window['addLoop'] = (tag, code) => {
    if (ArduinoCodeStack['loops'][tag] === undefined) {
      ArduinoCodeStack['loops'][tag] = code;
    }
  };


  return arduinoGenerator;
}

export const VAR_TYPE = [
  { name: 'int', value: 'int' },
  { name: 'long', value: 'long' },
  { name: 'float', value: 'float' },
  { name: 'double', value: 'double' },
  { name: 'char', value: 'char' },
  { name: 'String', value: 'String' },
  { name: 'boolean', value: 'boolean' }
]