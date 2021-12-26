const todos = []; //API'den gelen verilerin localde tutulması için tanımlanmıştır.
let li_id; // updateElement fonksiyonu için global tanımlandı.

function getUsername() { 
  let usernameDOM = document.getElementById("usernameInput")
  let usernameBtnDOM = document.getElementById("usernameBtn")
  let usernameHeadDOM = document.getElementById("usernameHeader")
  let usernameStr = usernameDOM.value;
  //DOM üzerinde bulunan değerlerin alınması

  if(usernameStr){ //Eger girilen değer doğruysa ("" değilse)
    localStorage.setItem("username",`${usernameStr}`); //localstorage'e kaydetme işlemi
    usernameDOM.style.display = "none";  
    usernameBtnDOM.style.display = "none";
    //localstorage'e ekledikten sonra bir işlevleri kalmadığı için gizliyoruz.
    usernameHeadDOM.innerHTML = `${usernameStr}'nin to-do listesi . . .`
    getTodos(); // sayfa ilk yüklendiğinde kaynakta bulunan to-do'ların getirilmesi işlemi. 
  }else{
    alert("Lütfen kullanıcı adınızı giriniz.")
  }
}

function getTodos() {
  fetch("https://61c3998c9cfb8f0017a3ec4a.mockapi.io/todos")
  .then((response) => response.json())
  .then((json) => {
    for(let index in json){
      todos.push(json[index]);
      addToList(todos[index].content, todos[index].id, todos[index].isCompleted); 
      // her bir todoyo Li elementi olarak HTML'e eklemek için ayrı ayrı gönderiyoruz.
    }
  });
}

function addToList(content, id, bool) {
  let li = document.createElement("li");
  if(bool === "true") li.setAttribute("class","checked"); //API'den gelen todo'nun tamamlandığı isCompleted değeri true ise tamamlanmış olarak listeye ekleme için class'ını değiştiriyoruz.
  let t = document.createTextNode(content);
  li.appendChild(t);
  li.setAttribute("id",`${parseInt(id)}`);
  //Eklenen li elementlerine id atanıyor, daha sonra EventListener ile kullanırken yardımcı olacak.
  if (content !== '') document.getElementById("userList").appendChild(li); //
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7"); // 'x' ekleniyor
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span)
}


let list = document.querySelector('ul');
list.addEventListener('click', function(event) {

    if (event.target.tagName === 'LI') {
      event.target.classList.toggle('checked');
      let str_li = event.target.innerHTML; //Li nin içeriğini alıyoruz. Ancak içerisinde span elementide olduğu için ayırmamız gerekiyor.
      let content = str_li.split("<"); //content[0] ile content'e tam olarak erişebiliriz.
      document.getElementById("todoInput").value = content[0];
      li_id = event.target.id; 
      // li ve API'de bulunan todo idler aynı ancak değişken olarak tanımlanan todos listesinde index 0 ile başladığı için bir eksiğine denk geliyor.
      let updateBool = (todos[li_id-1].isCompleted === "true") ? true : false;
      updateTodo(todos[li_id-1].content, !updateBool, todos[li_id-1].id);
      todos[li_id-1].isCompleted = `${!updateBool}`;
    }

    if (event.target.tagName === 'SPAN') {
      event.target.className = 'willclose';
      let closed = this.querySelector(".willclose")
      let parent = closed.parentElement;
      parent.style.display = "none";
      //Kaynağımızda ki to-do'yu silmek için DELETE ile istek yolluyoruz.
      let stringDel = `https://61c3998c9cfb8f0017a3ec4a.mockapi.io/todos/${parent.id}`;
      fetch(stringDel , {
        method: 'DELETE',
      });
      todos.pop(); 
    }
}, false); //Kabarcıklanma(Bubbling) için verilen "false" değeri.

function addToServer(content,id) {
  fetch("https://61c3998c9cfb8f0017a3ec4a.mockapi.io/todos", {
    method: 'POST',
    body: JSON.stringify({
      id: `${id}`,
      content: `${content}`,
      isCompleted: "false"
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {console.log(json)}); 
}

function newElement() {
  let li = document.createElement("li");
  let inputValue = document.getElementById("todoInput").value;
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue.length < 3) { //input texti minumum 3 karakter içermeli kuralını sağlamak için.
    alert("Bir şeyler yazmadan ekleme yapamazsınız!");
  } else {
    todos.push({
      "content" :`${inputValue}`,
      "isCompleted" : false,
      "id" : `${todos.length + 1}`
    })
    let strID = `${todos.length + 1}`;
    addToServer(inputValue,strID);
    addToList(inputValue,strID);
  }
  document.getElementById("todoInput").value = "";

  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      let div = this.parentElement;
      div.style.display = "none";
    }
  }
}

function updateElement() {
  let updateInput = document.getElementById("todoInput").value;
  todos[li_id-1].content = updateInput;
  updateTodo(updateInput,todos[li_id-1].boolValue,li_id);  
  //todo guncellendikten sonra li guncellenmiyor! Sayfanın yenilenmesi gerekli.
}

function updateTodo(content, boolValue, todo_id) {
  let updateStr = `https://61c3998c9cfb8f0017a3ec4a.mockapi.io/todos/${todo_id}`
  fetch(updateStr, {
    method: 'PUT',
    body: JSON.stringify({
      "content": `${content}`,
      "isCompleted": `${boolValue}`,
      "id": `${todo_id}`
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function activeNightMode() {
  let element = document.body;
  element.classList.toggle("dark-mode");
}