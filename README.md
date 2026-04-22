# Edirom Concordance Navigator Web Component

## Overview

The `edirom-concordance-navigator` is a Web Component used within the Edirom system to navigate through concordances — structured sets of corresponding passages across multiple sources or versions of a musical work. It provides a hierarchical selector UI for concordances, optional groups within them, and the individual connections between corresponding passages.

It supports two layout modes: `desktop` and `mobile`, with the mobile layout featuring a collapsible interface and swipe gesture support.

## Features

- **Hierarchical Navigation**: Supports three levels — concordances, optional groups, and connections.
- **Slider and Text Input**: Allows stepping through connections via prev/next buttons, a range slider, or a direct text input.
- **Collapsible Mobile UI**: In `mobile` mode the navigator can be collapsed to show only the most relevant selector, and expanded via tap or swipe gesture.
- **QR Code Scanner Entry Point**: An optional QR code scanner icon can be shown in `mobile` mode via the `enable-qr-code-scanner` attribute.
- **Disabled Concordance Injection**: A placeholder concordance can be injected at the top of the selector list to represent a disabled or unavailable concordance.
- **Event-Driven**: Dispatches custom events when a connection should be displayed, allowing for decoupled integration with the rest of the Edirom application.

## Endpoints (Attributes and Properties)

### `concordances-data` (Attribute / Property)

The primary way to provide data to the component. It expects a JSON string (as an attribute) or a JavaScript array (as a property) defining the concordances and their nested structure.

**Expected Value Template:**

```json
[
  {
    "name": "Concordance A",
    "groups": {
      "label": "Act",
      "groups": [
        {
          "name": "Act I",
          "connections": {
            "label": "Measure",
            "connections": [
              {
                "name": "1",
                "plist": "xmldb:exist:///db/.../source1.xml#measure1 xmldb:exist:///db/.../source2.xml#measure1"
              }
            ]
          }
        }
      ]
    },
    "connections": null
  },
  {
    "name": "Concordance B",
    "groups": null,
    "connections": {
      "label": "Measure",
      "connections": [
        {
          "name": "1",
          "plist": "xmldb:exist:///db/.../source1.xml#measure1 xmldb:exist:///db/.../source2.xml#measure1"
        }
      ]
    }
  }
]
```

- A concordance may have either `groups` or `connections` at the top level, not both.
- `groups` contains a `label` string and an array of `groups`, each of which holds a `connections` object.
- `connections` contains a `label` string and an array of connection objects.
- Each connection object has a `name` (displayed in the text input and slider) and a `plist` (a space-separated list of URIs identifying the corresponding passages).

---

### `layout-mode` (Attribute)

Controls the layout and behavior of the component.

> **Note:** Unlike `concordances-data`, `inject-disabled-concordance`, and `enable-qr-code-scanner`, this attribute is **not observed** after the element connects to the DOM. Set it in the HTML markup (or as a JavaScript attribute before inserting the element into the document); changing it later has no effect.

**Possible Values:**

- `desktop` (default): Standard stacked layout with labels rendered as separate elements above the controls.
- `mobile`: Touch-friendly layout with a collapsible interface, swipe gesture support, and larger controls. The label is rendered as an inline prefix inside the text input.

---

### `inject-disabled-concordance` (Attribute / Property)

An optional name of a concordance to inject as the first entry in the concordance selector. When this entry is selected, no connections are shown and the `concordance-navigator-disabled` event is fired. This is useful for representing a state where the concordance view is not active.

**Example:**

```html
<edirom-concordance-navigator
  inject-disabled-concordance="— off —"
>
</edirom-concordance-navigator>
```

---

### `enable-qr-code-scanner` (Attribute)

A boolean attribute. When present, a QR code scanner icon is made visible in `mobile` mode on the left side of the navigator. Removing the attribute hides it again.

**Example:**

```html
<edirom-concordance-navigator
  layout-mode="mobile"
  enable-qr-code-scanner
>
</edirom-concordance-navigator>
```

---

## Events

### `show-connection-request`

Dispatched when a connection should be displayed — on initial load, when the user navigates to a new connection, or when a group or concordance is switched.

**Event Detail:**

```javascript
{ plist: "string" }  // Space-separated list of passage URIs for the current connection
```

**Example:**

```javascript
document
  .querySelector("edirom-concordance-navigator")
  .addEventListener("show-connection-request", (e) => {
    console.log("Show connection:", e.detail.plist);
  });
```

---

### `concordance-navigator-disabled`

Dispatched when the injected disabled concordance (set via `inject-disabled-concordance`) is selected by the user.

**Event Detail:** none

---

### `layout-change`

Dispatched whenever the active concordance or group changes, signaling that the host application may need to update its layout.

**Event Detail:** none

---

### `changed-play-pause-status`

Dispatched when the timeline playback state changes (desktop mode only, experimental timeline feature).

**Event Detail:**

```javascript
{ newStatus: "play" | "pause" }
```

---

## Dependencies

### `edirom-icon`

The `edirom-concordance-navigator` depends on the `edirom-icon` Web Component from the [Edirom Core Web Components](https://github.com/Edirom/edirom-core-web-components). It uses `edirom-icon` to render:

1. The **previous** and **next** navigation buttons (`eo_previous`, `eo_next`).
2. The **show connection** button inside the text input (`keyboard_return`).
3. The **collapse/expand** toggle in mobile mode (`swipe_up`, `swipe_down`).
4. The **QR code scanner** icon in mobile mode (`qr_code_scanner`).

Ensure that the `edirom-icon` component is registered and available in your environment for the navigator to render correctly.

---

## Usage Example

```html
<edirom-concordance-navigator
  layout-mode="desktop"
  inject-disabled-concordance="— off —"
  concordances-data='[{"name":"Concordance A","groups":null,"connections":{"label":"Measure","connections":[{"name":"1","plist":"..."}]}}]'
>
</edirom-concordance-navigator>

<script>
  const nav = document.querySelector("edirom-concordance-navigator");

  nav.addEventListener("show-connection-request", (e) => {
    console.log("Show connection:", e.detail.plist);
  });

  nav.addEventListener("concordance-navigator-disabled", () => {
    console.log("Concordance navigator is disabled.");
  });
</script>
```
