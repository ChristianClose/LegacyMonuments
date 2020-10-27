"use strict";
/***********GLOBAL VARIABLES*********/
var i = 0;
var images = [];
var captions = [];
var links = [];

if (navigator.onLine && window.location.pathname === "/") {
    (async () => { images = await getResponse("/pictures/?compressed=false"); 
                    console.log(images)
                    setImages(images)
                    slideshow()})();

}
/*************************************/


function slideshow() {
    changeImg(images);

    if (window.innerWidth < 700) {
        document.getElementById("slideshow").style.height = "200px";
    }
}

/*Sets  global images array to the array that the server sent, 
which contains the location and file names*/
function setImages(response = undefined) {
    let imgs = [];
    let caps = [];
    let link = [];
    if (response !== undefined) {
       response.forEach((item) => {
            console.log(item);
            imgs.push(item.image);
            caps.push(item.caption);
            link.push(item._id);
        });
    }
    images = imgs;
    captions = caps;
    links = link;
    imgCaption(caps);
}

/*Sets the global captions variable to the JSON object sent
 by the server. Then changes the values of the caption and link elements to
 the corresponding object values*/
function imgCaption() {
    var caption = document.getElementsByClassName("slidecaption")[0];
    var imgLink = document.getElementById("slidelink");
    var captionsSlide = captions[i];
    if(document.getElementById("slide").src !== "pictures/default.jpg"){ 
        caption.innerHTML = captionsSlide;
        //caption.href = captionsSlide.link;
        //imgLink.href = caption.href;
        imgLink.title = "Purchase " + caption.innerHTML;
        imgLink.href = "/products/" + links[i];
    } else {
        caption.innerHTML = "";
    }
}

function nextSlide(index) {
    i += index;

    if (i < 0) {
        i = images.length - 1;
    } else if (i > images.length - 1) {
        i = 0;
    }

    document.slide.src = images[i];
    //Gets the correct caption for the image
    imgCaption();

}

function changeImg(images) {
    imgCaption();
    var time = 15000;
    //var images = this.images;
    if (images !== undefined) {
        document.slide.src = images[i];
        if (i < images.length - 1) {
            i++;
        } else {
            i = 0;
        }
    }
    setTimeout(slideshow, time);
}