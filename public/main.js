
const list = document.getElementById("todo-list");
const input_list = document.getElementById("input-list");
const howManyLeft = document.getElementById('how-many-left');

const server = 'http://localhost:3000/api';
const urlForGetAllRequest = server + '/tasks';

let getAllResponse = 0;
                                                                //clearCompleted пока не работает
const sendRequest = () => {
  return fetch(urlForGetAllRequest).then(response => {
    if (response.ok) {
      return (response.json());
    } else {
      throw new Error('Request failed');
    }
  }, networkError => console.log(networkError.message));
}

sendRequest().then(data => {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    let li1 = 0; 
    if (data[i].active === 1) {
      View.incrementActiveCounter();
      li1 = Controller.createNewListItem(data[i].content);
      let checkbx = Controller.createCheckboxForLi(li1);
      Controller.createDeleteButtonForLi(li1);
    }
    if (data[i].active === 0) {
      li1 = Controller.createNewCompletedListItem(data[i].content);
      li1.firstElementChild.style.opacity = '0.2';
      li1.firstElementChild.style.textDecoration = 'line-through';
      let checkbx = Controller.createCheckboxForLi(li1);
      checkbx.checked = true;

      Controller.createDeleteButtonForLi(li1);
    }
    li1.id = data[i].id;
    console.log(li1.id);
    li1.firstChild.addEventListener('change', () => {
      console.log('inputValue= ' + li1.firstChild.value);
     fetch(urlForGetAllRequest + '/' + li1.id + '?content=' + li1.firstChild.value, {
       method: 'PUT',
     })
 })
  }
}).catch(err => console.log(err));





const Model = {
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
    },
  },
  pushNewActiveTask(task) {
    this.Cards.all.push(task); // здесь вместо task сделать объект с полем task. В другом месте в этот объект будем пихать id. Потом по этому id будем удалять и изменять необходимые элементы.
    this.Cards.active.push(task);
  },
  pushNewCompletedTask(task) {
    this.Cards.all.push(task);
    this.Cards.completed.push(task);
  }

}

const View = {
  incrementActiveCounter() {
    Model.Cards.activeCounter++;
    howManyLeft.innerHTML = Model.Cards.activeCounter;
  },
  decrementActiveCounter() {
    Model.Cards.activeCounter--;
    howManyLeft.innerHTML = Model.Cards.activeCounter;
  },
  renderNewListItem(taskText) {
    let inp = taskText;
    input_list.value = '';
    let li1 = document.createElement('li');
    list.appendChild(li1);
    let innerInput = document.createElement('input')
    innerInput.className = "edit";
    innerInput.type = "text"
    innerInput.value = inp;
    li1.appendChild(innerInput);
    
   
    //li1.innerHTML = `<input class="edit" type="text" value="${inp}">` //${inp}<p>`; 
    return li1;
  }
}

const Controller = {
  createNewListItem(taskText) {
    const li1 = View.renderNewListItem(taskText);
    
    Model.pushNewActiveTask(li1);
    return li1;
  },

  createNewCompletedListItem(taskText) {
    const li1 = View.renderNewListItem(taskText);
    Model.pushNewCompletedTask(li1);
    return li1;
  },

  createCheckboxForLi(li1) {                                   // Это не MVC, но пока так
    let checkbx = document.createElement('input');
    checkbx.type = 'checkbox';
    checkbx.className = 'checkbx';
    li1.appendChild(checkbx);
    checkbx.addEventListener('change', () => {
      if (checkbx.checked) {
        Model.Cards.completed.push(li1);
        Model.Cards.active.splice(Model.Cards.active.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '0.2';
        li1.firstElementChild.style.textDecoration = 'line-through';
        View.decrementActiveCounter();
        
        fetch(urlForGetAllRequest + '/' + li1.id + '?active=false', {
          method: 'PUT',
        })

      } else {
        Model.Cards.active.push(li1);
        Model.Cards.completed.splice(Model.Cards.completed.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '1';
        li1.firstElementChild.style.textDecoration = 'none';
        View.incrementActiveCounter();

        fetch(urlForGetAllRequest + '/' + li1.id + '?active=true', {
          method: 'PUT',
        })
      }

    })
    return checkbx;
  },

  createDeleteButtonForLi(li1) {
    let button1 = document.createElement('button');
    li1.appendChild(button1);
    button1.className = 'del-but';
    //button1.innerText = 'del';
    button1.addEventListener('click', () => {
      if (li1.childNodes[2].checked) {
        Model.Cards.all.splice(Model.Cards.all.indexOf(li1), 1);
        Model.Cards.completed.splice(Model.Cards.completed.indexOf(li1), 1); // может она не попала в completed? вроде, попала

      } else {
        Model.Cards.all.splice(Model.Cards.all.indexOf(li1), 1);
        Model.Cards.active.splice(Model.Cards.active.indexOf(li1), 1);
        View.decrementActiveCounter();
      }

      
      fetch(urlForGetAllRequest + '/' + li1.id, {
        method: 'DELETE', 
      });

      

      li1.remove();

    })
  }
}

// одна из идей - создать в controller функцию создания checkbox со встроенным eventlistener

input_list.addEventListener("keydown", (event) => {

  if (event.code === "Enter") {
    View.incrementActiveCounter();
    const li1 = Controller.createNewListItem(input_list.value); // li1 - new created item
    let checkbx = Controller.createCheckboxForLi(li1);
    Controller.createDeleteButtonForLi(li1);

    //console.log(li1);
    
    
    fetch(urlForGetAllRequest, {
      method: 'POST',
      body: JSON.stringify({                          //зачем нужен json stringify?
        text: li1.firstElementChild.value
      }),
      headers: {'Content-Type': 'application/json'} 
    }) .then( (res) => {
      console.log(res);
      return res.json();
    
    }) .then(data => {
      li1.id = data.id;
     }) 

     li1.firstChild.addEventListener('change', () => {
       console.log('inputValue= ' + li1.firstChild.value);
      fetch(urlForGetAllRequest + '/' + li1.id + '?content=' + li1.firstChild.value, {
        method: 'PUT',
      })
  })
 
}
});

const buttonAll = document.createElement('button');
buttonAll.innerText = 'All';
buttonAll.classList.add('but-all', 'btnclicked');
const buttonActive = document.createElement('button');
buttonActive.innerText = 'Active';
const buttonCompleted = document.createElement('button');
buttonCompleted.innerText = 'Completed';
const buttonClearCompleted = document.createElement('button');
buttonClearCompleted.innerText = 'Clear Completed';
buttonClearCompleted.classList.add('clear-compl'); // добавляю класс ClearCompl
const tableFooter = document.getElementById('table-footer');
tableFooter.appendChild(buttonAll);
tableFooter.appendChild(buttonActive);
tableFooter.appendChild(buttonCompleted);
tableFooter.appendChild(buttonClearCompleted);

buttonAll.addEventListener('click', () => {
  for (let i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (let i = 0; i < Model.Cards.all.length; i++) {
    list.appendChild(Model.Cards.all[i]);
  }
  buttonAll.classList.add('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonActive.addEventListener('click', () => {
  for (let i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (let i = 0; i < Model.Cards.active.length; i++) {
    list.appendChild(Model.Cards.active[i]);
  }
  buttonActive.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
});

buttonCompleted.addEventListener('click', () => {
  for (let i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (let i = 0; i < Model.Cards.completed.length; i++) {
    list.appendChild(Model.Cards.completed[i]);
  }
  buttonCompleted.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonClearCompleted.addEventListener('click', () => {
  for (let i = list.children.length - 1; i > 0; i--) {
    list.children[i].remove();
  }
  for (let i = 0; i < Model.Cards.active.length; i++) {
    list.appendChild(Model.Cards.active[i]);
  }
  // перед этим из массива all нужно убрать все приколы, которые есть и здесь
  Model.Cards._all = Model.Cards.all.filter(obj => {
    return (Model.Cards.completed.indexOf(obj) === -1);
  })
  for(let i = 0; i < Model.Cards.completed.length; i++) {
    console.log(Model.Cards.completed[i])
    fetch(urlForGetAllRequest + '/' + Model.Cards.completed[i].id, {
      method: 'DELETE'
    })
  }

  Model.Cards._completed = [];
});

