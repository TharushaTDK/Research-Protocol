# RubberSense – Smart Smokehouse Setup and Farmer Workflow

## Component 4: Smart Smokehouse Drying-Time Prediction and Fire-Risk Monitoring

**Overall Research Topic:** Intelligent Framework for Precision Rubber Processing and Supply Chain Optimization

**Mobile Application:** RubberSense  
**Slogan:** Sense. Predict. Improve.

---

## 1. Purpose

This document describes the farmer-side setup and operation of Component 4 through the RubberSense mobile application.

The intended experience is:

**Install sensors → Power ESP32 → Open RubberSense → Connect Device → Configure Wi-Fi → Verify 6 Sensors → Register Smokehouse → Start Batch → Monitor Drying**

The farmer should not need to understand ESP32 programming, IP addresses, APIs, databases, or machine-learning models.

---

## 2. Smokehouse Hardware

The smokehouse has three layers:

- Layer 1 (L1) – Bottom
- Layer 2 (L2) – Middle
- Layer 3 (L3) – Top

Each layer has one temperature sensor and one humidity sensor.

| Layer | Temperature Sensor | Humidity Sensor |
|---|---|---|
| L1 | L1-T | L1-H |
| L2 | L2-T | L2-H |
| L3 | L3-T | L3-H |

Physical sensors should be labelled **L1-T, L1-H, L2-T, L2-H, L3-T, L3-H**.

### Hardware architecture

```text
             SMOKEHOUSE
        ┌─────────────────┐
        │       L3        │
        │    T3 + RH3     │
        ├─────────────────┤
        │       L2        │
        │    T2 + RH2     │
        ├─────────────────┤
        │       L1        │
        │    T1 + RH1     │
        ├─────────────────┤
        │   Heat Source   │
        └─────────────────┘
                 │
                 ↓
               ESP32
                 │
          ┌──────┴──────┐
          ↓             ↓
        Wi-Fi          SD Card
```

---

## 3. RubberSense Mobile Application

The application is called **RubberSense**.

### Slogan

> **Sense. Predict. Improve.**

The main application contains a **Smart Smokehouse** button.

When the farmer taps it:

- A new farmer sees **Set Up New Smokehouse**.
- An existing farmer sees **My Smokehouses** and the dashboard.

---

## 4. First-Time Setup Wizard

```text
Smart Smokehouse
       ↓
Set Up New Smokehouse
       ↓
Step 1 – Connect Hardware
       ↓
Step 2 – Connect Device
       ↓
Step 3 – Configure Wi-Fi
       ↓
Step 4 – Detect Sensors
       ↓
Step 5 – Verify 6 Sensors
       ↓
Step 6 – Register Smokehouse
       ↓
Setup Complete
```

---

## 5. Step 1 – Connect Hardware

The app shows a simple smokehouse diagram:

```text
             SMOKEHOUSE
        ┌─────────────────┐
        │       L3        │
        │   L3-T + L3-H   │
        ├─────────────────┤
        │       L2        │
        │   L2-T + L2-H   │
        ├─────────────────┤
        │       L1        │
        │   L1-T + L1-H   │
        ├─────────────────┤
        │   Heat Source   │
        └─────────────────┘
```

The farmer is instructed to place:

- L1-T and L1-H in Layer 1
- L2-T and L2-H in Layer 2
- L3-T and L3-H in Layer 3

The app can show:

`[ ] I have connected all six sensors.`

Then the farmer taps **Continue**.

---

## 6. Step 2 – Power the ESP32

The farmer turns on the IoT device.

The app displays:

> **Turn on the RubberSense Smokehouse Device.**

During first-time configuration, the ESP32 enters setup mode.

---

## 7. ESP32 Setup Mode

The ESP32 can create a temporary Wi-Fi network such as:

**RubberSense-Setup-XXXX**

The farmer's phone temporarily connects directly to it.

```text
Phone
  ↕
RubberSense ESP32
```

This temporary connection is only used for device configuration. The farmer should not need to enter an IP address manually.

---

## 8. Step 3 – Connect Phone to Device

The app displays:

> **Connect your phone to the RubberSense device.**

Instructions:

1. Turn on the RubberSense Smokehouse Device.
2. Open phone Wi-Fi settings if required.
3. Find `RubberSense-Setup-XXXX`.
4. Connect to it.
5. Return to RubberSense.

The app checks whether communication with the ESP32 is successful.

---

## 9. Step 4 – Configure Farmer Wi-Fi

After the phone connects to the ESP32 setup network, the app asks for the normal farm Wi-Fi.

Example:

**Wi-Fi Network**  
`[ Select Wi-Fi Network ]`

**Password**  
`[ *************** ]`

Button:

**Connect**

The app sends the Wi-Fi information to the ESP32 through the temporary setup connection.

The ESP32 then:

```text
Temporary Setup Wi-Fi
        ↓
Receive Farmer Wi-Fi Credentials
        ↓
Disconnect Setup Mode
        ↓
Connect to Farmer Wi-Fi
        ↓
Connect to Internet
```

---

## 10. Connection Verification

The app verifies:

```text
Device                🟢 Connected
Internet              🟢 Connected
RubberSense Cloud     🟢 Connected
```

If a connection fails, the app shows a simple troubleshooting message and a **Try Again** option.

---

## 11. Step 5 – Detect Six Sensors

The ESP32 should have a known sensor configuration:

```text
ESP32
│
├── Channel 1 → L1 Temperature
├── Channel 2 → L1 Humidity
├── Channel 3 → L2 Temperature
├── Channel 4 → L2 Humidity
├── Channel 5 → L3 Temperature
└── Channel 6 → L3 Humidity
```

The exact ESP32 pin mapping is defined during hardware implementation.

---

## 12. Sensor Verification Screen

The app displays:

| Sensor | Status |
|---|---|
| L1 Temperature | 🟢 Connected |
| L1 Humidity | 🟢 Connected |
| L2 Temperature | 🟢 Connected |
| L2 Humidity | 🟢 Connected |
| L3 Temperature | 🟢 Connected |
| L3 Humidity | 🟢 Connected |

The app should verify not only that the sensors are detected but also that valid measurements are being received.

---

## 13. Display Actual Sensor Readings

Example:

### Layer 1
- Temperature: **68.4°C**
- Humidity: **62%**

### Layer 2
- Temperature: **64.2°C**
- Humidity: **66%**

### Layer 3
- Temperature: **58.7°C**
- Humidity: **71%**

This lets the farmer confirm that the sensors are actually producing readings.

---

## 14. Failed Sensor Detection

If L2 humidity is not detected:

> 🔴 **L2 Humidity – Sensor Not Detected**

> Please check the L2 humidity sensor connection.

Buttons:

- **Try Again**
- **View Setup Instructions**

The farmer should not need to understand electronics or programming.

---

## 15. Sensor Test

A dedicated **Test Sensors** step can check:

- Sensor communication
- Valid temperature readings
- Valid humidity readings
- Missing sensors
- Invalid readings

Example:

```text
L1 Temperature     🟢 PASS
L1 Humidity        🟢 PASS

L2 Temperature     🟢 PASS
L2 Humidity        🟢 PASS

L3 Temperature     🟢 PASS
L3 Humidity        🟢 PASS
```

---

## 16. Step 6 – Register Smokehouse

After all six sensors are verified:

**Smokehouse Name:** `[ My Smokehouse ]`

**Number of Layers:** `3`

**Sensors Connected:** `6 / 6`

Button:

**Complete Setup**

The backend registers the smokehouse and associates the device with the farmer account.

```text
Farmer Account
      ↓
Smokehouse
      ↓
Device_ID
      ↓
Sensor Configuration
```

---

## 17. One-Time Setup vs. Daily Operation

### One-time setup

```text
Connect ESP32
      ↓
Configure Wi-Fi
      ↓
Verify Internet
      ↓
Detect Sensors
      ↓
Verify Six Sensors
      ↓
Register Smokehouse
```

### New drying batch

```text
New Batch
    ↓
Enter Batch Information
    ↓
Start Drying
```

The farmer should not need to repeat the Wi-Fi and sensor setup for every batch.

---

## 18. Starting a New Drying Batch

The farmer selects:

**Start New Drying Batch**

The app asks for batch information.

Example:

**Number of sheets:** `[ 180 ]`

**Layer area:** `[ 6.0 m² ]`

If each layer has a different number of sheets:

| Layer | Number of Sheets |
|---|---:|
| L1 | 180 |
| L2 | 175 |
| L3 | 160 |

The app calculates:

`Sheets/m² = Number of Sheets / Layer Area`

Example:

`180 / 6 = 30 sheets/m²`

This becomes part of the batch dataset.

---

## 19. Automatic Sensor Data Collection

After the farmer starts the batch, temperature and humidity are collected automatically.

The system collects:

- L1 temperature
- L1 humidity
- L2 temperature
- L2 humidity
- L3 temperature
- L3 humidity

The current planned prediction interval is **hourly**.

```text
Sensors
   ↓
ESP32
   ↓
Every 1 Hour
   ↓
Sensor Reading
   ↓
Backend / SD Card
   ↓
Database
```

---

## 20. Machine-Learning Prediction

The hourly measurements are processed by the backend.

```text
Temperature
Humidity
Sheets/m²
Elapsed Drying Hours
Temperature Change
Humidity Change
Other Selected Features
        ↓
Feature Processing
        ↓
ML Regression Model
        ↓
Remaining Drying Hours
```

The target variable is:

**Remaining_Drying_Hours**

---

## 21. Remaining Drying Time

The training target can be calculated as:

`Remaining Drying Hours = Actual Total Drying Hours - Elapsed Drying Hours`

Example:

```text
Actual drying duration = 22 hours
Elapsed drying time    = 8 hours

Remaining time = 22 - 8
               = 14 hours
```

The actual total drying duration is known only after the batch finishes and is used to create the training target.

It should **not** be provided to the model as a real-time input because that would cause data leakage.

---

## 22. Layer-Wise Prediction

The system supports:

```text
L1 → Remaining Drying Hours
L2 → Remaining Drying Hours
L3 → Remaining Drying Hours
```

Different layers can have different:

- Temperatures
- Humidity
- Heat exposure
- Airflow
- Drying rates

Therefore, the system should not automatically assume that all layers finish at exactly the same time.

---

## 23. RubberSense Smokehouse Dashboard

Example:

# Smart Smokehouse

**Batch:** B001

### Layer 1

🌡️ Temperature: **71.4°C**  
💧 Humidity: **58%**  
⏱️ Remaining: **14 hours**  
🟢 Risk Status: **Normal**

### Layer 2

🌡️ Temperature: **66.1°C**  
💧 Humidity: **63%**  
⏱️ Remaining: **17 hours**  
🟢 Risk Status: **Normal**

### Layer 3

🌡️ Temperature: **60.2°C**  
💧 Humidity: **69%**  
⏱️ Remaining: **21 hours**  
🟢 Risk Status: **Normal**

**Last Update:** 10:00 AM

---

## 24. Fire-Risk Monitoring

The initial approach is a **rule-based fire-risk monitoring system**, rather than immediately training another ML model.

Potential inputs:

- Temperature
- Temperature increase rate
- Humidity
- Layer
- Drying stage

Possible outputs:

```text
NORMAL
WARNING
CRITICAL
```

Exact safety thresholds should be determined from:

- Literature
- Field observations
- Expert advice
- Appropriate safety requirements
- Experimental data

The system should describe these as **risk alerts**, not as proof that a fire is occurring.

---

## 25. Fire-Risk Alerts

Normal sensor monitoring and prediction runs hourly.

Safety monitoring should be capable of identifying abnormal conditions without waiting for a long-interval summary.

Example:

> 🔶 **Warning — Layer 1**  
> Temperature is increasing unusually quickly. Please inspect the smokehouse.

Example:

> 🔴 **Critical Alert — Layer 1**  
> An abnormal temperature condition has been detected. Please inspect the smokehouse immediately.

---

## 26. Wi-Fi Failure Handling

The smokehouse may have unreliable Wi-Fi. Therefore, the ESP32 should support local MicroSD storage.

### Wi-Fi available

```text
ESP32
  ↓
Wi-Fi
  ↓
Backend
  ↓
Database
```

### Wi-Fi unavailable

```text
Wi-Fi Unavailable
       ↓
ESP32
       ↓
MicroSD Card
       ↓
Continue Recording
```

### Wi-Fi returns

```text
ESP32
  ↓
Internet Reconnected
  ↓
Upload Stored Records
  ↓
Backend
  ↓
Database
```

This prevents temporary network failures from destroying collected research data.

---

## 27. Complete System Architecture

```text
             ┌───────────────────┐
             │  RubberSense App  │
             └─────────┬─────────┘
                       │
                Device Setup
                       │
                       ↓
                 ┌──────────┐
                 │  ESP32   │
                 └────┬─────┘
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
      L1             L2             L3
   T + RH          T + RH          T + RH
       └──────────────┼──────────────┘
                      ↓
                  Wi-Fi / SD
                      ↓
                Backend API
                      ↓
                  Database
                      ↓
            ┌─────────┴─────────┐
            ↓                   ↓
      Drying ML Model       Fire-Risk Rules
            ↓                   ↓
            └─────────┬─────────┘
                      ↓
                RubberSense
                      ↓
                    Farmer
```

---

## 28. End-to-End Farmer Workflow

```text
                    RubberSense
                         │
                         ↓
               ┌──────────────────┐
               │ Smart Smokehouse │
               └────────┬─────────┘
                        ↓
                 First Time Setup?
                    /          \
                  YES           NO
                   ↓             ↓
             Setup Wizard     Dashboard
                   ↓
          Connect ESP32 Device
                   ↓
           Configure Farm Wi-Fi
                   ↓
           Internet Connection
                   ↓
             Detect ESP32
                   ↓
             Detect Sensors
                   ↓
          ┌─────────────────┐
          │ L1 T  ✓         │
          │ L1 H  ✓         │
          │ L2 T  ✓         │
          │ L2 H  ✓         │
          │ L3 T  ✓         │
          │ L3 H  ✓         │
          └─────────────────┘
                   ↓
             Test Readings
                   ↓
            Setup Complete
                   ↓
             Start Batch
                   ↓
           Enter Sheet Counts
                   ↓
             Drying Starts
                   ↓
          Hourly Sensor Reading
                   ↓
           ML + Fire-Risk Check
                   ↓
             RubberSense App
                   ↓
        Farmer Monitoring / Alerts
```

---

## 29. Recommended Technical Architecture

```text
Temperature Sensors
Humidity Sensors
        ↓
       ESP32
        ↓
   Wi-Fi Network
        ↓
     Backend API
        ↓
     PostgreSQL
        ↓
Feature Engineering
        ↓
Machine Learning Model
        ↓
Remaining Drying Time
        ↓
Fire-Risk Rule Engine
        ↓
     Backend API
        ↓
  RubberSense Mobile App
        ↓
      Farmer
```

For initial research data collection, the prototype can operate as:

```text
Sensors
   ↓
ESP32
   ↓
MicroSD
```

This allows data collection without requiring Wi-Fi.

---

## 30. Farmer-Facing Design Principle

The system should hide technical complexity.

The farmer should **not** have to:

- Enter IP addresses
- Configure APIs
- Access a database
- Run Python
- Understand machine learning
- Manually calculate remaining drying time
- Manually record hourly temperature
- Manually calculate humidity changes

The farmer should only need to:

1. Install sensors according to the illustrated instructions.
2. Turn on the ESP32 device.
3. Complete the one-time Wi-Fi setup.
4. Confirm that all six sensors are detected.
5. Start a drying batch.
6. Enter the required batch information.
7. Monitor the RubberSense dashboard.
8. Respond to alerts when necessary.

---

## 31. Final Farmer Experience

The intended experience is:

> **Connect → Verify → Start → Monitor → Receive Alerts**

The system performs:

> **Sense → Store → Analyze → Predict → Alert**

This supports the RubberSense slogan:

> **Sense. Predict. Improve.**

---

## 32. Relation to Component 4

This farmer-side workflow supports the main objectives of Component 4:

- IoT-based smokehouse monitoring
- Layer-wise temperature and humidity measurement
- Hourly data collection
- Structured dataset generation
- Drying-progress monitoring
- Remaining drying-time prediction
- Rule-based fire-risk monitoring
- Cloud/backend integration
- Mobile decision support
- Farmer alerts

The system connects the physical smokehouse environment to the machine-learning prediction system and finally to a practical farmer-facing mobile application.
