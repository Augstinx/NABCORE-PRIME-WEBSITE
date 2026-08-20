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
   GET ITEMS
========================================== */

function getAccordionItems(
    accordion
){

    return Array.from(
        accordion.querySelectorAll(
            ACCORDION_SELECTORS.item
        )
    );

}


/* ==========================================
   GET TRIGGER
========================================== */

function getTrigger(
    item
){

    return item.querySelector(
        ACCORDION_SELECTORS.trigger
    );

}


/* ==========================================
   GET CONTENT
========================================== */

function getContent(
    item
){

    return item.querySelector(
        ACCORDION_SELECTORS.content
    );

}


/* ==========================================
   CHECK OPEN STATE
========================================== */

function isItemOpen(
    item
){

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


    content.style.maxHeight =
        isOpen
            ? `${content.scrollHeight}px`
            : "0px";

}


/* ==========================================
   UPDATE ACCESSIBILITY
========================================== */

function updateAccessibility(
    item,
    isOpen
){

    const trigger =
        getTrigger(
            item
        );


    const content =
        getContent(
            item
        );


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

function closeItem(
    item
){

    const content =
        getContent(
            item
        );


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

function openItem(
    item
){

    const content =
        getContent(
            item
        );


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

    getAccordionItems(
        accordion
    ).forEach(
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


    if(
        isItemOpen(item)
    ){

        closeItem(
            item
        );

        return;

    }


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
   HANDLE CLICK
========================================== */

function handleTriggerClick(
    event
){

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

function handleKeyboard(
    event
){

    if(
        event.key !== "Enter" &&
        event.key !== " "
    ){

        return;

    }


    event.preventDefault();

    event.currentTarget.click();

}


/* ==========================================
   INITIALIZE ITEM
========================================== */

function initializeItem(
    item
){

    const trigger =
        getTrigger(
            item
        );


    const content =
        getContent(
            item
        );


    if(
        !trigger ||
        !content
    ){

        return;

    }


    if(!trigger.id){

        trigger.id =
            `accordion-trigger-${crypto.randomUUID()}`;

    }


    if(!content.id){

        content.id =
            `accordion-content-${crypto.randomUUID()}`;

    }


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


    const initiallyOpen =
        isItemOpen(
            item
        );


    updateAccessibility(
        item,
        initiallyOpen
    );


    setContentHeight(
        content,
        initiallyOpen
    );


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
        initializeItem
    );


    if(singleOpen){

        let foundOpenItem =
            false;


        items.forEach(
            (item) => {

                if(
                    !isItemOpen(item)
                ){

                    return;

                }


                if(!foundOpenItem){

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
   RESIZE
========================================== */

function handleResize(){

    document
        .querySelectorAll(
            ACCORDION_SELECTORS.accordion
        )
        .forEach(
            (accordion) => {

                getAccordionItems(
                    accordion
                ).forEach(
                    (item) => {

                        if(
                            !isItemOpen(item)
                        ){

                            return;

                        }


                        setContentHeight(
                            getContent(item),
                            true
                        );

                    }
                );

            }
        );

}


/* ==========================================
   INITIALIZE ALL
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
        initializeAccordion
    );


    window.addEventListener(
        "resize",
        handleResize
    );

}