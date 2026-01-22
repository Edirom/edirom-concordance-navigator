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
        <div id="concordance-selector-container">
            <select name="concordance-selector" id="concordance-selector">
            </select>
        </div>
        <div id="group-selector-container">
            <label for="group-selector" id="group-selector-label"></label>
            <select name="group-selector" id="group-selector">
            </select>
        </div>
        <div id="item-selector-container">
            <label for="item-slider" id="item-selector-label"></label>
         <input type="range" min="0" max="100" value="50" class="slider" id="item-slider" />

            <div id="buttons-container">
                <button id="prev-connection-button"><edirom-icon name="eo_previous"></edirom-icon></button>
                <div id="input-wrapper">
                    <input type="text" id="item-selector" />
                    <button id="show-connection-button"><edirom-icon name="keyboard_return"></edirom-icon></button>
                </div>
                <button id="next-connection-button"><edirom-icon name="eo_next"></edirom-icon></button>
            </div>
        </div>
        <div id="time-container">
            <hr />
            <select name="timeline-basis-selector" id="timeline-basis-selector"></select>
            <div class="duration-container">
                <input type="text" id="current-time" value="0:00" size="5"></input>
                /
                <div id="total-time"></div>
            </div>
            <button id="play-button">Play</button>
        </div>
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
            padding: 6px 8px;
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

        #slider-container, #group-selector-container, #concordance-selector-container {
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
        <div id="collapse-expand-container" class="visible-when-collapsed">
            <edirom-icon name="expand_all" size="2rem"></edirom-icon>
        </div>
        <div id="main-controls-container">
            <div id="concordance-selector-container">
                <select name="concordance-selector" id="concordance-selector">
                </select>
            </div>
            <div id="group-selector-container">
                <label for="group-selector" id="group-selector-label"></label>
                <select name="group-selector" id="group-selector">
                </select>
            </div>
            <div id="slider-container">
                <label for="item-slider" id="item-selector-label" class="visible-when-collapsed"></label>
            <input type="range" min="0" max="100" value="50" class="slider" id="item-slider" />
            </div>
            <div id="buttons-container" class="visible-when-collapsed">
                <button id="prev-connection-button"><edirom-icon name="eo_previous" size="2rem"></edirom-icon></button>
                <div id="input-wrapper">
                    <input type="text" id="item-selector" />
                    <button id="show-connection-button"><edirom-icon name="keyboard_return"></edirom-icon></button>
                </div>
                <button id="next-connection-button"><edirom-icon name="eo_next" size="2rem"></edirom-icon></button>
            </div>
        </div>
        <div id="scan-container" class="visible-when-collapsed">
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
        // Elements
        this.concordanceSelector = this.shadow.querySelector("#concordance-selector");
        this.groupSelectorContainer = this.shadow.querySelector("#group-selector-container");
        this.groupSelector = this.shadow.querySelector("#group-selector");
        this.groupSelectorLabel = this.shadow.querySelector("#group-selector-label");
        this.itemSelector = this.shadow.querySelector("#item-selector");
        this.itemSlider = this.shadow.querySelector("#item-slider");
        this.itemSelectorLabel = this.shadow.querySelector("#item-selector-label");
        this.showConnectionButton = this.shadow.querySelector("#show-connection-button");
        this.prevConnectionButton = this.shadow.querySelector("#prev-connection-button");
        this.nextConnectionButton = this.shadow.querySelector("#next-connection-button");
        this.timeContainer = this.shadow.querySelector("#time-container");
        this.timelineBasisSelector = this.shadow.querySelector("#timeline-basis-selector");
        this.currentTimeElem = this.shadow.querySelector("#current-time");
        this.totalTimeElem = this.shadow.querySelector("#total-time");
        this.playButton = this.shadow.querySelector("#play-button");
        this.collapseExpandContainer = this.shadow.querySelector("#collapse-expand-container");
        this.collapseExpandIcon = this.collapseExpandContainer ? this.collapseExpandContainer.querySelector("edirom-icon") : null;
    }

    setupEventListeners = () => {
        let me = this;

        // Event listeners
        this.concordanceSelector.addEventListener("change", function () { me.switchConcordance(this.value) });
        this.groupSelector.addEventListener("change", function () { me.switchGroup(this.value) });
        this.itemSlider.addEventListener("input", function () {
            me.timelinePause();
            me.updateIndex(this.value);
        });
        this.itemSlider.addEventListener("change", function () {
            me.showConnection();
        });

        this.itemSelector.addEventListener("keypress", function (e) {
            me.specialKeyOnInput(this, e);
        });
        this.itemSelector.addEventListener("focus", () => {
            me.timelinePause();
        });
        this.showConnectionButton.addEventListener("mousedown", () => {
            // Capture focus state before the click moves focus away from the input.
            me.itemSelectorWasFocusedOnShowClick = me.shadow.activeElement === me.itemSelector;
        });
        this.showConnectionButton.addEventListener("click", function () {
            me.timelinePause();
            if (me.itemSelectorWasFocusedOnShowClick) {
                me.setEnhancedValue(me.itemSelector.value);
            } else {
                me.showConnection();
            }
            me.itemSelectorWasFocusedOnShowClick = false;
        });
        this.prevConnectionButton.addEventListener("click", function () {
            me.timelinePause();
            me.showPrevConnection();
        });
        this.nextConnectionButton.addEventListener("click", function () {
            me.timelinePause();
            me.showNextConnection();
        });
        if (this.mode === "desktop") {
            this.timelineBasisSelector.addEventListener("change", function () { me.switchTimelineBasis(this.value) });
            this.playButton.addEventListener("click", function () {
                if (me.timelineState === "pause") {
                    me.timelinePlay();
                }
                else if (me.timelineState === "play") {
                    me.timelinePause();
                }
            });
            this.currentTimeElem.addEventListener("focus", () => {
                me.timelinePause();
            });
            this.currentTimeElem.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    console.log("Time changed with key press.");
                    var newTime = this.hhmmssToSeconds(this.currentTimeElem.value);
                    if (newTime === false) {
                        newTime = this.currentTime;
                    }
                    this.currentTime = newTime;
                    this.timeChanged();
                }
            });
        }
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
    }

    getElementsHiddenWhenCollapsed = () => {
        const container = this.shadow.querySelector("#concordance-navigator-container");
        if (!container) return [];

        const allElements = Array.from(container.querySelectorAll("*"));
        return allElements.filter(el => {
            // Keep the root container visible so its visible children can still render.
            if (el === container) return false;
            // If this element is marked visible, keep it visible.
            if (el.classList.contains('visible-when-collapsed')) return false;
            // If this element contains any visible-when-collapsed descendant, keep it visible to avoid hiding ancestors.
            if (el.querySelector('.visible-when-collapsed')) return false;
            // If any ancestor is marked visible, keep visible (redundant with descendant check but explicit).
            if (el.closest('.visible-when-collapsed')) return false;
            // Otherwise it should be hidden.
            return true;
        });
    }

    setCollapseState = (shouldCollapse) => {
        if (shouldCollapse === this.isCollapsed) return;
        this.isCollapsed = shouldCollapse;

        const elementsToToggle = this.getElementsHiddenWhenCollapsed();
        for (const el of elementsToToggle) {
            el.classList.toggle("hidden", shouldCollapse);
        }

        if (this.collapseExpandIcon) {
            this.collapseExpandIcon.setAttribute("name", shouldCollapse ? "expand_all" : "collapse_all");
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
        this.concordanceSelector.innerHTML = ""; // Clear the select
        for (let concordance of this.concordances) {
            let option = document.createElement("option");
            option.value = concordance.name;
            option.text = concordance.name;
            if (concordance == this.concordances[0]) { // Select the first concordance
                option.selected = true;
            }
            this.concordanceSelector.appendChild(option);
        }

        if (this.concordances.length > 0) { // If there are concordances, switch to the first one
            this.switchConcordance(this.concordanceSelector.value);
        }
    }

    switchConcordance = (concordanceName) => {
        console.log("Concordance switched!");
        var concordance = this.concordances.find(concordance => concordance.name === concordanceName);
        var hasGroups = concordance.groups != null;

        if (hasGroups) {
            this.groupSelectorContainer.classList.remove("hidden");
            this.groupSelectorLabel.innerHTML = concordance.groups.label;
            this.setGroups(concordance.groups.groups);
        } else {
            console.log("No groups!");
            this.groupSelectorContainer.classList.add("hidden");
            this.itemSelectorLabel.innerHTML = concordance.connections.label;
            this.setData(concordance.connections.connections, "name");
            this.itemSelector.value = this.getEnhancedValue();
            this.fireLayoutChangeEvent();
        }
    }

    setGroups = (groups) => {
        console.log("Groups set!");
        this.groups = groups;
        this.groupSelector.innerHTML = ""; // Clear the select
        for (let group of groups) {
            let option = document.createElement("option");
            option.value = group.name;
            option.text = group.name;
            if (group == groups[0]) { // Select the first concordance
                option.selected = true;
            }
            this.groupSelector.appendChild(option);

        }
        if (this.groups.length > 0) { // If there are groups, switch to the first one
            this.switchGroup(this.groupSelector.value);
        }
    }

    switchGroup = (groupName) => {
        console.log("Group switched!");
        var group = this.groups.find(group => group.name === groupName);
        this.setData(group.connections.connections, "name");
        this.itemSelectorLabel.innerHTML = group.connections.label;
        this.itemSelector.value = this.getEnhancedValue();
        this.fireLayoutChangeEvent();
    }

    setData = (data, labelField) => {
        this.data = data;
        this.labelField = labelField;
        this.updateIndex(0);
        this.maxIndex = this.data.length - 1;
        this.itemSlider.max = this.maxIndex;
        // this.setTimelineBasis(); // Set this to active time based media features (work in progress).
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
        this.timelineBasisSelector.innerHTML = "";
        this.interval = clearInterval(this.interval);
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
            // this.interval = setInterval(this.runInterval, 1000);
            this.timeContainer.style.display = "block";
            for (let item of this.timelineBasisData) {
                let option = document.createElement("option");
                option.value = item.siglum;
                option.text = item.siglum;
                if (item == this.timelineBasisData[0]) {
                    option.selected = true;
                }
                this.timelineBasisSelector.appendChild(option);
            }
            this.switchTimelineBasis(this.timelineBasisSelector.value);
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
        this.itemSlider.value = this.index;
        this.itemSelector.value = this.getEnhancedValue();

        if (updateTime && this.timelineBasis) {
            var basisMeasure = this.timelineBasis.measures.find(measure => measure.measureLabel === this.getEnhancedValue());
            if (basisMeasure) {
                console.log("Updating time!");
                this.currentTime = basisMeasure.begin;
                this.currentTimeElem.value = this.secondsToHhmmss(this.currentTime);
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

