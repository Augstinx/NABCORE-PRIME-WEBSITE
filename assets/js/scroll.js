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

    headerThreshold:
        20,

    scrollTopThreshold:
        400

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
   UPDATE HEADER STATE
========================================== */

function updateHeaderState(){

    const header =
        document.querySelector(
            SCROLL_SELECTORS.header
        );


    if(!header){
        return;
    }


    header.classList.toggle(
        "scrolled",
        window.scrollY >
        SCROLL_CONFIG.headerThreshold
    );

}


/* ==========================================
   UPDATE SCROLL TOP
========================================== */

function updateScrollTopState(){

    const buttons =
        document.querySelectorAll(
            SCROLL_SELECTORS.scrollTop
        );


    if(!buttons.length){
        return;
    }


    const visible =
        window.scrollY >
        SCROLL_CONFIG.scrollTopThreshold;


    buttons.forEach(
        (button) => {

            button.classList.toggle(
                "is-visible",
                visible
            );


            button.setAttribute(
                "aria-hidden",
                visible
                    ? "false"
                    : "true"
            );

        }
    );

}


/* ==========================================
   HANDLE SCROLL
========================================== */

function handleScroll(){

    if(isTicking){
        return;
    }


    isTicking = true;


    window.requestAnimationFrame(
        () => {

            updateHeaderState();

            updateScrollTopState();

            isTicking = false;

        }
    );

}


/* ==========================================
   SCROLL TO TOP
========================================== */

function scrollToTop(){

    window.scrollTo({

        top: 0,

        behavior:
            prefersReducedMotion()
                ? "auto"
                : "smooth"

    });

}


/* ==========================================
   INITIALIZE SCROLL TOP
========================================== */

function initializeScrollTop(){

    const buttons =
        document.querySelectorAll(
            SCROLL_SELECTORS.scrollTop
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                scrollToTop
            );

        }
    );

}


/* ==========================================
   HANDLE HASH ANCHOR
========================================== */

function handleAnchorClick(
    event
){

    const link =
        event.currentTarget;


    const href =
        link.getAttribute(
            "href"
        );


    if(
        !href ||
        href === "#" ||
        href.length <= 1
    ){

        return;

    }


    const linkUrl =
        new URL(
            link.href,
            window.location.href
        );


    if(
        linkUrl.pathname !==
        window.location.pathname
    ){

        return;

    }


    const targetId =
        decodeURIComponent(
            href.substring(1)
        );


    const target =
        document.getElementById(
            targetId
        );


    if(!target){
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


    window.scrollTo({

        top:
            Math.max(
                targetPosition,
                0
            ),

        behavior:
            prefersReducedMotion()
                ? "auto"
                : "smooth"

    });


    history.pushState(
        null,
        "",
        `#${targetId}`
    );

}


/* ==========================================
   INITIALIZE ANCHORS
========================================== */

function initializeAnchors(){

    const anchors =
        document.querySelectorAll(
            SCROLL_SELECTORS.anchor
        );


    anchors.forEach(
        (anchor) => {

            anchor.addEventListener(
                "click",
                handleAnchorClick
            );

        }
    );

}


/* ==========================================
   HANDLE INITIAL HASH
========================================== */

function handleInitialHash(){

    if(
        !window.location.hash
    ){

        return;

    }


    const targetId =
        decodeURIComponent(
            window.location.hash.substring(1)
        );


    const target =
        document.getElementById(
            targetId
        );


    if(!target){
        return;
    }


    window.requestAnimationFrame(
        () => {

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

                top:
                    Math.max(
                        targetPosition,
                        0
                    ),

                behavior:
                    "auto"

            });

        }
    );

}


/* ==========================================
   INITIALIZE SCROLL SYSTEM
========================================== */

export function initScroll(){

    updateHeaderState();

    updateScrollTopState();


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    initializeScrollTop();

    initializeAnchors();

    handleInitialHash();

}