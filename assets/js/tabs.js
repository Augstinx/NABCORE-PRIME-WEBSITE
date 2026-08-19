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

function getTabs(tabSystem){

    return Array.from(
        tabSystem.querySelectorAll(
            TAB_SELECTORS.tab
        )
    );

}


/* ==========================================
   GET PANELS
========================================== */

function getPanels(tabSystem){

    return Array.from(
        tabSystem.querySelectorAll(
            TAB_SELECTORS.panel
        )
    );

}


/* ==========================================
   GET TAB ID
========================================== */

function getTabTargetId(tab){

    return (
        tab.dataset.tabTarget ||
        tab.getAttribute(
            "aria-controls"
        )
    );

}


/* ==========================================
   FIND PANEL
========================================== */

function getPanelForTab(
    tabSystem,
    tab
){

    const targetId =
        getTabTargetId(tab);


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
        getTabs(tabSystem);


    const panels =
        getPanels(tabSystem);


    if(!selectedTab){
        return;
    }


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

            const isActive =
                tab === selectedTab;


            tab.classList.toggle(
                "is-active",
                isActive
            );


            tab.setAttribute(
                "aria-selected",
                isActive
                    ? "true"
                    : "false"
            );


            tab.setAttribute(
                "tabindex",
                isActive
                    ? "0"
                    : "-1"
            );

        }
    );


    panels.forEach(
        (panel) => {

            const isActive =
                panel === selectedPanel;


            panel.classList.toggle(
                "is-active",
                isActive
            );


            panel.hidden =
                !isActive;


            panel.setAttribute(
                "aria-hidden",
                isActive
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
   HANDLE TAB CLICK
========================================== */

function handleTabClick(event){

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
        tab,
        false
    );

}


/* ==========================================
   HANDLE KEYBOARD NAVIGATION
========================================== */

function handleTabKeydown(event){

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
        getTabs(tabSystem);


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
                    currentIndex - 1 +
                    tabs.length
                ) %
                tabs.length;

            break;


        case "Home":

            event.preventDefault();

            targetIndex = 0;

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


    const targetTab =
        tabs[targetIndex];


    if(!targetTab){
        return;
    }


    activateTab(
        tabSystem,
        targetTab,
        true
    );

}


/* ==========================================
   INITIALIZE TAB
========================================== */

function initializeTab(
    tabSystem,
    tab,
    index
){

    const panel =
        getPanelForTab(
            tabSystem,
            tab
        );


    if(!panel){
        return;
    }


    /*
     * Generate an ID for the panel
     * when one does not already exist.
     */

    if(!panel.id){

        panel.id =
            `tab-panel-${crypto.randomUUID()}`;

    }


    /*
     * Connect tab and panel.
     */

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
        tab.id ||
        ""
    );


    /*
     * Generate tab ID when necessary.
     */

    if(!tab.id){

        tab.id =
            `tab-${crypto.randomUUID()}`;

        panel.setAttribute(
            "aria-labelledby",
            tab.id
        );

    }


    /*
     * Initial state.
     */

    tab.classList.remove(
        "is-active"
    );


    tab.setAttribute(
        "aria-selected",
        "false"
    );


    tab.setAttribute(
        "tabindex",
        "-1"
    );


    panel.classList.remove(
        "is-active"
    );


    panel.hidden =
        true;


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Events.
     */

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
   INITIALIZE TAB SYSTEM
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


    /*
     * Locate the tab list.
     */

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


    /*
     * Initialize each tab.
     */

    tabs.forEach(
        (
            tab,
            index
        ) => {

            initializeTab(
                tabSystem,
                tab,
                index
            );

        }
    );


    /*
     * Determine initial active tab.
     */

    let initialIndex =
        tabs.findIndex(
            (tab) => {

                return (
                    tab.classList.contains(
                        "is-active"
                    ) ||
                    tab.getAttribute(
                        "aria-selected"
                    ) === "true"
                );

            }
        );


    if(initialIndex < 0){

        initialIndex = 0;

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
        tabs[initialIndex],
        false
    );

}


/* ==========================================
   INITIALIZE ALL TAB SYSTEMS
========================================== */

export function initTabs(){

    const tabSystems =
        document.querySelectorAll(
            TAB_SELECTORS.tabs
        );


    if(!tabSystems.length){

        return;

    }


    tabSystems.forEach(
        (
            tabSystem
        ) => {

            initializeTabSystem(
                tabSystem
            );

        }
    );

}