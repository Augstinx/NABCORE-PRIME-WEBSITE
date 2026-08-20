/* ==========================================
   NABCORE PRIME LIMITED
   JAVASCRIPT UTILITIES
   utilities.js
========================================== */


/* ==========================================
   DOM SELECTOR
========================================== */

export function $(
    selector,
    context = document
){

    return context.querySelector(
        selector
    );

}


/* ==========================================
   DOM SELECTOR ALL
========================================== */

export function $$(
    selector,
    context = document
){

    return context.querySelectorAll(
        selector
    );

}


/* ==========================================
   ELEMENT CHECK
========================================== */

export function isElement(
    element
){

    return element instanceof Element;

}


/* ==========================================
   REDUCED MOTION
========================================== */

export function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   VIEWPORT CHECK
========================================== */

export function isInViewport(
    element
){

    if(
        !isElement(element)
    ){

        return false;

    }


    const rect =
        element.getBoundingClientRect();


    return (
        rect.top <
        window.innerHeight &&
        rect.bottom > 0
    );

}


/* ==========================================
   DEBOUNCE
========================================== */

export function debounce(
    callback,
    delay = 200
){

    let timeoutId;


    return (...args) => {

        clearTimeout(
            timeoutId
        );


        timeoutId =
            setTimeout(
                () => {

                    callback(
                        ...args
                    );

                },
                delay
            );

    };

}


/* ==========================================
   THROTTLE
========================================== */

export function throttle(
    callback,
    limit = 200
){

    let waiting = false;


    return (...args) => {

        if(waiting){
            return;
        }


        callback(
            ...args
        );


        waiting = true;


        setTimeout(
            () => {

                waiting = false;

            },
            limit
        );

    };

}


/* ==========================================
   CURRENT YEAR
========================================== */

export function getCurrentYear(){

    return new Date()
        .getFullYear();

}


/* ==========================================
   UPDATE CURRENT YEAR
========================================== */

export function updateCurrentYear(){

    const elements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    elements.forEach(
        (element) => {

            element.textContent =
                getCurrentYear();

        }
    );

}


/* ==========================================
   STRING NORMALIZATION
========================================== */

export function normalizeText(
    value
){

    if(
        typeof value !==
        "string"
    ){

        return "";

    }


    return value
        .trim()
        .replace(
            /\s+/g,
            " "
        );

}


/* ==========================================
   SAFE JSON PARSING
========================================== */

export function safeJsonParse(
    value,
    fallback = null
){

    try{

        return JSON.parse(
            value
        );

    }catch{

        return fallback;

    }

}


/* ==========================================
   INITIALIZE UTILITIES
========================================== */

export function initUtilities(){

    updateCurrentYear();

}