import '../edirom-core-web-components/src/edirom-icon.js';
import '../edirom-qr-code-scanner/edirom-qr-code-scanner.js';


console.log("ConcordanceNavigator Webcomponent loaded");


const templates = {
    desktop: `
    <style>
        #concordance-navigator-container, #item-selector-container, #group-selector-container, #concordance-selector-container {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
        }

        #concordance-navigator-container {
            align-items: center;
            width: 100%;
        }

        #concordance-selector-container, #group-selector-container, #connections-container, #time-container {
            width: 100%;
            align-self: center;
        }

        #connections-container {
            align-items: center;
        }

        .slider {
            width: 90%;
            box-sizing: border-box;
        }

        #concordance-selector, #group-selector, #item-selector {
            text-align: center;
        }

        #input-wrapper {
            position: relative;
            flex-grow: 1;
            margin: 3px;
        }

        #item-selector {
            width: 100%;
            height: 26px;
            box-sizing: border-box;
            padding-right: 30px;
        }

        #buttons-container {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
        }

        #prev-connection-button, #next-connection-button {
            height: 26px;
            width: 26px;
            padding: 0;
            flex-shrink: 0;
            box-sizing: border-box;
        }

        #show-connection-button {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 30px;
            border: none;
            background: #69696921;
            margin: 0;
            font-size: 0.8em;
        }

        #show-connection-button:hover {
            background: #08080826;
        }

        #time-container {
            display: none;
        }

        .duration-container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        button {
            margin: 3px;
        }
        input[type="range"], button, select {
            cursor: pointer;
        }

        .hidden {
            display: none !important;
        }
    </style>
    <div id="concordance-navigator-container">
        <div id="concordance-selector-container"></div>
        <div id="group-selector-container"></div>
        <div id="connections-container"></div>
        <div id="time-container"></div>
    </div>
`,

    mobile: `
    <style>
        :host {
            display: block;
            width: 100%;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: visible;
            overscroll-behavior: contain; /* Prevent pull-to-refresh on supported browsers */
            touch-action: pan-x pan-y; /* Allow native gestures; vertical is handled via JS for collapse */
            --nav-bg: var(--concordance-navigator-background, #1f2333);
            --nav-top-bg: color-mix(in srgb, var(--nav-bg) 78%, white);
            --nav-contrast: #e4d9a5;
            --nav-contrast-strong: #cdbf86;
            --nav-surface: #f6f6f3;
            --nav-surface-border: #d8d0a4;
            --nav-side-control-width: 2.75rem;
            --nav-row-gap: 0.75rem;
            --nav-control-column-max-width: 500px;
            --nav-top-row-padding-top: 8px;
            --nav-top-row-padding-bottom: 0px;
            --nav-surface-outline: rgba(255, 255, 255, 0.1);
            --nav-surface-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.3) inset;
        }

        input[type="range"] {
            touch-action: pan-x; /* Keep sliders draggable while blocking vertical pull-to-refresh */
            height: 2px;
            margin: 10px 0 12px;
        }

        #concordance-navigator-container {
            display: flex;
            flex-direction: column;
            position: relative;
            width: 100%;
            box-sizing: border-box;
            align-items: center;
        }

        #top-row,
        #bottom-row {
            display: flex;
            width: 100%;
            box-sizing: border-box;
        }

        #top-row {
            position: relative;
            z-index: 1;
            justify-content: center;
            overflow: hidden;
            height: auto;
            width: 97%;
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
            margin-bottom: calc(-1 * var(--nav-row-overlap));
            padding-top: var(--nav-top-row-padding-top);
            padding-right: calc(var(--nav-side-control-width) + var(--nav-row-gap) - 1.5%);
            padding-bottom: var(--nav-top-row-padding-bottom);
            padding-left: calc(var(--nav-side-control-width) + var(--nav-row-gap) - 1.5%);
            background: var(--nav-top-bg);
            box-shadow: rgba(0, 0, 0, 0.61) 0px 0px 4px 3px inset, rgba(0, 0, 0, 0.61) 0px -1px 4px 3px;
        }

        #top-row.animating {
            transition: height 120ms ease-out, padding-top 120ms ease-out, padding-bottom 120ms ease-out;
        }

        #bottom-row {
            position: relative;
            z-index: 2;
            align-items: center;
            gap: var(--nav-row-gap);
            background: var(--nav-bg);
            min-height: 50px;
        }

        #additional-navigations,
        #main-navigations {
            width: min(100%, var(--nav-control-column-max-width));
            max-width: var(--nav-control-column-max-width);
            min-width: 0;
            box-sizing: border-box;
            border: 1px solid var(--nav-surface-outline);
            box-shadow: var(--nav-surface-shadow);
        }

        #additional-navigations {
            display: flex;
            flex-direction: column;
            border-radius: 12px 12px 0 0;
            border-bottom: none;
            padding: 6px 8px 0;
            padding-bottom: 10px;
            background: var(--nav-top-bg);
            box-shadow: rgba(0, 0, 0, 0.61) 0px -2px 3px 2px inset;
        }

        #main-navigations {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            margin-inline: auto;
            border-radius: 0 0 12px 12px;
            border-top: none;
            padding: 4px 8px 4px;
            background: var(--nav-bg);
        }

        #collapse-expand-container, #scan-container {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: stretch;
            flex: 0 0 var(--nav-side-control-width);
            width: var(--nav-side-control-width);
            user-select: none;
            -webkit-user-select: none;
        }

        #connections-container, #group-selector-container, #concordance-selector-container {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            width: 100%;
        }

        #top-row #group-selector-container,
        #top-row #concordance-selector-container {
            margin: 5px 0 5px;
        }

        #top-row #connections-container {
         margin-top: 5px;
        }

        #item-selector {
            text-align: center;
        }

        #concordance-selector, #group-selector {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            text-align: center;
            text-align-last: center;
            width: 100%;
            height: 35px;
            box-sizing: border-box;
            padding: 0;
            background: var(--nav-bg);
            border: 1px solid var(--nav-contrast-strong);
            border-radius: 10px;
            color: var(--nav-contrast);
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
            user-select: none;
            -webkit-user-select: none;
        }

        #concordance-selector:hover, #group-selector:hover {
            background: #262b3f;
        }

        #input-wrapper {
            position: relative;
            flex-grow: 1;
            margin: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--tertiary-color);
            border: 1px solid var(--nav-surface-border);
            border-radius: 8px;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
            height: 35px;
            box-sizing: border-box;
            overflow: hidden;
            padding-left: 8px;
            padding-right: 40px;
        }

        #input-content {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 100%;
        }

        #item-selector-prefix {
            margin-right: 4px;
            font-size: 0.8rem;
            color: #1a1a1a;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
            flex-shrink: 0;
        }

        #item-selector {
            width: 1px;
            flex-grow: 0;
            flex-shrink: 0;
            height: 100%;
            box-sizing: border-box;
            padding: 0;
            background: transparent;
            border: none;
            color: #1a1a1a;
            font-size: 1rem;
            text-align: left;
        }

        #input-wrapper:focus-within {
            outline: 2px solid var(--nav-contrast);
            outline-offset: 2px;
        }

        #item-selector:focus {
            outline: none;
        }

        #buttons-container {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            gap: 6px;
            width: 100%;
        }

        #prev-connection-button, #next-connection-button {
            height: 35px;
            width: 35px;
            padding: 0;
            flex: 0 0 35px;
            box-sizing: border-box;
            background: var(--nav-bg);
            border: 1px solid var(--nav-contrast-strong);
            border-radius: 10px;
            color: var(--nav-contrast);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            user-select: none;
            -webkit-user-select: none;
        }

        #prev-connection-button:hover, #next-connection-button:hover {
            background: #262b3f;
        }

        #prev-connection-button:active, #next-connection-button:active {
            transform: translateY(1px);
        }

        #show-connection-button {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 36px;
            border: 1px solid var(--nav-surface-border);
            background: var(--secondary-color);
            margin: 0;
            font-size: 0.8em;
            border-radius: 0 8px 8px 0;
            color: #2d2d2d;
            user-select: none;
            -webkit-user-select: none;
        }

        #show-connection-button:hover {
            background: #08080826;
        }

        #time-container {
            display: none;
        }

        .duration-container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        button {
            margin: 0;
            color: var(--nav-contrast);
        }
        input[type="range"], button, select {
            cursor: pointer;
        }

        .hidden {
            display: none !important;
        }
    </style>
    <div id="concordance-navigator-container">
        <div id="top-row">
            <div id="additional-navigations">
                <div id="concordance-selector-container"></div>
                <div id="group-selector-container"></div>
                <div id="connections-container"></div>
            </div>
        </div>
        <div id="bottom-row">
            <div id="scan-container">
                <edirom-icon name="qr_code_scanner" size="2.0rem"></edirom-icon>
            </div>
            <div id="main-navigations"></div>
            <div id="collapse-expand-container">
                <edirom-icon name="keyboard_arrow_up" size="2rem"></edirom-icon>
            </div>
        </div>
    </div>
`
};


class concordanceNavigatorElement extends HTMLElement {
    constructor() {
        super();
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
        this.concordances = [];
        this.groups = [];
        this.data = [];
        this.labelField = "";
        this.index = 0;
        this.maxIndex = 0;
        this.timelineBasisData = [];
        this.timelineBasis;
        this.leadingZeroFormatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
        this.timelineState = "pause";
        this.interval = null;
        this.currentTime = 0;
        this.stopwatch = { elapsedTime: 0 }
        this.swipeStartY = null;
        this.swipeThreshold = 30; // Minimum vertical distance (px) to treat as swipe
        this.itemSelectorWasFocusedOnShowClick = false;
        this.isCollapsed = false;
        this.rawConcordances = [];
        this.injectDisabledConcordanceName = this.getAttribute("inject-disabled-concordance");
        this._scannerPopover = null;
        this._scannerContainer = null;
        this._qrScannerElement = null;
        this._popoverToggleHandler = null;
        this._documentVisibilityHandler = null;
        this._pageHideHandler = null;
        this._suppressShowConnection = false;
        this._mobileLayoutResizeObserver = null;
        this._mobileHeightSyncFrame = null;
        this._mobilePendingHeightSync = null;
        this._mobileCollapseTransitionActive = false;
        this._mobileTopRowShown = null;
        this._mobileHeightTransitionEnd = null;
        this.buttonsContainer = null;
    }

    getLayoutMode = (layoutMode) => layoutMode === 'mobile' ? 'mobile' : 'desktop';

    applyTemplate = () => {
        const template = document.createElement("template");
        template.innerHTML = templates[this.mode];
        this.shadow.innerHTML = '';
        this.shadow.append(template.content.cloneNode(true));
    }

    setupElements = () => {
        // Container elements
        this.navigatorContainer = this.shadow.querySelector("#concordance-navigator-container");
        this.topRow = this.shadow.querySelector("#top-row");
        this.bottomRow = this.shadow.querySelector("#bottom-row");
        this.additionalNavigations = this.shadow.querySelector("#additional-navigations");
        this.mainNavigations = this.shadow.querySelector("#main-navigations");
        this.concordanceSelectorContainer = this.shadow.querySelector("#concordance-selector-container");
        this.groupSelectorContainer = this.shadow.querySelector("#group-selector-container");
        this.connectionsContainer = this.shadow.querySelector("#connections-container");
        this.timeContainer = this.shadow.querySelector("#time-container");
        this.collapseExpandContainer = this.shadow.querySelector("#collapse-expand-container");
        this.collapseExpandIcon = this.collapseExpandContainer ? this.collapseExpandContainer.querySelector("edirom-icon") : null;
        this.scanContainer = this.shadow.querySelector("#scan-container");

        this.updateScanContainerVisibility();

        if (this.mode === "mobile") {
            this._buildScannerPopover();
            this._setupMobileLayoutObserver();


        }
    }

    setupEventListeners = () => {
        if (this.mode === "mobile") {
            this.collapseExpandContainer.addEventListener("click", () => {
                this.toggleCollapseState();
            });

            // Simple vertical swipe detection to expand/collapse on touch devices.
            this.addEventListener("touchstart", (e) => {
                if (e.touches.length !== 1) return;
                const inRangeInput = e.composedPath().some(el => el instanceof HTMLInputElement && el.type === "range");
                if (inRangeInput) {
                    this.swipeStartY = null; // Let native slider handle the gesture.
                    return;
                }
                this.swipeStartY = e.touches[0].clientY;
            }, { passive: false });

            this.addEventListener("touchmove", (e) => {
                if (this.swipeStartY === null || e.touches.length !== 1) return;
                e.preventDefault(); // Block default scroll/pull-to-refresh while gesture is active.
            }, { passive: false });

            this.addEventListener("touchend", (e) => {
                if (this.swipeStartY === null || e.changedTouches.length === 0) return;
                const deltaY = e.changedTouches[0].clientY - this.swipeStartY;
                if (Math.abs(deltaY) >= this.swipeThreshold) {
                    if (deltaY < 0) {
                        this.expandNavigator();
                    } else {
                        e.preventDefault();
                        this.collapseNavigator();
                    }
                }
                this.swipeStartY = null;
            }, { passive: false });

            // Default to collapsed on mobile so the component initially reveals only the bottom row.
            this.setCollapseState(true, { animate: false, fireLayoutChange: false });

            this.scanContainer.addEventListener("click", () => {
                this._scannerPopover.showPopover();
            });

            if (!this._documentVisibilityHandler) {
                this._documentVisibilityHandler = () => {
                    if (document.hidden) {
                        this._releaseScannerForInactivity();
                    }
                };
                document.addEventListener("visibilitychange", this._documentVisibilityHandler);
            }

            if (!this._pageHideHandler) {
                this._pageHideHandler = () => {
                    this._releaseScannerForInactivity();
                };
                window.addEventListener("pagehide", this._pageHideHandler);
            }
        }
    }

    // ==================== Builder Functions ====================

    buildConcordanceSelector = (selectedName) => {
        this.concordanceSelectorContainer.innerHTML = "";

        if (this.concordances.length === 0) return;

        const select = document.createElement("select");
        select.name = "concordance-selector";
        select.id = "concordance-selector";

        for (let concordance of this.concordances) {
            const option = document.createElement("option");
            option.value = concordance.name;
            option.text = concordance.name;
            const shouldSelect = selectedName ? concordance.name === selectedName : concordance === this.concordances[0];
            if (shouldSelect) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.switchConcordance(select.value);
        });

        this.concordanceSelectorContainer.appendChild(select);
        this.concordanceSelector = select;
        this.syncMobileNavigationPlacement();
    }

    buildGroupSelector = (groups, label) => {
        this.groupSelectorContainer.innerHTML = "";

        if (!groups || groups.length === 0) return;

        if (label) {
            const labelElem = document.createElement("label");
            labelElem.setAttribute("for", "group-selector");
            labelElem.id = "group-selector-label";
            labelElem.innerHTML = label;
            this.groupSelectorContainer.appendChild(labelElem);
        }

        const select = document.createElement("select");
        select.name = "group-selector";
        select.id = "group-selector";

        for (let group of groups) {
            const option = document.createElement("option");
            option.value = group.name;
            option.text = group.name;
            if (group === groups[0]) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.switchGroup(select.value);
        });

        this.groupSelectorContainer.appendChild(select);
        this.groupSelector = select;
        this.syncMobileNavigationPlacement();
    }

    buildConnectionsUI = (connections, label) => {
        this.connectionsContainer.innerHTML = "";
        if (this.mode === "mobile" && this.mainNavigations) {
            this.mainNavigations.innerHTML = "";
        }

        if (!connections || connections.length === 0) {
            this.clearData();
            this.buttonsContainer = null;
            this.syncMobileNavigationPlacement();
            this.scheduleMobileHeightSync({ animate: false });
            return;
        }

        // Set the data
        this.setData(connections, "name");

        // Build label (desktop: separate label element, mobile: inline prefix)
        this.itemSelectorLabelText = label || "";
        if (label && this.mode === "desktop") {
            const labelElem = document.createElement("label");
            labelElem.setAttribute("for", "item-slider");
            labelElem.id = "item-selector-label";
            labelElem.innerHTML = label;
            this.connectionsContainer.appendChild(labelElem);
            this.itemSelectorLabel = labelElem;
        }

        // Build slider
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = this.maxIndex.toString();
        slider.value = this.index.toString();
        slider.classList.add("slider");
        slider.id = "item-slider";

        slider.addEventListener("input", () => {
            this.timelinePause();
            this.updateIndex(slider.value);
        });
        slider.addEventListener("change", () => {
            this.showConnection();
        });

        this.connectionsContainer.appendChild(slider);
        this.itemSlider = slider;

        // Build buttons container
        const buttonsContainer = document.createElement("div");
        buttonsContainer.id = "buttons-container";
        this.buttonsContainer = buttonsContainer;

        // Previous button
        const prevButton = document.createElement("button");
        prevButton.id = "prev-connection-button";
        const prevIcon = document.createElement("edirom-icon");
        prevIcon.setAttribute("name", "eo_previous");
        if (this.mode === "mobile") {
            prevIcon.setAttribute("size", "2rem");
        }
        prevButton.appendChild(prevIcon);
        prevButton.addEventListener("click", () => {
            this.timelinePause();
            this.showPrevConnection();
        });
        buttonsContainer.appendChild(prevButton);
        this.prevConnectionButton = prevButton;

        // Input wrapper
        const inputWrapper = document.createElement("div");
        inputWrapper.id = "input-wrapper";

        // On mobile, clicking anywhere on the wrapper should focus the input
        if (this.mode === "mobile") {
            inputWrapper.addEventListener("click", (e) => {
                // Don't focus if clicking on the show button
                if (e.target.closest("#show-connection-button")) return;
                itemSelector.focus();
            });
        }

        // On mobile, wrap prefix and input in an inner container for centering
        let inputContainer = inputWrapper;
        if (this.mode === "mobile") {
            const innerContent = document.createElement("div");
            innerContent.id = "input-content";
            inputWrapper.appendChild(innerContent);
            inputContainer = innerContent;

            // Add prefix only if there's actual label text
            if (this.itemSelectorLabelText && this.itemSelectorLabelText.trim()) {
                const prefixSpan = document.createElement("span");
                prefixSpan.id = "item-selector-prefix";
                prefixSpan.textContent = this.itemSelectorLabelText + " ";
                inputContainer.appendChild(prefixSpan);
                this.itemSelectorPrefix = prefixSpan;
            }
        }

        const itemSelector = document.createElement("input");
        itemSelector.type = "text";
        itemSelector.id = "item-selector";
        itemSelector.value = this.getEnhancedValue();

        // On mobile, dynamically size input based on content
        if (this.mode === "mobile") {
            const updateInputWidth = () => {
                const tempSpan = document.createElement("span");
                tempSpan.style.cssText = "visibility:hidden;position:absolute;white-space:pre;font-size:1rem;";
                tempSpan.textContent = itemSelector.value || " ";
                document.body.appendChild(tempSpan);
                const textWidth = tempSpan.offsetWidth;
                document.body.removeChild(tempSpan);
                itemSelector.style.width = Math.max(20, textWidth + 4) + "px";
            };
            itemSelector.addEventListener("input", updateInputWidth);
            // Initial sizing after element is in DOM
            setTimeout(updateInputWidth, 0);
            this._updateInputWidth = updateInputWidth;
        }

        itemSelector.addEventListener("keypress", (e) => {
            this.specialKeyOnInput(itemSelector, e);
        });
        itemSelector.addEventListener("focus", () => {
            this.timelinePause();
            if (this.mode === "mobile") {
                setTimeout(() => {
                    itemSelector.scrollIntoView({ "alignToTop": true });
                }, 300);
            }
        });
        inputContainer.appendChild(itemSelector);
        this.itemSelector = itemSelector;

        const showButton = document.createElement("button");
        showButton.id = "show-connection-button";
        const showIcon = document.createElement("edirom-icon");
        showIcon.setAttribute("name", "keyboard_return");
        showButton.appendChild(showIcon);
        showButton.addEventListener("mousedown", () => {
            this.itemSelectorWasFocusedOnShowClick = this.shadow.activeElement === this.itemSelector;
        });
        showButton.addEventListener("click", () => {
            this.timelinePause();
            if (this.itemSelectorWasFocusedOnShowClick) {
                this.setEnhancedValue(this.itemSelector.value);
            } else {
                this.showConnection();
            }
            this.itemSelectorWasFocusedOnShowClick = false;
        });
        inputWrapper.appendChild(showButton);
        this.showConnectionButton = showButton;

        buttonsContainer.appendChild(inputWrapper);

        // Next button
        const nextButton = document.createElement("button");
        nextButton.id = "next-connection-button";
        const nextIcon = document.createElement("edirom-icon");
        nextIcon.setAttribute("name", "eo_next");
        if (this.mode === "mobile") {
            nextIcon.setAttribute("size", "2rem");
        }
        nextButton.appendChild(nextIcon);
        nextButton.addEventListener("click", () => {
            this.timelinePause();
            this.showNextConnection();
        });
        buttonsContainer.appendChild(nextButton);
        this.nextConnectionButton = nextButton;

        if (this.mode !== "mobile") {
            this.connectionsContainer.appendChild(buttonsContainer);
        }

        this.syncMobileNavigationPlacement();

        // Set initial button visibility based on index position.
        this.updateNavigationButtonsVisibility();

        // Reserved for future collapse-managed sub-elements.
        this.updateCollapsibleControlsVisibility();
        this.scheduleMobileHeightSync({ animate: false });
    }

    buildTimelineUI = () => {
        this.timeContainer.innerHTML = "";

        if (this.timelineBasisData.length === 0) return;

        const hr = document.createElement("hr");
        this.timeContainer.appendChild(hr);

        const select = document.createElement("select");
        select.name = "timeline-basis-selector";
        select.id = "timeline-basis-selector";

        for (let item of this.timelineBasisData) {
            const option = document.createElement("option");
            option.value = item.siglum;
            option.text = item.siglum;
            if (item === this.timelineBasisData[0]) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.switchTimelineBasis(select.value);
        });

        this.timeContainer.appendChild(select);
        this.timelineBasisSelector = select;

        const durationContainer = document.createElement("div");
        durationContainer.classList.add("duration-container");

        const currentTimeInput = document.createElement("input");
        currentTimeInput.type = "text";
        currentTimeInput.id = "current-time";
        currentTimeInput.value = "0:00";
        currentTimeInput.size = 5;
        currentTimeInput.addEventListener("focus", () => {
            this.timelinePause();
        });
        currentTimeInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                console.log("Time changed with key press.");
                let newTime = this.hhmmssToSeconds(currentTimeInput.value);
                if (newTime === false) {
                    newTime = this.currentTime;
                }
                this.currentTime = newTime;
                this.timeChanged();
            }
        });
        durationContainer.appendChild(currentTimeInput);
        this.currentTimeElem = currentTimeInput;

        durationContainer.appendChild(document.createTextNode(" / "));

        const totalTime = document.createElement("div");
        totalTime.id = "total-time";
        durationContainer.appendChild(totalTime);
        this.totalTimeElem = totalTime;

        this.timeContainer.appendChild(durationContainer);

        const playButton = document.createElement("button");
        playButton.id = "play-button";
        playButton.innerHTML = "Play";
        playButton.addEventListener("click", () => {
            if (this.timelineState === "pause") {
                this.timelinePlay();
            } else if (this.timelineState === "play") {
                this.timelinePause();
            }
        });
        this.timeContainer.appendChild(playButton);
        this.playButton = playButton;

        this.timeContainer.style.display = "block";
        this.switchTimelineBasis(select.value);
    }

    static get observedAttributes() {
        return ["concordances-data", "show-connection-button-label-data", "inject-disabled-concordance", "enable-qr-code-scanner", "current-connection", "qr-regex"];
    }

    get concordancesData() {
        return this.getAttribute("concordances-data");
    }
    set concordancesData(value) {
        this.setAttribute("concordances-data", value);
    }

    connectedCallback() {
        console.log("Concordance Navigator connected!");
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.tabIndex = 0; // Make the host focusable and let clicks delegate focus into the shadow DOM so inputs behave on first click.
        this.applyTemplate();
        this.setupElements();
        this.setupEventListeners();
        this.setConcordances();
        if (this.mode === "mobile") {
            this.scheduleMobileHeightSync({ animate: false });
        }
        this.setAttribute('data-handles-back-request', '');
        this.addEventListener('back-request', this._handleBackRequest);
    }

    setCollapseState = (shouldCollapse, { animate = true, fireLayoutChange = true } = {}) => {
        if (shouldCollapse === this.isCollapsed) return;
        this.isCollapsed = shouldCollapse;

        if (shouldCollapse) {
            this.setAttribute("collapsed", "");
            this.removeAttribute("expanded");
        } else {
            this.setAttribute("expanded", "");
            this.removeAttribute("collapsed");
        }

        if (this.collapseExpandIcon) {
            this.collapseExpandIcon.setAttribute("name", shouldCollapse ? "keyboard_arrow_up" : "keyboard_arrow_down");
        }

        if (this.mode === "mobile") {
            this.applyCollapsedState({ animate, fireLayoutChange });
        }
    }

    toggleCollapseState = () => {
        this.setCollapseState(!this.isCollapsed);
    }

    collapseNavigator = () => {
        this.setCollapseState(true);
    }

    expandNavigator = () => {
        this.setCollapseState(false);
    }

    applyCollapsedState = ({ animate = true, fireLayoutChange = true } = {}) => {
        if (this.mode !== "mobile") return;

        this.updateCollapsibleControlsVisibility();
        this.scheduleMobileHeightSync({ animate });

        if (fireLayoutChange) {
            this.fireLayoutChangeEvent();
        }
    }

    updateNavigationButtonsVisibility = () => {
        if (this.prevConnectionButton) {
            this.prevConnectionButton.style.visibility = this.index <= 0 ? "hidden" : "visible";
        }
        if (this.nextConnectionButton) {
            this.nextConnectionButton.style.visibility = this.index >= this.maxIndex ? "hidden" : "visible";
        }
    }

    updateCollapsibleControlsVisibility = () => {
        if (this.mode !== "mobile") return;

        const collapseManagedElements = this.shadow.querySelectorAll("[data-collapse-visibility='hidden']");
        for (const element of collapseManagedElements) {
            element.classList.toggle("hidden", this.isCollapsed);
        }
    }

    updateScanContainerVisibility = () => {
        if (!this.scanContainer) return;
        const enabled = this.hasAttribute("enable-qr-code-scanner");
        this.scanContainer.style.visibility = enabled ? "visible" : "hidden";
        this.scanContainer.style.pointerEvents = enabled ? "auto" : "none";
        this.scanContainer.setAttribute("aria-hidden", enabled ? "false" : "true");
    }

    getMobileVisibleContainers = () => {
        return [
            this.concordanceSelectorContainer,
            this.groupSelectorContainer,
            this.connectionsContainer
        ].filter((container) => container && container.children.length > 0);
    }

    syncMobileNavigationPlacement = () => {
        if (this.mode !== "mobile" || !this.additionalNavigations || !this.mainNavigations) return;

        const visibleContainers = this.getMobileVisibleContainers();
        const hasConnections = !!this.connectionsContainer && this.connectionsContainer.children.length > 0;

        this.additionalNavigations.innerHTML = "";
        this.mainNavigations.innerHTML = "";

        if (hasConnections) {
            visibleContainers.forEach((container) => {
                this.additionalNavigations.appendChild(container);
            });

            if (this.buttonsContainer) {
                this.mainNavigations.appendChild(this.buttonsContainer);
            }
        } else {
            visibleContainers.forEach((container) => {
                this.mainNavigations.appendChild(container);
            });
        }
    }

    isDisabledConcordanceSelected = () => {
        return !!this.injectDisabledConcordanceName && this.concordanceSelector?.value === this.injectDisabledConcordanceName;
    }

    hasExpandableMobileContent = () => {
        return !!this.connectionsContainer && this.connectionsContainer.children.length > 0;
    }

    isMobileCollapsible = () => {
        return this.hasExpandableMobileContent() && !this.isDisabledConcordanceSelected();
    }

    getMobileTopRowTargetHeight = () => {
        if (!this.topRow || !this.additionalNavigations || !this.hasExpandableMobileContent()) {
            return 0;
        }

        const styles = getComputedStyle(this);
        const paddingTop = parseFloat(styles.getPropertyValue("--nav-top-row-padding-top")) || 0;
        const paddingBottom = parseFloat(styles.getPropertyValue("--nav-top-row-padding-bottom")) || 0;
        const additionalHeight = Math.ceil(this.additionalNavigations.scrollHeight);

        return additionalHeight + paddingTop + paddingBottom;
    }

    _setupMobileLayoutObserver = () => {
        if (this.mode !== "mobile" || typeof ResizeObserver === "undefined") return;

        if (this._mobileLayoutResizeObserver) {
            this._mobileLayoutResizeObserver.disconnect();
        }

        this._mobileLayoutResizeObserver = new ResizeObserver(() => {
            if (this._mobileCollapseTransitionActive) {
                return;
            }
            this.scheduleMobileHeightSync({ animate: false });
        });

        [this.topRow, this.bottomRow, this.additionalNavigations, this.mainNavigations].forEach((element) => {
            if (element) {
                this._mobileLayoutResizeObserver.observe(element);
            }
        });
    }

    scheduleMobileHeightSync = ({ animate = false } = {}) => {
        if (this.mode !== "mobile") return;

        if (this._mobilePendingHeightSync) {
            this._mobilePendingHeightSync.animate = this._mobilePendingHeightSync.animate || animate;
        } else {
            this._mobilePendingHeightSync = { animate };
        }

        if (this._mobileHeightSyncFrame) return;

        this._mobileHeightSyncFrame = requestAnimationFrame(() => {
            const pendingSync = this._mobilePendingHeightSync || { animate: false };
            this._mobileHeightSyncFrame = null;
            this._mobilePendingHeightSync = null;
            this.syncMobileHeight({ animate: pendingSync.animate });
        });
    }

    syncMobileHeight = ({ animate = false } = {}) => {
        if (this.mode !== "mobile" || !this.topRow || !this.bottomRow) return;

        const hasExpandableContent = this.hasExpandableMobileContent();
        const isCollapsible = this.isMobileCollapsible();
        if (this.collapseExpandContainer) {
            this.collapseExpandContainer.style.visibility = isCollapsible ? "visible" : "hidden";
        }

        if (isCollapsible) {
            this.setAttribute("collapsible", "");
            this.toggleAttribute("collapsed", this.isCollapsed);
            this.toggleAttribute("expanded", !this.isCollapsed);
        } else {
            this.removeAttribute("collapsible");
            this.removeAttribute("collapsed");
            this.removeAttribute("expanded");
        }

        const shouldShowTopRow = hasExpandableContent && (!isCollapsible || !this.isCollapsed);
        const visibilityChanged = this._mobileTopRowShown !== null && this._mobileTopRowShown !== shouldShowTopRow;
        const shouldAnimate = animate || visibilityChanged;

        this.style.height = "";
        this._mobileTopRowShown = shouldShowTopRow;

        this.topRow.style.boxShadow = shouldShowTopRow
            ? "rgba(0, 0, 0, 0.61) 0px 0px 4px 3px inset, rgba(0, 0, 0, 0.61) 0px -1px 4px 3px"
            : "none";

        if (shouldShowTopRow && !shouldAnimate) {
            // Expanded, content changed while already visible — update instantly.
            // height:auto lets the browser handle the new content size without any transition.
            this._cancelMobileHeightTransition();
            this.topRow.style.transition = "none";
            this.topRow.style.height = "auto";
            this.topRow.style.paddingTop = "var(--nav-top-row-padding-top)";
            this.topRow.style.paddingBottom = "var(--nav-top-row-padding-bottom)";
            requestAnimationFrame(() => {
                if (this.isConnected) {
                    this.topRow.style.transition = "";
                }
            });
        } else if (shouldShowTopRow && shouldAnimate) {
            // Expand animation: collapsed → expanded.
            // Animate from 0px to the computed target height, then snap to auto.
            this._cancelMobileHeightTransition();
            const targetHeight = this.getMobileTopRowTargetHeight();
            this._mobileCollapseTransitionActive = true;
            this.topRow.classList.add("animating");
            this.topRow.style.height = `${targetHeight}px`;
            this.topRow.style.paddingTop = "var(--nav-top-row-padding-top)";
            this.topRow.style.paddingBottom = "var(--nav-top-row-padding-bottom)";
            const onExpandEnd = (event) => {
                if (event.propertyName !== "height") return;
                this.topRow.removeEventListener("transitionend", onExpandEnd);
                this._mobileHeightTransitionEnd = null;
                this.topRow.style.height = "auto";
                this.topRow.classList.remove("animating");
                this._mobileCollapseTransitionActive = false;
            };
            this._mobileHeightTransitionEnd = onExpandEnd;
            this.topRow.addEventListener("transitionend", onExpandEnd);
        } else if (!shouldShowTopRow && shouldAnimate) {
            // Collapse animation: expanded → collapsed.
            // Snapshot the current rendered height, pin it, then animate to 0.
            this._cancelMobileHeightTransition();
            const currentHeight = this.topRow.getBoundingClientRect().height;
            this._mobileCollapseTransitionActive = true;
            this.topRow.style.transition = "none";
            this.topRow.style.height = `${currentHeight}px`;
            // Force a reflow to commit the pinned height before enabling the transition.
            void this.topRow.getBoundingClientRect();
            this.topRow.style.transition = "";
            this.topRow.classList.add("animating");
            this.topRow.style.height = "0px";
            this.topRow.style.paddingTop = "0px";
            this.topRow.style.paddingBottom = "0px";
            const onCollapseEnd = (event) => {
                if (event.propertyName !== "height") return;
                this.topRow.removeEventListener("transitionend", onCollapseEnd);
                this._mobileHeightTransitionEnd = null;
                this.topRow.classList.remove("animating");
                this._mobileCollapseTransitionActive = false;
            };
            this._mobileHeightTransitionEnd = onCollapseEnd;
            this.topRow.addEventListener("transitionend", onCollapseEnd);
        } else {
            // Instant collapse — no animation (e.g. initial state, fast hide).
            this._cancelMobileHeightTransition();
            this.topRow.style.transition = "none";
            this.topRow.style.height = "0px";
            this.topRow.style.paddingTop = "0px";
            this.topRow.style.paddingBottom = "0px";
            requestAnimationFrame(() => {
                if (this.isConnected) {
                    this.topRow.style.transition = "";
                }
            });
        }
    }

    _cancelMobileHeightTransition = () => {
        if (this._mobileHeightTransitionEnd) {
            this.topRow.removeEventListener("transitionend", this._mobileHeightTransitionEnd);
            this._mobileHeightTransitionEnd = null;
        }
        this.topRow.classList.remove("animating");
        this.topRow.style.transition = "";
        this._mobileCollapseTransitionActive = false;
    }

    _buildScannerPopover = () => {
        const popover = document.createElement("div");
        popover.popover = "manual";
        // Do NOT set display here — the Popover API hides elements via display:none
        // on the UA stylesheet. An explicit display inline style would override that,
        // causing the popover to be permanently visible even when "hidden".
        popover.style.cssText = [
            "margin: 0",
            "padding: 0",
            "border: none",
            "width: 100dvw",
            "height: 100dvh",
            "box-sizing: border-box",
            "background: rgba(0, 0, 0, 0.85)",
        ].join(";");

        // Inner wrapper carries the flex layout so it never interferes with the
        // browser's display:none that the Popover API uses to hide the popover.
        const inner = document.createElement("div");
        inner.style.cssText = [
            "display: flex",
            "flex-direction: column",
            "align-items: center",
            "justify-content: space-between",
            "width: 100%",
            "height: 100%",
            "padding: 24px",
            "box-sizing: border-box",
        ].join(";");

        // Top group: instruction text + camera feed, stacked vertically and
        // centred horizontally. flex-grow: 1 lets it fill the available space
        // above the button row.
        const topGroup = document.createElement("div");
        topGroup.style.cssText = [
            "display: flex",
            "flex-direction: column",
            "align-items: center",
            "flex-grow: 1",
            "width: 100%",
        ].join(";");

        const scannerInstruction = document.createElement("p");
        scannerInstruction.textContent = "Bandkontext wechseln durch QR-Code";
        scannerInstruction.style.cssText = [
            "color: #e4d9a5",
            "font-size: 1rem",
            "text-align: center",
            "margin: 16px 0 5px 0px",
            "padding: 0 16px",
            "flex-shrink: 0",
        ].join(";");

        const scannerContainer = document.createElement("div");
        scannerContainer.style.cssText = [
            "width: 100%",
            "border-radius: 12px",
            "overflow: hidden",
            "flex-shrink: 1",
        ].join(";");
        this._scannerContainer = scannerContainer;


        topGroup.appendChild(scannerContainer);
        topGroup.appendChild(scannerInstruction);

        // Button row — sits at the bottom, right-aligned so buttons are
        // reachable by the thumb. Add further buttons here in the future.
        const buttonRow = document.createElement("div");
        buttonRow.style.cssText = [
            "display: flex",
            "flex-direction: row",
            "justify-content: flex-end",
            "align-items: center",
            "width: 100%",
            "gap: 12px",
            "flex-shrink: 0",
        ].join(";");

        const closeButton = document.createElement("button");
        closeButton.textContent = "Schließen";
        closeButton.setAttribute("aria-label", "QR-Code-Scanner schließen");
        closeButton.style.cssText = [
            "padding: 12px 28px",
            "font-size: 1rem",
            "cursor: pointer",
            "border: none",
            "border-radius: 8px",
            "background: #e4d9a5",
            "color: #1f2333",
            "font-weight: bold",
        ].join(";");
        closeButton.addEventListener("click", () => {
            popover.hidePopover();
        });

        buttonRow.appendChild(closeButton);

        popover.appendChild(inner);
        inner.appendChild(topGroup);
        inner.appendChild(buttonRow);

        this._popoverToggleHandler = async (event) => {
            if (event.newState === "open") {
                const scanner = this._ensureScannerElement();
                const resumed = scanner.resumeScanner();
                if (!resumed) {
                    try {
                        await scanner.startScanner();
                    } catch (err) {
                        console.error("Failed to start QR scanner", err);
                    }
                }
            } else {
                await this._pauseOrStopScanner();
            }
        };

        popover.addEventListener("toggle", this._popoverToggleHandler);

        this.shadow.appendChild(popover);
        this._scannerPopover = popover;
    }

    _ensureScannerElement = () => {
        if (this._qrScannerElement) {
            return this._qrScannerElement;
        }

        const scanner = document.createElement("edirom-qr-code-scanner");
        scanner.setAttribute("aspect-ratio", "1");
        if (this.hasAttribute("qr-regex")) {
            scanner.setAttribute("regex", this.getAttribute("qr-regex"));
        }
        scanner.addEventListener("qr-code-scanned", (e) => {
            console.log("QR Code scanned:", e.detail.text);
            const paused = scanner.pauseScanner(true);
            if (!paused) {
                scanner.stopScanner().catch((err) => {
                    console.error("Failed to stop QR scanner after scan", err);
                });
            }
            this.dispatchEvent(new CustomEvent("load-links-request", {
                detail: e.detail.text,
                bubbles: true,
                composed: true
            }));
        });

        this._scannerContainer.appendChild(scanner);
        this._qrScannerElement = scanner;
        return scanner;
    }

    _pauseOrStopScanner = async () => {
        if (!this._qrScannerElement) return;

        const paused = this._qrScannerElement.pauseScanner(true);
        if (!paused) {
            try {
                await this._qrScannerElement.stopScanner();
            } catch (err) {
                console.error("Failed to stop QR scanner", err);
            }
        }
    }

    _releaseScannerForInactivity = async () => {
        if (this._scannerPopover && this._scannerPopover.matches(":popover-open")) {
            this._scannerPopover.hidePopover();
        }

        if (!this._qrScannerElement) return;
        try {
            await this._qrScannerElement.stopScanner();
        } catch (err) {
            console.error("Failed to stop scanner on inactivity", err);
        }
    }

    /**
     * Closes the QR scanner popover if it is currently open.
     * Safe to call when the popover does not exist or is already closed.
     */
    closeScannerPopover = () => {
        this._scannerPopover?.hidePopover();
    }

    _handleBackRequest = (event) => {
        if (this._scannerPopover?.matches(':popover-open')) {
            event.preventDefault();
            this.closeScannerPopover();
            this._pauseOrStopScanner();
        }
    }

    disconnectedCallback() {
        console.log("Concordance Navigator disconnected!");
        this.removeEventListener('back-request', this._handleBackRequest);

        if (this._mobileHeightSyncFrame) {
            cancelAnimationFrame(this._mobileHeightSyncFrame);
            this._mobileHeightSyncFrame = null;
        }

        if (this._mobileLayoutResizeObserver) {
            this._mobileLayoutResizeObserver.disconnect();
            this._mobileLayoutResizeObserver = null;
        }

        if (this._documentVisibilityHandler) {
            document.removeEventListener("visibilitychange", this._documentVisibilityHandler);
            this._documentVisibilityHandler = null;
        }

        if (this._pageHideHandler) {
            window.removeEventListener("pagehide", this._pageHideHandler);
            this._pageHideHandler = null;
        }

        this._releaseScannerForInactivity();

        if (this._scannerPopover && this._popoverToggleHandler) {
            this._scannerPopover.removeEventListener("toggle", this._popoverToggleHandler);
            this._popoverToggleHandler = null;
        }

        if (this._scannerPopover) {
            this._scannerPopover.remove();
            this._scannerPopover = null;
        }

        this._scannerContainer = null;
        this._qrScannerElement = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        if (oldValue === newValue) return;
        if (name === "concordances-data") {
            this.rawConcordances = JSON.parse(newValue);
            this.setConcordances();
        }
        if (name === "inject-disabled-concordance") {
            this.injectDisabledConcordanceName = newValue || null;
            this.setConcordances();
        }
        if (name === "enable-qr-code-scanner") {
            this.updateScanContainerVisibility();
        }
        if (name === "qr-regex") {
            if (this._qrScannerElement) {
                if (newValue !== null) {
                    this._qrScannerElement.setAttribute("regex", newValue);
                } else {
                    this._qrScannerElement.removeAttribute("regex");
                }
            }
        }
        if (name === "current-connection") {
            if (newValue && this.concordanceSelectorContainer && this.concordances.length > 0) {
                this.navigateToConnectionById(newValue);
            }
        }

    }

    // Fill the menu with concordances
    getConcordancesWithInjection = () => {
        const baseConcordances = Array.isArray(this.rawConcordances) ? [...this.rawConcordances] : [];
        if (!this.injectDisabledConcordanceName) {
            return baseConcordances;
        }
        const filteredBase = baseConcordances.filter(c => c && c.name !== this.injectDisabledConcordanceName);
        return [{ name: this.injectDisabledConcordanceName, groups: null, connections: null }, ...filteredBase];
    }

    setConcordances = () => {
        if (!this.concordanceSelectorContainer) return;

        const previousSelection = this.concordanceSelector?.value;
        this.concordances = this.getConcordancesWithInjection();

        const desiredSelection = previousSelection && this.concordances.some(c => c.name === previousSelection)
            ? previousSelection
            : (this.concordances[0]?.name || null);

        const currentConnection = this.getAttribute("current-connection");
        const shouldSelectCurrentConnection = !!currentConnection;
        const previousSuppressFlag = this._suppressShowConnection;

        if (shouldSelectCurrentConnection) {
            this._suppressShowConnection = true;
        }

        this.buildConcordanceSelector(desiredSelection);

        if (this.concordances.length > 0) {
            this.switchConcordance(this.concordanceSelector.value);
        }

        this._suppressShowConnection = previousSuppressFlag;

        if (shouldSelectCurrentConnection) {
            this.navigateToConnectionById(currentConnection);
        }
    }

    findConnectionById = (connectionId) => {
        if (!connectionId || !Array.isArray(this.concordances) || this.concordances.length === 0) {
            return null;
        }

        const normalizedConnectionId = String(connectionId);

        for (const concordance of this.concordances) {
            const directConnections = concordance?.connections?.connections;
            if (Array.isArray(directConnections)) {
                const connectionIndex = directConnections.findIndex((connection) => String(connection?.id) === normalizedConnectionId);
                if (connectionIndex !== -1) {
                    return {
                        concordanceName: concordance.name,
                        groupName: null,
                        connectionIndex
                    };
                }
            }

            const groups = concordance?.groups?.groups;
            if (!Array.isArray(groups)) continue;

            for (const group of groups) {
                const groupConnections = group?.connections?.connections;
                if (!Array.isArray(groupConnections)) continue;

                const connectionIndex = groupConnections.findIndex((connection) => String(connection?.id) === normalizedConnectionId);
                if (connectionIndex !== -1) {
                    return {
                        concordanceName: concordance.name,
                        groupName: group.name,
                        connectionIndex
                    };
                }
            }
        }

        return null;
    }

    navigateToConnectionById = (connectionId) => {
        const resolved = this.findConnectionById(connectionId);
        if (!resolved) {
            console.warn("Connection ID not found:", connectionId);
            return false;
        }

        const previousSuppressFlag = this._suppressShowConnection;
        this._suppressShowConnection = true;

        this.switchConcordance(resolved.concordanceName);
        if (this.concordanceSelector) {
            this.concordanceSelector.value = resolved.concordanceName;
        }

        if (resolved.groupName !== null) {
            this.switchGroup(resolved.groupName);
            if (this.groupSelector) {
                this.groupSelector.value = resolved.groupName;
            }
        }

        this._suppressShowConnection = previousSuppressFlag;

        const indexWasUpdated = this.updateIndex(resolved.connectionIndex);
        if (!indexWasUpdated) {
            return false;
        }

        this.showConnection();
        return true;
    }

    switchConcordance = (concordanceName) => {
        console.log("Concordance switched!");
        const concordance = this.concordances.find(c => c.name === concordanceName);
        if (!concordance) {
            this.groupSelectorContainer.innerHTML = "";
            this.connectionsContainer.innerHTML = "";
            this.clearData();
            this.buttonsContainer = null;
            this.syncMobileNavigationPlacement();
            this.scheduleMobileHeightSync({ animate: false });
            return;
        }
        const isDisabledConcordance = this.injectDisabledConcordanceName && concordanceName === this.injectDisabledConcordanceName;
        const hasGroups = concordance.groups?.groups?.length > 0;
        const hasDirectConnections = concordance.connections?.connections?.length > 0;
        let shouldFireShowConnection = false;

        if (hasGroups) {
            this.groups = concordance.groups.groups;
            this.buildGroupSelector(this.groups, concordance.groups.label);
            // switchGroup will be triggered, which builds connections UI
            this.switchGroup(this.groupSelector.value);
        } else {
            // Clear group selector
            this.groupSelectorContainer.innerHTML = "";
            this.groups = [];

            if (hasDirectConnections) {
                console.log("No groups, but has direct connections!");
                this.buildConnectionsUI(concordance.connections.connections, concordance.connections.label);
                shouldFireShowConnection = this.data.length > 0;
            } else {
                console.log("No groups and no connections!");
                this.connectionsContainer.innerHTML = "";
                this.clearData();
                this.buttonsContainer = null;
                this.syncMobileNavigationPlacement();
            }
        }

        // Always expand when concordance changes.
        this.setCollapseState(false);

        if (shouldFireShowConnection) {
            this.showConnection();
        }

        if (isDisabledConcordance && !this._suppressShowConnection) {
            const disabledEvent = new CustomEvent('concordance-navigator-disabled', {
                bubbles: true
            });
            this.dispatchEvent(disabledEvent);
        }

        this.fireLayoutChangeEvent();
    }

    switchGroup = (groupName) => {
        console.log("Group switched!");
        const group = this.groups.find(g => g.name === groupName);
        const hasConnections = group?.connections?.connections?.length > 0;
        const shouldFireShowConnection = hasConnections;

        if (hasConnections) {
            this.buildConnectionsUI(group.connections.connections, group.connections.label);
        } else {
            console.log("Group has no connections!");
            this.connectionsContainer.innerHTML = "";
            this.clearData();
            this.buttonsContainer = null;
            this.syncMobileNavigationPlacement();
            this.scheduleMobileHeightSync({ animate: false });
        }

        // Always expand when group changes.
        this.setCollapseState(false);

        if (shouldFireShowConnection && this.data.length > 0) {
            this.showConnection();
        }

        this.fireLayoutChangeEvent();
    }

    setData = (data, labelField) => {
        this.data = data;
        this.labelField = labelField;
        this.index = 0;
        this.maxIndex = this.data.length - 1;
        // this.setTimelineBasis(); // Set this to active time based media features (work in progress).
    }

    clearData = () => {
        this.data = [];
        this.labelField = "";
        this.index = 0;
        this.maxIndex = 0;
    }

    getEnhancedValue = () => {
        return this.data[this.index][this.labelField];
    }

    setEnhancedValue = (value) => {
        var index = this.data.findIndex(item => item[this.labelField] === value);

        if (index === -1) { // findIndex returns -1 if no item was found
            this.itemSelector.value = this.getEnhancedValue();
        }
        else {
            let success = this.updateIndex(index);
            if (success) {
                this.showConnection();
            }
        }
    }

    specialKeyOnInput = (t, e) => {
        if (e.key === "Enter") {
            this.setEnhancedValue(t.value);
        }

    }

    fireLayoutChangeEvent = () => {
        console.log("Firing layout change event!");
        const updateLayoutEvent = new CustomEvent('layout-change', {
            bubbles: true
        });
        this.dispatchEvent(updateLayoutEvent);
    }

    setTimelineBasis = async () => {
        this.timelineBasisData = [];
        this.timeContainer.style.display = "none";
        this.timeContainer.innerHTML = "";
        this.interval = clearInterval(this.interval);

        if (!this.data || this.data.length === 0) return;

        for (let uri of this.data[0].plist.replace(/\s|;/g, '\uC280').split('\uC280')) {
            if (uri.length === 0) continue;
            const data = await this.makeRequest("data/xql/getMeasuresInRecording.xql?uri=" + uri.split("#")[0]);
            if (data.length > 0) {
                this.timelineBasisData.push({ uri: uri.split("#")[0], measures: data });
            }
        }
        for (let item of this.timelineBasisData) {
            item.siglum = await this.makeRequest("data/xql/getSiglum.xql?uri=" + item.uri);
            var recordingTimeData = await this.makeRequest("data/xql/getRecordingTime.xql?uri=" + item.uri);
            item.begin = this.hhmmssToSeconds(recordingTimeData.begin);
            item.end = this.hhmmssToSeconds(recordingTimeData.end);
            for (let measure of item.measures) {
                measure.begin = this.hhmmssToSeconds(measure.begin);
                measure.end = this.hhmmssToSeconds(measure.end);
            }
        }

        if (this.timelineBasisData.length > 0) {
            this.buildTimelineUI();
        }
    }


    switchTimelineBasis = (timelineBasisSiglum) => {
        console.log("Timeline basis switched!");
        this.timelineBasis = this.timelineBasisData.find(timelineBasis => timelineBasis.siglum === timelineBasisSiglum);
        this.currentTime = this.timelineBasis.begin;
        this.currentTimeElem.value = this.secondsToHhmmss(this.currentTime);
        this.totalTimeElem.innerHTML = this.secondsToHhmmss(this.timelineBasis.end);
    }

    runInterval = () => {
        if (this.timelineState === "play") {
            this.currentTime++;
            this.timeChanged();
        }
        else if (this.timelineState === "pause") {
            console.log("Interval paused!");
        }
    }

    checkForNewMeasure = () => { // TODO: Rename Function.
        var newMeasure = this.getMeasureFromSeconds(this.currentTime);
        if (newMeasure !== false && newMeasure.measureLabel !== this.getEnhancedValue()) { // TODO: change naming of measure to index
            this.updateIndex(this.data.findIndex(item => item[this.labelField] === newMeasure.measureLabel), false);
            this.showConnection();
        }
    }

    timeChanged = () => {
        if (this.currentTime >= this.timelineBasis.end) {
            this.timelinePause();
            this.currentTime = this.timelineBasis.end;
        }
        this.checkForNewMeasure();

        this.currentTimeElem.value = this.secondsToHhmmss(this.currentTime);
    }

    startStopwatch = () => {
        this.stopwatch.startTime = Date.now();
        this.stopwatch.frozenCurrentTime = this.currentTime;
        this.stopwatch.intervalId = setInterval(() => {
            //calculate elapsed time
            this.stopwatch.elapsedTime = Date.now() - this.stopwatch.startTime;
            this.currentTime = this.stopwatch.frozenCurrentTime + Math.floor(this.stopwatch.elapsedTime / 1000);
            this.timeChanged();
        }, 100);
    }

    timelinePlay = () => {
        if (!this.playButton) return;
        this.timelineState = "play";
        this.playButton.innerHTML = "Pause";
        this.startStopwatch();
        this.showConnection();
        // TODO: Fire the LinkController here so that everything starts synchronos.
        const changedPlayPauseStatus = new CustomEvent('changed-play-pause-status', {
            detail: { newStatus: this.timelineState },
            bubbles: true
        });
        this.dispatchEvent(changedPlayPauseStatus);
    }

    timelinePause = () => {
        if (this.mode === "desktop" && this.playButton) {
            this.timelineState = "pause";
            this.playButton.innerHTML = "Play";
            clearInterval(this.stopwatch.intervalId);
            const changedPlayPauseStatus = new CustomEvent('changed-play-pause-status', {
                detail: { newStatus: this.timelineState },
                bubbles: true
            });
            this.dispatchEvent(changedPlayPauseStatus);
        }
    }

    getMeasureFromSeconds = (seconds) => {
        for (var measure of this.timelineBasis.measures) {
            if (measure.begin <= seconds && seconds < measure.end) {
                return measure;
            }
        }
        return false;
    }


    makeRequest = (url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    return "";
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    showConnection = () => {
        if (this._suppressShowConnection) return;
        if (!this.data || this.data.length === 0 || !this.data[this.index]) return;
        console.log("showing", this.index);
        // Send showConnection event to host
        const showConnectionRequest = new CustomEvent('show-connection-request', {
            detail: { plist: this.data[this.index]["plist"] },
            bubbles: true
        });
        this.dispatchEvent(showConnectionRequest);
    }

    showPrevConnection = () => {
        var success = this.updateIndex(this.index - 1);
        if (success) {
            this.showConnection();
        }
    }

    showNextConnection = () => {
        var success = this.updateIndex(this.index + 1);
        if (success) {
            this.showConnection();
        }
    }

    updateIndex = (newIndex, updateTime = true) => {
        var newIndex = parseInt(newIndex);
        if (newIndex < 0 || newIndex > this.maxIndex) return false; // Prevent out of bounds
        this.index = newIndex;

        if (this.itemSlider) {
            this.itemSlider.value = this.index;
        }
        if (this.itemSelector && this.data.length > 0) {
            this.itemSelector.value = this.getEnhancedValue();
            // Update dynamic input width on mobile
            if (this._updateInputWidth) {
                this._updateInputWidth();
            }
        }

        this.updateNavigationButtonsVisibility();

        if (updateTime && this.timelineBasis) {
            var basisMeasure = this.timelineBasis.measures.find(measure => measure.measureLabel === this.getEnhancedValue());
            if (basisMeasure) {
                console.log("Updating time!");
                this.currentTime = basisMeasure.begin;
                if (this.currentTimeElem) {
                    this.currentTimeElem.value = this.secondsToHhmmss(this.currentTime);
                }
            }
        }
        return true;
    }

    secondsToHhmmss = (time) => {
        // still ignores milliseconds!!!
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        if (hours === 0) {
            return `${minutes}:${this.leadingZeroFormatter.format(seconds)}`;
        } else {
            return `${hours}:${this.leadingZeroFormatter.format(minutes)}:${this.leadingZeroFormatter.format(seconds)}`;
        }
    }

    hhmmssToSeconds = (time) => {
        // Still ignores milliseconds!!!
        const parts = time.split(":");
        const regex = /^(?!.*::)(?!.*:$)(?!^:)[0-9:.]*$/;
        if (!regex.test(time) || parts.length > 3 || time.length == 0) {
            return false;
        }
        if (parts.length == 1) {
            return parseFloat(parts[0]);
        }
        else if (parts.length == 2) {
            return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
        }
        else if (parts.length == 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
        }
    }

}

customElements.define("edirom-concordance-navigator", concordanceNavigatorElement);

