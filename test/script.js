let goods = [

];

// Для теста вызови testObjToLocal() в консоли браузера

let testArr = [
    {name: "IPhone 11", img:"promax.jpg", price: 1700},
    {name: "IPhone 7+", img:"7plus.jpg", price: 500},
    {name: "IPhone XR", img:"xr.jpg", price: 700}
];

function testObjToLocal() {
    localStorage.clear();
    for(let i = 0; i < testArr.length; i++) {
        var serialObj = JSON.stringify(testArr[i]);
        localStorage.setItem(i, serialObj);
    }
}

// Ф-ция которая при загрузке страницы добавляет обьекты в массив из локального хранилища
window.onload = function() {
    for (let index = 0; index < localStorage.length; index++) {
        let temp = JSON.parse(localStorage.getItem(index));
        goods.push(temp);
    }
    goodsPrint();
};

// Наоборот - из массива в локальное хранилище (для добавления, редактирования и удаления товаров)
function objToLocal() {
    localStorage.clear();
    for(let i = 0; i < goods.length; i++) {
        var serialObj = JSON.stringify(goods[i]);
        localStorage.setItem(i, serialObj);
    }
}

// Генерация компонента карточки товара

function createGood(good) {
    return `
<div class="card col-md-4 cardno${good.index}" >
        <div class="card__interface">
            <i class="far fa-trash-alt" id="delete-card${good.index}"></i>
            <i class="far fa-edit" class="btn btn-primary btn-md col-md-3 " data-target="#edit__good" data-toggle="modal" id="edit-card${good.index}"></i>
        </div>
        <img src="${good.img}" alt="${good.name}">
        <div class="row card__info">
        <h3 class="card__tittle col-md-8">
        ${good.name}
        </h3>
        <p class="card__price col-md-4">
            ${good.price}$
        </p>
        </div>
        </div> `
}

// Отрисовка превью при добавлении товара

function createPreview() {
    let good = {};
    good.name = document.getElementById('add__good-name').value;
    good.img = document.getElementById('add__good-img').value;
    good.price = document.getElementById('add__good-price').value;
    let preview = document.getElementById('preview-good');

    let previewTemp = `
<div class="card col-md-12" >
        <div class="card__interface">
            <i class="far fa-trash-alt" id="delete-card${good.index}"></i>
            <i class="far fa-edit" class="btn btn-primary btn-md col-md-3 " data-target="#edit__good" data-toggle="modal" id="edit-card${good.index}"></i>
        </div>
        <img src="${good.img}" alt="${good.name}">
        <div class="row card__info">
        <h3 class="card__tittle col-md-8">
        ${good.name}
        </h3>
        <p class="card__price col-md-4">
            ${good.price}$
        </p>
        </div>

    <button class="card__buy">
        Купить
        </button>
        </div> `
    preview.innerHTML = previewTemp;
}

document.getElementById('preview__good-btn').onclick = function () {
    createPreview();
};

// Отрисовка всех карточек из массива goods

function goodsPrint() {
    let cards = document.getElementById('cards__list');
    if(goods.length != 0) {
        let cardTemplate = goods.map(elem => createGood(elem));
        let html = cardTemplate.join(' ');

        cards.innerHTML = html;
    } else {
        cards.innerHTML = "Список товаров пуст";
    }

}

//Добавление товара

function addGood() {
    let obj = {
        name: "",
        img: "",
        price: 0
    };

    obj.name = document.getElementById('add__good-name').value;
    obj.img = document.getElementById('add__good-img').value;
    obj.price = document.getElementById('add__good-price').value;
    obj.index = goods.length;


   goods.push(obj);
   goodsPrint();
   objToLocal();
}

document.getElementById('add__good-btn').onclick = function () {
    checkall();
};

// 3 функции проверки полей и потом checkall() которая обьеденяет все и вызывает addGood() если true

function validateName(){
    let x=document.forms["addForm"]["add__good-name"].value;
    if (x.length < 2) {
        document.getElementById('nameF').innerHTML = '(мин. 3 символа)';
        return false;
    } else {
        document.getElementById('nameF').innerHTML = '';
        return true;
    }
}

function validateImg() {
    let x=document.forms["addForm"]["add__good-img"].value;
    let jpgPos=x.lastIndexOf(".jpg");
    if(jpgPos <= 0) {
        document.getElementById('imgF').innerHTML = 'Введите ссылку на изображение в формате jpg';
        return false;
    } else {
        document.getElementById('imgF').innerHTML = '';
        return true;
    }
}

function validatePrice() {
    let x=document.forms["addForm"]["add__good-price"].value;
    var re = /^\d+$/;
    var OK = re.exec(x);
    if(x.length > 4 || !OK) {
        document.getElementById('priceF').innerHTML = 'Введите цену до 9999';
        return false;
    } else {
        document.getElementById('imgF').innerHTML = '';
        return true;
    }
}

function checkall(){
    if(validateImg() && validateName() && validatePrice()){
        addGood();
        return true;
    }

    else return false;
}


let cardsList = document.getElementById('cards__list');

// функция для получения числа из строки

function getIndex(str) {
    let index =  "";
    for (let i = 0; i <str.length; i++) {
        if(parseInt(str[i]) || str[i] == 0) {
            index = index + str[i];
        }
    }
    return index;
}

// Функция которая реализует интерфейс карточки (удалить и редактировать)

cardsList.onclick = function(event) {
    console.log(event.target.id);
    if(event.target.id.startsWith('delete') ){
        let tempIndex = getIndex(event.target.id);
        for(let i in goods) {
            if(goods[i].index == tempIndex) {
                goods.splice(i, 1);
                for(let j in goods) {
                    goods[j].index = j;
                }
            }
        }
        objToLocal();
        goodsPrint();
    } else if(event.target.id.startsWith('edit')) {
        let tempIndex = getIndex(event.target.id);
        for(let i in goods) {
            if(goods[i].index == tempIndex) {
                var editIndex = tempIndex;
                function editGood(index) {
                    let newName = document.getElementById('edit__good-name').value;
                    let newImg = document.getElementById('edit__good-img').value;
                    let newPrice = document.getElementById('edit__good-price').value;
                    if(newName.length != 0) {
                        goods[index].name = newName;
                    }
                    if(newImg.length != 0) {
                        goods[index].img = newImg;
                    }
                    if(newPrice.length != 0) {
                        goods[index].price = newPrice;
                    }
                    objToLocal();
                    goodsPrint();
                }

                document.getElementById('edit__good-btn').onclick = function () {
                    editGood(editIndex);
                };
            }
        }

    }

};

