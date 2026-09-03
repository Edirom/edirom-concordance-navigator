# Edirom Concordance Navigator

Web Component for navigating concordances — structured sets of corresponding passages across multiple sources of a musical work. Supports hierarchical browsing via concordances, optional groups, and individual connections. Two layout modes: `desktop` and `mobile` (collapsible, swipe-enabled).

## Usage

```html
<edirom-concordance-navigator
  layout-mode="mobile"
  enable-qr-code-scanner
  qr-regex="^edirom://"
  inject-disabled-concordance="— off —"
  skip-empty-connections
  concordances-data='…'
>
</edirom-concordance-navigator>
```

## Data Structure

Passed via the `concordances-data` attribute as a JSON string.

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
                "id": "conn-1",
                "name": "1",
                "plist": "xmldb:exist:///db/…/source1.xml#m1 xmldb:exist:///db/…/source2.xml#m1"
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
          "id": "conn-2",
          "name": "1",
          "plist": "xmldb:exist:///db/…/source1.xml#m1 xmldb:exist:///db/…/source2.xml#m1"
        }
      ]
    }
  }
]
```

- Each concordance has either `groups` or `connections` at the top level.
- Connection objects: `name` (display label), `plist` (space-separated URIs), and optionally `id` (for `current-connection` / `connection-changed`).
- A connection with an empty, whitespace-only, or missing `plist` is treated as "empty" and is skipped by the Next/Prev arrows when `skip-empty-connections` is set.

## Attributes

| Attribute | Type | Description |
|---|---|---|
| `concordances-data` | JSON string | Concordance hierarchy (see above). |
| `layout-mode` | `"desktop"` \| `"mobile"` | UI variant. Set in markup — not observed after connect. Default: `"desktop"`. |
| `inject-disabled-concordance` | string | Injects a placeholder concordance at the top of the selector. When selected, no connections are shown. |
| `enable-qr-code-scanner` | boolean | Shows the QR scanner icon in `mobile` mode. |
| `qr-regex` | string | Regex to filter QR scan results. Passed through to `edirom-qr-code-scanner`. |
| `current-connection` | string | Connection `id` to navigate to on load. |
| `skip-empty-connections` | boolean | When present, the Next/Prev arrow buttons skip connections whose `plist` is empty/whitespace/missing and land on the nearest non-empty one. The text input, slider, `current-connection`, and `navigateToConnectionById()` are unaffected and always select the exact connection requested. If only empty connections remain in a direction, that arrow does nothing and is hidden. |

## Events

| Event | Detail | Description |
|---|---|---|
| `connection-changed` | `{ connectionId: string \| null, plist: string }` | Fired whenever the navigator's current connection changes (arrows, slider, text input, `current-connection`, `navigateToConnectionById()`). `plist` is the connection's space-separated target URIs; `connectionId` is its `id`, or `null` if it has none. The host decides what to do — typically open `plist` and store `connectionId` in app state / URL. |
| `concordance-navigator-disabled` | — | Fired when the injected disabled concordance is selected. |
| `layout-change` | — | Fired when concordance or group changes. |
| `load-links-request` | target string | Generic "resolve this target" request — the same event `edirom-navigator` dispatches on item click. The host passes `detail` straight to its link resolver. In this component the QR-code scanner is currently the only trigger, so `detail` is the scanned text. |
| `changed-play-pause-status` | `{ newStatus: "play" \| "pause" }` | Desktop-only, experimental timeline feature. |

`load-links-request` is intentionally trigger-agnostic and shared with `edirom-navigator`, so a host can wire a single handler for "resolve this target string". `connection-changed` is different: it reports a *position* within the concordance data, with a stable `connectionId` the host can persist and share.

## Methods

| Method | Returns | Description |
|---|---|---|
| `navigateToConnectionById(id)` | `boolean` | Select the connection with the given `id`. Returns `true` on success. |
| `closeScannerPopover()` | — | Closes the QR scanner popover if open. |

## Dependencies

- **[`edirom-icon`](https://github.com/Edirom/edirom-core-web-components)** — for all icon rendering (prev/next buttons, show button, collapse toggle, QR scanner icon).
- **[`edirom-qr-code-scanner`](https://github.com/Edirom/edirom-qr-code-scanner)** — for QR code scanning in `mobile` mode when `enable-qr-code-scanner` is set.
