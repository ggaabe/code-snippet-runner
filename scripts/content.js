const buttonStyle = `
display: inline-block;
margin-top: 10px;
border-top: 1px solid #ccc; /* A simple top border as a divider */
padding-top: 10px;
margin-right: 10px;
`;

const toolbarStyle = `
display: flex; 
justify-content: flex-start;; 
background-color:rgba(52,53,65,1);
padding-left: 10px;
padding-right: 10px;
`;

let codeBlockCounter = 0;

setInterval(() => {
  document
    .querySelectorAll(
      "pre code.language-javascript:not([data-run-button-added])"
    )
    .forEach((block) => {
      let blockId = "code-block-" + codeBlockCounter++;
      let toolbar = document.createElement("div");
      toolbar.style = toolbarStyle;
      block.setAttribute("data-block-id", blockId);
      let button = document.createElement("button");
      button.innerText = "Run Code";
      button.style = buttonStyle;
      button.onclick = async function () {
        try {
          let oldLog = console.log;
          let logOutput = "";
          console.log = (output) => (logOutput += output + "\n");
          let code = block.innerText;

          // let func = new Function("return " + code);
          let result = eval(code);
          if (result instanceof Promise) {
            try {
              result = await result;
              console.log(result);
            } catch (error) {
              console.error(error);
            }
          } else {
            console.log(result);
          }
          //eval(block.innerText);

          console.log = oldLog; // restore original console.log function
          logOutput += "\n" + result + "\n";

          // Display the result below the block
          let outputDivId = "output-for-" + blockId;
          let outputDiv = document.getElementById(outputDivId);

          if (!outputDiv) {
            outputDiv = document.createElement("div");
            outputDiv.id = outputDivId; // Set the ID for the output div
            outputDiv.className = "output-div"; // Use a class for styling
            outputDiv.innerText = logOutput;

            block.parentElement.appendChild(outputDiv);
          } else {
            outputDiv.innerText = logOutput;
          }
        } catch (e) {
          console.error(e);
        }
      };
      // block.parentElement.appendChild(button);
      toolbar.appendChild(button); // Append the button to the toolbar

      let editButton = document.createElement("button");
      editButton.innerText = "Edit Code";
      editButton.style = buttonStyle;
      editButton.onclick = function () {
        block.contentEditable = "true";
        block.focus();
      };

      toolbar.appendChild(editButton); // Append the edit button to the toolbar

      block.parentElement.appendChild(toolbar);

      block.setAttribute("data-run-button-added", "");
    });
}, 1000);
