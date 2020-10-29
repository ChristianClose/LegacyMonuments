"use strict";
/*******************************New products page************************************************/
if (window.location.pathname === "/dashboard/products/new") {
    document.getElementById("imgurl").checked = true;
    var imageType = document.querySelector("input[name='imagetype']:checked");
    var imgUrl = document.getElementById("productImgUrl");
    var cecontainer = document.getElementById("cecontainer");
    var image = document.getElementById("imagepreview");
    var userFile = document.getElementById("fileupload");
    //Used to create elements on the page
    var hiddenInput = document.createElement("input");
    var imgUrlInput = document.createElement("input");
    var imgUrlLabel = document.createElement("label");
    var imgUploadInput = document.createElement("input");
    var imgUploadLabel = document.createElement("label");
    var fileUpload = document.getElementById("fileupload");

    //check when the user has selected whether to use a link or upload an image
    imageType.addEventListener("change", () => {
        //if the use has changed the option then update the variables so displayed input is not null
        imgUrl = document.getElementById("productImgUrl");
        fileUpload = document.getElementById("fileupload");
    });

    //check if anything has changed on the page
    window.addEventListener("change", () => {
        //display the image if the user has inserted a url
        imagePreview();
        //Update variables to the current values
        imageType = document.querySelector("input[name='imagetype']:checked");
        imgUrl = document.getElementById("productImgUrl");
        fileUpload = document.getElementById("fileupload");
        userFile = document.getElementById("fileupload");
        //if the user has selected to upload a file and the user has chose a file to upload
        if (imageType.value === "imgupload") {
            if (userFile !== null) {
                //display the image the user has uploaded
                showUserImage(userFile, image);
                if (document.getElementById("fileupload").value !== "") {
                    //make the image container visable
                    cecontainer.removeAttribute("hidden");
                } else {
                    cecontainer.setAttribute("hidden", true);
                }
            }
        }
    });

    //Whenever the user chooses the upload option
    document.getElementById("imgupload").addEventListener("click", () => {
        document.getElementById("imgupload").checked = true;
        document.getElementById("upload").hidden = false;
        imageType.value = "imgupload";
        //if the upload field does not exist, create it with all the necessary attributes
        if (document.getElementById("fileupload") === null) {
            document.getElementById("upload").appendChild(imgUploadInput);
            imgUploadInput.type = "file";
            imgUploadInput.classList.add("custom-file-input");
            imgUploadInput.setAttribute("id", "fileupload");
            imgUploadInput.setAttribute("name", "imgupload");
            imgUploadInput.setAttribute("accept", "image/*");


            document.getElementById("upload").appendChild(imgUploadLabel);
            imgUploadLabel.classList.add("custom-file-label");
            imgUploadLabel.setAttribute("for", "fileupload");
            imgUploadLabel.setAttribute("id", "fileuploadLabel");
            imgUploadLabel.innerHTML = "Choose File";

            //hidden input used to create a field for the server with the name image
            document.getElementById("upload").appendChild(hiddenInput);
            /*the server will use this blank input to assign a value of the uploaded image's dir 
            and insert it into the database */
            hiddenInput.setAttribute("name", "image");
            hiddenInput.hidden = true;
            //Display the name of the image the user uploaded (ex. Dog.png)
            imageName();

        }
        //Set the imgUrl field container to nothing since it is not needed
        document.getElementById("imgUrlDiv").innerHTML = "";
    });

    //Same as previous eventlistener except creates the needed input for the url field
    document.getElementById("imgurl").addEventListener("click", () => {
        document.getElementById("imgurl").checked = true;
        document.getElementById("upload").hidden = true;
        imageType.value = "imgurl";
        if (document.getElementById("productImgUrl") === null) {
            document.getElementById("imgUrlDiv").appendChild(imgUrlInput);
            imgUrlInput.type = "text";
            imgUrlInput.classList.add("form-control");
            imgUrlInput.setAttribute("id", "productImgUrl");
            imgUrlInput.setAttribute("name", "product[image]");
            imgUrlInput.setAttribute("placeholder", "Image Url");

            document.getElementById("imgUrlDiv").appendChild(imgUrlLabel);
            imgUrlLabel.innerHTML = "Image: ";
            imgUrlLabel.classList.add("input-group-text");
        }

        document.getElementById("upload").innerHTML = "";
    });
}
/************************************************************************************************/

/* Remove the dollar sign from each image if no price is set */
if (window.location.pathname === "/dashboard/products") {
    var prices = document.querySelectorAll(".price > p");

    prices.forEach((price) => {
        if (price.innerHTML === "$") {
            price.innerHTML = "";
        }
    });
}

//Asks the user if they are sure the want to delete a product, and if so then add post method to delete it
if (window.location.pathname.includes("edit")) {
    var deleteAction = document.getElementById("deleteId").value;

    document.getElementById("deleteproduct").addEventListener("click", () => {
        var confirm = window.confirm("Are you sure?");
        if (confirm === true) {
            document.getElementById("deleteform").setAttribute("method", "POST");
            document.getElementById("deleteform").setAttribute("action", deleteAction);
        }
    });
}

//Displays the image that the user provided via url
function imagePreview() {
    if (imageType.value === "imgurl") {
        if (imgUrl !== null) {
            imgUrl.addEventListener("input", () => {
                let imagesrc = document.getElementById("productImgUrl").value;

                if (imagesrc !== "") {
                    document.getElementById("cecontainer").removeAttribute("hidden");
                    document.getElementById("mastercontainer").style.paddingTop = "2rem";
                    image.src = imagesrc;
                } else {
                    document.getElementById("cecontainer").hidden = true;
                }
            });

            if (document.getElementById("productImgUrl").value === "") {
                document.getElementById("mastercontainer").style.paddingTop = "15rem";
            }
        }
    }
}

//gets the name of the image and displays it in the upload field
function imageName() {
    if (document.getElementById("fileupload") !== null) {
        var fileUpload = document.getElementById("fileupload");
        document.getElementById("fileupload").addEventListener("change", () => {
            var fakePath = fileUpload.value;
            document.getElementById("fileuploadLabel").innerHTML = fakePath.split("\\").pop();
        });
    }
}

//shows the image the user uploaded
function showUserImage(src, target) {
    var fr = new FileReader();
    fr.onload = function () { target.src = this.result; };
    src.addEventListener("input", function () {
        fr.readAsDataURL(src.files[0]);
    });
}

if (document.getElementById("inProgress")) {
    let checkboxes = document.getElementsByName("isComplete");
    let inProgressCheckboxes = document.querySelectorAll("#inProgress [id^='isComplete'");
    let completeCheckboxes = document.querySelectorAll("#completedOrders [id^='isInComplete'");
    Array.from(checkboxes).forEach((checkbox, i) => {
        checkbox.addEventListener("click", () => {
            if (document.getElementById("inProgressTab").getAttribute("aria-selected") === "true") {
                console.log(checkbox.checked)
                if (checkbox.checked === true) {
                    inProgressCheckboxes.forEach(checkbox => checkbox.submit());
                }
            } else {
                if (checkbox.checked === true) {
                    console.log("isInComplete" + parseInt(i+1));
                    completeCheckboxes.forEach(checkbox => checkbox.submit());
                }
            }

        })

    })
}