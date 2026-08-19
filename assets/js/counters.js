/* ==========================================
   NABCORE PRIME LIMITED
   STATISTICS COUNTER SYSTEM
   counters.js
========================================== */


/* ==========================================
   COUNTER SELECTORS
========================================== */

const COUNTER_SELECTOR =
    ".statistic-number[data-counter]";


/* ==========================================
   COUNTER CONFIGURATION
========================================== */

const COUNTER_CONFIG = {

    duration:1200,

    threshold:0.5

};


/* ==========================================
   FORMAT COUNTER VALUE
========================================== */

function formatCounterValue(
    value,
    suffix
){

    const roundedValue =
        Math.floor(value);


    return `${roundedValue}${suffix}`;

}


/* ==========================================
   ANIMATE COUNTER
========================================== */

function animateCounter(element){

    if(!element){
        return;
    }


    /*
     * Prevent the same counter from
     * being animated more than once.
     */

    if(
        element.dataset.counterAnimated === "true"
    ){

        return;

    }


    const target =
        Number(
            element.dataset.counter
        );


    if(
        !Number.isFinite(target) ||
        target < 0
    ){

        return;

    }


    const suffix =
        element.dataset.suffix || "";


    const duration =
        Number(
            element.dataset.duration
        ) ||
        COUNTER_CONFIG.duration;


    element.dataset.counterAnimated =
        "true";


    const startTime =
        performance.now();


    function updateCounter(
        currentTime
    ){

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Ease-out function.
         *
         * Starts quickly and slows smoothly
         * near the target value.
         */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            target *
            easedProgress;


        element.textContent =
            formatCounterValue(
                currentValue,
                suffix
            );


        if(progress < 1){

            window.requestAnimationFrame(
                updateCounter
            );

        }else{

            element.textContent =
                formatCounterValue(
                    target,
                    suffix
                );

        }

    }


    window.requestAnimationFrame(
        updateCounter
    );

}


/* ==========================================
   CREATE COUNTER OBSERVER
========================================== */

function createCounterObserver(){

    return new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if(
                    !entry.isIntersecting
                ){

                    return;

                }


                animateCounter(
                    entry.target
                );


                observer.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold:
                COUNTER_CONFIG.threshold
        }
    );

}


/* ==========================================
   INITIALIZE COUNTERS
========================================== */

export function initCounters(){

    const counters =
        document.querySelectorAll(
            COUNTER_SELECTOR
        );


    if(!counters.length){

        return;

    }


    /*
     * Respect reduced-motion preferences.
     *
     * Users who prefer reduced motion
     * receive the final values immediately.
     */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if(reducedMotion){

        counters.forEach((counter) => {

            const target =
                Number(
                    counter.dataset.counter
                );


            const suffix =
                counter.dataset.suffix || "";


            if(
                Number.isFinite(target)
            ){

                counter.textContent =
                    formatCounterValue(
                        target,
                        suffix
                    );

            }

        });

        return;

    }


    const observer =
        createCounterObserver();


    counters.forEach((counter) => {

        observer.observe(
            counter
        );

    });

}


/* ==========================================
   RESET COUNTERS
========================================== */

export function resetCounters(){

    const counters =
        document.querySelectorAll(
            COUNTER_SELECTOR
        );


    counters.forEach((counter) => {

        counter.dataset.counterAnimated =
            "false";


        const suffix =
            counter.dataset.suffix || "";


        counter.textContent =
            `0${suffix}`;

    });

}