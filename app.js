// BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, descripton, value) {
    this.id = id;
    this.description = descripton;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // create a new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      // push into data
      data.allItems[type].push(newItem);

      return newItem;
    },

    getData: function() {
      return data;
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  // some code
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
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
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;

      if (type === 'exp') {
        element = DOMStrings.expenseContainer;

        html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>
        <div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>
        <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete">
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></<div></div></div>`;
      }

      // replace text on html with real data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

    // 2. add the budget item into the budget controller
    var newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );

    // 3. add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    // 4. calculate the budget
    // 5. display updated budget to the UI
  };

  return {
    init: function() {
      console.log('application is running');
      setupEventListener();
    }
  };
})(UIController, budgetController);

controller.init();
