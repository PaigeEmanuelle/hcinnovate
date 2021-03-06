/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Python for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

//goog.provide('Blockly.Python.math');

goog.require('Blockly.JavaScript');


// If any new block imports any library, add that library name here.
Blockly.JavaScript.addReservedWords('math,random,Number');

// Blockly.JavaScript['create_scatterplot'] = function(block) {
//   var value_test_number = Blockly.JavaScript.valueToCode(block, 'test_number', Blockly.JavaScript.ORDER_ATOMIC);
//   // TODO: Assemble Python into code variable.
//   var code = 'print("Scatterplot created")';
//   return code;
// };

Blockly.JavaScript['create_scatterplot_2'] = function(block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('test_number'), Blockly.Variables.NAME_TYPE);
  var value_test_number = Blockly.JavaScript.valueToCode(block, 'test_number', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = variable_name;//'print("New scatterplot created")';
  return code;
};


