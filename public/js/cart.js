
var itemArray = [];
if (document.getElementById("imageId") !== null) {
    var add = document.getElementById("add");
    add.addEventListener("click", addItem)
}

if(document.getElementById("submitCart")){
    document.getElementById("submitCart").addEventListener("click", () => {
        sessionStorage.clear()
    });
}

function addItem() {
    var sessObject = {};
    var imageId = document.getElementById("imageId").innerText;
    var imageName = document.getElementById("productCaption").innerText;
    var imagePrice = document.getElementById("productPrice").innerText;
    var cart = document.getElementById("cartItems");

    if (sessionStorage.getItem("cart")) {
        itemArray = JSON.parse(sessionStorage.getItem("cart"));
    }


    sessObject.id = imageId;
    sessObject.quantity = 1;
    sessObject.name = imageName.replace("~", "");
    sessObject.price = parseFloat(imagePrice.replace("$", ""));

    itemArray.push(sessObject);
    sessionStorage.setItem("cart", JSON.stringify(itemArray));
    if(document.getElementById("cart") === null){
        createCart();
    } else {
        showCart();
    }
    
    document.getElementById("cart").classList.add("show");
    // document.getElementById("cart").hidden = false;

    // itemArray.forEach((element, index) => {
    //     var table = document.getElementsByTagName("table")[0];
    //     var rowCount = cart.rows.length;
    //     var row = cart.insertRow(rowCount);

    //     row.insertCell(0).innerText = element.item.price;
    //     row.insertCell(1).innerText = element.item.name;
    // });

    // var tds = document.querySelectorAll("table td");

    // tds.forEach((item) => {
    //     if (item.innerText.includes("$")) {
    //         item.classList.add("itemPrice");
    //     } else {
    //         item.classList.add("itemName");
    //     }
    // });

    //

}

function createCart() {
    var itemArray = [];

    if (sessionStorage.getItem("cart")) {
        itemArray = JSON.parse(sessionStorage.getItem("cart"));

        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        var thPrice = document.createElement("th");
        var thName = document.createElement("th");
        var button = document.createElement("button");
        var card = document.createElement("div");
        var checkoutBtn = document.createElement("button");

        //table.setAttribute("id", "cart")
        card.classList.add("collapse");
        card.classList.add("container");
        document.getElementsByTagName("nav")[0].appendChild(button);
        button.setAttribute("type", "button");
        button.setAttribute("data-toggle", "collapse");
        button.setAttribute("data-target", "#cart");
        button.setAttribute("aria-expanded", " false");
        button.setAttribute("aira-controls", "cart");
        button.classList.add("btn");
        button.classList.add("btn-light")
        button.innerText = "Cart"


        document.getElementsByTagName("nav")[0].insertAdjacentElement("afterend", card);
        //card.classList.add("card");
        card.classList.add("card-body");
        card.setAttribute("id", "cart");
        card.appendChild(table)
        table.appendChild(thead);
        table.appendChild(tbody);
        card.appendChild(checkoutBtn);
        checkoutBtn.innerText = "Checkout";
        checkoutBtn.addEventListener("click", () => {
            window.location = "/checkout";
        });
        tbody.setAttribute("id", "cartItems");
        thead.insertRow(0);
        document.getElementsByTagName("tr")[0].appendChild(thName);
        thName.classList.add("itemName");
        document.getElementsByTagName("tr")[0].appendChild(thPrice);
        thPrice.classList.add("itemPrice");
        thPrice.innerText = "Price";
        thName.innerText = "Name";

        showCart();


    }
}

function showCart() {
    var totalPrice = 0;
    var tbody = document.getElementById("cartItems");

    if(document.getElementById("total") !== null){
        document.getElementById("cartItems").innerText = "";
    }

    if (sessionStorage.getItem("cart")) {
        var cart = JSON.parse(sessionStorage.getItem("cart"));
    }

    var rowCount = document.getElementById("cartItems").rows.length;
    cart.forEach((item) => {
        var row = document.getElementById("cartItems").insertRow(rowCount);
        var price = item.price;
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = "$" + parseFloat(price).toFixed(2);
        console.log(item.price)
        totalPrice += parseFloat(item.price);
        rowCount++;
    });

    var tbodyRows = document.querySelectorAll("#cartItems td");
    var lastRow = tbodyRows[tbodyRows.length -1];
    console.log(lastRow);
    var totalRow = tbody.insertRow(-1);
    totalRow.setAttribute("id", "total")
    totalRow.insertCell(0).innerText = "Total";
    totalRow.insertCell(1).innerText = "$" + totalPrice.toFixed(2);

    var tds = document.querySelectorAll("table td");
    tds.forEach((item) => {
        if (item.innerText.includes("$")) {
            item.classList.add("itemPrice");
        } else {
            item.classList.add("itemName");
        }
    });


}

createCart();