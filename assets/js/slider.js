/* ==========================================
   NABCORE PRIME LIMITED
   SLIDER / CAROUSEL SYSTEM
   slider.js
========================================== */


/* ==========================================
   SLIDER SELECTORS
========================================== */

const SLIDER_SELECTORS = {

    slider:
        "[data-slider]",

    track:
        "[data-slider-track]",

    slide:
        "[data-slide]",

    previous:
        "[data-slider-prev]",

    next:
        "[data-slider-next]",

    indicator:
        "[data-slider-indicator]"

};


/* ==========================================
   CONFIGURATION
========================================== */

const SLIDER_CONFIG = {

    transitionDuration:
        400,

    swipeThreshold:
        50

};


/* ==========================================
   STATE
========================================== */

const sliderStates =
    new WeakMap();


/* ==========================================
   REDUCED MOTION
========================================== */

function prefersReducedMotion(){

    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

}


/* ==========================================
   GET SLIDES
========================================== */

function getSlides(
    slider
){

    return Array.from(
        slider.querySelectorAll(
            SLIDER_SELECTORS.slide
        )
    );

}


/* ==========================================
   GET TRACK
========================================== */

function getTrack(
    slider
){

    return slider.querySelector(
        SLIDER_SELECTORS.track
    );

}


/* ==========================================
   GET VISIBLE SLIDES
========================================== */

function getVisibleSlides(
    slider
){

    const slides =
        getSlides(
            slider
        );


    if(!slides.length){
        return 1;
    }


    const firstSlide =
        slides[0];


    const slideWidth =
        firstSlide.getBoundingClientRect().width;


    const track =
        getTrack(
            slider
        );


    if(
        !track ||
        !slideWidth
    ){

        return 1;

    }


    const trackWidth =
        track.getBoundingClientRect().width;


    return Math.max(
        1,
        Math.floor(
            trackWidth /
            slideWidth
        )
    );

}


/* ==========================================
   GET MAX INDEX
========================================== */

function getMaxIndex(
    slider
){

    const slides =
        getSlides(
            slider
        );


    return Math.max(
        0,
        slides.length -
        getVisibleSlides(
            slider
        )
    );

}


/* ==========================================
   UPDATE POSITION
========================================== */

function updateSliderPosition(
    slider,
    animate = true
){

    const track =
        getTrack(
            slider
        );


    const slides =
        getSlides(
            slider
        );


    const state =
        sliderStates.get(
            slider
        );


    if(
        !track ||
        !slides.length ||
        !state
    ){

        return;

    }


    const slideWidth =
        slides[0]
            .getBoundingClientRect()
            .width;


    const gap =
        parseFloat(
            getComputedStyle(
                track
            ).gap
        ) || 0;


    const offset =
        state.index *
        (slideWidth + gap);


    track.style.transition =
        animate &&
        !prefersReducedMotion()
            ? `transform ${SLIDER_CONFIG.transitionDuration}ms ease`
            : "none";


    track.style.transform =
        `translate3d(-${offset}px, 0, 0)`;

}


/* ==========================================
   UPDATE INDICATORS
========================================== */

function updateIndicators(
    slider
){

    const indicators =
        Array.from(
            slider.querySelectorAll(
                SLIDER_SELECTORS.indicator
            )
        );


    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    indicators.forEach(
        (
            indicator,
            index
        ) => {

            const active =
                index === state.index;


            indicator.classList.toggle(
                "active",
                active
            );


            indicator.setAttribute(
                "aria-current",
                active
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ==========================================
   UPDATE ACCESSIBILITY
========================================== */

function updateSlideAccessibility(
    slider
){

    const slides =
        getSlides(
            slider
        );


    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const visible =
        getVisibleSlides(
            slider
        );


    slides.forEach(
        (
            slide,
            index
        ) => {

            const isVisible =
                index >= state.index &&
                index <
                state.index + visible;


            slide.setAttribute(
                "aria-hidden",
                isVisible
                    ? "false"
                    : "true"
            );

        }
    );

}


/* ==========================================
   UPDATE CONTROLS
========================================== */

function updateControls(
    slider
){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const maxIndex =
        getMaxIndex(
            slider
        );


    const previous =
        slider.querySelector(
            SLIDER_SELECTORS.previous
        );


    const next =
        slider.querySelector(
            SLIDER_SELECTORS.next
        );


    if(previous){

        previous.disabled =
            state.index <= 0;

    }


    if(next){

        next.disabled =
            state.index >= maxIndex;

    }

}


/* ==========================================
   UPDATE SLIDER
========================================== */

function updateSlider(
    slider,
    animate = true
){

    updateSliderPosition(
        slider,
        animate
    );


    updateIndicators(
        slider
    );


    updateSlideAccessibility(
        slider
    );


    updateControls(
        slider
    );

}


/* ==========================================
   GO TO SLIDE
========================================== */

function goToSlide(
    slider,
    index,
    animate = true
){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const maxIndex =
        getMaxIndex(
            slider
        );


    state.index =
        Math.max(
            0,
            Math.min(
                index,
                maxIndex
            )
        );


    updateSlider(
        slider,
        animate
    );

}


/* ==========================================
   NEXT
========================================== */

function nextSlide(
    slider
){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    goToSlide(
        slider,
        state.index + 1
    );

}


/* ==========================================
   PREVIOUS
========================================== */

function previousSlide(
    slider
){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    goToSlide(
        slider,
        state.index - 1
    );

}


/* ==========================================
   INITIALIZE TOUCH
========================================== */

function initializeTouch(
    slider
){

    let startX = 0;
    let startY = 0;


    slider.addEventListener(
        "touchstart",
        (event) => {

            const touch =
                event.changedTouches[0];


            if(!touch){
                return;
            }


            startX =
                touch.clientX;


            startY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        (event) => {

            const touch =
                event.changedTouches[0];


            if(!touch){
                return;
            }


            const deltaX =
                touch.clientX -
                startX;


            const deltaY =
                touch.clientY -
                startY;


            if(
                Math.abs(deltaY) >
                Math.abs(deltaX)
            ){

                return;

            }


            if(
                Math.abs(deltaX) <
                SLIDER_CONFIG.swipeThreshold
            ){

                return;

            }


            if(deltaX < 0){

                nextSlide(
                    slider
                );

            }else{

                previousSlide(
                    slider
                );

            }

        },
        {
            passive: true
        }
    );

}


/* ==========================================
   INITIALIZE SLIDER
========================================== */

function initializeSlider(
    slider
){

    const track =
        getTrack(
            slider
        );


    const slides =
        getSlides(
            slider
        );


    if(
        !track ||
        !slides.length
    ){

        return;

    }


    sliderStates.set(
        slider,
        {
            index: 0
        }
    );


    slider.setAttribute(
        "role",
        "region"
    );


    if(
        !slider.hasAttribute(
            "aria-label"
        )
    ){

        slider.setAttribute(
            "aria-label",
            "Content slider"
        );

    }


    slides.forEach(
        (slide) => {

            slide.setAttribute(
                "role",
                "group"
            );

        }
    );


    const previous =
        slider.querySelector(
            SLIDER_SELECTORS.previous
        );


    const next =
        slider.querySelector(
            SLIDER_SELECTORS.next
        );


    if(previous){

        previous.addEventListener(
            "click",
            () =>
                previousSlide(
                    slider
                )
        );

    }


    if(next){

        next.addEventListener(
            "click",
            () =>
                nextSlide(
                    slider
                )
        );

    }


    slider
        .querySelectorAll(
            SLIDER_SELECTORS.indicator
        )
        .forEach(
            (
                indicator,
                index
            ) => {

                indicator.addEventListener(
                    "click",
                    () =>
                        goToSlide(
                            slider,
                            index
                        )
                );

            }
        );


    slider.addEventListener(
        "keydown",
        (event) => {

            if(
                !slider.contains(
                    document.activeElement
                )
            ){

                return;

            }


            if(
                event.key ===
                "ArrowLeft"
            ){

                event.preventDefault();

                previousSlide(
                    slider
                );

            }


            if(
                event.key ===
                "ArrowRight"
            ){

                event.preventDefault();

                nextSlide(
                    slider
                );

            }

        }
    );


    initializeTouch(
        slider
    );


    updateSlider(
        slider,
        false
    );

}


/* ==========================================
   INITIALIZE ALL SLIDERS
========================================== */

export function initSlider(){

    const sliders =
        Array.from(
            document.querySelectorAll(
                SLIDER_SELECTORS.slider
            )
        );


    if(!sliders.length){
        return;
    }


    sliders.forEach(
        initializeSlider
    );


    window.addEventListener(
        "resize",
        () => {

            sliders.forEach(
                (slider) => {

                    updateSlider(
                        slider,
                        false
                    );

                }
            );

        }
    );

}