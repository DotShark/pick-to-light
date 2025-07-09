import json
import requests
import time
from umqtt.simple import MQTTClient
from lib.http_utils import check_response_status


BASE_URL = "http://localhost:4000"
FLOOR_ID = 1
MQTT_BROKER = "localhost"  # Update this to your MQTT broker address
MQTT_PORT = 1883
CLIENT_ID = f"led_controller_floor_{FLOOR_ID}"
TOPIC = f"floors/{FLOOR_ID}"


def mqtt_callback(topic, msg):
    """Handle incoming MQTT messages"""
    try:
        topic_str = topic.decode('utf-8')
        message_str = msg.decode('utf-8')
        message_data = json.loads(message_str)
        
        print(f"📦 MQTT message received on topic: {topic_str}")
        print(f"- action: {message_data.get('action', 'Unknown')}")
        print(f"- params: {message_data.get('params', {})}")
        
        handle_mqtt_message(message_data)
        
    except Exception as e:
        print(f"❌ Error processing MQTT message: {e}")


def handle_mqtt_message(data):
    """Handle MQTT message based on action"""
    action = data.get('action')
    params = data.get('params', {})
    
    if action == 'reloadItems':
        print("🔄 Reloading all items from floor...")
        fetch_items_from_floor(FLOOR_ID)
    elif action == 'changeItemColor':
        slot = params.get('slot')
        color = params.get('color')
        if slot is not None and color:
            update_led(slot, color)
        else:
            print("⚠️ Missing slot or color in changeItemColor message")
    else:
        print(f"⚠️ Unknown action: {action}")


def connect_mqtt():
    """Connect to MQTT broker and subscribe to floor topic"""
    try:
        client = MQTTClient(CLIENT_ID, MQTT_BROKER, port=MQTT_PORT)
        client.set_callback(mqtt_callback)
        client.connect()
        client.subscribe(TOPIC.encode('utf-8'))
        print(f"🔗 Connected to MQTT broker and subscribed to: {TOPIC}")
        return client
    except Exception as e:
        print(f"❌ Failed to connect to MQTT broker: {e}")
        return None


def listen_to_mqtt(client):
    """Listen to MQTT messages"""
    print("👂 Listening to MQTT messages...")
    try:
        while True:
            client.check_msg()
            time.sleep(0.1)  # Small delay to prevent busy waiting
    except Exception as e:
        print(f"❌ MQTT listening error: {e}")
        client.disconnect()


def fetch_items_from_floor(floor_id: int):
    response = requests.get(f"{BASE_URL}/floors/{floor_id}")
    check_response_status(response)
    floor_data = response.json()
    print(f"🏗 Floor: {floor_data['name']}")
    for item in floor_data["items"]:
        if item["slot"] or item["slot"] == 0:
            update_led(item["slot"], item["color"])


def update_led(slot: int, color: str):
    # TODO: Replace with your actual Raspberry Pi Pico LED control
    print(f"💡 Set LED at slot {slot} to color {color}")


if __name__ == "__main__":
    # Initial load of items from the floor
    fetch_items_from_floor(FLOOR_ID)
    
    # Connect to MQTT and start listening
    mqtt_client = connect_mqtt()
    if mqtt_client:
        listen_to_mqtt(mqtt_client)
    else:
        print("❌ Failed to start MQTT client")
