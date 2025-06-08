import mqtt from 'mqtt'
import env from '#start/env'

export type ItemsMqttMessage = {
  action: 'reloadItems' | 'changeItemColor'
  params?: {
    slot: number
    color: string
  }
}

class MqttService {
  private client: mqtt.MqttClient | null = null
  private isConnected = false

  connect() {
    try {
      const mqttUrl = env.get('MQTT_URL')
      if (!mqttUrl) throw new Error('MQTT_URL is not defined in environment variables')
      this.client = mqtt.connect(mqttUrl)

      this.client.on('connect', () => {
        console.log('🔗 Connected to MQTT broker')
        this.isConnected = true
      })

      this.client.on('error', (error) => {
        console.error('❌ MQTT connection error:', error)
        this.isConnected = false
      })

      this.client.on('close', () => {
        console.log('🔌 MQTT connection closed')
        this.isConnected = false
      })
    } catch (error) {
      console.error('❌ Failed to connect to MQTT broker:', error)
    }
  }

  async publish(topic: string, message: ItemsMqttMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        console.warn('⚠️ MQTT client not connected, skipping message publish')
        resolve()
        return
      }

      this.client.publish(topic, JSON.stringify(message), (error) => {
        if (error) {
          console.error('❌ Failed to publish MQTT message:', error)
          reject(error)
        } else {
          console.log(`📤 Published MQTT message to topic: ${topic}`)
          resolve()
        }
      })
    })
  }

  async publishToFloor(floorId: number, message: ItemsMqttMessage): Promise<void> {
    const topic = `floors/${floorId}`
    return this.publish(topic, message)
  }

  disconnect() {
    if (this.client) {
      this.client.end()
      this.client = null
      this.isConnected = false
    }
  }
}

export const mqttService = new MqttService()
