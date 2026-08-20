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
   REDUCED MOTION
========================================== */

function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   DISABLE ANIMATIONS
========================================== */

function disableAnimations(){

    const elements =
        document.querySelectorAll(
            ANIMATION_SELECTORS.reveal
        );


    elements.forEach(
        (element) => {

            element.style.opacity =
                "1";


            element.style.transform =
                "none";


            element.classList.add(
                "is-visible"
            );

        }
    );

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


    if(observer){

        observer.unobserve(
            element
        );

    }

}


/* ==========================================
   CREATE OBSERVER
========================================== */

function createRevealObserver(){

    return new IntersectionObserver(
        (
            entries,
            observer
        ) => {

            entries.forEach(
                (entry) => {

                    if(
                        !entry.isIntersecting
                    ){

                        return;

                    }


                    revealElement(
                        entry.target,
                        observer
                    );

                }
            );

        },
        {
            threshold:
                0.15,

            rootMargin:
                "0px 0px -40px 0px"
        }
    );

}


/* ==========================================
   INITIALIZE REVEALS
========================================== */

function initializeRevealAnimations(){

    const elements =
        document.querySelectorAll(
            ANIMATION_SELECTORS.reveal
        );


    if(!elements.length){
        return;
    }


    if(
        !("IntersectionObserver" in window)
    ){

        elements.forEach(
            (element) => {

                revealElement(
                    element
                );

            }
        );

        return;

    }


    const observer =
        createRevealObserver();


    elements.forEach(
        (element) => {

            observer.observe(
                element
            );

        }
    );

}


/* ==========================================
   INITIALIZE STAGGER
========================================== */

function initializeStaggerAnimations(){

    const containers =
        document.querySelectorAll(
            ANIMATION_SELECTORS.stagger
        );


    containers.forEach(
        (container) => {

            Array.from(
                container.children
            ).forEach(
                (
                    child,
                    index
                ) => {

                    child.style.setProperty(
                        "--animation-delay",
                        `${index * 100}ms`
                    );

                }
            );

        }
    );

}


/* ==========================================
   INITIALIZE ANIMATIONS
========================================== */

export function initAnimations(){

    if(
        prefersReducedMotion()
    ){

        disableAnimations();

        return;

    }


    initializeStaggerAnimations();

    initializeRevealAnimations();

}


/* ==========================================
   REFRESH ANIMATIONS
========================================== */

export function refreshAnimations(){

    if(
        prefersReducedMotion()
    ){

        disableAnimations();

        return;

    }


    initializeStaggerAnimations();

    initializeRevealAnimations();

}