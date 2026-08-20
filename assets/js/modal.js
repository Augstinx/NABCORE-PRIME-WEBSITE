/* ==========================================
   NABCORE PRIME LIMITED
   MODAL / DIALOG SYSTEM
   modal.js
========================================== */


/* ==========================================
   MODAL SELECTORS
========================================== */

const MODAL_SELECTORS = {

    modal:
        "[data-modal]",

    open:
        "[data-modal-open]",

    close:
        "[data-modal-close]"

};


/* ==========================================
   MODAL STATE
========================================== */

const modalStates =
    new WeakMap();


let activeModal =
    null;


let previouslyFocusedElement =
    null;


/* ==========================================
   BODY SCROLL
========================================== */

function lockBodyScroll(){

    document.body.classList.add(
        "modal-open"
    );

}


function unlockBodyScroll(){

    document.body.classList.remove(
        "modal-open"
    );

}


/* ==========================================
   FOCUSABLE ELEMENTS
========================================== */

function getFocusableElements(
    modal
){

    return Array.from(
        modal.querySelectorAll(
            [
                "a[href]",
                "button:not([disabled])",
                "input:not([disabled])",
                "textarea:not([disabled])",
                "select:not([disabled])",
                "details",
                '[tabindex]:not([tabindex="-1"])'
            ].join(",")
        )
    ).filter(
        (element) =>
            element.offsetWidth > 0 ||
            element.offsetHeight > 0 ||
            element === document.activeElement
    );

}


/* ==========================================
   FOCUS FIRST
========================================== */

function focusFirstElement(
    modal
){

    const focusable =
        getFocusableElements(
            modal
        );


    if(focusable.length){

        focusable[0].focus();

        return;

    }


    modal.setAttribute(
        "tabindex",
        "-1"
    );


    modal.focus();

}


/* ==========================================
   FOCUS TRAP
========================================== */

function handleFocusTrap(
    event
){

    if(
        !activeModal ||
        event.key !== "Tab"
    ){

        return;

    }


    const focusable =
        getFocusableElements(
            activeModal
        );


    if(!focusable.length){

        event.preventDefault();

        activeModal.focus();

        return;

    }


    const first =
        focusable[0];


    const last =
        focusable[
            focusable.length - 1
        ];


    if(
        event.shiftKey &&
        document.activeElement === first
    ){

        event.preventDefault();

        last.focus();

        return;

    }


    if(
        !event.shiftKey &&
        document.activeElement === last
    ){

        event.preventDefault();

        first.focus();

    }

}


/* ==========================================
   ESCAPE
========================================== */

function handleEscape(
    event
){

    if(
        event.key === "Escape" &&
        activeModal
    ){

        closeModal(
            activeModal
        );

    }

}


/* ==========================================
   OPEN MODAL
========================================== */

function openModal(
    modal
){

    if(!modal){
        return;
    }


    if(
        activeModal &&
        activeModal !== modal
    ){

        closeModal(
            activeModal,
            false
        );

    }


    previouslyFocusedElement =
        document.activeElement;


    activeModal =
        modal;


    modalStates.set(
        modal,
        {
            isOpen:
                true
        }
    );


    modal.classList.add(
        "is-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    lockBodyScroll();


    requestAnimationFrame(
        () => {

            focusFirstElement(
                modal
            );

        }
    );

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeModal(
    modal,
    restoreFocus = true
){

    if(!modal){
        return;
    }


    modal.classList.remove(
        "is-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    modalStates.set(
        modal,
        {
            isOpen:
                false
        }
    );


    if(
        activeModal === modal
    ){

        activeModal =
            null;

    }


    unlockBodyScroll();


    if(
        restoreFocus &&
        previouslyFocusedElement &&
        document.contains(
            previouslyFocusedElement
        )
    ){

        previouslyFocusedElement.focus();

    }


    if(restoreFocus){

        previouslyFocusedElement =
            null;

    }

}


/* ==========================================
   GET MODAL BY ID
========================================== */

function getModalById(
    id
){

    if(!id){
        return null;
    }


    return document.getElementById(
        id
    );

}


/* ==========================================
   OPEN BUTTON
========================================== */

function handleOpenClick(
    event
){

    const trigger =
        event.currentTarget;


    const modalId =
        trigger.getAttribute(
            "data-modal-open"
        );


    const modal =
        getModalById(
            modalId
        );


    if(!modal){
        return;
    }


    event.preventDefault();


    openModal(
        modal
    );

}


/* ==========================================
   CLOSE BUTTON
========================================== */

function handleCloseClick(
    event
){

    const modal =
        event.currentTarget.closest(
            MODAL_SELECTORS.modal
        );


    if(!modal){
        return;
    }


    event.preventDefault();


    closeModal(
        modal
    );

}


/* ==========================================
   BACKDROP
========================================== */

function handleModalClick(
    event
){

    const modal =
        event.currentTarget;


    if(
        event.target === modal
    ){

        closeModal(
            modal
        );

    }

}


/* ==========================================
   INITIALIZE MODAL
========================================== */

function initializeModal(
    modal
){

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    modalStates.set(
        modal,
        {
            isOpen:
                false
        }
    );


    modal.addEventListener(
        "click",
        handleModalClick
    );


    modal.querySelectorAll(
        MODAL_SELECTORS.close
    ).forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleCloseClick
            );

        }
    );

}


/* ==========================================
   INITIALIZE SYSTEM
========================================== */

export function initModal(){

    document
        .querySelectorAll(
            MODAL_SELECTORS.modal
        )
        .forEach(
            initializeModal
        );


    document
        .querySelectorAll(
            MODAL_SELECTORS.open
        )
        .forEach(
            (trigger) => {

                trigger.addEventListener(
                    "click",
                    handleOpenClick
                );

            }
        );


    document.addEventListener(
        "keydown",
        handleEscape
    );


    document.addEventListener(
        "keydown",
        handleFocusTrap
    );

}


/* ==========================================
   PUBLIC OPEN
========================================== */

export function showModal(
    id
){

    const modal =
        getModalById(
            id
        );


    if(modal){

        openModal(
            modal
        );

    }

}


/* ==========================================
   PUBLIC CLOSE
========================================== */

export function hideModal(
    id
){

    const modal =
        getModalById(
            id
        );


    if(modal){

        closeModal(
            modal
        );

    }

}


/* ==========================================
   CLOSE ALL
========================================== */

export function closeAllModals(){

    document
        .querySelectorAll(
            MODAL_SELECTORS.modal
        )
        .forEach(
            (modal) => {

                closeModal(
                    modal
                );

            }
        );

}