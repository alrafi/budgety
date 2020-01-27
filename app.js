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

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: 0
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
    },

    calculateBudget: function() {
      // calculate total income and expense
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage
      if (data.totals.inc > data.totals.exp) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    deleteItem: function(type, ID) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(ID);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    getDOMStrings: function() {
      return DOMStrings;
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;

      if (type === 'exp') {
        element = DOMStrings.expenseContainer;

        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>
        <div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'inc') {
        element = DOMStrings.incomeContainer;

        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>
        <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete">
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></<div></div></div>`;
      }

      // replace text on html with real data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDelItem);
  };

  var updateBudget = function() {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return the budget
    var budget = budgetCtrl.getBudget();

    // 2. display updated budget to the UI
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    // 1. get the field input
    var input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. add the budget item into the budget controller
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3. add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. clear the fields
      UICtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();
    }
  };

  var ctrlDelItem = function(event) {
    var itemID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    console.log(itemID);

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      console.log(ID);

      // delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // delete item on UI
      UICtrl.deleteListItem(itemID);

      // update budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log('application is running');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListener();
    }
  };
})(UIController, budgetController);

controller.init();
