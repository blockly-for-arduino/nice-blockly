arduinoGenerator.forBlock['arduino_setup'] = function (block) {
  const code = arduinoGenerator.statementToCode(block, 'ARDUINO_SETUP');
  addUserSetup('setup', code)
  return null;
};

arduinoGenerator.forBlock['arduino_loop'] = function (block) {
  const code = arduinoGenerator.statementToCode(block, 'ARDUINO_LOOP');
  addLoop('loop', code)
  return null;
};

arduinoGenerator.forBlock['controls_repeat_ext'] = function (block) {
  let repeats;
  if (block.getField('TIMES')) {
    repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    repeats =
      arduinoGenerator.valueToCode(block, 'TIMES', arduinoGenerator.ORDER_ASSIGNMENT) ||
      '0';
  }
  let branch = arduinoGenerator.statementToCode(block, 'DO');
  branch = arduinoGenerator.addLoopTrap(branch, block);
  let code = '';
  const loopVar =
    arduinoGenerator.nameDB_.getDistinctName('count', 'VARIABLE');
  let endVar = repeats;
  if (!repeats.match(/^\w+$/) && !stringUtils.isNumber(repeats)) {
    endVar =
      arduinoGenerator.nameDB_.getDistinctName('repeat_end', 'VARIABLE');
    code += 'int ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (int ' + loopVar + ' = 0; ' + loopVar + ' < ' + endVar + '; ' +
    loopVar + '++) {\n' + branch + '}\n';
  return code;
};

arduinoGenerator.forBlock['controls_repeat'] = ARDUINO['controls_repeat_ext'];

arduinoGenerator.forBlock['controls_whileUntil'] = function (block) {
  // Do while/until loop.
  const until = block.getFieldValue('MODE') === 'UNTIL';
  let argument0 =
    arduinoGenerator.valueToCode(
      block, 'BOOL',
      until ? arduinoGenerator.ORDER_LOGICAL_NOT : arduinoGenerator.ORDER_NONE) ||
    'false';
  let branch = arduinoGenerator.statementToCode(block, 'DO');
  branch = arduinoGenerator.addLoopTrap(branch, block);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

arduinoGenerator.forBlock['controls_for'] = function (block) {
  // For loop.
  const variable0 = arduinoGenerator.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  // getValue(block,'VAR')

  const argument0 = arduinoGenerator.valueToCode(block, 'FROM', arduinoGenerator.ORDER_ASSIGNMENT) || '0';
  const argument1 = arduinoGenerator.valueToCode(block, 'TO', arduinoGenerator.ORDER_ASSIGNMENT) || '0';
  const increment = arduinoGenerator.valueToCode(block, 'BY', arduinoGenerator.ORDER_ASSIGNMENT) || '1';
  let branch = arduinoGenerator.statementToCode(block, 'DO');
  branch = arduinoGenerator.addLoopTrap(branch, block);
  let code;
  let up = true;
  if (stringUtils.isNumber(argument0) && stringUtils.isNumber(argument1) && stringUtils.isNumber(increment))
    up = Number(argument0) <= Number(argument1);
  else
    if (Number(increment) < 0) up = false;
  code = 'for (' + variable0 + ' = ' + argument0 + '; ' + variable0 +
    (up ? ' <= ' : ' >= ') + argument1 + '; ' + variable0;
  const step = Math.abs(Number(increment));
  if (step === 1) {
    code += up ? '++' : '--';
  } else {
    code += (up ? ' += ' : ' -= ') + step;
  }
  code += ') {\n' + branch + '}\n';
  arduinoGenerator.addVariable(variable0, 'int ' + variable0 + ';')
  return code;
};

arduinoGenerator.forBlock['controls_flow_statements'] = function (block) {
  // Flow statements: continue, break.
  let xfix = '';
  if (arduinoGenerator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += arduinoGenerator.injectId(arduinoGenerator.STATEMENT_PREFIX, block);
  }
  if (arduinoGenerator.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += arduinoGenerator.injectId(arduinoGenerator.STATEMENT_SUFFIX, block);
  }
  if (arduinoGenerator.STATEMENT_PREFIX) {
    const loop = block.getSurroundLoop();
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += arduinoGenerator.injectId(arduinoGenerator.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return xfix + 'break;\n';
    case 'CONTINUE':
      return xfix + 'continue;\n';
  }
  throw Error('Unknown flow statement.');
};
