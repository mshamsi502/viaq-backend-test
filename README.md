
# VIAQ Iot Service

This is a backend service built to handle various tasks, such as interacting with MQTT brokers, RabbitMQ, MongoDB, and providing a RESTful API. The project includes multiple microservices for processing data and notifications.

## Technologies Used
- **MQTT:** To interact with the MQTT broker for receiving and publishing data.
- **RabbitMQ:** For message queue management, enabling efficient communication between different services.
- **MongoDB:** Used for storing device information and notifications.
- **Express.js:** For creating a RESTful API to interact with the stored data.
- **Mongoose:** For managing MongoDB schemas and data models.
- **Node.js:** The runtime environment for executing the backend services.
- **Nodemon:** Used for au tomatically restarting the app during development when file changes are detected.

## Project Structure
```bash
/viaq-backend-app
├── /api
│   └── route.js                 # Express routes for API endpoints 
├── /constant
│   └── deviceCheckPoints.js     # Contains the defined checkpoints for devices (e.g., min/max values for temperature and humidity)  
├── /consumers
│   ├── deviceConsumer.js        # Consumer for processing device data from MQTT and sending it to RabbitMQ
│   ├── dataSaverConsumer.js     # Consumer for saving data to MongoDB
│   └── notificationConsumer.js  # Consumer for monitoring data and storing notifications
├── /generator
│   ├── data-generator.js         # Data generator for series of simulating devices data and publishing to MQTT
│   └── single-data-generator.js  # Data generator for a custom single simulating device data and publishing to MQTT
├── /helper
│   └── helper.js                 # Helper functions for generating random values and other utility functions
├── /models
│   ├── device.js                 # Mongoose model for storing device data (e.g., serial number, checkpoints, last saved)
│   └── Notification.js           # Mongoose model for storing notifications related to devices when parameter values exceed defined thresholds
├── /mqtt
│   └── mqttClient.js             # MQTT client for handling connections to the MQTT broker and publishing data
├── /rabbitmq
│   ├── connection.js             # RabbitMQ connection management, including setup and connection handling
│   └── publisher.js              # Publisher that sends data to RabbitMQ queues
├── /service
│   └── dataSaver.js              # Service responsible for consuming data from RabbitMQ and saving it to MongoDB
├── .env                          #  Environment variables for configuration (e.g., MongoDB URI, RabbitMQ credentials)
├── docker-compose.yml            # Docker configuration for RabbitMQ and MongoDB
├── index.js                      # Main entry point for the application
└── package.json                  # Project dependencies and NPM scripts
```

## Installation & Setup
**1. Clone the repository and navigate into the project directory:**
```bash
git clone https://github.com/yourusername/backend-service-project.git
cd backend-service-project
```
**2. Create .env File in Root Project and Copy Below Variables:**
```bash
MONGO_URI=mongodb://localhost:27017/mqttApp
MQTT_BROKER=mqtt://broker.emqx.io:1883
RABBITMQ_URI=amqp://guest:guest@localhost:5672
```
**3. Install dependencies:**
```bash
npm install
```
**4. Set up RabbitMQ and MongoDB using Docker:**
```bash
docker-compose up -d
```
**5. To run the project in development mode (using Nodemon):**

You can run the service in different modes using the following npm scripts:

- ### Quick Run:
    ```bash
    - npm run server-full #run server, all consumer and generate data for test
    ```

- ### Custom Consumers Run:
    ```bash
    - npm run device #run device consumer
    - npm run data-saver #run data-saver consumer
    - npm run notification #run notification consumer
    ```
    or
    ```bash
    - npm run all-consumers #run all consumers
    ```
- ### Run Just Server:
    ```bash
    - npm run server #run server alone
    ```
- ### Run Server with Consumers:
    ```bash
    - npm run server-consumer #run server with consumers
    ```

## API Endpoints
**1. Devices Endpoint**

Route: /devices
```bash
http://localhost:3000/devices
```
Description: Fetch the last 10 entries for each device, including the timestamp (minute and second).

**2. Notifications Endpoint**

Route: /notifications
```bash
http://localhost:3000/notifications
```
Description: Fetch the last 10 notifications stored in the database.

## Notes
- Ensure that RabbitMQ and MongoDB are correctly running before executing the service.

- The services should automatically process incoming data, store it in MongoDB, and monitor parameters for notification generation.

- This project is designed to be modular, with each service handling specific responsibilities, such as consuming data, saving to the database, and notifying users.