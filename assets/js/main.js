/* ==========================================
   NABCORE PRIME LIMITED
   JAVASCRIPT ENTRY POINT
   main.js
========================================== */


/* ==========================================
   CORE UTILITIES
========================================== */

import {
    initUtilities
} from "./utilities.js";


/* ==========================================
   FORM VALIDATION
========================================== */

import {
    initValidation
} from "./validation.js";


/* ==========================================
   NAVIGATION
========================================== */

import {
    initNavigation
} from "./navigation.js";


/* ==========================================
   ANIMATIONS
========================================== */

import {
    initAnimations
} from "./animations.js";


/* ==========================================
   COUNTERS
========================================== */

import {
    initCounters
} from "./counters.js";


/* ==========================================
   SCROLL SYSTEM
========================================== */

import {
    initScroll
} from "./scroll.js";


/* ==========================================
   FORMS
========================================== */

import {
    initForms
} from "./forms.js";


/* ==========================================
   IMAGE GALLERY
========================================== */

import {
    initGallery
} from "./gallery.js";


/* ==========================================
   SLIDER
========================================== */

import {
    initSlider
} from "./slider.js";


/* ==========================================
   MODALS
========================================== */

import {
    initModal
} from "./modal.js";


/* ==========================================
   ACCORDION
========================================== */

import {
    initAccordion
} from "./accordion.js";


/* ==========================================
   TABS
========================================== */

import {
    initTabs
} from "./tabs.js";


/* ==========================================
   INITIALIZATION
========================================== */

function initializeWebsite(){

    /*
     * Shared utilities
     */

    initUtilities();


    /*
     * Form validation
     */

    initValidation();


    /*
     * Main navigation
     */

    initNavigation();


    /*
     * Scroll-based behavior
     */

    initScroll();


    /*
     * Scroll / reveal animations
     */

    initAnimations();


    /*
     * Statistics counters
     */

    initCounters();


    /*
     * Contact / enquiry forms
     */

    initForms();


    /*
     * Image galleries
     */

    initGallery();


    /*
     * Sliders / carousels
     */

    initSlider();


    /*
     * Modal dialogs
     */

    initModal();


    /*
     * Accordions / FAQs
     */

    initAccordion();


    /*
     * Tabs
     */

    initTabs();

}


/* ==========================================
   DOM READY
========================================== */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite,
        {
            once:true
        }
    );

}else{

    initializeWebsite();

}