# Automatic Order Printing – MyD Delivery

This script was created to automate the order printing flow of the **MyD Delivery** WordPress plugin.

By default, MyD Delivery requires manual interaction to open a new order and click the print button.  
This JavaScript automates this process, allowing new orders to be printed automatically.

---

## 🚀 How it works

- Monitors the MyD Delivery admin panel for new incoming orders
- Automatically selects the newest order
- Triggers the print action without manual clicks
- Designed to work continuously while the admin panel is open

---

## 🖨️ Automatic Printing (Chrome Kiosk Mode)

To enable **fully automatic printing**, the script can be used together with:

- **Google Chrome in Kiosk Mode**
- Silent printing enabled via Chrome settings or command-line flags

With this setup, when a new order arrives:
1. The order is opened automatically
2. The print command is triggered
3. The printer prints without user interaction

This setup is commonly used in restaurants and delivery environments.

---

## ⚙️ Requirements

- WordPress with **MyD Delivery** plugin installed
- Access to the admin orders panel
- Google Chrome (recommended for kiosk mode)
- Proper printer configuration

---

## ⚠️ Important notes

- This script depends on MyD Delivery’s DOM structure  
- Changes to the plugin may require script adjustments
- Intended for controlled environments (kiosk / dedicated machines)

---

## 📌 Disclaimer

This project is not officially affiliated with or endorsed by MyD Delivery.
