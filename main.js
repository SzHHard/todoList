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
  set all(par){
    if(typeof par === number) {
    this._all = par;
    }
    else {
      console.log('former line 23 par is not a number отладочка');
    }
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
    console.log(Cards.all); // самопроверка, потом удалить
    console.log(Cards.active); // самопроверка, потом удалить
    
    

    //
    let button1 = document.createElement('button');
    li1.appendChild(button1);
    button1.innerText = 'del';
    button1.addEventListener('click', () => {
        li1.remove();
    })
    //
    let checkbx = document.createElement('input');
    checkbx.type = 'checkbox';
    checkbx.className = 'checkbx';
    li1.appendChild(checkbx);
    checkbx.addEventListener('change', () => {
      if (checkbx.checked) {
        li1.firstElementChild.style.opacity = '0.2';
        li1.firstElementChild.style.textDecoration = 'line-through';
        doneCounter--;

      } else {
        li1.firstElementChild.style.opacity = '1';
        li1.firstElementChild.style.textDecoration = 'none';
        doneCounter++;
      }
      howManyLeft.innerHTML = doneCounter;
    })


  }
});