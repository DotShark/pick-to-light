import requests
import uuid
import threading
import time
import json

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
    print("👂 Listening to Transmit events...")
    response = requests.get(url, stream=True)
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
    print(f"- channel: {data['channel']}")
    print(f"- action: {data['payload']['action']}")
    print(f"- params: {data['payload']['params']}")
    # TODO: update LEDs accordingly

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
