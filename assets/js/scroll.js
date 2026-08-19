/* ==========================================
   NABCORE PRIME LIMITED
   SCROLL SYSTEM
   scroll.js
========================================== */


/* ==========================================
   SCROLL SELECTORS
========================================== */

const SCROLL_SELECTORS = {

    header:
        ".header",

    scrollTop:
        "[data-scroll-top]",

    anchor:
        'a[href^="#"]'

};


/* ==========================================
   SCROLL CONFIGURATION
========================================== */

const SCROLL_CONFIG = {

    headerThreshold:20,

    scrollTopThreshold:400

};


/* ==========================================
   SCROLL STATE
========================================== */

let isTicking = false;


/* ==========================================
   REDUCED MOTION
========================================== */

function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   UPDATE HEADER SCROLL STATE
========================================== */

function updateHeaderState(){

    const header =
        document.querySelector(
            SCROLL_SELECTORS.header
        );


    if(!header){
        return;
    }


    if(
        window.scrollY >
        SCROLL_CONFIG.headerThreshold
    ){

        header.classList.add(
            "scrolled"
        );

    }else{

        header.classList.remove(
            "scrolled"
        );

    }

}


/* ==========================================
   UPDATE SCROLL-TO-TOP CONTROL
========================================== */

function updateScrollTopState(){

    const scrollTopButton =
        document.querySelector(
            SCROLL_SELECTORS.scrollTop
        );


    if(!scrollTopButton){
        return;
    }


    if(
        window.scrollY >
        SCROLL_CONFIG.scrollTopThreshold
    ){

        scrollTopButton.classList.add(
            "is-visible"
        );

        scrollTopButton.removeAttribute(
            "aria-hidden"
        );

    }else{

        scrollTopButton.classList.remove(
            "is-visible"
        );

        scrollTopButton.setAttribute(
            "aria-hidden",
            "true"
        );

    }

}


/* ==========================================
   HANDLE SCROLL
========================================== */

function handleScroll(){

    /*
     * Prevent multiple layout calculations
     * during the same animation frame.
     */

    if(isTicking){
        return;
    }


    isTicking = true;


    window.requestAnimationFrame(() => {

        updateHeaderState();

        updateScrollTopState();


        isTicking = false;

    });

}


/* ==========================================
   SCROLL TO TOP
========================================== */

function scrollToTop(){

    const behavior =
        prefersReducedMotion()
            ? "auto"
            : "smooth";


    window.scrollTo({
        top:0,
        behavior
    });

}


/* ==========================================
   INITIALIZE SCROLL-TO-TOP
========================================== */

function initializeScrollTop(){

    const buttons =
        document.querySelectorAll(
            SCROLL_SELECTORS.scrollTop
        );


    if(!buttons.length){
        return;
    }


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            scrollToTop
        );

    });

}


/* ==========================================
   HANDLE HASH ANCHORS
========================================== */

function handleAnchorClick(event){

    const link =
        event.currentTarget;


    if(!link){
        return;
    }


    const href =
        link.getAttribute("href");


    if(
        !href ||
        href === "#" ||
        href.length <= 1
    ){

        return;

    }


    const targetId =
        href.substring(1);


    const target =
        document.getElementById(
            targetId
        );


    if(!target){
        return;
    }


    /*
     * Allow normal navigation when the
     * target is not on the current page.
     */

    const currentPath =
        window.location.pathname;


    const linkUrl =
        new URL(
            link.href,
            window.location.href
        );


    if(
        linkUrl.pathname !== currentPath
    ){

        return;

    }


    event.preventDefault();


    const header =
        document.querySelector(
            SCROLL_SELECTORS.header
        );


    const headerHeight =
        header
            ? header.offsetHeight
            : 0;


    const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;


    const behavior =
        prefersReducedMotion()
            ? "auto"
            : "smooth";


    window.scrollTo({
        top:Math.max(
            targetPosition,
            0
        ),
        behavior
    });


    /*
     * Update the URL without forcing
     * another browser navigation.
     */

    if(
        window.history &&
        window.history.pushState
    ){

        window.history.pushState(
            null,
            "",
            `#${targetId}`
        );

    }

}


/* ==========================================
   INITIALIZE HASH ANCHORS
========================================== */

function initializeAnchors(){

    const anchors =
        document.querySelectorAll(
            SCROLL_SELECTORS.anchor
        );


    if(!anchors.length){
        return;
    }


    anchors.forEach((anchor) => {

        anchor.addEventListener(
            "click",
            handleAnchorClick
        );

    });

}


/* ==========================================
   HANDLE INITIAL HASH
========================================== */

function handleInitialHash(){

    if(!window.location.hash){
        return;
    }


    const targetId =
        window.location.hash.substring(1);


    const target =
        document.getElementById(
            targetId
        );


    if(!target){
        return;
    }


    /*
     * Wait until the browser has completed
     * initial layout before positioning.
     */

    window.requestAnimationFrame(() => {

        const header =
            document.querySelector(
                SCROLL_SELECTORS.header
            );


        const headerHeight =
            header
                ? header.offsetHeight
                : 0;


        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;


        window.scrollTo({
            top:Math.max(
                targetPosition,
                0
            ),
            behavior:"auto"
        });

    });

}


/* ==========================================
   INITIALIZE SCROLL SYSTEM
========================================== */

export function initScroll(){

    /*
     * Initial state.
     */

    updateHeaderState();

    updateScrollTopState();


    /*
     * Scroll listener.
     */

    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive:true
        }
    );


    /*
     * Scroll-to-top controls.
     */

    initializeScrollTop();


    /*
     * Internal page anchors.
     */

    initializeAnchors();


    /*
     * Handle direct links containing
     * a hash fragment.
     */

    handleInitialHash();

}