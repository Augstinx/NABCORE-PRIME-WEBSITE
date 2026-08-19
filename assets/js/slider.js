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
   SLIDER CONFIGURATION
========================================== */

const SLIDER_CONFIG = {

    transitionDuration:400,

    swipeThreshold:50,

    autoplayInterval:5000

};


/* ==========================================
   SLIDER STATE
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

function getSlides(slider){

    return Array.from(
        slider.querySelectorAll(
            SLIDER_SELECTORS.slide
        )
    );

}


/* ==========================================
   GET TRACK
========================================== */

function getTrack(slider){

    return slider.querySelector(
        SLIDER_SELECTORS.track
    );

}


/* ==========================================
   GET VISIBLE SLIDES
========================================== */

function getVisibleSlides(slider){

    const slides =
        getSlides(slider);


    if(!slides.length){
        return 1;
    }


    const firstSlide =
        slides[0];


    const slideWidth =
        firstSlide.getBoundingClientRect().width;


    const track =
        getTrack(slider);


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

function getMaxIndex(slider){

    const slides =
        getSlides(slider);


    const visibleSlides =
        getVisibleSlides(slider);


    return Math.max(
        0,
        slides.length -
        visibleSlides
    );

}


/* ==========================================
   UPDATE SLIDER POSITION
========================================== */

function updateSliderPosition(
    slider,
    animate = true
){

    const track =
        getTrack(slider);


    if(!track){
        return;
    }


    const slides =
        getSlides(slider);


    const state =
        sliderStates.get(
            slider
        );


    if(
        !state ||
        !slides.length
    ){

        return;

    }


    const slide =
        slides[0];


    const slideWidth =
        slide.getBoundingClientRect().width;


    const gap =
        parseFloat(
            window.getComputedStyle(
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
        `translate3d(-${offset}px,0,0)`;

}


/* ==========================================
   UPDATE INDICATORS
========================================== */

function updateIndicators(slider){

    const indicators =
        Array.from(
            slider.querySelectorAll(
                SLIDER_SELECTORS.indicator
            )
        );


    if(!indicators.length){
        return;
    }


    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    indicators.forEach(
        (indicator, index) => {

            const isActive =
                index === state.index;


            indicator.classList.toggle(
                "active",
                isActive
            );


            indicator.setAttribute(
                "aria-current",
                isActive
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ==========================================
   UPDATE ARIA STATES
========================================== */

function updateSlideAccessibility(
    slider
){

    const slides =
        getSlides(slider);


    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const visibleSlides =
        getVisibleSlides(slider);


    slides.forEach(
        (slide, index) => {

            const isVisible =
                index >= state.index &&
                index <
                state.index +
                visibleSlides;


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

function updateControls(slider){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const maxIndex =
        getMaxIndex(slider);


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

    const maxIndex =
        getMaxIndex(slider);


    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


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
   NEXT SLIDE
========================================== */

function nextSlide(slider){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    const maxIndex =
        getMaxIndex(slider);


    if(
        state.index >= maxIndex
    ){

        return;

    }


    goToSlide(
        slider,
        state.index + 1
    );

}


/* ==========================================
   PREVIOUS SLIDE
========================================== */

function previousSlide(slider){

    const state =
        sliderStates.get(
            slider
        );


    if(!state){
        return;
    }


    if(state.index <= 0){

        return;

    }


    goToSlide(
        slider,
        state.index - 1
    );

}


/* ==========================================
   PREVIOUS BUTTON
========================================== */

function handlePreviousClick(event){

    const button =
        event.currentTarget;


    const slider =
        button.closest(
            SLIDER_SELECTORS.slider
        );


    if(!slider){
        return;
    }


    previousSlide(
        slider
    );

}


/* ==========================================
   NEXT BUTTON
========================================== */

function handleNextClick(event){

    const button =
        event.currentTarget;


    const slider =
        button.closest(
            SLIDER_SELECTORS.slider
        );


    if(!slider){
        return;
    }


    nextSlide(
        slider
    );

}


/* ==========================================
   INDICATOR CLICK
========================================== */

function handleIndicatorClick(event){

    const indicator =
        event.currentTarget;


    const slider =
        indicator.closest(
            SLIDER_SELECTORS.slider
        );


    if(!slider){
        return;
    }


    const indicators =
        Array.from(
            slider.querySelectorAll(
                SLIDER_SELECTORS.indicator
            )
        );


    const index =
        indicators.indexOf(
            indicator
        );


    if(index === -1){
        return;
    }


    goToSlide(
        slider,
        index
    );

}


/* ==========================================
   KEYBOARD NAVIGATION
========================================== */

function handleKeyboard(event){

    const slider =
        event.currentTarget;


    if(!slider){
        return;
    }


    const activeElement =
        document.activeElement;


    if(
        !slider.contains(
            activeElement
        )
    ){

        return;

    }


    switch(event.key){

        case "ArrowLeft":

            event.preventDefault();

            previousSlide(
                slider
            );

            break;


        case "ArrowRight":

            event.preventDefault();

            nextSlide(
                slider
            );

            break;


        default:

            break;

    }

}


/* ==========================================
   TOUCH / SWIPE SUPPORT
========================================== */

function initializeTouch(slider){

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
            passive:true
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


            /*
             * Ignore predominantly vertical
             * gestures.
             */

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
            passive:true
        }
    );

}


/* ==========================================
   RESIZE HANDLING
========================================== */

function handleResize(){

    sliderStates.forEach?.(() => {});

}


/* ==========================================
   INITIALIZE SLIDER
========================================== */

function initializeSlider(slider){

    const track =
        getTrack(slider);


    const slides =
        getSlides(slider);


    if(
        !track ||
        !slides.length
    ){

        return;

    }


    /*
     * Initialize state.
     */

    sliderStates.set(
        slider,
        {
            index:0
        }
    );


    /*
     * Track accessibility.
     */

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


    /*
     * Slide accessibility.
     */

    slides.forEach(
        (slide) => {

            slide.setAttribute(
                "role",
                "group"
            );

        }
    );


    /*
     * Previous control.
     */

    const previous =
        slider.querySelector(
            SLIDER_SELECTORS.previous
        );


    if(previous){

        previous.addEventListener(
            "click",
            handlePreviousClick
        );

    }


    /*
     * Next control.
     */

    const next =
        slider.querySelector(
            SLIDER_SELECTORS.next
        );


    if(next){

        next.addEventListener(
            "click",
            handleNextClick
        );

    }


    /*
     * Indicators.
     */

    const indicators =
        slider.querySelectorAll(
            SLIDER_SELECTORS.indicator
        );


    indicators.forEach(
        (indicator) => {

            indicator.addEventListener(
                "click",
                handleIndicatorClick
            );

        }
    );


    /*
     * Keyboard support.
     */

    slider.addEventListener(
        "keydown",
        handleKeyboard
    );


    /*
     * Touch support.
     */

    initializeTouch(
        slider
    );


    /*
     * Initial rendering.
     */

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
        document.querySelectorAll(
            SLIDER_SELECTORS.slider
        );


    if(!sliders.length){

        return;

    }


    sliders.forEach(
        (slider) => {

            initializeSlider(
                slider
            );

        }
    );


    /*
     * Recalculate slider position when
     * viewport dimensions change.
     */

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