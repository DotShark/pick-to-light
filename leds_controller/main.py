import requests
from sseclient import SSEClient 
import uuid
import threading
import time

TRANSMIT_UID = str(uuid.uuid4())
BASE_URL = "http://localhost:3333"
CHANNEL = "items"

def subscribe_to_channel():
    response = requests.post(f"{BASE_URL}/__transmit/subscribe", json={
        "uid": TRANSMIT_UID,
        "channel": CHANNEL
    })
    response.raise_for_status()
    print("✅ Subscribed to channel 'items'")

def listen_to_events():
    url = f"{BASE_URL}/__transmit/events?uid={TRANSMIT_UID}"
    messages = SSEClient(url)
    print("👂 Listening to Transmit events...")
    for msg in messages:
        handle_event(msg)

def handle_event(msg):
    print("📦 Event received:", msg)
    # TODO: parse JSON and update LEDs accordingly
    # You can use `json.loads(data)` then call your LED controller logic

def fetch_items_from_floor(floor_id: int):
    response = requests.get(f"{BASE_URL}/floors/{floor_id}")
    response.raise_for_status()
    floor_data = response.json()
    print(f"🏗 Floor: {floor_data['name']}")
    for item in floor_data["items"]:
        update_led(item["slot"], item["color"])

def update_led(slot: int, color: str):
    # TODO: Replace with your actual Raspberry Pi Pico LED control
    print(f"💡 Set LED at slot {slot} to color {color}")

if __name__ == "__main__":
    # I had to write this weird code because AdonisJS Transmit want us to listen to events before subscribing to any channel
    fetch_items_from_floor(1)
    events_thread = threading.Thread(target=listen_to_events)
    events_thread.daemon = True
    events_thread.start()
    time.sleep(0.5)
    subscribe_to_channel()
    events_thread.join()
