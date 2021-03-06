// Comment this out?
    var demoWorkspace = Blockly.inject('blocklyDiv',
        {media: '../../media/',
         toolbox: document.getElementById('toolbox')});
    Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'),
                               demoWorkspace);

    // Exit is used to signal the end of a script.
    Blockly.JavaScript.addReservedWords('exit');

    var outputArea = document.getElementById('textOutputDiv'); //was 'output before', to a text area
    var runButton = document.getElementById('runButton');
    var myInterpreter = null;
    var runner;

    function initApi(interpreter, scope) {
      // Add an API function for the alert() block, generated for "text_print" blocks.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        outputArea.value = outputArea.value + '\n' + text;
      };
      interpreter.setProperty(scope, 'alert',
          interpreter.createNativeFunction(wrapper));

      // Add an API function for the prompt() block.
      var wrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
      };
      interpreter.setProperty(scope, 'prompt',
          interpreter.createNativeFunction(wrapper));

      // Add an API for the wait block.  See wait_block.js
      initInterpreterWaitForSeconds(interpreter, scope);

      // Add an API function for highlighting blocks.
      var wrapper = function(id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
      };
      interpreter.setProperty(scope, 'highlightBlock',
          interpreter.createNativeFunction(wrapper));
    }

    var highlightPause = false;
    var latestCode = '';

    function highlightBlock(id) {
      demoWorkspace.highlightBlock(id);
      highlightPause = true;
    }

    function resetStepUi(clearOutput) {
      //demoWorkspace.highlightBlock(null);
      highlightPause = false;
      //runButton.disabled = '';

      if (clearOutput) {
        outputArea.value = 'Program output:\n=================';
      }
    }

    function generateCodeAndLoadIntoInterpreter() {
      // Generate JavaScript code and parse it.
      Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
      Blockly.JavaScript.addReservedWords('highlightBlock');
      latestCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

      resetStepUi(true);
    }

    function resetInterpreter() {
      myInterpreter = null;
      if (runner) {
        clearTimeout(runner);
        runner = null;
      }
    }

    function runCode() {
      if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi(true);
        //runButton.disabled = 'disabled';

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function() {
          alert('Ready to execute the following code\n' +
            '===================================\n' +
            latestCode);

          // Begin execution
          highlightPause = false;
          myInterpreter = new Interpreter(latestCode, initApi);
          runner = function() {
            if (myInterpreter) {
              var hasMore = myInterpreter.run();
              if (hasMore) {
                // Execution is currently blocked by some async call.
                // Try again later.
                setTimeout(runner, 10);
              } else {
                // Program is complete.
                outputArea.value += '\n\n<< Program complete >>';
                resetInterpreter();
                resetStepUi(false);
              }
            }
          };
          runner();
        }, 1);
        return;
      }
    }

    // Load the interpreter now, and upon future changes.
    generateCodeAndLoadIntoInterpreter();
    demoWorkspace.addChangeListener(function(event) {
      if (!(event instanceof Blockly.Events.Ui)) {
        // Something changed. Parser needs to be reloaded.
        resetInterpreter();
        generateCodeAndLoadIntoInterpreter();
      }
    });
