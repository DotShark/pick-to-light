# Pick-to-Light 💡

**Live Demo:** The project is currently up and running at [https://ptl.dotshark.dev](https://ptl.dotshark.dev)

> Because finding stuff in your warehouse shouldn't feel like a treasure hunt.

A smart IoT solution that lets you click a button and instantly light up the exact shelf location of any product. No more wandering around with a clipboard like it's 1995.

## 🎯 What Does This Thing Do?

Instead of manually searching through shelves, you:
1. Open the web interface 
2. Click on "Screw 22mm" (or whatever you're looking for)
3. The LED under that product lights up instantly
4. Profit! 📈

Perfect for warehouses, workshops, or any place where you store stuff and occasionally need to find it again.

## 🏗️ Architecture

This is a monorepo with:

```
pick-to-light/
├── api/              # AdonisJS backend (Node.js)
├── front/            # Vue.js frontend (used to be Svelte)
├── leds_controller/  # Python code for Raspberry Pi Pico
├── mosquitto/        # MQTT broker config
└── docker-compose.yml
```

**Communication Flow:**
- Frontend ↔ Backend: REST API
- Backend ↔ LED Controller: MQTT + HTTP
- LED Controller runs on Raspberry Pi Pico WH with WS2812B LED strips

## 🛠️ Hardware Requirements

- **Raspberry Pi Pico WH** (the W is for Wi-Fi, the H is for pre-soldered headers)
- **WS2812B LED Strip** (RGB addressable)
- **Power Supply (not mandatory)** (5V for the LED strip)

**Wiring:**
- VBUS (5V) → LED Strip power
- GND → LED Strip ground  
- GP16 → LED Strip data (DIN)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- A Raspberry Pi Pico WH with MicroPython

### Environment Variables

Create a `.env` file in the root directory for Docker Compose:

```bash
# API Configuration
API_PORT=4000
API_HOST=0.0.0.0
APP_KEY=your-app-key-here
LOG_LEVEL=info

# Frontend Configuration
FRONT_PORT=3000

# MQTT Configuration
MQTT_HOST=mosquitto
MQTT_PORT=4010

# System Configuration
TZ=UTC
```

For local development, also create `api/.env`:

```bash
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-secure-app-key-here
NODE_ENV=development
MQTT_URL=mqtt://localhost:1883
```

**Required Variables:**
- `APP_KEY`: Secure encryption key for the backend (generate with `node ace generate:key`)
- `MQTT_URL/MQTT_HOST`: MQTT broker connection details
- `API_HOST`: Host binding for the API server
- `PORT`: Port for the API server

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd pick-to-light
```

### 2. Start the Stack
```bash
# Fire up backend, frontend, and MQTT broker
docker-compose up -d

# Backend will be at http://localhost:4000
# Frontend will be at http://localhost:3000
# MQTT broker at localhost:1883
```

### 3. Setup the LED Controller
```bash
# Flash MicroPython on your Pico
# Copy the leds_controller/ folder to your Pico
# Update the Wi-Fi credentials in your Pico's boot script
# Run main.py on the Pico
```

### 4. Initialize Data
Hit the backend API to create your first floor and add some items:
```bash
# Create a floor
curl -X POST http://localhost:4000/floors -H "Content-Type: application/json" -d '{"name": "Main Floor"}'

# Add an item to a slot
curl -X POST http://localhost:4000/items -H "Content-Type: application/json" -d '{"name": "Screw 22mm", "slot": 5, "color": "#FF0000", "floor_id": 1}'
```

## 📱 Usage

### User Interface
1. Open the web interface
2. Browse or search for products
3. Click on any item to light up its LED
4. Go grab your stuff ✨

### Admin Interface
⚠️ **Note**: Authentication is not implemented yet, so the admin interface is currently wide open.

Admin features include:
- Add/remove products
- Assign items to LED slots
- Manage floor configurations
- Update LED colors

## 🔧 Development

### Backend (AdonisJS)
```bash
cd api/
npm install
npm run dev    # Runs on port 3333
```

### Frontend (Vue.js)
```bash
cd front/
npm install
npm run dev    # Runs on port 5173
```

### LED Controller
The `leds_controller/` runs on the Raspberry Pi Pico with MicroPython:
- On startup: Fetches all items via HTTP GET
- Runtime: Listens to MQTT messages for real-time updates
- Supported actions: `reloadItems`, `changeItemColor`

## 📊 Current Status

**What's Working:**
- ✅ LED control via Raspberry Pi Pico
- ✅ MQTT communication
- ✅ REST API for items/floors
- ✅ Basic web interface
- ✅ Docker setup

**What's Coming:**
- 🔜 Authentication system
- 🔜 Multiple floor support (architecture ready, needs testing)
- 🔜 Better admin interface
- 🔜 Mobile app

## 🚀 Deployment

For production:
1. Update MQTT broker settings in `mosquitto/`
2. Configure environment variables for the backend
3. Set up proper networking for Pico controllers
4. Scale with multiple floors/controllers as needed

## 🧪 Testing

Currently tested with:
- Single Raspberry Pi Pico controller
- One floor configuration
- Basic LED operations

Multi-floor support is architecturally ready but not yet tested in production.

## 🤝 Contributing

1. Fork it
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

## 🆘 Troubleshooting

**LED not lighting up?**
- Check Pico Wi-Fi connection
- Verify MQTT broker is running
- Check the wiring (GP16 → DIN)

**Frontend can't reach backend?**
- Make sure Docker services are running
- Check if ports 3000 and 4000 are available

**MQTT issues?**
- Verify broker is accessible at localhost:1883
- Check topic subscriptions in the logs
