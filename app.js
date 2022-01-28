let id = 0;
let id2 = 0;
let ch_id = 1;
let total_cost = 0;
let categories = document.getElementById('categories');
let prices = {}

const cart = document.getElementById('cart');
const api_key = 'gVmG2dOV9U0KZ7duLy3Eu5XKru6mn7jV'
const list_categories =  [
    "Combined Print and E-Book Fiction",
    "Combined Print and E-Book Nonfiction", 
    "Hardcover Fiction",
    "Hardcover Nonfiction",
    "Trade Fiction Paperback",
    "Paperback Nonfiction",
    "Advice How-To and Miscellaneous",
    "Childrens Middle Grade Hardcover",
    "Picture Books",
    "Young Adult Hardcover",
    "Audio Fiction",
    "Audio Nonfiction",
    "Business Books",
    "Graphic Books and Manga",
    "Mass Market Monthly",
    "Middle Grade Paperback Monthly",
    "Young Adult Paperback Monthly"
]


function loadCategories(){
    list_categories.map((el)=>{
        let ch_box = document.createElement('input');
        ch_box.type = 'checkbox'
        ch_box.id = `ch-${ch_id}`
        ch_box.className= 'checkbox'
        ch_box.value = el;
        ch_box.onchange = loadApi;
        categories.appendChild(ch_box);

        let label = document.createElement('label')
        label.htmlFor = `ch-${ch_id}`
        label.appendChild(document.createTextNode(el));


        let br = document.createElement('br')

        categories.appendChild(label);
        categories.appendChild(br);

        ch_id++;
    })

    list_categories.map((el)=>{
        let arrayx = []
        for(let i = 0; i < 5; i++){
            let num = Math.floor(Math.random() * (2000 - 100) + 100) / 100;
            arrayx.push(num);
        }
        prices[el] = arrayx;
    })

}

loadCategories();
setTimeout(loadApi, 200);

function loadApi(e){
    id = 0;
    let checked_list = getCheckedList()
    // fetch('./overview.json')
    fetch(`https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${api_key}`)
    .then(data => data.json())
    .then(data => data.results.lists)
    .then((data) => {
        document.getElementById('books').innerHTML = ''
        data.forEach(element => {
            
            if(checked_list.includes(element.list_name) || checked_list.includes('All')){
                let card = `<h3>${element.list_name}</h3>`
                let cards = card;
                let i = 0;
                element.books.forEach(el => {
                    card = `
                    <div class="col-sm-4 py-2">
                        <div class="card h-100 border-primary" style=" position: relative;width:18% ; float:left; margin: 1%">
                            <img src=${el.book_image} width=100% />
                            <div class="container">
                                <h5 height=30px>${el.title}</h5>
                                <h5 height=30px>${el.author}</h5>
                                <h6>${prices[element.list_name][i]}</h6>
                                <button class="add" id="bt-${id}" style="bottom:38px; position: absolute;">Add</button>
                            </div>
                        </div>
                    </div>
                    `
                    cards += card;
                    id++;
                    i++;
                })
                                
                document.getElementById('books').innerHTML += '<div class="rowlist">' + cards + '</div>';
            }
        });
    })
    .catch(error => console.log(error))
    setTimeout(loadEventListeners, 2000);
}

function getCheckedList(){
    let ans = []
    let checkbox_list = document.getElementsByClassName("checkbox");
    for(var cbox of checkbox_list){
        if(cbox.checked)
            ans.push(cbox.value);
    }
    return ans;
}



function loadEventListeners() {  
    for(let book_id = 0; book_id < id; book_id++){
        document.getElementById(`bt-${book_id}`).addEventListener("click", addToCart);
    }
}

function addToCart(e){
    e.stopPropagation();

    console.log(e.target.id)
    const title = e.target.parentElement.children[0].innerHTML;
    const price = e.target.parentElement.children[2].innerHTML;
    let count = 1
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${title}</td>
        <td>${price}</td>
        <td id="ct-${id2}"><button id="dec-${id2}">-</button><b>${count}</b><button id="inc-${id2}">+</button></td>
        <td><a id="rm-${id2}" href="#">x</a></td>
    `
    cart.appendChild(row);
    
    total_cost += Number(price)*Number(count);
    document.getElementById('totalCost').innerHTML = `${total_cost.toFixed(2)} AZN`


    for(let book_id = 0; book_id <= id2; book_id++){
        document.getElementById(`dec-${book_id}`).addEventListener("click", decrementCount)
        document.getElementById(`inc-${book_id}`).addEventListener("click", incrementCount)
        document.getElementById(`rm-${book_id}`).addEventListener("click", removeFromCart)
    }

    document.getElementById('clear-cart').addEventListener("click", clearCart);
    document.getElementById('buy').addEventListener("click", buyItems)
    id2++;
    
}

function decrementCount (e){
    let targett = e.target.parentElement;
    let countx = Number(targett.children[1].innerHTML);
    let pricex = Number(targett.parentElement.children[1].innerHTML);
    e.target.parentElement.children[1].innerHTML = (countx > 1) ? countx - 1 : 1 ;

    let countx2 = Number(targett.children[1].innerHTML);
    total_cost = total_cost - (countx-countx2) * pricex;

    document.getElementById('totalCost').innerHTML = `${total_cost.toFixed(2)} AZN`
}
 
function incrementCount (e){
    let targett = e.target.parentElement;
    let countx = Number(targett.children[1].innerHTML);
    let pricex = Number(targett.parentElement.children[1].innerHTML);
    e.target.parentElement.children[1].innerHTML =  (countx < 10) ? countx + 1 : 10 ;
    
    let countx2 = Number(e.target.parentElement.children[1].innerHTML);
    total_cost = total_cost + (countx2-countx) * pricex;

    document.getElementById('totalCost').innerHTML = `${total_cost.toFixed(2)} AZN`
}


function removeFromCart(e){
    let targett = e.target.parentElement.parentElement;
    const price = Number(targett.children[1].innerHTML);
    const count = Number(targett.children[2].children[1].innerHTML);
    console.log([price, count])
    targett.remove();
    id2--;
    total_cost -= Math.abs(price*count);
    document.getElementById('totalCost').innerHTML = `${total_cost.toFixed(2)} AZN`;

    e.preventDefault();
}

function clearCart(e){
    while(cart.firstChild){
        cart.removeChild(cart.firstChild);
    }
    document.getElementById('totalCost').innerHTML = '';
    
    id2 = 0;
    total_cost = 0;
}


function buyItems(e){
    clearCart()
    alert(`Purchase is successful. Thank you!`)
}