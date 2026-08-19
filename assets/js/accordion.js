/* ==========================================
   NABCORE PRIME LIMITED
   ACCORDION SYSTEM
   accordion.js
========================================== */


/* ==========================================
   ACCORDION SELECTORS
========================================== */

const ACCORDION_SELECTORS = {

    accordion:
        "[data-accordion]",

    item:
        "[data-accordion-item]",

    trigger:
        "[data-accordion-trigger]",

    content:
        "[data-accordion-content]"

};


/* ==========================================
   ACCORDION STATE
========================================== */

const accordionStates =
    new WeakMap();


/* ==========================================
   GET ACCORDION ITEMS
========================================== */

function getAccordionItems(accordion){

    return Array.from(
        accordion.querySelectorAll(
            ACCORDION_SELECTORS.item
        )
    );

}


/* ==========================================
   GET TRIGGER
========================================== */

function getTrigger(item){

    return item.querySelector(
        ACCORDION_SELECTORS.trigger
    );

}


/* ==========================================
   GET CONTENT
========================================== */

function getContent(item){

    return item.querySelector(
        ACCORDION_SELECTORS.content
    );

}


/* ==========================================
   GET ITEM STATE
========================================== */

function isItemOpen(item){

    return item.classList.contains(
        "is-open"
    );

}


/* ==========================================
   SET CONTENT HEIGHT
========================================== */

function setContentHeight(
    content,
    isOpen
){

    if(!content){
        return;
    }


    if(isOpen){

        content.style.maxHeight =
            `${content.scrollHeight}px`;

    }else{

        content.style.maxHeight =
            "0px";

    }

}


/* ==========================================
   UPDATE ACCESSIBILITY
========================================== */

function updateAccessibility(
    item,
    isOpen
){

    const trigger =
        getTrigger(item);


    const content =
        getContent(item);


    if(trigger){

        trigger.setAttribute(
            "aria-expanded",
            isOpen
                ? "true"
                : "false"
        );

    }


    if(content){

        content.setAttribute(
            "aria-hidden",
            isOpen
                ? "false"
                : "true"
        );

    }

}


/* ==========================================
   CLOSE ITEM
========================================== */

function closeItem(item){

    const content =
        getContent(item);


    item.classList.remove(
        "is-open"
    );


    updateAccessibility(
        item,
        false
    );


    setContentHeight(
        content,
        false
    );

}


/* ==========================================
   OPEN ITEM
========================================== */

function openItem(item){

    const content =
        getContent(item);


    item.classList.add(
        "is-open"
    );


    updateAccessibility(
        item,
        true
    );


    setContentHeight(
        content,
        true
    );

}


/* ==========================================
   CLOSE OTHER ITEMS
========================================== */

function closeOtherItems(
    accordion,
    currentItem
){

    const items =
        getAccordionItems(
            accordion
        );


    items.forEach(
        (item) => {

            if(
                item !== currentItem
            ){

                closeItem(
                    item
                );

            }

        }
    );

}


/* ==========================================
   TOGGLE ITEM
========================================== */

function toggleItem(
    accordion,
    item
){

    const state =
        accordionStates.get(
            accordion
        );


    if(!state){
        return;
    }


    const currentlyOpen =
        isItemOpen(
            item
        );


    if(currentlyOpen){

        closeItem(
            item
        );

        return;

    }


    /*
     * In single-open mode, close all
     * other items before opening this one.
     */

    if(
        state.singleOpen
    ){

        closeOtherItems(
            accordion,
            item
        );

    }


    openItem(
        item
    );

}


/* ==========================================
   HANDLE TRIGGER CLICK
========================================== */

function handleTriggerClick(event){

    const trigger =
        event.currentTarget;


    const item =
        trigger.closest(
            ACCORDION_SELECTORS.item
        );


    const accordion =
        trigger.closest(
            ACCORDION_SELECTORS.accordion
        );


    if(
        !item ||
        !accordion
    ){

        return;

    }


    event.preventDefault();


    toggleItem(
        accordion,
        item
    );

}


/* ==========================================
   HANDLE KEYBOARD
========================================== */

function handleKeyboard(event){

    const trigger =
        event.currentTarget;


    switch(event.key){

        case "Enter":
        case " ":

            event.preventDefault();

            trigger.click();

            break;


        default:

            break;

    }

}


/* ==========================================
   INITIALIZE ITEM
========================================== */

function initializeItem(item){

    const trigger =
        getTrigger(item);


    const content =
        getContent(item);


    if(
        !trigger ||
        !content
    ){

        return;

    }


    /*
     * Generate IDs when necessary.
     */

    if(
        !trigger.id
    ){

        trigger.id =
            `accordion-trigger-${crypto.randomUUID()}`;

    }


    if(
        !content.id
    ){

        content.id =
            `accordion-content-${crypto.randomUUID()}`;

    }


    /*
     * Connect trigger and content.
     */

    trigger.setAttribute(
        "aria-controls",
        content.id
    );


    content.setAttribute(
        "role",
        "region"
    );


    content.setAttribute(
        "aria-labelledby",
        trigger.id
    );


    /*
     * Determine initial state from
     * the existing .is-open class.
     */

    const initiallyOpen =
        item.classList.contains(
            "is-open"
        );


    updateAccessibility(
        item,
        initiallyOpen
    );


    setContentHeight(
        content,
        initiallyOpen
    );


    /*
     * Trigger events.
     */

    trigger.addEventListener(
        "click",
        handleTriggerClick
    );


    trigger.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* ==========================================
   INITIALIZE ACCORDION
========================================== */

function initializeAccordion(
    accordion
){

    const items =
        getAccordionItems(
            accordion
        );


    if(!items.length){
        return;
    }


    /*
     * Determine whether the accordion
     * should allow only one open item.
     *
     * Default:
     * single-open = true
     *
     * To allow multiple open items:
     *
     * data-single-open="false"
     */

    const singleOpen =
        accordion.dataset.singleOpen !==
        "false";


    accordionStates.set(
        accordion,
        {
            singleOpen
        }
    );


    items.forEach(
        (item) => {

            initializeItem(
                item
            );

        }
    );


    /*
     * If single-open mode is active,
     * make sure only one initially-open
     * item remains open.
     */

    if(singleOpen){

        let foundOpenItem = false;


        items.forEach(
            (item) => {

                if(
                    !isItemOpen(item)
                ){

                    return;

                }


                if(
                    !foundOpenItem
                ){

                    foundOpenItem =
                        true;

                }else{

                    closeItem(
                        item
                    );

                }

            }
        );

    }

}


/* ==========================================
   HANDLE WINDOW RESIZE
========================================== */

function handleResize(){

    const accordions =
        document.querySelectorAll(
            ACCORDION_SELECTORS.accordion
        );


    accordions.forEach(
        (accordion) => {

            const items =
                getAccordionItems(
                    accordion
                );


            items.forEach(
                (item) => {

                    if(
                        !isItemOpen(item)
                    ){

                        return;

                    }


                    const content =
                        getContent(item);


                    setContentHeight(
                        content,
                        true
                    );

                }
            );

        }
    );

}


/* ==========================================
   INITIALIZE ALL ACCORDIONS
========================================== */

export function initAccordion(){

    const accordions =
        document.querySelectorAll(
            ACCORDION_SELECTORS.accordion
        );


    if(!accordions.length){

        return;

    }


    accordions.forEach(
        (accordion) => {

            initializeAccordion(
                accordion
            );

        }
    );


    /*
     * Recalculate open content heights
     * when the viewport changes.
     */

    window.addEventListener(
        "resize",
        handleResize
    );

}