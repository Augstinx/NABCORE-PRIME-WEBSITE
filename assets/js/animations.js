/* ==========================================
   NABCORE PRIME LIMITED
   ANIMATION SYSTEM
   animations.js
========================================== */


/* ==========================================
   ANIMATION SELECTORS
========================================== */

const ANIMATION_SELECTORS = {

    reveal:
        "[data-animation]",

    stagger:
        "[data-animation-stagger]"

};


/* ==========================================
   REDUCED MOTION DETECTION
========================================== */

function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   APPLY REDUCED MOTION STATE
========================================== */

function disableAnimations(){

    const elements =
        document.querySelectorAll(
            ANIMATION_SELECTORS.reveal
        );


    elements.forEach((element) => {

        element.style.opacity = "1";

        element.style.transform =
            "none";

    });

}


/* ==========================================
   REVEAL ELEMENT
========================================== */

function revealElement(
    element,
    observer
){

    if(!element){
        return;
    }


    element.classList.add(
        "is-visible"
    );


    /*
     * Once revealed, the element no longer
     * needs to be observed.
     */

    if(observer){

        observer.unobserve(
            element
        );

    }

}


/* ==========================================
   CREATE REVEAL OBSERVER
========================================== */

function createRevealObserver(){

    return new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if(!entry.isIntersecting){
                    return;
                }


                revealElement(
                    entry.target,
                    observer
                );

            });

        },
        {
            threshold:0.15,

            rootMargin:
                "0px 0px -40px 0px"

        }
    );

}


/* ==========================================
   INITIALIZE REVEAL ANIMATIONS
========================================== */

function initializeRevealAnimations(){

    const elements =
        document.querySelectorAll(
            ANIMATION_SELECTORS.reveal
        );


    if(!elements.length){
        return;
    }


    const observer =
        createRevealObserver();


    elements.forEach((element) => {

        observer.observe(
            element
        );

    });

}


/* ==========================================
   STAGGER CHILDREN
========================================== */

function initializeStaggerAnimations(){

    const containers =
        document.querySelectorAll(
            ANIMATION_SELECTORS.stagger
        );


    if(!containers.length){
        return;
    }


    containers.forEach((container) => {

        const children =
            Array.from(
                container.children
            );


        children.forEach(
            (child, index) => {

                child.style.setProperty(
                    "--animation-delay",
                    `${index * 100}ms`
                );

            }
        );

    });

}


/* ==========================================
   INITIALIZE ANIMATION SYSTEM
========================================== */

export function initAnimations(){

    /*
     * Respect accessibility preferences.
     */

    if(prefersReducedMotion()){

        disableAnimations();

        return;

    }


    /*
     * Prepare staggered elements.
     */

    initializeStaggerAnimations();


    /*
     * Initialize viewport reveals.
     */

    initializeRevealAnimations();

}


/* ==========================================
   PUBLIC REFRESH FUNCTION
========================================== */

export function refreshAnimations(){

    if(prefersReducedMotion()){

        disableAnimations();

        return;

    }


    initializeStaggerAnimations();

    initializeRevealAnimations();

}