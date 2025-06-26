import network
import time

SSID = "Unknown"
PASSWORD = "something"

def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("🔌 Connecting to Wi-Fi...")
        wlan.connect(SSID, PASSWORD)
        timeout = 10
        while not wlan.isconnected() and timeout > 0:
            print("⌛ Waiting for connection...")
            time.sleep(1)
            timeout -= 1
    if wlan.isconnected():
        print("✅ Connected!")
        print("📡 IP Address:", wlan.ifconfig()[0])
    else:
        print("❌ Failed to connect.")

connect_to_wifi()
