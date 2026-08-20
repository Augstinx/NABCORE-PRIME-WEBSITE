/* ==========================================
   NABCORE PRIME LIMITED
   FORM HANDLING SYSTEM
   forms.js
========================================== */

import {
    validateForm,
    clearFormValidation
} from "./validation.js";


/* ==========================================
   FORM CONFIGURATION
========================================== */

const FORM_CONFIG = {

    endpoint:
        "/api/submit-form",

    defaultSubmitText:
        "Send Message",

    loadingText:
        "Sending...",

    successText:
        "Message sent successfully.",

    errorText:
        "Unable to send your message. Please try again."

};


/* ==========================================
   FORM SELECTORS
========================================== */

const FORM_SELECTORS = {

    form:
        "form[data-contact-form]",

    submit:
        '[type="submit"]',

    status:
        "[data-form-status]"

};


/* ==========================================
   FORM STATE
========================================== */

const submittingForms =
    new WeakSet();


/* ==========================================
   GET FORM STATUS
========================================== */

function getStatusElement(form){

    let status =
        form.querySelector(
            FORM_SELECTORS.status
        );


    if(!status){

        status =
            document.createElement(
                "div"
            );


        status.className =
            "form-status";


        status.setAttribute(
            "data-form-status",
            ""
        );


        status.setAttribute(
            "role",
            "status"
        );


        status.setAttribute(
            "aria-live",
            "polite"
        );


        form.appendChild(
            status
        );

    }


    return status;

}


/* ==========================================
   SET FORM STATUS
========================================== */

function setFormStatus(
    form,
    message,
    type = ""
){

    const status =
        getStatusElement(
            form
        );


    status.textContent =
        message;


    status.className =
        "form-status";


    if(type){

        status.classList.add(
            `is-${type}`
        );

    }

}


/* ==========================================
   SET SUBMIT STATE
========================================== */

function setSubmitState(
    form,
    isSubmitting
){

    const button =
        form.querySelector(
            FORM_SELECTORS.submit
        );


    if(!button){
        return;
    }


    if(isSubmitting){

        if(
            !button.dataset.originalText
        ){

            button.dataset.originalText =
                button.textContent.trim();

        }


        button.disabled =
            true;


        button.setAttribute(
            "aria-disabled",
            "true"
        );


        button.textContent =
            FORM_CONFIG.loadingText;


    }else{

        button.disabled =
            false;


        button.removeAttribute(
            "aria-disabled"
        );


        button.textContent =
            button.dataset.originalText ||
            FORM_CONFIG.defaultSubmitText;

    }

}


/* ==========================================
   SERIALIZE FORM DATA
========================================== */

function serializeForm(form){

    const formData =
        new FormData(
            form
        );


    const data = {};


    formData.forEach(
        (value, key) => {

            if(
                typeof value ===
                "string"
            ){

                data[key] =
                    value.trim();

            }

        }
    );


    return data;

}

/* ==========================================
   SEND FORM
========================================== */

async function submitForm(form){

    const formData =
        new FormData(form);


    const response =
        await fetch(
            FORM_CONFIG.endpoint,
            {
                method:"POST",

                headers:{
                    "Accept":
                        "application/json"
                },

                body:formData
            }
        );


    let result = null;


    try{

        result =
            await response.json();

    }catch{

        result =
            null;

    }


    if(!response.ok){

        const message =
            result?.message ||
            FORM_CONFIG.errorText;


        throw new Error(
            message
        );

    }


    return result;

}

/* ==========================================
   HANDLE FORM SUBMISSION
========================================== */

async function handleSubmit(event){

    event.preventDefault();


    const form =
        event.currentTarget;


    if(
        submittingForms.has(
            form
        )
    ){

        return;

    }


    /*
     * Validate before sending.
     */

    const valid =
        validateForm(
            form
        );


    if(!valid){

        setFormStatus(
            form,
            "Please correct the highlighted fields.",
            "error"
        );

        return;

    }


    submittingForms.add(
        form
    );


    setSubmitState(
        form,
        true
    );


    setFormStatus(
        form,
        "",
        ""
    );


    try{

        await submitForm(
            form
        );


        setFormStatus(
            form,
            FORM_CONFIG.successText,
            "success"
        );


        form.reset();


        clearFormValidation(
            form
        );


    }catch(error){

        console.error(
            "NABCORE PRIME form submission error:",
            error
        );


        setFormStatus(
            form,
            error.message ||
            FORM_CONFIG.errorText,
            "error"
        );


    }finally{

        setSubmitState(
            form,
            false
        );


        submittingForms.delete(
            form
        );

    }

}


/* ==========================================
   INITIALIZE FORMS
========================================== */

export function initForms(){

    const forms =
        document.querySelectorAll(
            FORM_SELECTORS.form
        );


    if(!forms.length){
        return;
    }


    forms.forEach(
        (form) => {

            if(
                form.dataset.formInitialized ===
                "true"
            ){

                return;

            }


            form.addEventListener(
                "submit",
                handleSubmit
            );


            form.dataset.formInitialized =
                "true";

        }
    );

}


/* ==========================================
   RESET FORM STATUS
========================================== */

export function resetFormStatus(form){

    if(!form){
        return;
    }


    setFormStatus(
        form,
        "",
        ""
    );

}


/* ==========================================
   PUBLIC FORM STATE
========================================== */

export function isFormSubmitting(form){

    return submittingForms.has(
        form
    );

}