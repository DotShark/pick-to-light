import _thread
import json
import os
import time

import network
from urequests import urequests

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


def get_random_bytes(n):
    try:
        return os.urandom(n)
    except ImportError:
        # Fallback if urandom is not available
        import random
        return bytes([random.getrandbits(8) for _ in range(n)])


def uuid4():
    # Generate 16 random bytes
    random_bytes = bytearray(get_random_bytes(16))

    # Set version to 4 (random UUID)
    random_bytes[6] = (random_bytes[6] & 0x0F) | 0x40
    # Set variant to 10xx
    random_bytes[8] = (random_bytes[8] & 0x3F) | 0x80

    hex_str = ''.join('{:02x}'.format(b) for b in random_bytes)
    return (
        f"{hex_str[0:8]}-"
        f"{hex_str[8:12]}-"
        f"{hex_str[12:16]}-"
        f"{hex_str[16:20]}-"
        f"{hex_str[20:]}"
    )


TRANSMIT_UID = str(uuid4())
BASE_URL = "http://localhost:3333"
CHANNEL = "floors/1"


def subscribe_to_channel():
    response = urequests.post(f"{BASE_URL}/__transmit/subscribe", json={
        "uid": TRANSMIT_UID,
        "channel": CHANNEL
    })
    response.raise_for_status()
    print(f"✅ Subscribed to channel '{CHANNEL}'")


def listen_to_events():
    url = f"{BASE_URL}/__transmit/events?uid={TRANSMIT_UID}"
    print("👂 Listening to Transmit events...")
    response = urequests.get(url, stream=True)
    response.raise_for_status()

    buffer = ""
    for chunk in response.iter_content(decode_unicode=True):
        if chunk:
            buffer += chunk
            while "\n\n" in buffer:
                message, buffer = buffer.split("\n\n", 1)
                if message.startswith("data: "):
                    data = message[6:]
                    try:
                        event_data = json.loads(data)
                        handle_event(event_data)
                    except json.JSONDecodeError:
                        print(f"Failed to parse event data: {data}")


def handle_event(data):
    print("📦 Event received:")
    print(f"- channel: {data.get('channel', 'Unknown')}")
    print(f"- action: {data.get('payload', {}).get('action', 'Unknown')}")
    print(f"- params: {data.get('payload', {}).get('params', {})}")
    # TODO: update LEDs accordingly


def fetch_items_from_floor(floor_id: int):
    response = urequests.get(f"{BASE_URL}/floors/{floor_id}")
    response.raise_for_status()
    floor_data = response.json()
    print(f"🏗 Floor: {floor_data['name']}")
    for item in floor_data["items"]:
        update_led(item["slot"], item["color"])


def update_led(slot: int, color: str):
    # TODO: Replace with your actual Raspberry Pi Pico LED control
    print(f"💡 Set LED at slot {slot} to color {color}")


if __name__ == "__main__":
    # I had to write this weird code because AdonisJS Transmit want us to listen to events before subscribing to any
    # channel
    fetch_items_from_floor(1)
    events_thread = _thread.start_new_thread(listen_to_events, ())
    time.sleep(0.5)
    subscribe_to_channel()
