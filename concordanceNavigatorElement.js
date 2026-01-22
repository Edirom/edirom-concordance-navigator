import '../edirom-core-web-components/src/edirom-icon.js';


console.log("ConcordanceNavigator Webcomponent loaded3");


const templates = {
    desktop: `
<div>
    <style>
        #concordance-navigator-container, #item-selector-container, #group-selector-container, #concordance-selector-container {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
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
</div>
`,

    mobile: `<div>
    <style>
        :host {
            overscroll-behavior: contain; /* Prevent pull-to-refresh on supported browsers */
            touch-action: pan-x pan-y; /* Allow native gestures; vertical is handled via JS for collapse */
            --nav-bg: #1f2333;
            --nav-contrast: #e4d9a5;
            --nav-contrast-strong: #cdbf86;
            --nav-surface: #f6f6f3;
            --nav-surface-border: #d8d0a4;
        }

        input[type="range"] {
            touch-action: pan-x; /* Keep sliders draggable while blocking vertical pull-to-refresh */
            height: 2px;
            margin-bottom: 10px;
            margin-top: 10px;
        }

        #concordance-navigator-container {
            display: grid;
            grid-template-columns: 10% 1fr 10%;
            align-items: center;
            width: 100%;
            column-gap: 20px;
            box-sizing: border-box;
        }

        #main-controls-container {
            display: flex;
            flex-direction: column;
            justify-self: center;
            width: min(100%, 500px);
            max-width: 500px;
            min-width: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
            border-radius: 10px;
            padding: 3px 8px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        #collapse-expand-container, #scan-container {
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            flex-shrink: 0;
        }

        #connections-container, #group-selector-container, #concordance-selector-container {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
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
            margin-bottom: 8px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
        }

        #concordance-selector:hover, #group-selector:hover {
            background: #262b3f;
        }

        #input-wrapper {
            position: relative;
            flex-grow: 1;
            margin: 3px;
        }

        #item-selector {
            width: 100%;
            height: 35px;
            box-sizing: border-box;
            padding-right: 40px;
            background: var(--ewk-tertiary-color);
            border: 1px solid var(--nav-surface-border);
            border-radius: 8px;
            color: #1a1a1a;
            font-size: 1rem;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        #item-selector:focus {
            outline: 2px solid var(--nav-contrast);
            outline-offset: 2px;
        }

        #buttons-container {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
        }

        #prev-connection-button, #next-connection-button {
            height: 35px;
            width: 35px;
            padding: 0;
            flex-shrink: 0;
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
            background: var(--ewk-secondary-color);
            margin: 0;
            font-size: 0.8em;
            border-radius: 0 8px 8px 0;
            color: #2d2d2d;
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
        <div id="collapse-expand-container">
            <edirom-icon name="swipe_up" size="2rem"></edirom-icon>
        </div>
        <div id="main-controls-container">
            <div id="concordance-selector-container"></div>
            <div id="group-selector-container"></div>
            <div id="connections-container"></div>
        </div>
        <div id="scan-container">
            <edirom-icon name="qr_code_scanner" size="3rem"></edirom-icon>
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
        this.concordanceSelectorContainer = this.shadow.querySelector("#concordance-selector-container");
        this.groupSelectorContainer = this.shadow.querySelector("#group-selector-container");
        this.connectionsContainer = this.shadow.querySelector("#connections-container");
        this.timeContainer = this.shadow.querySelector("#time-container");
        this.collapseExpandContainer = this.shadow.querySelector("#collapse-expand-container");
        this.collapseExpandIcon = this.collapseExpandContainer ? this.collapseExpandContainer.querySelector("edirom-icon") : null;
        this.scanContainer = this.shadow.querySelector("#scan-container");
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

            // Default to collapsed on mobile so only marked elements remain visible.
            this.setCollapseState(true);
        }
    }

    // ==================== Builder Functions ====================

    buildConcordanceSelector = () => {
        this.concordanceSelectorContainer.innerHTML = "";

        if (this.concordances.length === 0) return;

        const select = document.createElement("select");
        select.name = "concordance-selector";
        select.id = "concordance-selector";

        for (let concordance of this.concordances) {
            const option = document.createElement("option");
            option.value = concordance.name;
            option.text = concordance.name;
            if (concordance === this.concordances[0]) {
                option.selected = true;
            }
            select.appendChild(option);
        }

        select.addEventListener("change", () => {
            this.switchConcordance(select.value);
        });

        this.concordanceSelectorContainer.appendChild(select);
        this.concordanceSelector = select;
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
    }

    buildConnectionsUI = (connections, label) => {
        this.connectionsContainer.innerHTML = "";

        if (!connections || connections.length === 0) {
            this.clearData();
            return;
        }

        // Set the data
        this.setData(connections, "name");

        // Build label
        if (label) {
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

        const itemSelector = document.createElement("input");
        itemSelector.type = "text";
        itemSelector.id = "item-selector";
        itemSelector.value = this.getEnhancedValue();
        itemSelector.addEventListener("keypress", (e) => {
            this.specialKeyOnInput(itemSelector, e);
        });
        itemSelector.addEventListener("focus", () => {
            this.timelinePause();
        });
        inputWrapper.appendChild(itemSelector);
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

        this.connectionsContainer.appendChild(buttonsContainer);
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
        return ["concordances-data", "show-connection-button-label-data"];
    }

    get concordancesData() {
        return this.getAttribute("concordances-data");
    }
    set concordancesData(value) {
        this.setAttribute("concordances-data", value);
    }

    connectedCallback() {
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.tabIndex = 0; // Make the host focusable and let clicks delegate focus into the shadow DOM so inputs behave on first click.
        this.applyTemplate();
        this.setupElements();
        this.setupEventListeners();
        this.setConcordances();
    }

    /**
     * Determines which container should be visible when collapsed.
     * Priority: connections > groups > concordances
     * Returns the container element that should remain visible.
     */
    getLowestVisibleContainer = () => {
        // Check if connections container has content
        if (this.connectionsContainer && this.connectionsContainer.children.length > 0) {
            return this.connectionsContainer;
        }
        // Check if group selector container has content
        if (this.groupSelectorContainer && this.groupSelectorContainer.children.length > 0) {
            return this.groupSelectorContainer;
        }
        // Fall back to concordance selector container
        if (this.concordanceSelectorContainer && this.concordanceSelectorContainer.children.length > 0) {
            return this.concordanceSelectorContainer;
        }
        return null;
    }

    setCollapseState = (shouldCollapse) => {
        if (shouldCollapse === this.isCollapsed) return;
        this.isCollapsed = shouldCollapse;

        if (this.mode === "mobile") {
            this.applyCollapsedState();
        }

        if (this.collapseExpandIcon) {
            this.collapseExpandIcon.setAttribute("name", shouldCollapse ? "swipe_up" : "swipe_down");
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

    applyCollapsedState = () => {
        if (this.mode !== "mobile") return;

        const mainContainers = [
            this.concordanceSelectorContainer,
            this.groupSelectorContainer,
            this.connectionsContainer
        ].filter(c => c != null);

        if (this.collapseExpandContainer) {
            const visibleContainersCount = mainContainers.filter(c => c.children.length > 0).length;
            this.collapseExpandContainer.style.visibility = visibleContainersCount <= 1 ? "hidden" : "visible";
        }

        if (this.isCollapsed) {
            // When collapsed, only show the lowest level container with content
            const lowestVisible = this.getLowestVisibleContainer();

            for (const container of mainContainers) {
                container.classList.toggle("hidden", container !== lowestVisible);
            }
        } else {
            // When expanded, show all containers
            for (const container of mainContainers) {
                container.classList.remove("hidden");
            }
        }
    }

    disconnectedCallback() {
        console.log("Concordance Navigator disconnected!");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        if (oldValue === newValue) return;
        if (name === "concordances-data") {
            this.concordances = JSON.parse(newValue);
            this.setConcordances();
        }

    }

    // Fill the menu with concordances
    setConcordances = () => {
        if (!this.concordanceSelectorContainer) return;

        this.buildConcordanceSelector();

        if (this.concordances.length > 0) {
            this.switchConcordance(this.concordanceSelector.value);
        }
    }

    switchConcordance = (concordanceName) => {
        console.log("Concordance switched!");
        const concordance = this.concordances.find(c => c.name === concordanceName);
        const hasGroups = concordance.groups?.groups?.length > 0;
        const hasDirectConnections = concordance.connections?.connections?.length > 0;

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
            } else {
                console.log("No groups and no connections!");
                this.connectionsContainer.innerHTML = "";
                this.clearData();
            }
        }

        // Re-apply collapsed state after UI rebuild
        if (this.mode === "mobile") {
            this.applyCollapsedState();
        }

        this.fireLayoutChangeEvent();
    }

    switchGroup = (groupName) => {
        console.log("Group switched!");
        const group = this.groups.find(g => g.name === groupName);
        const hasConnections = group?.connections?.connections?.length > 0;

        if (hasConnections) {
            this.buildConnectionsUI(group.connections.connections, group.connections.label);
        } else {
            console.log("Group has no connections!");
            this.connectionsContainer.innerHTML = "";
            this.clearData();
        }

        // Re-apply collapsed state after UI rebuild
        if (this.mode === "mobile") {
            this.applyCollapsedState();
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
        if (this.mode === "desktop") {
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
        }

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

