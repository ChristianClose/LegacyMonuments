
var test = document.querySelectorAll(".images");
var test2 = Array.from(test);
var check = function (item) { return item.src !== ""; };
var responseObject;

if (window.location.pathname === "/products") {
    (async () => {
       let response =  await getResponse("/pictures/");
        setProductImages(response)
    })();
}

function setProductImages(response) {
    var pictures = response.sort();
    var pictureCanvas = Array.from(document.querySelectorAll(".images"));
    var caption = Array.from(document.querySelectorAll(".slidecaption"));

    //pictures.sort((a, b) => a.image.localeCompare(b.name));

    for (var i = 0; i < pictureCanvas.length; i++) {
        if(pictures[i].compressedImage === ""){
            pictureCanvas[i].src = pictures[i].image
        } else {
            pictureCanvas[i].src = pictures[i].compressedImage;
        }
        caption[i].innerHtml = pictures[i].caption;
    }
}