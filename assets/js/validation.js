/* ==========================================
   NABCORE PRIME LIMITED
   FORM VALIDATION SYSTEM
   validation.js
========================================== */


/* ==========================================
   VALIDATION RULES
========================================== */

const validationRules = {

    required: {
        validate: (value) => value.trim().length > 0,
        message: "This field is required."
    },


    email: {
        validate: (value) => {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            return emailPattern.test(value.trim());

        },

        message: "Please enter a valid email address."
    },


    phone: {
        validate: (value) => {

            const phonePattern =
                /^[+]?[0-9\s().-]{7,20}$/;

            return phonePattern.test(value.trim());

        },

        message: "Please enter a valid phone number."
    },


    minLength: {
        validate: (value, length) =>
            value.trim().length >= length,

        message: (length) =>
            `Please enter at least ${length} characters.`
    },


    maxLength: {
        validate: (value, length) =>
            value.trim().length <= length,

        message: (length) =>
            `Please enter no more than ${length} characters.`
    }

};


/* ==========================================
   FIELD HELPERS
========================================== */

/**
 * Get the error element associated with a field.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @returns {Element|null}
 */

function getErrorElement(field){

    const errorId =
        field.getAttribute("aria-describedby");

    if(!errorId){
        return null;
    }

    return document.getElementById(errorId);

}


/* ==========================================
   SHOW FIELD ERROR
========================================== */

/**
 * Display a validation error.
 *
 * @param {HTMLElement} field
 * @param {string} message
 */

export function showFieldError(field, message){

    if(!field){
        return;
    }

    field.classList.remove("is-valid");

    field.classList.add("is-invalid");

    field.setAttribute(
        "aria-invalid",
        "true"
    );


    const errorElement =
        getErrorElement(field);

    if(errorElement){

        errorElement.textContent = message;

        errorElement.classList.add(
            "is-visible"
        );

    }

}


/* ==========================================
   CLEAR FIELD ERROR
========================================== */

/**
 * Remove a validation error.
 *
 * @param {HTMLElement} field
 */

export function clearFieldError(field){

    if(!field){
        return;
    }

    field.classList.remove(
        "is-invalid"
    );

    field.removeAttribute(
        "aria-invalid"
    );


    const errorElement =
        getErrorElement(field);

    if(errorElement){

        errorElement.textContent = "";

        errorElement.classList.remove(
            "is-visible"
        );

    }

}


/* ==========================================
   SHOW FIELD VALID
========================================== */

/**
 * Mark a field as valid.
 *
 * @param {HTMLElement} field
 */

export function showFieldValid(field){

    if(!field){
        return;
    }

    field.classList.remove(
        "is-invalid"
    );

    field.classList.add(
        "is-valid"
    );

    field.setAttribute(
        "aria-invalid",
        "false"
    );


    const errorElement =
        getErrorElement(field);

    if(errorElement){

        errorElement.textContent = "";

        errorElement.classList.remove(
            "is-visible"
        );

    }

}


/* ==========================================
   VALIDATE REQUIRED FIELD
========================================== */

/**
 * Validate a required field.
 *
 * @param {HTMLElement} field
 * @returns {boolean}
 */

export function validateRequired(field){

    if(!field){
        return false;
    }

    const value =
        field.value.trim();

    if(
        !validationRules.required.validate(
            value
        )
    ){

        showFieldError(
            field,
            validationRules.required.message
        );

        return false;
    }

    showFieldValid(field);

    return true;

}


/* ==========================================
   VALIDATE EMAIL
========================================== */

/**
 * Validate an email field.
 *
 * @param {HTMLElement} field
 * @returns {boolean}
 */

export function validateEmail(field){

    if(!field){
        return false;
    }

    const value =
        field.value.trim();

    if(
        !validationRules.email.validate(
            value
        )
    ){

        showFieldError(
            field,
            validationRules.email.message
        );

        return false;
    }

    showFieldValid(field);

    return true;

}


/* ==========================================
   VALIDATE PHONE
========================================== */

/**
 * Validate a phone field.
 *
 * @param {HTMLElement} field
 * @returns {boolean}
 */

export function validatePhone(field){

    if(!field){
        return false;
    }

    const value =
        field.value.trim();

    if(
        !validationRules.phone.validate(
            value
        )
    ){

        showFieldError(
            field,
            validationRules.phone.message
        );

        return false;
    }

    showFieldValid(field);

    return true;

}


/* ==========================================
   VALIDATE LENGTH
========================================== */

/**
 * Validate minimum and maximum field length.
 *
 * @param {HTMLElement} field
 * @param {number} minimum
 * @param {number|null} maximum
 * @returns {boolean}
 */

export function validateLength(
    field,
    minimum = 0,
    maximum = null
){

    if(!field){
        return false;
    }

    const value =
        field.value.trim();


    if(
        minimum > 0 &&
        !validationRules.minLength.validate(
            value,
            minimum
        )
    ){

        showFieldError(
            field,
            validationRules.minLength.message(
                minimum
            )
        );

        return false;
    }


    if(
        maximum !== null &&
        !validationRules.maxLength.validate(
            value,
            maximum
        )
    ){

        showFieldError(
            field,
            validationRules.maxLength.message(
                maximum
            )
        );

        return false;
    }


    showFieldValid(field);

    return true;

}


/* ==========================================
   VALIDATE FIELD
========================================== */

/**
 * Validate a field based on its
 * data-validation attributes.
 *
 * Supported attributes:
 *
 * data-required
 * data-validation="email"
 * data-validation="phone"
 * data-min-length="10"
 * data-max-length="500"
 *
 * @param {HTMLElement} field
 * @returns {boolean}
 */

export function validateField(field){

    if(!field){
        return false;
    }


    const value =
        field.value.trim();


    /* ------------------------------------------
       REQUIRED
    ------------------------------------------ */

    if(
        field.hasAttribute(
            "data-required"
        )
    ){

        if(!validateRequired(field)){
            return false;
        }

    }


    /* ------------------------------------------
       EMAIL
    ------------------------------------------ */

    if(
        field.dataset.validation === "email"
    ){

        if(value.length === 0){
            return true;
        }

        if(!validateEmail(field)){
            return false;
        }

    }


    /* ------------------------------------------
       PHONE
    ------------------------------------------ */

    if(
        field.dataset.validation === "phone"
    ){

        if(value.length === 0){
            return true;
        }

        if(!validatePhone(field)){
            return false;
        }

    }


    /* ------------------------------------------
       MINIMUM LENGTH
    ------------------------------------------ */

    const minimum =
        Number(
            field.dataset.minLength || 0
        );


    /* ------------------------------------------
       MAXIMUM LENGTH
    ------------------------------------------ */

    const maximum =
        field.dataset.maxLength
            ? Number(field.dataset.maxLength)
            : null;


    if(
        minimum > 0 ||
        maximum !== null
    ){

        if(!validateLength(
            field,
            minimum,
            maximum
        )){

            return false;

        }

    }


    return true;

}


/* ==========================================
   VALIDATE FORM
========================================== */

/**
 * Validate all supported fields
 * inside a form.
 *
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */

export function validateForm(form){

    if(!form){
        return false;
    }


    const fields =
        form.querySelectorAll(
            "input, textarea, select"
        );


    let isValid = true;


    fields.forEach((field) => {

        /*
         * Skip disabled fields.
         */

        if(field.disabled){
            return;
        }


        /*
         * Skip submit/reset/button fields.
         */

        if(
            field.type === "submit" ||
            field.type === "reset" ||
            field.type === "button"
        ){
            return;
        }


        /*
         * Validate field.
         */

        if(!validateField(field)){

            isValid = false;

        }

    });


    /*
     * Focus the first invalid field.
     */

    if(!isValid){

        const firstInvalid =
            form.querySelector(
                ".is-invalid"
            );

        if(firstInvalid){

            firstInvalid.focus();

        }

    }


    return isValid;

}


/* ==========================================
   CLEAR FORM VALIDATION
========================================== */

/**
 * Clear all validation states
 * from a form.
 *
 * @param {HTMLFormElement} form
 */

export function clearFormValidation(form){

    if(!form){
        return;
    }


    const fields =
        form.querySelectorAll(
            "input, textarea, select"
        );


    fields.forEach((field) => {

        field.classList.remove(
            "is-valid",
            "is-invalid"
        );

        field.removeAttribute(
            "aria-invalid"
        );


        const errorElement =
            getErrorElement(field);

        if(errorElement){

            errorElement.textContent = "";

            errorElement.classList.remove(
                "is-visible"
            );

        }

    });

}


/* ==========================================
   LIVE FIELD VALIDATION
========================================== */

/**
 * Attach live validation to form fields.
 *
 * @param {HTMLFormElement} form
 */

export function enableLiveValidation(form){

    if(!form){
        return;
    }


    const fields =
        form.querySelectorAll(
            "input, textarea, select"
        );


    fields.forEach((field) => {

        field.addEventListener(
            "blur",
            () => {

                validateField(field);

            }
        );


        field.addEventListener(
            "input",
            () => {

                if(
                    field.classList.contains(
                        "is-invalid"
                    )
                ){

                    validateField(field);

                }

            }
        );

    });

}