
var list = document.getElementById("todo-list");
var input_list = document.getElementById("input-list");
var howManyLeft = document.getElementById('how-many-left');

var server = 'http://localhost:3000/api';
var urlForGetAllRequest = server + '/tasks';

var getAllResponse = 0;
//clearCompleted пока не работает
var sendRequest = function sendRequest() {
  return fetch(urlForGetAllRequest).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed');
    }
  }, function (networkError) {
    return console.log(networkError.message);
  });
};

sendRequest().then(function (data) {
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    var li1 = 0;
    if (data[i].active === 1) {
      View.incrementActiveCounter();
      li1 = Controller.createNewListItem(data[i].content);
      var checkbx = Controller.createCheckboxForLi(li1);
      Controller.createDeleteButtonForLi(li1);
    }
    if (data[i].active === 0) {
      li1 = Controller.createNewCompletedListItem(data[i].content);
      li1.firstElementChild.style.opacity = '0.2';
      li1.firstElementChild.style.textDecoration = 'line-through';
      var _checkbx = Controller.createCheckboxForLi(li1);
      _checkbx.checked = true;

      Controller.createDeleteButtonForLi(li1);
    }
    li1.id = data[i].id;
    console.log(li1.id);
  }
}).catch(function (err) {
  return console.log(err);
});

var Model = {
  Cards: {
    activeCounter: 0,
    _all: [],
    _active: [],
    _completed: [],
    get all() {
      return this._all;
    },
    get active() {
      return this._active;
    },
    get completed() {
      return this._completed;
    }
  },
  pushNewActiveTask: function pushNewActiveTask(task) {
    this.Cards.all.push(task); // здесь вместо task сделать объект с полем task. В другом месте в этот объект будем пихать id. Потом по этому id будем удалять и изменять необходимые элементы.
    this.Cards.active.push(task);
  },
  pushNewCompletedTask: function pushNewCompletedTask(task) {
    this.Cards.all.push(task);
    this.Cards.completed.push(task);
  }
};

var View = {
  incrementActiveCounter: function incrementActiveCounter() {
    Model.Cards.activeCounter++;
    howManyLeft.innerHTML = Model.Cards.activeCounter;
  },
  decrementActiveCounter: function decrementActiveCounter() {
    Model.Cards.activeCounter--;
    howManyLeft.innerHTML = Model.Cards.activeCounter;
  },
  renderNewListItem: function renderNewListItem(taskText) {
    var inp = taskText;
    input_list.value = '';
    var li1 = document.createElement('li');
    list.appendChild(li1);
    li1.innerHTML = "<p>" + inp + "<p>";

    return li1;
  }
};

var Controller = {
  createNewListItem: function createNewListItem(taskText) {
    var li1 = View.renderNewListItem(taskText);
    Model.pushNewActiveTask(li1);
    return li1;
  },
  createNewCompletedListItem: function createNewCompletedListItem(taskText) {
    var li1 = View.renderNewListItem(taskText);
    Model.pushNewCompletedTask(li1);
    return li1;
  },
  createCheckboxForLi: function createCheckboxForLi(li1) {
    // Это не MVC, но пока так
    var checkbx = document.createElement('input');
    checkbx.type = 'checkbox';
    checkbx.className = 'checkbx';
    li1.appendChild(checkbx);
    checkbx.addEventListener('change', function () {
      if (checkbx.checked) {
        Model.Cards.completed.push(li1);
        Model.Cards.active.splice(Model.Cards.active.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '0.2';
        li1.firstElementChild.style.textDecoration = 'line-through';
        View.decrementActiveCounter();

        fetch(urlForGetAllRequest + '/' + li1.id + '?active=false', {
          method: 'PUT'
        });
      } else {
        Model.Cards.active.push(li1);
        Model.Cards.completed.splice(Model.Cards.completed.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '1';
        li1.firstElementChild.style.textDecoration = 'none';
        View.incrementActiveCounter();

        fetch(urlForGetAllRequest + '/' + li1.id + '?active=true', {
          method: 'PUT'
        });
      }
    });
    return checkbx;
  },
  createDeleteButtonForLi: function createDeleteButtonForLi(li1) {
    var button1 = document.createElement('button');
    li1.appendChild(button1);
    button1.className = 'del-but';
    //button1.innerText = 'del';
    button1.addEventListener('click', function () {
      if (li1.childNodes[2].checked) {
        Model.Cards.all.splice(Model.Cards.all.indexOf(li1), 1);
        Model.Cards.completed.splice(Model.Cards.completed.indexOf(li1), 1); // может она не попала в completed? вроде, попала
      } else {
        Model.Cards.all.splice(Model.Cards.all.indexOf(li1), 1);
        Model.Cards.active.splice(Model.Cards.active.indexOf(li1), 1);
        View.decrementActiveCounter();
      }

      fetch(urlForGetAllRequest + '/' + li1.id, {
        method: 'DELETE'
      });

      li1.remove();
    });
  }
};

// одна из идей - создать в controller функцию создания checkbox со встроенным eventlistener

input_list.addEventListener("keydown", function (event) {

  if (event.code === "Enter") {
    View.incrementActiveCounter();
    var li1 = Controller.createNewListItem(input_list.value); // li1 - new created item
    var checkbx = Controller.createCheckboxForLi(li1);
    Controller.createDeleteButtonForLi(li1);

    //console.log(li1);


    fetch(urlForGetAllRequest, {
      method: 'POST',
      body: JSON.stringify({ //зачем нужен json stringify?
        text: li1.firstElementChild.innerHTML
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      console.log(res);
      return res.json();
    }).then(function (data) {
      li1.id = data.id;
    });
  }
});

var buttonAll = document.createElement('button');
buttonAll.innerText = 'All';
buttonAll.classList.add('but-all', 'btnclicked');
var buttonActive = document.createElement('button');
buttonActive.innerText = 'Active';
var buttonCompleted = document.createElement('button');
buttonCompleted.innerText = 'Completed';
var buttonClearCompleted = document.createElement('button');
buttonClearCompleted.innerText = 'Clear Completed';
buttonClearCompleted.classList.add('clear-compl'); // добавляю класс ClearCompl
var tableFooter = document.getElementById('table-footer');
tableFooter.appendChild(buttonAll);
tableFooter.appendChild(buttonActive);
tableFooter.appendChild(buttonCompleted);
tableFooter.appendChild(buttonClearCompleted);

buttonAll.addEventListener('click', function () {
  for (var i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (var _i = 0; _i < Model.Cards.all.length; _i++) {
    list.appendChild(Model.Cards.all[_i]);
  }
  buttonAll.classList.add('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonActive.addEventListener('click', function () {
  for (var i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (var _i2 = 0; _i2 < Model.Cards.active.length; _i2++) {
    list.appendChild(Model.Cards.active[_i2]);
  }
  buttonActive.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
});

buttonCompleted.addEventListener('click', function () {
  for (var i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (var _i3 = 0; _i3 < Model.Cards.completed.length; _i3++) {
    list.appendChild(Model.Cards.completed[_i3]);
  }
  buttonCompleted.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonClearCompleted.addEventListener('click', function () {
  for (var i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (var _i4 = 0; _i4 < Model.Cards.active.length; _i4++) {
    list.appendChild(Model.Cards.active[_i4]);
  }
  // перед этим из массива all нужно убрать все приколы, которые есть и здесь
  Model.Cards._all = Model.Cards.all.filter(function (obj) {
    return Model.Cards.completed.indexOf(obj) === -1;
  });
  for (var _i5 = 0; _i5 < Model.Cards.completed.length; _i5++) {
    console.log(Model.Cards.completed[_i5]);
    fetch(urlForGetAllRequest + '/' + Model.Cards.completed[_i5].id, {
      method: 'DELETE'
    });
  }

  Model.Cards._completed = [];
});