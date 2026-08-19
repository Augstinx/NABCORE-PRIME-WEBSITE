/* ==========================================
   NABCORE PRIME LIMITED
   CONTACT FORM API
   functions/api/submit-form.js
========================================== */


/* ==========================================
   CONFIGURATION
========================================== */

const RESEND_API_URL = "https://api.resend.com/emails";

const RECIPIENT_EMAIL = "info@nabcoreprime.com";

const FROM_EMAIL = "NABCORE PRIME Website <onboarding@resend.dev>";


/* ==========================================
   ALLOWED REQUEST METHOD
========================================== */

export async function onRequestPost(context) {

    try {

        /* ==========================================
           REQUEST
        =========================================== */

        const request = context.request;

        const env = context.env;


        /* ==========================================
           ENVIRONMENT CHECK
        =========================================== */

        const resendApiKey = env.RESEND_API_KEY;

        if (!resendApiKey) {

            return jsonResponse(
                {
                    success:false,
                    message:"The email service is not configured."
                },
                500
            );

        }


        /* ==========================================
           CONTENT TYPE
        =========================================== */

        const contentType =
            request.headers.get("content-type") || "";


        let formData;


        if (
            contentType.includes(
                "application/x-www-form-urlencoded"
            ) ||
            contentType.includes(
                "multipart/form-data"
            )
        ) {

            formData = await request.formData();

        } else {

            return jsonResponse(
                {
                    success:false,
                    message:"Invalid form submission."
                },
                400
            );

        }


        /* ==========================================
           READ FORM DATA
        =========================================== */

        const name =
            cleanText(
                formData.get("name")
            );

        const company =
            cleanText(
                formData.get("company")
            );

        const email =
            cleanText(
                formData.get("email")
            );

        const phone =
            cleanText(
                formData.get("phone")
            );

        const service =
            cleanText(
                formData.get("service")
            );

        const location =
            cleanText(
                formData.get("location")
            );

        const message =
            cleanText(
                formData.get("message")
            );

        const website =
            cleanText(
                formData.get("website")
            );


        /* ==========================================
           HONEYPOT
        =========================================== */

        if (website) {

            return jsonResponse(
                {
                    success:true,
                    message:"Your enquiry has been received."
                },
                200
            );

        }


        /* ==========================================
           REQUIRED FIELD VALIDATION
        =========================================== */

        if (!name) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide your full name."
                },
                400
            );

        }


        if (!email) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide your email address."
                },
                400
            );

        }


        if (!phone) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide your phone number."
                },
                400
            );

        }


        if (!service) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please select a service or requirement."
                },
                400
            );

        }


        if (!message) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide your project details."
                },
                400
            );

        }


        /* ==========================================
           LENGTH VALIDATION
        =========================================== */

        if (name.length < 2 || name.length > 100) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide a valid name."
                },
                400
            );

        }


        if (company.length > 150) {

            return jsonResponse(
                {
                    success:false,
                    message:"Company name is too long."
                },
                400
            );

        }


        if (email.length > 150) {

            return jsonResponse(
                {
                    success:false,
                    message:"Email address is too long."
                },
                400
            );

        }


        if (phone.length > 30) {

            return jsonResponse(
                {
                    success:false,
                    message:"Phone number is too long."
                },
                400
            );

        }


        if (message.length < 20 || message.length > 5000) {

            return jsonResponse(
                {
                    success:false,
                    message:
                        "Project details must be between 20 and 5000 characters."
                },
                400
            );

        }


        /* ==========================================
           EMAIL VALIDATION
        =========================================== */

        if (!isValidEmail(email)) {

            return jsonResponse(
                {
                    success:false,
                    message:"Please provide a valid email address."
                },
                400
            );

        }


        /* ==========================================
           SERVICE LABEL
        =========================================== */

        const serviceLabel =
            getServiceLabel(service);


        /* ==========================================
           EMAIL SUBJECT
        =========================================== */

        const subject =
            `NABCORE PRIME Website Enquiry — ${serviceLabel}`;


        /* ==========================================
           EMAIL HTML
        =========================================== */

        const html = createEmailHtml({
            name,
            company,
            email,
            phone,
            service:serviceLabel,
            location,
            message
        });


        /* ==========================================
           RESEND REQUEST
        =========================================== */

        const resendResponse =
            await fetch(
                RESEND_API_URL,
                {
                    method:"POST",

                    headers:{
                        "Authorization":
                            `Bearer ${resendApiKey}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({

                        from:FROM_EMAIL,

                        to:[
                            RECIPIENT_EMAIL
                        ],

                        reply_to:[
                            email
                        ],

                        subject,

                        html

                    })
                }
            );


        /* ==========================================
           RESEND RESPONSE
        =========================================== */

        const resendData =
            await resendResponse.json();


        if (!resendResponse.ok) {

            console.error(
                "Resend API error:",
                resendData
            );

            return jsonResponse(
                {
                    success:false,
                    message:
                        "We could not send your enquiry. Please try again or contact us directly."
                },
                502
            );

        }


        /* ==========================================
           SUCCESS
        =========================================== */

        return jsonResponse(
            {
                success:true,
                message:
                    "Thank you. Your enquiry has been sent successfully. The NABCORE PRIME team will get back to you."
            },
            200
        );


    } catch (error) {

        /* ==========================================
           SERVER ERROR
        =========================================== */

        console.error(
            "Contact form error:",
            error
        );


        return jsonResponse(
            {
                success:false,
                message:
                    "An unexpected error occurred. Please try again later."
            },
            500
        );

    }

}


/* ==========================================
   TEXT SANITIZATION
========================================== */

function cleanText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .trim()
        .replace(/\s+/g," ");

}


/* ==========================================
   EMAIL VALIDATION
========================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ==========================================
   SERVICE LABELS
========================================== */

function getServiceLabel(service) {

    const services = {

        "surface-preparation":
            "Surface Preparation",

        "protective-coating":
            "Protective Coating",

        "scaffolding":
            "Scaffolding Services",

        "insulation":
            "Insulation Services",

        "equipment-rental":
            "Equipment Rental",

        "labour-outsourcing":
            "Labour Outsourcing",

        "lpg-infrastructure":
            "LPG Infrastructure",

        "fuel-storage":
            "Fuel Storage Systems",

        "industrial-products":
            "Industrial Products",

        "other":
            "Other / General Enquiry"

    };


    return (
        services[service] ||
        "General Enquiry"
    );

}


/* ==========================================
   EMAIL TEMPLATE
========================================== */

function createEmailHtml({
    name,
    company,
    email,
    phone,
    service,
    location,
    message
}) {

    const safeName =
        escapeHtml(name);

    const safeCompany =
        escapeHtml(
            company || "Not provided"
        );

    const safeEmail =
        escapeHtml(email);

    const safePhone =
        escapeHtml(phone);

    const safeService =
        escapeHtml(service);

    const safeLocation =
        escapeHtml(
            location || "Not provided"
        );

    const safeMessage =
        escapeHtml(message)
            .replace(/\n/g,"<br>");


    return `

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <title>
        NABCORE PRIME Website Enquiry
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#F8FAFC;
        font-family:Arial,Helvetica,sans-serif;
        color:#374151;
    "
>

    <div
        style="
            max-width:680px;
            margin:40px auto;
            background:#FFFFFF;
            border:1px solid #E5E7EB;
            border-radius:12px;
            overflow:hidden;
        "
    >

        <!-- Header -->

        <div
            style="
                padding:28px 32px;
                background:#0B2E59;
                color:#FFFFFF;
            "
        >

            <h1
                style="
                    margin:0;
                    font-size:24px;
                    line-height:1.3;
                "
            >
                NABCORE PRIME
            </h1>

            <p
                style="
                    margin:8px 0 0;
                    color:#D4A017;
                    font-size:13px;
                    font-weight:700;
                    letter-spacing:1px;
                    text-transform:uppercase;
                "
            >
                Website Enquiry
            </p>

        </div>


        <!-- Content -->

        <div
            style="
                padding:32px;
            "
        >

            <h2
                style="
                    margin:0 0 24px;
                    color:#1F2937;
                    font-size:22px;
                "
            >
                New Project Enquiry
            </h2>


            <!-- Name -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Full Name
                </strong>

                <div>
                    ${safeName}
                </div>

            </div>


            <!-- Company -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Company / Organisation
                </strong>

                <div>
                    ${safeCompany}
                </div>

            </div>


            <!-- Email -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Email Address
                </strong>

                <div>
                    ${safeEmail}
                </div>

            </div>


            <!-- Phone -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Phone Number
                </strong>

                <div>
                    ${safePhone}
                </div>

            </div>


            <!-- Service -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Service / Requirement
                </strong>

                <div>
                    ${safeService}
                </div>

            </div>


            <!-- Location -->

            <div
                style="
                    margin-bottom:18px;
                "
            >

                <strong>
                    Project Location
                </strong>

                <div>
                    ${safeLocation}
                </div>

            </div>


            <!-- Message -->

            <div
                style="
                    margin-top:28px;
                    padding:20px;
                    background:#F8FAFC;
                    border-left:4px solid #D4A017;
                    border-radius:6px;
                "
            >

                <strong>
                    Project Details
                </strong>

                <p
                    style="
                        margin:12px 0 0;
                        line-height:1.7;
                    "
                >
                    ${safeMessage}
                </p>

            </div>


            <!-- Reply -->

            <div
                style="
                    margin-top:28px;
                "
            >

                <a
                    href="mailto:${safeEmail}"
                    style="
                        display:inline-block;
                        padding:13px 22px;
                        background:#0B2E59;
                        color:#FFFFFF;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:600;
                    "
                >
                    Reply to Enquirer
                </a>

            </div>

        </div>


        <!-- Footer -->

        <div
            style="
                padding:20px 32px;
                background:#F8FAFC;
                border-top:1px solid #E5E7EB;
                color:#6B7280;
                font-size:13px;
                line-height:1.6;
            "
        >

            NABCORE PRIME LIMITED<br>

            +233 551886968<br>

            info@nabcoreprime.com

        </div>

    </div>

</body>

</html>

`;

}


/* ==========================================
   HTML ESCAPING
========================================== */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


/* ==========================================
   JSON RESPONSE
========================================== */

function jsonResponse(
    data,
    status = 200
) {

    return new Response(

        JSON.stringify(data),

        {
            status,

            headers:{
                "Content-Type":
                    "application/json",

                "Cache-Control":
                    "no-store"
            }

        }

    );

}