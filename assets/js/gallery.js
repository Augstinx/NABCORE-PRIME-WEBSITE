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
   STATE
========================================== */

const galleryStates =
    new WeakMap();


/* ==========================================
   GET ITEMS
========================================== */

function getGalleryItems(
    gallery
){

    return Array.from(
        gallery.querySelectorAll(
            GALLERY_SELECTORS.thumbnail
        )
    );

}


/* ==========================================
   GET MAIN IMAGE
========================================== */

function getMainImage(
    gallery
){

    return gallery.querySelector(
        GALLERY_SELECTORS.image
    );

}


/* ==========================================
   GET IMAGE DATA
========================================== */

function getImageData(
    thumbnail
){

    if(!thumbnail){
        return null;
    }


    const image =
        thumbnail.querySelector(
            "img"
        );


    const source =
        thumbnail.dataset.image ||
        thumbnail.dataset.src ||
        image?.currentSrc ||
        image?.src;


    if(!source){
        return null;
    }


    return {

        source,

        alt:
            thumbnail.dataset.alt ||
            image?.alt ||
            ""

    };

}


/* ==========================================
   UPDATE THUMBNAIL
========================================== */

function updateActiveThumbnail(
    gallery,
    index
){

    getGalleryItems(
        gallery
    ).forEach(
        (
            item,
            itemIndex
        ) => {

            const active =
                itemIndex === index;


            item.classList.toggle(
                "active",
                active
            );


            item.setAttribute(
                "aria-current",
                active
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

    const items =
        getGalleryItems(
            gallery
        );


    const thumbnail =
        items[index];


    const data =
        getImageData(
            thumbnail
        );


    const mainImage =
        getMainImage(
            gallery
        );


    if(
        !data ||
        !mainImage
    ){

        return;

    }


    mainImage.src =
        data.source;


    mainImage.alt =
        data.alt;


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
   SHOW IMAGE
========================================== */

function showImage(
    gallery,
    index
){

    const items =
        getGalleryItems(
            gallery
        );


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
   NEXT
========================================== */

function nextImage(
    gallery
){

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
   PREVIOUS
========================================== */

function previousImage(
    gallery
){

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


    const index =
        getGalleryItems(
            gallery
        ).indexOf(
            thumbnail
        );


    if(index >= 0){

        showImage(
            gallery,
            index
        );

    }

}


/* ==========================================
   INITIALIZE GALLERY
========================================== */

function initializeGallery(
    gallery
){

    const mainImage =
        getMainImage(
            gallery
        );


    const thumbnails =
        getGalleryItems(
            gallery
        );


    if(
        !mainImage ||
        !thumbnails.length
    ){

        return;

    }


    let initialIndex =
        thumbnails.findIndex(
            (thumbnail) =>
                thumbnail.classList.contains(
                    "active"
                )
        );


    if(initialIndex < 0){

        initialIndex =
            0;

    }


    galleryStates.set(
        gallery,
        {
            index:
                initialIndex
        }
    );


    updateMainImage(
        gallery,
        initialIndex
    );


    thumbnails.forEach(
        (thumbnail) => {

            thumbnail.setAttribute(
                "tabindex",
                "0"
            );


            thumbnail.addEventListener(
                "click",
                handleThumbnailClick
            );


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


    const previous =
        gallery.querySelector(
            GALLERY_SELECTORS.previous
        );


    if(previous){

        previous.addEventListener(
            "click",
            () =>
                previousImage(
                    gallery
                )
        );

    }


    const next =
        gallery.querySelector(
            GALLERY_SELECTORS.next
        );


    if(next){

        next.addEventListener(
            "click",
            () =>
                nextImage(
                    gallery
                )
        );

    }


    gallery.addEventListener(
        "keydown",
        (event) => {

            if(
                !gallery.contains(
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

                previousImage(
                    gallery
                );

            }


            if(
                event.key ===
                "ArrowRight"
            ){

                event.preventDefault();

                nextImage(
                    gallery
                );

            }

        }
    );

}


/* ==========================================
   INITIALIZE ALL
========================================== */

export function initGallery(){

    document
        .querySelectorAll(
            GALLERY_SELECTORS.gallery
        )
        .forEach(
            initializeGallery
        );

}