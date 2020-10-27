if (document.getElementById("checkoutItems")) {
    listCart();
    addHiddenInput();
}

function listCart() {
    let ul = document.getElementById("checkoutItems");

    if (document.getElementById("total") !== null) {
        document.getElementById("checkoutItems").innerText = "";
    }

    if (sessionStorage.getItem("cart")) {
        var cart = JSON.parse(sessionStorage.getItem("cart"));
    }
    let total = 0;
    document.getElementById("totalItems").innerText = cart.length;
    cart.forEach((item, i) => {
        let li = document.createElement("li");
        //let div = document.createElement("div");
        let h6 = document.createElement("h6");
        let p = document.createElement("p");
        let span = document.createElement("span");
        let price = item.price;
        console.log(price)
        ul.appendChild(li);
        li.appendChild(h6);
        li.appendChild(span)
        li.appendChild(p);

        // div.appendChild(h6);
        // div.appendChild(span);
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed")
        h6.classList.add("my-0", "text-dark");
        span.classList.add("text-muted", "text-dark", "justify-content-end");
        p.hidden = true;
        total += price;
        h6.innerText = item.name;
        span.innerText = "$" + item.price;
        p.innerText = item.id;
        if (i === cart.length - 1) {
            let totalEle = document.createElement("il");
            let totalH5 = document.createElement("h5");
            let totalSpan = document.createElement("span");

            li.insertAdjacentElement("afterend", totalEle);
            totalEle.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed", "border-top", "border-dark");
            totalH5.classList.add("my-0", "text-dark");
            totalSpan.classList.add("text-dark", "lead");
            totalEle.appendChild(totalH5);
            totalH5.innerText = "Total";
            totalEle.appendChild(totalSpan);
            totalSpan.innerText = "$" + total;
        }
    });
}

function addHiddenInput() {
    let form = document.getElementsByTagName("form")[0];

    if (sessionStorage.getItem("cart")) {
        var cart = JSON.parse(sessionStorage.getItem("cart"));
    }

        cart.forEach((item) => {
            console.log(JSON.stringify(cart).replace("[", "").replace("]", "").replace("{", "item" + item.id + ": {"));
        })
        
        let input = document.createElement("input");
        form.appendChild(input);
        input.hidden = true;
        input.type = "text";
        input.name = "customer[order]";
        input.setAttribute("value", JSON.stringify(cart));


//     cart.forEach((item, i) => {
//         let input = document.createElement("input");
//         form.appendChild(input);
//         input.hidden = true;
//         input.type = "text";
//         input.name = "customer[order]";
//         input.setAttribute("value", parseInt(item + )
//     });
// }
}





