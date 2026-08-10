# Edirom Concordance Navigator

Web Component for navigating concordances — structured sets of corresponding passages across multiple sources of a musical work. Supports hierarchical browsing via concordances, optional groups, and individual connections. Two layout modes: `desktop` and `mobile` (collapsible, swipe-enabled).

## Usage

```html
<edirom-concordance-navigator
  layout-mode="mobile"
  enable-qr-code-scanner
  qr-regex="^edirom://"
  inject-disabled-concordance="— off —"
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

## Attributes

| Attribute | Type | Description |
|---|---|---|
| `concordances-data` | JSON string | Concordance hierarchy (see above). |
| `layout-mode` | `"desktop"` \| `"mobile"` | UI variant. Set in markup — not observed after connect. Default: `"desktop"`. |
| `inject-disabled-concordance` | string | Injects a placeholder concordance at the top of the selector. When selected, no connections are shown. |
| `enable-qr-code-scanner` | boolean | Shows the QR scanner icon in `mobile` mode. |
| `qr-regex` | string | Regex to filter QR scan results. Passed through to `edirom-qr-code-scanner`. |
| `current-connection` | string | Connection `id` to navigate to on load. |

## Events

| Event | Detail | Description |
|---|---|---|
| `show-connection-request` | `{ plist: string }` | Fired when a connection should be displayed. |
| `connection-changed` | `{ connectionId: string \| null }` | Fired alongside `show-connection-request` with the connection's `id`. |
| `concordance-navigator-disabled` | — | Fired when the injected disabled concordance is selected. |
| `layout-change` | — | Fired when concordance or group changes. |
| `load-links-request` | QR code text | Fired when a QR code is successfully scanned. |
| `changed-play-pause-status` | `{ newStatus: "play" \| "pause" }` | Desktop-only, experimental timeline feature. |

## Methods

| Method | Returns | Description |
|---|---|---|
| `navigateToConnectionById(id)` | `boolean` | Select the connection with the given `id`. Returns `true` on success. |
| `closeScannerPopover()` | — | Closes the QR scanner popover if open. |

## Dependencies

- **[`edirom-icon`](https://github.com/Edirom/edirom-core-web-components)** — for all icon rendering (prev/next buttons, show button, collapse toggle, QR scanner icon).
- **[`edirom-qr-code-scanner`](https://github.com/Edirom/edirom-qr-code-scanner)** — for QR code scanning in `mobile` mode when `enable-qr-code-scanner` is set.
