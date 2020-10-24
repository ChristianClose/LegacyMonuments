"use strict";
//Sends a get request to the server based on the provided parameter
function getResponse(getURL, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', getURL);
    xhr.send();

    xhr.onload = function () {
        var DONE = 4;
        var OK = 200;

        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                //if all is well continue to the next function
                successResponse(JSON.parse(xhr.response), callback);
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
}

function successResponse(response, callback) {
    if(callback){
        callback(response);
    } else {
        return response;
    }
   
}
