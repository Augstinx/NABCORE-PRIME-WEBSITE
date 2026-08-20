/* ==========================================
   NABCORE PRIME LIMITED
   TABS SYSTEM
   tabs.js
========================================== */


/* ==========================================
   TAB SELECTORS
========================================== */

const TAB_SELECTORS = {

    tabs:
        "[data-tabs]",

    tabList:
        "[data-tab-list]",

    tab:
        "[data-tab]",

    panel:
        "[data-tab-panel]"

};


/* ==========================================
   TAB STATE
========================================== */

const tabStates =
    new WeakMap();


/* ==========================================
   GET TABS
========================================== */

function getTabs(
    tabSystem
){

    return Array.from(
        tabSystem.querySelectorAll(
            TAB_SELECTORS.tab
        )
    );

}


/* ==========================================
   GET PANELS
========================================== */

function getPanels(
    tabSystem
){

    return Array.from(
        tabSystem.querySelectorAll(
            TAB_SELECTORS.panel
        )
    );

}


/* ==========================================
   GET TARGET
========================================== */

function getTabTargetId(
    tab
){

    return (
        tab.dataset.tabTarget ||
        tab.getAttribute(
            "aria-controls"
        )
    );

}


/* ==========================================
   GET PANEL
========================================== */

function getPanelForTab(
    tabSystem,
    tab
){

    const targetId =
        getTabTargetId(
            tab
        );


    if(!targetId){
        return null;
    }


    return tabSystem.querySelector(
        `#${CSS.escape(targetId)}`
    );

}


/* ==========================================
   ACTIVATE TAB
========================================== */

function activateTab(
    tabSystem,
    selectedTab,
    moveFocus = false
){

    const tabs =
        getTabs(
            tabSystem
        );


    const panels =
        getPanels(
            tabSystem
        );


    const selectedPanel =
        getPanelForTab(
            tabSystem,
            selectedTab
        );


    if(!selectedPanel){
        return;
    }


    tabs.forEach(
        (tab) => {

            const active =
                tab === selectedTab;


            tab.classList.toggle(
                "is-active",
                active
            );


            tab.setAttribute(
                "aria-selected",
                active
                    ? "true"
                    : "false"
            );


            tab.setAttribute(
                "tabindex",
                active
                    ? "0"
                    : "-1"
            );

        }
    );


    panels.forEach(
        (panel) => {

            const active =
                panel === selectedPanel;


            panel.classList.toggle(
                "is-active",
                active
            );


            panel.hidden =
                !active;


            panel.setAttribute(
                "aria-hidden",
                active
                    ? "false"
                    : "true"
            );

        }
    );


    const state =
        tabStates.get(
            tabSystem
        );


    if(state){

        state.activeIndex =
            tabs.indexOf(
                selectedTab
            );

    }


    if(moveFocus){

        selectedTab.focus();

    }

}


/* ==========================================
   CLICK
========================================== */

function handleTabClick(
    event
){

    const tab =
        event.currentTarget;


    const tabSystem =
        tab.closest(
            TAB_SELECTORS.tabs
        );


    if(!tabSystem){
        return;
    }


    event.preventDefault();


    activateTab(
        tabSystem,
        tab
    );

}


/* ==========================================
   KEYBOARD
========================================== */

function handleTabKeydown(
    event
){

    const tab =
        event.currentTarget;


    const tabSystem =
        tab.closest(
            TAB_SELECTORS.tabs
        );


    if(!tabSystem){
        return;
    }


    const tabs =
        getTabs(
            tabSystem
        );


    const currentIndex =
        tabs.indexOf(
            tab
        );


    if(currentIndex === -1){
        return;
    }


    let targetIndex =
        currentIndex;


    switch(event.key){

        case "ArrowRight":

            event.preventDefault();

            targetIndex =
                (
                    currentIndex + 1
                ) %
                tabs.length;

            break;


        case "ArrowLeft":

            event.preventDefault();

            targetIndex =
                (
                    currentIndex -
                    1 +
                    tabs.length
                ) %
                tabs.length;

            break;


        case "Home":

            event.preventDefault();

            targetIndex =
                0;

            break;


        case "End":

            event.preventDefault();

            targetIndex =
                tabs.length - 1;

            break;


        case "Enter":
        case " ":

            event.preventDefault();

            activateTab(
                tabSystem,
                tab,
                true
            );

            return;


        default:

            return;

    }


    activateTab(
        tabSystem,
        tabs[targetIndex],
        true
    );

}


/* ==========================================
   INITIALIZE TAB
========================================== */

function initializeTab(
    tabSystem,
    tab
){

    const panel =
        getPanelForTab(
            tabSystem,
            tab
        );


    if(!panel){
        return;
    }


    if(!panel.id){

        panel.id =
            `tab-panel-${crypto.randomUUID()}`;

    }


    if(!tab.id){

        tab.id =
            `tab-${crypto.randomUUID()}`;

    }


    tab.setAttribute(
        "aria-controls",
        panel.id
    );


    tab.setAttribute(
        "role",
        "tab"
    );


    panel.setAttribute(
        "role",
        "tabpanel"
    );


    panel.setAttribute(
        "aria-labelledby",
        tab.id
    );


    tab.addEventListener(
        "click",
        handleTabClick
    );


    tab.addEventListener(
        "keydown",
        handleTabKeydown
    );

}


/* ==========================================
   INITIALIZE SYSTEM
========================================== */

function initializeTabSystem(
    tabSystem
){

    const tabs =
        getTabs(
            tabSystem
        );


    const panels =
        getPanels(
            tabSystem
        );


    if(
        !tabs.length ||
        !panels.length
    ){

        return;

    }


    const tabList =
        tabSystem.querySelector(
            TAB_SELECTORS.tabList
        );


    if(tabList){

        tabList.setAttribute(
            "role",
            "tablist"
        );

    }


    tabs.forEach(
        (tab) => {

            initializeTab(
                tabSystem,
                tab
            );

        }
    );


    let initialIndex =
        tabs.findIndex(
            (tab) =>
                tab.classList.contains(
                    "is-active"
                ) ||
                tab.getAttribute(
                    "aria-selected"
                ) === "true"
        );


    if(initialIndex < 0){

        initialIndex =
            0;

    }


    tabStates.set(
        tabSystem,
        {
            activeIndex:
                initialIndex
        }
    );


    activateTab(
        tabSystem,
        tabs[initialIndex]
    );

}


/* ==========================================
   INITIALIZE ALL
========================================== */

export function initTabs(){

    const systems =
        document.querySelectorAll(
            TAB_SELECTORS.tabs
        );


    systems.forEach(
        initializeTabSystem
    );

}