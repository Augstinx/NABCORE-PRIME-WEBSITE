/* ==========================================
   NABCORE PRIME LIMITED
   NAVIGATION SYSTEM
   navigation.js
========================================== */

import {
    $,
    $$,
    debounce
} from "./utilities.js";


/* ==========================================
   NAVIGATION SELECTORS
========================================== */

const SELECTORS = {

    toggle: ".menu-toggle",

    navigation: "#main-navigation",

    links: ".nav-menu a"

};


/* ==========================================
   NAVIGATION STATE
========================================== */

let menuToggle = null;
let navigation = null;
let navigationLinks = null;


/* ==========================================
   OPEN MOBILE MENU
========================================== */

function openMenu(){

    if(!menuToggle || !navigation){
        return;
    }


    navigation.classList.add(
        "is-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

}


/* ==========================================
   CLOSE MOBILE MENU
========================================== */

function closeMenu(){

    if(!menuToggle || !navigation){
        return;
    }


    navigation.classList.remove(
        "is-open"
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

}


/* ==========================================
   TOGGLE MOBILE MENU
========================================== */

function toggleMenu(){

    if(!menuToggle || !navigation){
        return;
    }


    const isOpen =
        navigation.classList.contains(
            "is-open"
        );


    if(isOpen){

        closeMenu();

    }else{

        openMenu();

    }

}


/* ==========================================
   GET CURRENT PAGE
========================================== */

/**
 * Determine the current page from the
 * browser URL.
 *
 * @returns {string}
 */

function getCurrentPage(){

    const pathname =
        window.location.pathname;


    /*
     * Root website.
     */

    if(
        pathname === "/" ||
        pathname.endsWith("/")
    ){

        return "index.html";

    }


    /*
     * Return the final path segment.
     */

    const segments =
        pathname
            .split("/")
            .filter(Boolean);


    return (
        segments.pop() ||
        "index.html"
    );

}


/* ==========================================
   GET LINK PAGE
========================================== */

/**
 * Get the page filename represented
 * by a navigation link.
 *
 * @param {HTMLAnchorElement} link
 * @returns {string}
 */

function getLinkPage(link){

    if(!link){
        return "";
    }


    const href =
        link.getAttribute("href");


    if(
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
    ){

        return "";

    }


    /*
     * Remove query strings and hashes.
     */

    const cleanHref =
        href.split("#")[0]
            .split("?")[0];


    /*
     * Root homepage.
     */

    if(
        cleanHref === "" ||
        cleanHref === "/" ||
        cleanHref.endsWith("/")
    ){

        return "index.html";

    }


    const segments =
        cleanHref
            .split("/")
            .filter(Boolean);


    return (
        segments.pop() ||
        "index.html"
    );

}


/* ==========================================
   SET ACTIVE PAGE
========================================== */

function setActivePage(){

    if(!navigationLinks){
        return;
    }


    const currentPage =
        getCurrentPage();


    navigationLinks.forEach((link) => {

        const linkPage =
            getLinkPage(link);


        /*
         * Remove previous state.
         */

        link.classList.remove(
            "active"
        );

        link.removeAttribute(
            "aria-current"
        );


        /*
         * Ignore links that do not represent
         * a navigable page.
         */

        if(!linkPage){
            return;
        }


        /*
         * Mark current page.
         */

        if(linkPage === currentPage){

            link.classList.add(
                "active"
            );

            link.setAttribute(
                "aria-current",
                "page"
            );

        }

    });

}


/* ==========================================
   NAVIGATION LINK HANDLERS
========================================== */

function handleNavigationClick(){

    /*
     * Close the mobile menu after a
     * navigation link is selected.
     */

    closeMenu();

}


/* ==========================================
   KEYBOARD HANDLING
========================================== */

function handleKeydown(event){

    /*
     * Escape closes the mobile menu.
     */

    if(
        event.key === "Escape" &&
        navigation?.classList.contains(
            "is-open"
        )
    ){

        closeMenu();

        menuToggle?.focus();

    }

}


/* ==========================================
   RESIZE HANDLING
========================================== */

function handleResize(){

    /*
     * When returning to desktop layout,
     * remove the mobile menu state.
     */

    if(
        window.innerWidth > 768
    ){

        closeMenu();

    }

}


/* ==========================================
   INITIALIZE NAVIGATION
========================================== */

export function initNavigation(){

    menuToggle =
        $(SELECTORS.toggle);


    navigation =
        $(SELECTORS.navigation);


    navigationLinks =
        $$(SELECTORS.links);


    /*
     * Nothing to initialize if the page
     * does not contain navigation.
     */

    if(
        !menuToggle ||
        !navigation
    ){

        return;

    }


    /* ------------------------------------------
       INITIAL ARIA STATE
    ------------------------------------------ */

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );


    /* ------------------------------------------
       MOBILE MENU TOGGLE
    ------------------------------------------ */

    menuToggle.addEventListener(
        "click",
        toggleMenu
    );


    /* ------------------------------------------
       NAVIGATION LINKS
    ------------------------------------------ */

    navigationLinks.forEach((link) => {

        link.addEventListener(
            "click",
            handleNavigationClick
        );

    });


    /* ------------------------------------------
       KEYBOARD
    ------------------------------------------ */

    document.addEventListener(
        "keydown",
        handleKeydown
    );


    /* ------------------------------------------
       RESIZE
    ------------------------------------------ */

    window.addEventListener(
        "resize",
        debounce(
            handleResize,
            150
        )
    );


    /* ------------------------------------------
       ACTIVE PAGE
    ------------------------------------------ */

    setActivePage();

}