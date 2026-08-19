/* ==========================================
   NABCORE PRIME LIMITED
   JAVASCRIPT UTILITIES
   utilities.js
========================================== */


/* ==========================================
   DOM SELECTOR
========================================== */

/**
 * Select a single DOM element.
 *
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {Element|null}
 */

export function $(selector, context = document){

    return context.querySelector(selector);

}


/* ==========================================
   DOM SELECTOR ALL
========================================== */

/**
 * Select multiple DOM elements.
 *
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {NodeList}
 */

export function $$(selector, context = document){

    return context.querySelectorAll(selector);

}


/* ==========================================
   ELEMENT CHECK
========================================== */

/**
 * Check whether a value is a DOM element.
 *
 * @param {*} element
 * @returns {boolean}
 */

export function isElement(element){

    return element instanceof Element;

}


/* ==========================================
   REDUCED MOTION
========================================== */

/**
 * Check whether the user prefers reduced motion.
 *
 * @returns {boolean}
 */

export function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   VIEWPORT CHECK
========================================== */

/**
 * Check whether an element is currently
 * inside the viewport.
 *
 * @param {Element} element
 * @returns {boolean}
 */

export function isInViewport(element){

    if(!isElement(element)){
        return false;
    }

    const rect =
        element.getBoundingClientRect();

    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );

}


/* ==========================================
   DEBOUNCE
========================================== */

/**
 * Delay function execution until the
 * event has stopped firing.
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */

export function debounce(callback, delay = 200){

    let timeoutId;

    return (...args) => {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}


/* ==========================================
   THROTTLE
========================================== */

/**
 * Limit how frequently a function executes.
 *
 * @param {Function} callback
 * @param {number} limit
 * @returns {Function}
 */

export function throttle(callback, limit = 200){

    let waiting = false;

    return (...args) => {

        if(waiting){
            return;
        }

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, limit);

    };

}


/* ==========================================
   CURRENT YEAR
========================================== */

/**
 * Return the current calendar year.
 *
 * @returns {number}
 */

export function getCurrentYear(){

    return new Date().getFullYear();

}


/* ==========================================
   STRING NORMALIZATION
========================================== */

/**
 * Trim and normalize user-facing text.
 *
 * @param {string} value
 * @returns {string}
 */

export function normalizeText(value){

    if(typeof value !== "string"){
        return "";
    }

    return value
        .trim()
        .replace(/\s+/g, " ");

}


/* ==========================================
   SAFE JSON PARSING
========================================== */

/**
 * Safely parse JSON without throwing.
 *
 * @param {string} value
 * @param {*} fallback
 * @returns {*}
 */

export function safeJsonParse(
    value,
    fallback = null
){

    try{

        return JSON.parse(value);

    }catch(error){

        return fallback;

    }

}