/* ==========================================
   NABCORE PRIME LIMITED
   MAIN NAVIGATION SYSTEM
   navigation.js
========================================== */


/* ==========================================
   NAVIGATION SELECTORS
========================================== */

const NAVIGATION_SELECTORS = {

    menuToggle:
        ".menu-toggle",

    navigation:
        ".main-navigation"

};


/* ==========================================
   NAVIGATION CONFIGURATION
========================================== */

const NAVIGATION_CONFIG = {

    mobileBreakpoint:
        768

};


/* ==========================================
   INITIALIZE NAVIGATION
========================================== */

export function initNavigation(){

    const menuToggle =
        document.querySelector(
            NAVIGATION_SELECTORS.menuToggle
        );


    const navigation =
        document.querySelector(
            NAVIGATION_SELECTORS.navigation
        );


    if(
        !menuToggle ||
        !navigation
    ){

        console.warn(
            "NABCORE PRIME: Navigation initialization skipped. Required navigation elements were not found."
        );

        return;

    }


    /* ==========================================
       INITIAL ARIA STATE
    ========================================== */

    if(
        !navigation.id
    ){

        navigation.id =
            "main-navigation";

    }


    menuToggle.setAttribute(
        "aria-controls",
        navigation.id
    );


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );


    /* ==========================================
       OPEN NAVIGATION
    ========================================== */

    function openNavigation(){

        navigation.classList.add(
            "is-open"
        );


        menuToggle.classList.add(
            "is-active"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );


        document.body.classList.add(
            "navigation-open"
        );

    }


    /* ==========================================
       CLOSE NAVIGATION
    ========================================== */

    function closeNavigation(){

        navigation.classList.remove(
            "is-open"
        );


        menuToggle.classList.remove(
            "is-active"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );


        document.body.classList.remove(
            "navigation-open"
        );

    }


    /* ==========================================
       TOGGLE NAVIGATION
    ========================================== */

    function toggleNavigation(){

        const isOpen =
            navigation.classList.contains(
                "is-open"
            );


        if(isOpen){

            closeNavigation();

        }else{

            openNavigation();

        }

    }


    /* ==========================================
       MOBILE MENU BUTTON
    ========================================== */

    menuToggle.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            toggleNavigation();

        }
    );


    /* ==========================================
       NAVIGATION LINKS
    ========================================== */

    const navigationLinks =
        navigation.querySelectorAll(
            "a"
        );


    navigationLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    closeNavigation();

                }
            );

        }
    );


    /* ==========================================
       ESCAPE KEY
    ========================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if(
                event.key !==
                "Escape"
            ){

                return;

            }


            if(
                navigation.classList.contains(
                    "is-open"
                )
            ){

                closeNavigation();

                menuToggle.focus();

            }

        }
    );


    /* ==========================================
       OUTSIDE CLICK
    ========================================== */

    document.addEventListener(
        "click",
        (event) => {

            if(
                !navigation.classList.contains(
                    "is-open"
                )
            ){

                return;

            }


            const clickedInsideNavigation =
                navigation.contains(
                    event.target
                );


            const clickedMenuToggle =
                menuToggle.contains(
                    event.target
                );


            if(
                !clickedInsideNavigation &&
                !clickedMenuToggle
            ){

                closeNavigation();

            }

        }
    );


    /* ==========================================
       RESPONSIVE CLEANUP
    ========================================== */

    window.addEventListener(
        "resize",
        () => {

            if(
                window.innerWidth >
                NAVIGATION_CONFIG.mobileBreakpoint
            ){

                closeNavigation();

            }

        }
    );


    /* ==========================================
       INITIAL STATE
    ========================================== */

    closeNavigation();


    console.info(
        "NABCORE PRIME: Navigation initialized successfully."
    );

}