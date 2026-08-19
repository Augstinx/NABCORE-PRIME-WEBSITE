/* ==========================================
   NABCORE PRIME LIMITED
   IMAGE GALLERY SYSTEM
   gallery.js
========================================== */


/* ==========================================
   GALLERY SELECTORS
========================================== */

const GALLERY_SELECTORS = {

    gallery:
        "[data-gallery]",

    image:
        "[data-gallery-image]",

    thumbnail:
        "[data-gallery-thumbnail]",

    previous:
        "[data-gallery-prev]",

    next:
        "[data-gallery-next]"

};


/* ==========================================
   GALLERY STATE
========================================== */

const galleryStates =
    new WeakMap();


/* ==========================================
   GET GALLERY ITEMS
========================================== */

function getGalleryItems(gallery){

    return Array.from(
        gallery.querySelectorAll(
            GALLERY_SELECTORS.thumbnail
        )
    );

}


/* ==========================================
   GET MAIN IMAGE
========================================== */

function getMainImage(gallery){

    return gallery.querySelector(
        GALLERY_SELECTORS.image
    );

}


/* ==========================================
   GET IMAGE DATA
========================================== */

function getImageData(thumbnail){

    if(!thumbnail){
        return null;
    }


    const image =
        thumbnail.querySelector("img");


    const source =
        thumbnail.dataset.image ||
        thumbnail.getAttribute(
            "data-src"
        ) ||
        image?.currentSrc ||
        image?.src;


    if(!source){
        return null;
    }


    const alt =
        thumbnail.dataset.alt ||
        image?.alt ||
        "";


    return {
        source,
        alt
    };

}


/* ==========================================
   UPDATE ACTIVE THUMBNAIL
========================================== */

function updateActiveThumbnail(
    gallery,
    index
){

    const items =
        getGalleryItems(gallery);


    items.forEach(
        (item, itemIndex) => {

            const isActive =
                itemIndex === index;


            item.classList.toggle(
                "active",
                isActive
            );


            item.setAttribute(
                "aria-current",
                isActive
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ==========================================
   UPDATE MAIN IMAGE
========================================== */

function updateMainImage(
    gallery,
    index
){

    const mainImage =
        getMainImage(gallery);


    if(!mainImage){
        return;
    }


    const items =
        getGalleryItems(gallery);


    const thumbnail =
        items[index];


    const data =
        getImageData(thumbnail);


    if(!data){
        return;
    }


    /*
     * Preload the selected image before
     * replacing the currently displayed image.
     */

    const preload =
        new Image();


    preload.onload = () => {

        mainImage.src =
            data.source;


        mainImage.alt =
            data.alt;

    };


    preload.src =
        data.source;


    updateActiveThumbnail(
        gallery,
        index
    );


    const state =
        galleryStates.get(
            gallery
        );


    if(state){

        state.index =
            index;

    }

}


/* ==========================================
   SHOW GALLERY IMAGE
========================================== */

function showImage(
    gallery,
    index
){

    const items =
        getGalleryItems(gallery);


    if(!items.length){
        return;
    }


    const normalizedIndex =
        (
            index +
            items.length
        ) %
        items.length;


    updateMainImage(
        gallery,
        normalizedIndex
    );

}


/* ==========================================
   NEXT IMAGE
========================================== */

function nextImage(gallery){

    const state =
        galleryStates.get(
            gallery
        );


    if(!state){
        return;
    }


    showImage(
        gallery,
        state.index + 1
    );

}


/* ==========================================
   PREVIOUS IMAGE
========================================== */

function previousImage(gallery){

    const state =
        galleryStates.get(
            gallery
        );


    if(!state){
        return;
    }


    showImage(
        gallery,
        state.index - 1
    );

}


/* ==========================================
   THUMBNAIL CLICK
========================================== */

function handleThumbnailClick(
    event
){

    const thumbnail =
        event.currentTarget;


    const gallery =
        thumbnail.closest(
            GALLERY_SELECTORS.gallery
        );


    if(!gallery){
        return;
    }


    const items =
        getGalleryItems(gallery);


    const index =
        items.indexOf(
            thumbnail
        );


    if(index === -1){
        return;
    }


    showImage(
        gallery,
        index
    );

}


/* ==========================================
   PREVIOUS BUTTON
========================================== */

function handlePreviousClick(
    event
){

    const button =
        event.currentTarget;


    const gallery =
        button.closest(
            GALLERY_SELECTORS.gallery
        );


    if(!gallery){
        return;
    }


    previousImage(
        gallery
    );

}


/* ==========================================
   NEXT BUTTON
========================================== */

function handleNextClick(
    event
){

    const button =
        event.currentTarget;


    const gallery =
        button.closest(
            GALLERY_SELECTORS.gallery
        );


    if(!gallery){
        return;
    }


    nextImage(
        gallery
    );

}


/* ==========================================
   KEYBOARD NAVIGATION
========================================== */

function handleKeyboard(
    event
){

    const gallery =
        event.currentTarget;


    if(!gallery){
        return;
    }


    /*
     * Only handle keyboard input when
     * the gallery itself or one of its
     * controls has focus.
     */

    const activeElement =
        document.activeElement;


    if(
        !gallery.contains(
            activeElement
        )
    ){

        return;

    }


    switch(event.key){

        case "ArrowLeft":

            event.preventDefault();

            previousImage(
                gallery
            );

            break;


        case "ArrowRight":

            event.preventDefault();

            nextImage(
                gallery
            );

            break;


        default:

            break;

    }

}


/* ==========================================
   INITIALIZE GALLERY
========================================== */

function initializeGallery(
    gallery
){

    const mainImage =
        getMainImage(gallery);


    const thumbnails =
        getGalleryItems(gallery);


    if(
        !mainImage ||
        !thumbnails.length
    ){

        return;

    }


    /*
     * Determine the initial image.
     */

    let initialIndex =
        thumbnails.findIndex(
            (thumbnail) =>
                thumbnail.classList.contains(
                    "active"
                )
        );


    if(initialIndex < 0){

        initialIndex = 0;

    }


    galleryStates.set(
        gallery,
        {
            index:initialIndex
        }
    );


    /*
     * Initialize thumbnail state.
     */

    updateActiveThumbnail(
        gallery,
        initialIndex
    );


    /*
     * Thumbnail events.
     */

    thumbnails.forEach(
        (thumbnail) => {

            thumbnail.addEventListener(
                "click",
                handleThumbnailClick
            );


            /*
             * Ensure keyboard accessibility.
             */

            if(
                !thumbnail.hasAttribute(
                    "tabindex"
                )
            ){

                thumbnail.setAttribute(
                    "tabindex",
                    "0"
                );

            }


            thumbnail.addEventListener(
                "keydown",
                (event) => {

                    if(
                        event.key !== "Enter" &&
                        event.key !== " "
                    ){

                        return;

                    }


                    event.preventDefault();


                    thumbnail.click();

                }
            );

        }
    );


    /*
     * Previous button.
     */

    const previousButton =
        gallery.querySelector(
            GALLERY_SELECTORS.previous
        );


    if(previousButton){

        previousButton.addEventListener(
            "click",
            handlePreviousClick
        );

    }


    /*
     * Next button.
     */

    const nextButton =
        gallery.querySelector(
            GALLERY_SELECTORS.next
        );


    if(nextButton){

        nextButton.addEventListener(
            "click",
            handleNextClick
        );

    }


    /*
     * Keyboard navigation.
     */

    gallery.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* ==========================================
   INITIALIZE ALL GALLERIES
========================================== */

export function initGallery(){

    const galleries =
        document.querySelectorAll(
            GALLERY_SELECTORS.gallery
        );


    if(!galleries.length){

        return;

    }


    galleries.forEach(
        (gallery) => {

            initializeGallery(
                gallery
            );

        }
    );

}