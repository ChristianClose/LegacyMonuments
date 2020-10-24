"use strict";
/*Runs the correct functions when the user first loads the page */
window.addEventListener("load", () => {
    //checks if user is on home page then runs the slideshow
    window.location.pathname === "/" ? slideshow() : null;
    setActive();
});

//Highlights the user's current tab by adding the active css class to the navlink element
function setActive() {
    var nav = document.getElementsByClassName("nav-link");
    var location = window.location.pathname;
    var navlinks = [];
    var navInnerText = [];

    /*Looping through each nav item to get the outerText and store each item in an Array
      Nav is a multidimensional array so we have to use the index of one to get the properties of the nav item*/
    Object.entries(nav).forEach((item) => {
        console.log(item);
        navInnerText.push(item[1].outerText.toLowerCase());
        navlinks.push(item[1]);
    });

    //Checks which page the user is on and adds the active class to it to light it up.
    if (location === "/" || location === "/dashboard") {
        nav[0].classList.add("active");
    } else {
        navInnerText.forEach((navitem) => {
            if (location.includes("/" + navitem) || location.includes("/dashboard/" + navitem)) {
                navlinks.forEach((item) => {
                    if (item.outerText.toLowerCase() === navitem) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }
}
