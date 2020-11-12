if (document.getElementById("checkoutItems")) {
    listCart();
    addHiddenInput();
    const isEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
    const isName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const isPhone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const nameInput = document.getElementsByName("customer[name]")[0];
    const emailInput = document.getElementsByName("customer[email]")[0];
    const phoneInput = document.getElementsByName("customer[phone]")[0];
    let isValid = {
        email: false,
        name: false,
        phone: false
    }
    let allValid = true;

    nameInput.addEventListener("change", () => {
        if (!isName.test(nameInput.value)) {
            nameInput.style.background = "rgba(255, 0, 0, 1)";
            nameInput.style.color = "white";
            nameInput.style.border = "5px solid rgba(100, 0, 0, 1)";
            nameInput.setAttribute("placeholder", "Enter a valid name!")

            //alert("Please enter your first and last name!")
            isValid.name = false;
        } else {
            nameInput.style.removeProperty("border");
            nameInput.style.background = "white";
            isValid.name = true;
            nameInput.style.color = "black";
        }

    });

    emailInput.addEventListener("change", () => {
        if (!isEmail.test(emailInput.value)) {
            emailInput.style.background = "red";
            emailInput.style.color = "white";
            alert("Please enter a valid email address!")
            isValid.email = false;
        } else {
            emailInput.style.background = "white";
            emailInput.style.color = "black";
            isValid.email = true;
        }
    })
    phoneInput.addEventListener("change", () => {
        if (!isPhone.test(phoneInput.value)) {
            phoneInput.style.background = "red";
            phoneInput.style.color = "white";
            alert("Please enter a valid phone number!")
            isValid.phone = false;
        } else {
            phoneInput.style.background = "white";
            phoneInput.style.color = "black";
            isValid.phone = true;
        }
    });

    document.getElementById("submitCart").addEventListener("click", () => {
        let inputs = document.getElementsByTagName("input");
        let inputHasData = true;

        for (let input of inputs) {
            if (input.value === "") {
                inputHasData = false;
                break;
            }
        }
        for(let valid of Object.values(isValid)){
            if(!valid){
                allValid = false;
                break;
            }
        }
        if (allValid) {
            sessionStorage.clear()
        }


    });
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





