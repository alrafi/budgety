var budgetController = (function() {
  // some code
})();

var UIController = (function() {
  // some code
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(UICtrl, budgetCtrl) {
  var DOM = UICtrl.getDOMStrings();

  var ctrlAddItem = function() {
    // 1. get the field input
    var input = UICtrl.getInput();
    console.log(input);
    // 2. add the budget item into the budget controller
    // 3. add the item to the UI
    // 4. calculate the budget
    // 5. display updated budget to the UI
    console.log('it works');
  };

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(UIController, budgetController);
