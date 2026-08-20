/* ==========================================
   NABCORE PRIME LIMITED
   STATISTICS COUNTER SYSTEM
   counters.js
========================================== */


/* ==========================================
   COUNTER SELECTOR
========================================== */

const COUNTER_SELECTOR =
    ".statistic-number[data-counter]";


/* ==========================================
   COUNTER CONFIGURATION
========================================== */

const COUNTER_CONFIG = {

    duration:
        1200,

    threshold:
        0.5

};


/* ==========================================
   FORMAT VALUE
========================================== */

function formatCounterValue(
    value,
    suffix
){

    return `${Math.floor(value)}${suffix}`;

}


/* ==========================================
   ANIMATE COUNTER
========================================== */

function animateCounter(
    element
){

    if(!element){
        return;
    }


    if(
        element.dataset.counterAnimated ===
        "true"
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
        element.dataset.suffix ||
        "";


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
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


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


        if(
            progress < 1
        ){

            requestAnimationFrame(
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


    requestAnimationFrame(
        updateCounter
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


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if(reducedMotion){

        counters.forEach(
            (counter) => {

                const target =
                    Number(
                        counter.dataset.counter
                    );


                const suffix =
                    counter.dataset.suffix ||
                    "";


                if(
                    Number.isFinite(target)
                ){

                    counter.textContent =
                        formatCounterValue(
                            target,
                            suffix
                        );

                }

            }
        );

        return;

    }


    if(
        !("IntersectionObserver" in window)
    ){

        counters.forEach(
            animateCounter
        );

        return;

    }


    const observer =
        new IntersectionObserver(
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


                        animateCounter(
                            entry.target
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold:
                    COUNTER_CONFIG.threshold
            }
        );


    counters.forEach(
        (counter) => {

            observer.observe(
                counter
            );

        }
    );

}


/* ==========================================
   RESET COUNTERS
========================================== */

export function resetCounters(){

    const counters =
        document.querySelectorAll(
            COUNTER_SELECTOR
        );


    counters.forEach(
        (counter) => {

            counter.dataset.counterAnimated =
                "false";


            const suffix =
                counter.dataset.suffix ||
                "";


            counter.textContent =
                `0${suffix}`;

        }
    );

}