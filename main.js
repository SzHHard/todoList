var list = document.getElementById("todo-list");
var input_list = document.getElementById("input-list");


input_list.addEventListener("keydown", (event) => {
  console.log(event.code);
  if (event.code === "Enter") {
    let inp =  input_list.value;
    input_list.value = '';
    let li1 = document.createElement('li');
    list.appendChild(li1);
    li1.innerHTML = `<p>${inp}<p>`;
    let button1 = document.createElement('button');
    //
    li1.appendChild(button1);
    button1.innerText = 'del';
    button1.addEventListener('click', () => {
        li1.remove();
    })
    //
    let inp1 = document.createElement('input');
    inp1.type = 'checkbox';
    li1.appendChild(inp1);
    


  }
});