const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list')
const modalInfo = document.querySelector('#modal-info')


document.addEventListener("DOMContentLoaded", () => {
    // callback > içerisinde farklı fonksiyonlar çalıştırır
    fetchCategories();
    fetchProduct();
});

function fetchCategories() {
    // veri çekme isteği atma
    fetch('https://api.escuelajs.co/api/v1/categories')
        // gelen veriyi okuma
        .then((res) => res.json())
        // işlenen veriyi ekrana basma
        .then((data) =>
            data.slice(0, 4).forEach((category) => {
                
                // gelen herbir obje için div oluşturma
                const categoryDiv = document.createElement('div');
                // dive class ekleme
                categoryDiv.classList.add('category');
                categoryDiv.innerHTML = `
                <img src="${category.image}" />
                <span>${category.name}</span>
                `;
                // oluşan divi html deki listeye atma
                categoryList.appendChild(categoryDiv);
            })
        );
}

// Ürünleri çekme
function fetchProduct() {
    fetch("https://api.escuelajs.co/api/v1/products")
        .then((res) => res.json())
        // işlenen veriyi al ve ekrana bas
        .then((data) =>
            data.slice(0, 25).forEach((item) => {
                // div oluştur
                const productDiv = document.createElement("div");
                // dive clas ekle
                productDiv.classList.add('product');
//    divin içeriğini değiştir
                productDiv.innerHTML = `
                <img src="${item.images[0]}" />
                <p>${item.title}</p>
                <p>${item.category.name}</p>
                <div class="product-action">
                    <p>${item.price} $</p>
                    <button onclick="addToBasket({title:'${item.title}',id:${item.id},price:${item.price},img:'${item.images[0]}',amount:1})">Sepete Ekle</button>
                </div>
                
                `;
              
                // oluşan ürünü html deki listeye gönderme
                productList.appendChild(productDiv);
                
            })
        );
}
// sepet
let basket = [];
let total = 0

// sepete ekleme işlemi
function addToBasket(product) {
    // sepette eğer bu değişkenden varsa onu değişkene aktar
    const foundItem = basket.find((basketItem) => basketItem.id === product.id)
    if (foundItem) {
        //    eğer eleman sepette varsa miktarını artır
        foundItem.amount++;
    } else {
        // eğer eleman sepette bulunmadıysa ekle
        basket.push(product);
  }
   
    
}
//açma ve kapatma 
openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    // sepetin içine ürünleri listeleme
    addList();
    // toplam bilgisini güncelle
    modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    // sepeti kapatınca içini temizle
    modalList.innerHTML = '';
    // toplam değerini sıfırlama
    total = 0;
});

// sepete Listeleme
function addList() {
    basket.forEach((product) => {
        console.log(product);
     // sepet dizisindeki her obje için div oluştur 
        const listItem = document.createElement('div');
        // bunlara class ekle
        listItem.classList.add('list-item');
        // içeriğini değiştir
        listItem.innerHTML = `
        
        <img src="${product.img}">
        <h2>${product.title}</h2>
        <h2 class="price">${product.price} $</h2>
        <p>${product.amount}</p>
        <button id="del" onclick="deleteItem({id:${product.id},price:${product.price},amount:${product.amount}})">Sil</button>

        `;
        // elemanı html deki listeye gönderme
        modalList.appendChild(listItem);
        // toplam değişkenini güncelleme
        total += product.price * product.amount;
      
    });
}
function deleteItem(deletingItem) {
    // id si silinecek elemanın idsiyle eşit olmayanları al
    basket = basket.filter((i) => i.id !== deletingItem.id);
    // silinen elemanın fiyatını totalden çıkarma
    total -= deletingItem.price * deletingItem.amount;
    modalInfo.innerText = total;
    console.log(total);
}

modalList.addEventListener('clicsk', (e) => {
    if (e.target.id === 'del') {
        e.target.parentElement.remove();
    }
});



// eğer dışarıya tıklanırsa modülü kapatma

modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
        modal.classList.remove('active');
  }
});