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


/* ==========================================
   CURRENT ACTIVE MODAL
========================================== */

let activeModal = null;


/* ==========================================
   PREVIOUSLY FOCUSED ELEMENT
========================================== */

let previouslyFocusedElement = null;


/* ==========================================
   BODY SCROLL LOCK
========================================== */

function lockBodyScroll(){

    document.body.classList.add(
        "modal-open"
    );

}


/* ==========================================
   BODY SCROLL UNLOCK
========================================== */

function unlockBodyScroll(){

    document.body.classList.remove(
        "modal-open"
    );

}


/* ==========================================
   GET FOCUSABLE ELEMENTS
========================================== */

function getFocusableElements(modal){

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
        (element) => {

            return (
                element.offsetWidth > 0 ||
                element.offsetHeight > 0 ||
                element === document.activeElement
            );

        }
    );

}


/* ==========================================
   FOCUS FIRST ELEMENT
========================================== */

function focusFirstElement(modal){

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
   HANDLE FOCUS TRAP
========================================== */

function handleFocusTrap(event){

    if(!activeModal){
        return;
    }


    if(event.key !== "Tab"){
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
   HANDLE ESCAPE
========================================== */

function handleEscape(event){

    if(
        event.key !== "Escape" ||
        !activeModal
    ){

        return;

    }


    closeModal(
        activeModal
    );

}


/* ==========================================
   OPEN MODAL
========================================== */

function openModal(modal){

    if(!modal){
        return;
    }


    /*
     * Close another modal first if one
     * is already active.
     */

    if(
        activeModal &&
        activeModal !== modal
    ){

        closeModal(
            activeModal
        );

    }


    previouslyFocusedElement =
        document.activeElement;


    activeModal =
        modal;


    modalStates.set(
        modal,
        {
            isOpen:true
        }
    );


    /*
     * Make the modal visible.
     */

    modal.classList.add(
        "is-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Prevent the page behind the modal
     * from scrolling.
     */

    lockBodyScroll();


    /*
     * Focus the first available control.
     */

    window.requestAnimationFrame(
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

function closeModal(modal){

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
            isOpen:false
        }
    );


    if(activeModal === modal){

        activeModal =
            null;

    }


    unlockBodyScroll();


    /*
     * Restore focus to the element that
     * originally opened the modal.
     */

    if(
        previouslyFocusedElement &&
        document.contains(
            previouslyFocusedElement
        )
    ){

        previouslyFocusedElement.focus();

    }


    previouslyFocusedElement =
        null;

}


/* ==========================================
   TOGGLE MODAL
========================================== */

function toggleModal(modal){

    if(!modal){
        return;
    }


    const state =
        modalStates.get(
            modal
        );


    if(
        state?.isOpen
    ){

        closeModal(
            modal
        );

    }else{

        openModal(
            modal
        );

    }

}


/* ==========================================
   FIND MODAL BY ID
========================================== */

function getModalById(id){

    if(!id){
        return null;
    }


    return document.getElementById(
        id
    );

}


/* ==========================================
   OPEN BUTTON HANDLER
========================================== */

function handleOpenClick(event){

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
   CLOSE BUTTON HANDLER
========================================== */

function handleCloseClick(event){

    const trigger =
        event.currentTarget;


    const modal =
        trigger.closest(
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
   BACKDROP CLICK
========================================== */

function handleModalClick(event){

    const modal =
        event.currentTarget;


    /*
     * Only close when the actual modal
     * backdrop itself is clicked.
     *
     * Clicking content inside the modal
     * does not close it.
     */

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

function initializeModal(modal){

    if(
        !modal.hasAttribute(
            "aria-hidden"
        )
    ){

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    modalStates.set(
        modal,
        {
            isOpen:false
        }
    );


    /*
     * Backdrop click.
     */

    modal.addEventListener(
        "click",
        handleModalClick
    );


    /*
     * Close controls.
     */

    const closeButtons =
        modal.querySelectorAll(
            MODAL_SELECTORS.close
        );


    closeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                handleCloseClick
            );

        }
    );

}


/* ==========================================
   INITIALIZE MODAL TRIGGERS
========================================== */

function initializeModalTriggers(){

    const triggers =
        document.querySelectorAll(
            MODAL_SELECTORS.open
        );


    triggers.forEach(
        (trigger) => {

            trigger.addEventListener(
                "click",
                handleOpenClick
            );

        }
    );

}


/* ==========================================
   INITIALIZE GLOBAL KEYBOARD EVENTS
========================================== */

function initializeKeyboardEvents(){

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
   CLOSE ALL MODALS
========================================== */

export function closeAllModals(){

    const modals =
        document.querySelectorAll(
            MODAL_SELECTORS.modal
        );


    modals.forEach(
        (modal) => {

            closeModal(
                modal
            );

        }
    );

}


/* ==========================================
   PUBLIC OPEN MODAL
========================================== */

export function showModal(id){

    const modal =
        getModalById(
            id
        );


    if(!modal){
        return;
    }


    openModal(
        modal
    );

}


/* ==========================================
   PUBLIC CLOSE MODAL
========================================== */

export function hideModal(id){

    const modal =
        getModalById(
            id
        );


    if(!modal){
        return;
    }


    closeModal(
        modal
    );

}


/* ==========================================
   INITIALIZE MODAL SYSTEM
========================================== */

export function initModal(){

    const modals =
        document.querySelectorAll(
            MODAL_SELECTORS.modal
        );


    modals.forEach(
        (modal) => {

            initializeModal(
                modal
            );

        }
    );


    initializeModalTriggers();

    initializeKeyboardEvents();

}