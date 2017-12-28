/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Provide help text to the user.
browser.omnibox.setDefaultSuggestion({
  description: `Get results for math queries (e.g. 5 * 9 = 45)`
});

// Update suggestions with user input
browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
  // Need to create an array, even though we're only gonna have 1 answer
  var suggestion = [];
  answer = calculate(text);
  result = answer.toString();
  // Suggestions gotta be objects, 'cause why not?
  suggestion.push({content: result, description: result})
  addSuggestions(suggestion);
});

/*
 * This code from https://stackoverflow.com/a/6482814/8373676
 *
 * Credit to vol7ron, thanks :)
 *
 * Code initially under CC BY-SA 3.0 as per SO's submission policy
 */

// Define calculating function
function calculate(input) {

  // Define operators
  var operators = {
    add: '+',
    sub: '-',
    div: '/',
    mlt: '*',
    mod: '%',
    exp: '^'
  };

  /*
   * Create array for Order of Operation and precedence
   * This works by checking in chunks by the nested arrays.
   * Ex: epx and mod come before mult/div, which are before
   * add/sub.  However, order within these nested arrays is
   * irrelivant.
   */
  operators.ooo = [
    [
      [operators.exp],
      [operators.mod],
    ],
    [
      [operators.div],
      [operators.mlt]
    ],
    [
      [operators.add],
      [operators.sub]
    ]
  ];

  // Clean up unnecessary characters
  input = input.replace(/[^0-9%^*\/()\-+.]/g, '');

  var output;

  // Loop to find operators from the input
  for (var i = 0, n = operators.ooo.length; i < n; i++) {

    // Regular Expression to look for operators between floating numbers or integers
    var re = new RegExp('(\\d+\\.?\\d*)([\\' + operators.ooo[i].join('\\') + '])(\\d+\\.?\\d*)');
    re.lastIndex = 0; // take precautions and reset re starting pos

    // Loop while there is still calculation for level of precedence
    while (re.test(input)) {
      output = _calculate(RegExp.$1, RegExp.$2, RegExp.$3);
      if (isNaN(output) || !isFinite(output))
        return output; // exit early if not a number
      input = input.replace(re, output);
    }
  }

  // This is the string of operators (I think)
  return output;

  // This part does the actual calculating
  function _calculate(a, op, b) {
    // Not sure what this is for ¯\_(ツ)_/¯
    a = a * 1;
    b = b * 1;
    // Switch for executing operations
    switch (op) {
      case operators.add:
        return a + b;
        break;
      case operators.sub:
        return a - b;
        break;
      case operators.div:
        return a / b;
        break;
      case operators.mlt:
        return a * b;
        break;
      case operators.mod:
        return a % b;
        break;
      case operators.exp:
        return Math.pow(a, b);
        break;
      default:
        null;
    }
  }
}
