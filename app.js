// BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, descripton, value) {
    this.id = id;
    this.description = descripton;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id;
    this.description;
    this.value;
  };

  var Data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
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
  var setupEventListener = function() {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

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

  return {
    init: function() {
      console.log('application is running');
      setupEventListener();
    }
  };
})(UIController, budgetController);

controller.init();
