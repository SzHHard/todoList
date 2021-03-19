var list = document.getElementById("todo-list");
var input_list = document.getElementById("input-list");


let Cards = {
  _all: [],
  _active: [],
  _completed: [],
  get all(){
    return this._all;
  },
  get active(){
    return this._active;
  },
  get completed(){
    return this._completed;
  },
};



let doneCounter = 0;
const howManyLeft = document.getElementById('how-many-left');

input_list.addEventListener("keydown", (event) => {
  
  if (event.code === "Enter") {
    doneCounter++;
    howManyLeft.innerHTML = doneCounter;
    let inp =  input_list.value;
    input_list.value = '';
    let li1 = document.createElement('li');
    list.appendChild(li1);
    li1.innerHTML = `<p>${inp}<p>`;
    //
    Cards.all.push(li1);
    Cards.active.push(li1);
  
    
    

    //
   
    //
    let checkbx = document.createElement('input');
    checkbx.type = 'checkbox';
    checkbx.className = 'checkbx';
    li1.appendChild(checkbx);
    checkbx.addEventListener('change', () => {
      if (checkbx.checked) {
        Cards.completed.push(li1);
        Cards.active.splice(Cards.active.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '0.2';
        li1.firstElementChild.style.textDecoration = 'line-through';
        doneCounter--;

      } else {
        Cards.active.push(li1);
        Cards.completed.splice(Cards.completed.indexOf(li1), 1);
        li1.firstElementChild.style.opacity = '1';
        li1.firstElementChild.style.textDecoration = 'none';
        doneCounter++;
      }
      howManyLeft.innerHTML = doneCounter;
    })

    let button1 = document.createElement('button');
    li1.appendChild(button1);
    button1.className = 'del-but';
    //button1.innerText = 'del';
    button1.addEventListener('click', () => {
      if(li1.childNodes[2].checked)  {
        Cards.all.splice(Cards.all.indexOf(li1), 1);
        Cards.completed.splice(Cards.completed.indexOf(li1), 1); // может она не попала в completed? вроде, попала
      
      }  else{
        Cards.all.splice(Cards.all.indexOf(li1), 1);
        Cards.active.splice(Cards.active.indexOf(li1), 1);
        doneCounter--;
        howManyLeft.innerHTML = doneCounter;
      } 
      
      li1.remove();
        
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
  for(let i = list.children.length-1; i > 0; i--){
    list.children[i].remove();
  }
  for(let i = 0; i < Cards.all.length; i++) {
    list.appendChild(Cards.all[i]);
  }
  buttonAll.classList.add('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonActive.addEventListener('click', () => {
  for(let i = list.children.length-1; i > 0; i--){
    list.children[i].remove();
  }
  for(let i = 0; i < Cards.active.length; i++) {
    list.appendChild(Cards.active[i]);
  }
  buttonActive.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonCompleted.classList.remove('btnclicked');
});

buttonCompleted.addEventListener('click', () => {
  for(let i = list.children.length-1; i > 0; i--){
    list.children[i].remove();
  }
  for(let i = 0; i < Cards.completed.length; i++) {
    list.appendChild(Cards.completed[i]);
  }
  buttonCompleted.classList.add('btnclicked');
  buttonAll.classList.remove('btnclicked');
  buttonActive.classList.remove('btnclicked');
});

buttonClearCompleted.addEventListener('click', () => {
  for(let i = list.children.length-1; i > 0; i--){
    list.children[i].remove();
  }
  for(let i = 0; i < Cards.active.length; i++) {
    list.appendChild(Cards.active[i]);
  }
   // перед этим из массива all нужно убрать все приколы, которые есть и здесь
  Cards._all = Cards.all.filter(obj => {
    return (Cards.completed.indexOf(obj) === -1);
  })
  Cards._completed = [];
});

