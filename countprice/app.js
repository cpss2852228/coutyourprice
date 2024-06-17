let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let listCartprice = document.querySelector('.totalprice');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let shareToLine = document.querySelector('.checkOut');
let orig = document.querySelector('.orig');
let dc95 = document.querySelector('.dc95');
let dc7 = document.querySelector('.dc7');
let dc65 = document.querySelector('.dc65');
let dc62 = document.querySelector('.dc62');
let dc57 = document.querySelector('.dc57');
let dc52 = document.querySelector('.dc52 ');
let products = [];
let cart = [];
var discount=1;
//var copyPrice=0;
var sharecart = "";
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
document.addEventListener('click',function(){
    body.classList.remove('showCart');
},true);

shareToLine.addEventListener('click', () => {
    sharecart=sharecart+"總額為：" + Math.ceil(copyPrice*discount);
    console.log("分享到line的文字：",sharecart);
    shareOnLine(sharecart);
})
var shareOnLine =function (text) {
    var lineUrl = "https://social-plugins.line.me/lineit/share?url=&text=";
    var encodedText = encodeURIComponent(text);
    var finalUrl = lineUrl + encodedText;
    console.log(finalUrl);
    window.open(finalUrl, "_blank", "width=600,height=400");
    sharecart="";
}
orig.addEventListener('click', () => {
    discount=1;
    clickHandler(discount);
})
dc95.addEventListener('click', () => {
    discount=0.95;
    clickHandler(discount);
})
dc7.addEventListener('click', () => {
    discount=0.7;
    clickHandler(discount);
})
dc65.addEventListener('click', () => {
    discount=0.65;
    clickHandler(discount);
})
dc62.addEventListener('click', () => {
    discount=0.62;
    clickHandler(discount);
})
dc57.addEventListener('click', () => {
    discount=0.57;
    clickHandler(discount);
})
dc52.addEventListener('click', () => {
    discount=0.52;
    clickHandler(discount);
})
var clickHandler = function(discount){
    //listCartprice.innerText = "總額為：" + Math.ceil(copyPrice*discount);
    //console.log(copyPrice,"*",discount,"=",copyPrice*discount);
    addCartToHTML();
  };
    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price"><span>NT$</span>${product.price}</div>
                <button class="addCart">加入購物車</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    //儲存在瀏覽器，放在 localStorage 的資料會永久保存，直到被使用者清除
    //addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            totalPrice = totalPrice + Math.ceil(info.price*discount)*item.quantity;
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name} $${info.price}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            sharecart=sharecart+info.name+"\n價格："+info.price+"\n數量："+item.quantity+"\n\n";
        })
    }
    copyPrice=totalPrice;
    listCartprice.innerText = "總額為：" + totalPrice;
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                sharecart="";
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                    sharecart="";
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    //addCartToMemory();
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();