Blockly.JavaScript['initiate_drawing'] = function(block) {
  var code = `
  canvas = document.createElement("CANVAS");
  canvas.setAttribute("id", "myCanvas");
  canvas.setAttribute("style", "border:1px solid #000000;")
  canvas.setAttribute("width", "400")
  canvas.setAttribute("height", "400")
  div = document.getElementById('canvas-cont');
  div.innerHTML = "";
  div.appendChild(canvas);
  canvas = new fabric.Canvas('myCanvas');
  TOP = canvas.height/2;
  LEFT = canvas.width/2;
  DEGREE = -180;
  COLOR = 'red';
  LINEWIDTH = 1;
  
  \n`;
  return code;
};

Blockly.JavaScript['width'] = function(block) {
  var number_name = block.getFieldValue('WIDTH');
  // TODO: Assemble JavaScript into code variable.
  var code = `
  LINEWIDTH = ` + number_name +`
  \n`;
  return code;
};

Blockly.JavaScript['setcolor'] = function(block) {
  var colour_color = block.getFieldValue('COLOR');
  // TODO: Assemble JavaScript into code variable.
  
  var code = `
  COLOR = '` + colour_color + `'
  \n`;
  return code;
};

Blockly.JavaScript['turn'] = function(block) {
  var dropdown_way = block.getFieldValue('WAY');
  var value_name = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);

  if (dropdown_way=="RIGHT") {
    var code = `
    DEGREE -= ` + value_name + `
      \n`;

  } else  {
    var code = `
    DEGREE += ` + value_name + `
      \n`;

  }
 
  return code;
};

Blockly.JavaScript['move'] = function(block) {
  var dropdown_way = block.getFieldValue('WAY');
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `//STEP
  var actualdegree = DEGREE%360
  var cosine = Math.cos(actualdegree * Math.PI/180);
  var adj = cosine * (`+value_value+`+1);
  var sinus =  Math.sin(actualdegree * Math.PI/180);
  var opp = sinus * (`+value_value+`+1);
`
  if (dropdown_way=="FORWARD") {
    code += `

    var x = adj + TOP;
    var y = opp + LEFT;
  `
  } else {
    code += `
    var x = TOP - adj;
    var y = LEFT - opp;
  `
  }
  
code+=`
console.log("qweqwe", [LEFT, TOP, y, x])
  var line = new fabric.Line([LEFT, TOP, y, x], {
      fill: COLOR,
      stroke: COLOR,
      strokeWidth: LINEWIDTH,
      selectable: false,
      evented: false,
    });
    canvas.add(line);
    LEFT = y
    TOP = x
  //var line`+ (+new Date).toString()+` = new fabric.lineTo(x, y);
  \n`;
  return code;
};

Blockly.JavaScript['drawcircle'] = function(block) {
  var number_radius = block.getFieldValue('radius');
  var dropdown_color = block.getFieldValue('color');
  // TODO: Assemble JavaScript into code variable.
  var text = `
	  var rect = new fabric.Circle({
	    left: TOP,
	    top: RIGHT,
	    fill: '`+ dropdown_color + `',
	    radius: ` + number_radius + `
	  });
	  canvas.add(rect);
  `;

  var code = text + '\n';
  return code;
};



Blockly.Blocks['initiate_drawing'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("initiate");
    this.setNextStatement(true, null);
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['setcolor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set color");
    this.appendDummyInput()
        .appendField(new Blockly.FieldColour("#ff0000"), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['width'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("line width");
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), "WIDTH");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("turn");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["right","RIGHT"], ["left","LEFT"]]), "WAY");
    this.appendDummyInput()
        .appendField("by");
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['move'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["forward","FORWARD"], ["backward","BACKWARD"]]), "WAY");
    this.appendDummyInput()
        .appendField("by");
    this.appendValueInput("VALUE")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['drawcircle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Radius")
        .appendField(new Blockly.FieldNumber(0), "radius");
    this.appendDummyInput()
        .appendField("Color")
        .appendField(new Blockly.FieldDropdown([["White","white"], ["Yellow","yellow"], ["Red","red"], ["Blue","blue"], ["Green","green"]]), "color");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("circle");
 this.setHelpUrl("");
  }
};
