# Automatic Order Printing — MyD Delivery

**JavaScript automation for printing new orders from a legacy WordPress delivery dashboard.**

Developed by **CEOS Tech** for the first version of **1Pedido**. This script was **deployed and successfully used at a real customer location**, where a dedicated computer opened the MyD Delivery order dashboard through a custom Google Chrome shortcut in kiosk mode.

> **Status: historical / legacy implementation.** This repository documents a working deployment from the original 1Pedido workflow. It has **not** been verified against current MyD Delivery or Chrome versions and should not be adopted without a controlled test.

**Português:** este projeto automatizava a impressão de pedidos no primeiro 1Pedido (WordPress + MyD Delivery). A solução foi usada em um cliente real, com um atalho personalizado do Chrome que abria diretamente o painel de pedidos. Veja o [guia de configuração no Windows](docs/CONFIGURACAO-WINDOWS.md).

## Why it was built

In the original workflow, the operator had to open each new order in the administration panel and click **Print** manually. The script automated those interactions without modifying the underlying plugin or requiring a separate printing service.

~~~mermaid
flowchart TD
    A[New order arrives] --> B[MyD Delivery dashboard in Chrome]
    B --> C[Script polls the order list]
    C --> D{New order found?}
    D -->|No| C
    D -->|Yes| E[Click the order]
    E --> F[Trigger the dashboard's print button]
    F --> G[Chrome sends a print job]
~~~

### What the original code does

- Scans the order list **every 5 seconds**.
- Remembers IDs that were already present when the page loaded.
- Detects new orders using their IDs and displayed timestamps.
- Clicks each detected order, waits **3 seconds**, and triggers the original print button if it is visible.
- Works alongside a **separately configured** Chrome shortcut with kiosk and silent-printing options.

**Scope of confirmation:** the code tracks a click on the print control; it **does not verify** successful printing at the physical printer.

## Real-world use

The original solution ran for a customer using the first-generation **1Pedido**, a WordPress-based delivery workflow powered by MyD Delivery.

At the customer site, the operator launched the browser from a **custom Chrome shortcut** that opened the orders dashboard directly. The automation handled order detection and activated printing without a manual click for each new order. This was a practical fix for a specific production environment, not a universal printing product.

The exact historic Chrome shortcut and injection method are not preserved in this repository; the documentation gives **illustrative setup guidance**, not a claim to reproduce the customer's complete configuration.

## Repository structure

| File | Description |
| --- | --- |
| [`auto-print.js`](auto-print.js) | Original script, intentionally preserved without modification. |
| [Windows / kiosk setup (pt-BR)](docs/CONFIGURACAO-WINDOWS.md) | Dedicated Chrome shortcut, printer configuration, and validation. |
| [Technical notes (pt-BR)](docs/NOTAS-TECNICAS.md) | DOM selectors, assumptions, limitations, and a test checklist. |

## Prerequisites

- WordPress with a **compatible** version of the MyD Delivery plugin.
- Authorized access to its administrative order dashboard.
- Chrome on a Windows computer, with an appropriately configured printer.
- An authorized method for including the script **on the orders admin page**.

The historical [`auto-print.js`](auto-print.js) includes `<script> ... </script>` tags because it was designed as an **inline HTML snippet**. Do not load it unchanged with `<script src="auto-print.js">`: it is not packaged as a standalone external JavaScript asset.

This repository **does not ship a WordPress installation plugin or an automatic setup tool**. Ensure the script is injected only once, before the `DOMContentLoaded` event, and that the target elements exist.

See the [Windows setup guide](docs/CONFIGURACAO-WINDOWS.md) before trying it in a controlled environment.

## Known limitations

- DOM-dependent: changes in the MyD Delivery interface may break the selectors.
- Multiple orders detected together may overlap because printing is triggered through delayed UI clicks.
- Tracking is held in page memory and resets when the page is reloaded.
- Timestamps are parsed from an expected `DD/MM - HH:mm`-style string, using the current year.
- There is no printer acknowledgement, durable queue, or automatic recovery mechanism.
- Compatibility with modern browsers, plugin releases, and printers has not been tested.

These are limitations of the **original code**, not verified failures in the customer's historical deployment. See [technical notes](docs/NOTAS-TECNICAS.md) for a detailed review.

## Credits and license

Built by **CEOS Tech** for the original **1Pedido** workflow. This independent project is not officially affiliated with or endorsed by **MyD Delivery**.

**License:** no open-source license has been selected. A publicly visible repository is not automatically licensed for redistribution, modification, or commercial reuse; licensing can be decided separately by the owner.
