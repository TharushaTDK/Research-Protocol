# MASTER PROMPT — COMPLETE FINAL-YEAR RESEARCH PLAN PDF

Create a professional, comprehensive, academic PDF document for my university final-year research project.

The document must describe the **entire research project**, including the overall research topic, research problem, motivation, objectives, proposed intelligent framework, all four research components, datasets, machine-learning models, IoT architecture, mobile applications, workflows, system architecture, data collection, preprocessing, feature engineering, correlation analysis, model training, evaluation, deployment, expected outputs, research contribution, limitations, and future work.

The document must be understandable to:
- University supervisors
- Research evaluators
- Academic researchers
- Industry/rubber-sector stakeholders
- Students working on the implementation

Use simple but academically appropriate English.

IMPORTANT:
- Do not remove important technical details.
- Do not excessively shorten the content.
- Include diagrams, flowcharts, architecture diagrams, tables, sample datasets, formulas, graphs and workflows.
- Clearly distinguish between actual research information and illustrative/sample information.
- Never present sample values as real experimental results.
- Do not invent experimental results.
- Do not invent accuracy, RMSE, R², MAE or other performance values unless explicitly identified as previously obtained/available research results.
- If a value is not yet experimentally established, write "To be determined through experimentation."
- Use BLUE AND WHITE as the primary document colour scheme.
- Use professional academic formatting.
- Include a cover page.
- Include table of contents.
- Include numbered sections and subsections.
- Include page numbers.
- Include figure numbers and captions.
- Include table numbers and captions.
- Use landscape pages where necessary for large tables or wide architecture diagrams.
- Make the PDF approximately 35–60 pages if necessary. Do not artificially restrict the document length.
- Make the document suitable as a complete research-plan/reference document.

============================================================
1. RESEARCH PROJECT INFORMATION
============================================================

Research Topic:

"Intelligent Framework for Precision Rubber Processing and Supply Chain Optimization"

Research domain:

- Data Science
- Machine Learning
- Internet of Things
- Mobile Computing
- Precision Rubber Processing
- Agricultural Technology
- Smallholder Rubber Sector
- Decision Support Systems

The research focuses on developing an intelligent framework for improving rubber processing and related decision-making using IoT, machine learning, mobile computing and data-driven approaches.

The research is designed around four interconnected components.

The four components are:

Component 1:
Smartphone-Based Machine Learning Decision Support System for Rubber Latex Coagulation Management

Component 2:
Village-Level Weather & Tapping Advisory System

Component 3:
Mobile Acoustic "Thud-Test" App for Rubber Sheet Quality Assessment

Component 4:
Smart Smokehouse Drying-Time Prediction and Fire-Risk Monitoring System

============================================================
2. OVERALL RESEARCH VISION
============================================================

Explain the overall research concept.

Traditional rubber processing can depend heavily on:
- Manual measurements
- Farmer experience
- Fixed recommendations
- Manual quality assessment
- Weather uncertainty
- Manual smokehouse monitoring
- Limited real-time decision support

The proposed research develops an integrated intelligent framework that uses:

- Machine learning
- IoT
- Smartphone/mobile computing
- Weather intelligence
- Acoustic signal processing
- Environmental sensing
- Cloud/backend technologies
- Data analytics
- Decision-support mechanisms

The overall framework should transform selected rubber-processing activities from manual/experience-based processes into data-driven intelligent decision support.

============================================================
3. OVERALL SYSTEM PERSPECTIVE
============================================================

Create an overall Input–Process–Output model.

INPUTS:

Agricultural and processing data:
- Metrolac reading
- Latex temperature
- Latex volume
- Weather data
- Rainfall
- Humidity
- Temperature
- Wet hours
- Historical latex density
- Historical DRC
- Tapping frequency
- Rubber sheet acoustic signals
- Smokehouse temperature
- Smokehouse humidity
- Sheet loading information
- Historical drying records

PROCESS:

- Data collection
- IoT sensing
- Smartphone data collection
- Cloud/local storage
- Data preprocessing
- Feature extraction
- Feature engineering
- Machine learning
- Signal processing
- Prediction
- Risk analysis
- Decision-support generation
- Mobile notifications

OUTPUTS:

Component 1:
- Corrected DRC
- Water recommendation
- Formic acid recommendation
- Coagulation time prediction

Component 2:
- Tap/Not Tap recommendation
- DRC stress prediction
- Bark rot risk prediction
- Weather-based advisory

Component 3:
- Acoustic features
- Rubber-sheet quality assessment
- Moisture/quality prediction

Component 4:
- Layer-wise temperature monitoring
- Layer-wise humidity monitoring
- Remaining drying-time prediction
- Fire-risk alerts
- Farmer notifications

============================================================
4. OVERALL FRAMEWORK DIAGRAM
============================================================

Create a professional architecture diagram:

                 INTELLIGENT RUBBER PROCESSING FRAMEWORK

                         DATA SOURCES
                              │
       ┌──────────────────────┼────────────────────────┐
       │                      │                        │
   Latex Data            Weather Data            Sensor Data
       │                      │                        │
       │                      │              Smokehouse / Acoustic
       │                      │                        │
       └──────────────────────┼────────────────────────┘
                              ↓
                     DATA COLLECTION
                              ↓
                  DATA STORAGE / DATABASE
                              ↓
               DATA PREPROCESSING & CLEANING
                              ↓
                  FEATURE ENGINEERING
                              ↓
              MACHINE LEARNING / ANALYTICS
                              ↓
       ┌──────────────┬───────────────┬───────────────┬───────────────┐
       ↓              ↓               ↓               ↓
 Component 1      Component 2      Component 3      Component 4
 Latex            Weather &        Acoustic         Smokehouse
 Coagulation      Tapping          Quality          Drying
       ↓              ↓               ↓               ↓
       └──────────────┴───────────────┴───────────────┘
                              ↓
                    DECISION SUPPORT
                              ↓
                     MOBILE APPLICATION
                              ↓
                           FARMER

============================================================
5. COMPONENT 1
============================================================

TITLE:

"Smartphone-Based Machine Learning Decision Support System for Rubber Latex Coagulation Management"

Explain the purpose.

The component focuses on helping determine appropriate latex coagulation conditions using:
- Metrolac readings
- Latex temperature
- Latex volume

The system addresses the need for temperature-corrected DRC estimation and recommendations for coagulation.

============================================================
6. COMPONENT 1 — PROBLEM
============================================================

Explain:

Rubber latex DRC estimation can be affected by temperature.

Traditional methods may require:
- Manual Metrolac reading
- Reference charts
- Manual calculations
- Temperature correction
- Farmer interpretation

The proposed system provides smartphone-based machine-learning decision support.

============================================================
7. COMPONENT 1 — INPUTS
============================================================

Inputs:

1. Metrolac Reading
2. Latex Temperature (°C)
3. Raw Latex Volume (L)

Outputs:

1. Corrected DRC
2. Water requirement
3. Formic acid requirement
4. Predicted coagulation time

============================================================
8. COMPONENT 1 — DRC PROCESS
============================================================

Create:

Metrolac Reading
+
Latex Temperature
+
Latex Volume
        ↓
Data preprocessing
        ↓
Temperature correction
        ↓
ML model
        ↓
Corrected DRC
        ↓
Water calculation
        ↓
Formic acid calculation
        ↓
Coagulation-time prediction
        ↓
Mobile recommendation

============================================================
9. COMPONENT 1 — MODEL
============================================================

The selected temperature-corrected linear regression approach referenced in the research is:

Metro_N

Previously referenced performance:

R² = 0.84

IMPORTANT:

Clearly state whether this is an existing experimental/reference result or an illustrative value according to the source material. Do not fabricate additional metrics.

Explain that final performance must be evaluated using actual research data.

============================================================
10. COMPONENT 2
============================================================

TITLE:

"Village-Level Weather & Tapping Advisory System"

Purpose:

Provide weather-sensitive tapping recommendations for rubber farmers.

The system combines:
- Weather data
- Historical latex information
- Machine learning
- Disease-risk prediction
- Advisory generation

============================================================
11. COMPONENT 2 — DATA SOURCES
============================================================

Potential weather sources:

- OpenWeatherMap API
- WeatherAPI
- Local weather stations

Variables:

- Rainfall (mm/day)
- Relative humidity (%)
- Temperature (°C)
- Wet hours
- Consecutive rainy days
- 3-day cumulative rainfall
- Previous latex density
- Previous DRC
- Tapping frequency

============================================================
12. COMPONENT 2 — FEATURE ENGINEERING
============================================================

Create:

3-day cumulative rainfall

Continuous wet hours

Consecutive rainy days

Average humidity

Previous latex density

Previous DRC

Tapping frequency

Explain why each feature may be relevant.

============================================================
13. COMPONENT 2 — MACHINE LEARNING
============================================================

Models referenced:

Tap / Not Tap:
Random Forest

DRC Stress Level:
XGBoost

Bark Rot Risk:
Logistic Regression

Create a table:

| Prediction | ML Model | Problem Type |
| Tap/Not Tap | Random Forest | Classification |
| DRC Stress Level | XGBoost | Classification/Prediction |
| Bark Rot Risk | Logistic Regression | Classification |

Explain that final models should be validated experimentally.

============================================================
14. COMPONENT 2 — WORKFLOW
============================================================

Weather API / Local Station
        ↓
Weather Data Collection
        ↓
Data Cleaning
        ↓
Feature Extraction
        ↓
DRC Stress Model
        ↓
Disease Risk Model
        ↓
Tap/Not Tap Model
        ↓
Advisory Engine
        ↓
Farmer Mobile Application
        ↓
Tap / Do Not Tap Recommendation

============================================================
15. COMPONENT 3
============================================================

TITLE:

"Mobile Acoustic 'Thud-Test' App for Rubber Sheet Quality Assessment"

Purpose:

Use smartphone acoustic signals to support rubber-sheet quality/moisture assessment.

The farmer taps the rubber sheet.

The smartphone records the sound.

The application processes the signal.

============================================================
16. COMPONENT 3 — SIGNAL PROCESSING
============================================================

Create:

Rubber Sheet
      ↓
Thud/Tap
      ↓
Smartphone Microphone
      ↓
Audio Recording
      ↓
Signal Preprocessing
      ↓
FFT
      ↓
Feature Extraction
      ↓
Machine Learning
      ↓
Quality/Moisture Prediction

Features:

- Dominant Frequency
- Damping Ratio
- Spectral Centroid

============================================================
17. COMPONENT 3 — MODEL
============================================================

Referenced model:

k-Nearest Neighbours (kNN)

Previously referenced performance:

RMSE = 0.660%

MAE = 0.480%

Again, clearly distinguish existing/referenced values from future experimental results.

============================================================
18. COMPONENT 4
============================================================

TITLE:

"Smart Smokehouse Drying-Time Prediction and Fire-Risk Monitoring System"

This is the main component assigned to the researcher.

Purpose:

Develop an IoT-enabled intelligent smokehouse monitoring system that:

1. Measures temperature and humidity in three layers.
2. Uses six sensors.
3. Collects data every hour.
4. Records drying batches.
5. Records number of rubber sheets.
6. Calculates sheets per square metre.
7. Predicts remaining drying time separately for each layer.
8. Monitors abnormal heat/fire-risk conditions.
9. Sends useful information and alerts to farmers through a mobile application.

============================================================
19. COMPONENT 4 — SMOKEHOUSE STRUCTURE
============================================================

The smokehouse has three layers.

Layer 1:
Temperature sensor T1
Humidity sensor RH1

Layer 2:
Temperature sensor T2
Humidity sensor RH2

Layer 3:
Temperature sensor T3
Humidity sensor RH3

Total:

6 environmental sensors.

Create a detailed smokehouse diagram.

Show heat source/firewood below the layers.

Clearly state:

The expected heat distribution between layers is a research hypothesis that must be verified through actual sensor measurements.

============================================================
20. COMPONENT 4 — IOT DEVICE
============================================================

Main microcontroller:

ESP32

Initial research prototype:

Six sensors
↓
ESP32
↓
MicroSD card

This allows data collection without Wi-Fi.

Final online system:

Six sensors
↓
ESP32
↓
Wi-Fi
↓
Backend API
↓
Database
↓
Machine Learning
↓
Mobile Application

============================================================
21. COMPONENT 4 — SENSOR COLLECTION FREQUENCY
============================================================

FINAL DECISION:

Collect sensor data every hour.

Why?

- Higher temporal resolution
- Better training dataset
- Captures temperature changes
- Captures humidity changes
- Supports dynamic predictions
- Supports safety monitoring

System schedule:

Sensor measurement:
Every 1 hour

Database update:
Every 1 hour

ML prediction:
Every 1 hour

Normal farmer summary:
Every 6 hours if desired

Warning:
Immediately

Critical:
Immediately

============================================================
22. COMPONENT 4 — LAYER-WISE PREDICTION
============================================================

The model should provide separate predictions:

Layer 1 → Remaining drying time

Layer 2 → Remaining drying time

Layer 3 → Remaining drying time

Example only:

L1 = 14.3 hours
L2 = 17.8 hours
L3 = 21.2 hours

Mark these as:

"Illustrative sample values — not experimental results."

============================================================
23. COMPONENT 4 — SHEET LOADING
============================================================

Include:

Number_of_Sheets

Layer_Area_m2

Sheets_per_m2

Formula:

Sheets_per_m2 =
Number_of_Sheets / Layer_Area_m2

Example:

180 sheets / 6 m²
=
30 sheets/m²

Explain why loading density may affect:
- airflow
- moisture removal
- drying rate
- drying time

============================================================
24. COMPONENT 4 — FINAL DATASET
============================================================

FINAL DATASET COLUMNS:

Identifiers:
- Batch_ID
- Timestamp
- Layer_ID

Loading:
- Number_of_Sheets
- Layer_Area_m2
- Sheets_per_m2

Sensors:
- Temperature_C
- Humidity_%

Progress:
- Elapsed_Drying_Hours

Derived:
- Temperature_Change_1h
- Humidity_Change_1h

Target:
- Remaining_Drying_Hours

Safety:
- Fire_Risk_Level

Create a detailed table explaining every column.

============================================================
25. REMOVED PARAMETERS
============================================================

DO NOT include:

Firewood_Amount_kg

Reason:

It is impractical to measure accurately during actual smokehouse operation.

Smokehouse_ID:

Do not use it as an ML predictive feature.

Reason:

The model should learn physical/environmental relationships rather than memorize smokehouse identity.

It may optionally be retained in administrative/raw records for traceability and generalization analysis.

============================================================
26. BATCH DEFINITION
============================================================

Define:

A Batch is one complete rubber-sheet drying operation.

Example:

Batch B001:

Layer 1
Layer 2
Layer 3

with hourly records until each layer completes drying.

Create a batch hierarchy diagram.

============================================================
27. TARGET VARIABLE
============================================================

Target:

Remaining_Drying_Hours

Formula:

Remaining_Drying_Hours =
Actual_Total_Drying_Hours
-
Elapsed_Drying_Hours

Example:

Actual drying duration = 20 hours

Elapsed = 5 hours

Remaining = 15 hours

Important:

Actual_Total_Drying_Hours is used to create the target.

It must NOT be used as an input feature during prediction.

This is a critical data-leakage issue.

============================================================
28. DIFFERENT DRYING TIME BY LAYER
============================================================

Explain:

Each layer can have different actual drying duration.

Illustrative:

Layer 1 = 20 hours
Layer 2 = 23 hours
Layer 3 = 27 hours

These are examples only.

Actual values must be collected from field experiments.

============================================================
29. COMPONENT 4 — MACHINE LEARNING MODELS
============================================================

This is a regression problem.

Target:

Remaining_Drying_Hours

Candidate models:

1. Linear Regression
2. Random Forest Regressor
3. Gradient Boosting Regressor
4. XGBoost Regressor
5. Extra Trees Regressor

Create comparison table:

| Model | Type | Purpose |
| Linear Regression | Regression | Baseline |
| Random Forest | Regression | Nonlinear relationships |
| Gradient Boosting | Regression | Strong tabular baseline |
| XGBoost | Regression | Advanced boosting |
| Extra Trees | Regression | Ensemble comparison |

Do not automatically declare one model as best.

Select the best model using actual evaluation results.

============================================================
30. COMPONENT 4 — MODEL FEATURES
============================================================

Inputs:

- Layer_ID
- Number_of_Sheets
- Layer_Area_m2
- Sheets_per_m2
- Temperature_C
- Humidity_%
- Elapsed_Drying_Hours
- Temperature_Change_1h
- Humidity_Change_1h

Target:

Remaining_Drying_Hours

============================================================
31. FEATURE ENGINEERING
============================================================

Include formulas:

Sheets_per_m2:

Number_of_Sheets / Layer_Area_m2

Temperature_Change_1h:

Current temperature - previous hour temperature

Humidity_Change_1h:

Current humidity - previous hour humidity

Elapsed_Drying_Hours:

Current timestamp - batch start timestamp

Potential future features:

- Rolling temperature mean
- Rolling humidity mean
- Temperature trend
- Humidity trend

Only use features available at prediction time.

============================================================
32. FIRE-RISK SYSTEM
============================================================

The initial approach is:

RULE-BASED FIRE-RISK MONITORING

Three levels:

NORMAL
WARNING
CRITICAL

Potential indicators:

- Current temperature
- Temperature increase rate
- Temperature change
- Humidity
- Layer
- Drying stage

Do NOT invent exact thresholds.

State:

"The exact thresholds must be established using field observations, literature, expert knowledge, safety requirements and experimental data."

Important:

High temperature alone does not necessarily mean fire.

The system should identify abnormal conditions/patterns.

============================================================
33. OPTIONAL FIRE-RISK ML MODEL
============================================================

If sufficient labelled fire-risk data becomes available, investigate:

1. Logistic Regression
2. Decision Tree
3. Random Forest
4. XGBoost Classifier
5. SVM

Evaluation:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

Explain why Recall is particularly important for critical safety events.

============================================================
34. CORRELATION ANALYSIS
============================================================

Include a dedicated section because the supervisor requested correlation analysis.

The correlation analysis should investigate relationships among:

- Number_of_Sheets
- Layer_Area_m2
- Sheets_per_m2
- Temperature_C
- Humidity_%
- Elapsed_Drying_Hours
- Temperature_Change_1h
- Humidity_Change_1h
- Remaining_Drying_Hours

Perform:

1. Pearson correlation
2. Spearman correlation
3. Correlation heatmap
4. Feature-vs-target ranking
5. Feature multicollinearity analysis

Explain:

Pearson:
Measures linear correlation.

Spearman:
Measures monotonic relationships and is less dependent on linearity.

Correlation coefficient:

- +1 = strong positive
- 0 = no linear relationship
- -1 = strong negative

Create a sample heatmap, but clearly mark it as illustrative unless actual data is provided.

============================================================
35. CORRELATION INTERPRETATION
============================================================

Use guidelines:

| |r| | Interpretation |
| 0.00–0.29 | Weak |
| 0.30–0.69 | Moderate |
| 0.70–1.00 | Strong |

Clearly state:

These are general interpretation guidelines.

Do not automatically remove a feature solely because of correlation.

Special case:

Sheets_per_m2 is mathematically derived from:

Number_of_Sheets / Layer_Area_m2

Therefore correlations involving these variables must be interpreted carefully.

============================================================
36. DATA PREPROCESSING
============================================================

Overall preprocessing:

1. Load raw data.
2. Validate timestamps.
3. Check missing values.
4. Check duplicate records.
5. Check sensor failures.
6. Detect impossible values.
7. Validate Layer_ID.
8. Validate Batch_ID.
9. Validate sheet counts.
10. Validate layer area.
11. Calculate Sheets_per_m2.
12. Calculate elapsed time.
13. Calculate temperature change.
14. Calculate humidity change.
15. Generate Remaining_Drying_Hours.
16. Check target values.
17. Prepare model dataset.

============================================================
37. DATA QUALITY
============================================================

Check:

- Missing temperature
- Missing humidity
- Duplicate timestamps
- Sensor disconnection
- Flat-line readings
- Timestamp errors
- Negative elapsed time
- Incorrect batch IDs
- Incorrect layer IDs
- Invalid sheet counts
- Invalid layer areas
- Negative remaining drying time
- Incorrect drying completion records

============================================================
38. DATA SPLITTING
============================================================

IMPORTANT:

Do not randomly split hourly records.

Use Batch_ID-based splitting.

Example:

Training batches:
B001–B080

Validation:
B081–B090

Testing:
B091–B100

These numbers are examples only.

Explain:

Hourly records from the same batch are highly related.

Random row splitting can cause data leakage.

============================================================
39. REGRESSION EVALUATION
============================================================

Metrics:

MAE
RMSE
R²

Table:

| Metric | Meaning | Better |
| MAE | Average absolute prediction error | Lower |
| RMSE | Penalizes large errors | Lower |
| R² | Explained variance | Higher |

Include model comparison table:

| Model | MAE | RMSE | R² | Rank |
| Linear Regression | TBD | TBD | TBD | TBD |
| Random Forest | TBD | TBD | TBD | TBD |
| Gradient Boosting | TBD | TBD | TBD | TBD |
| XGBoost | TBD | TBD | TBD | TBD |
| Extra Trees | TBD | TBD | TBD | TBD |

Do not invent values.

============================================================
40. OVERALL DATA SCIENCE PIPELINE
============================================================

Create:

Raw Data
↓
Data Cleaning
↓
Exploratory Data Analysis
↓
Correlation Analysis
↓
Feature Engineering
↓
Train/Validation/Test Split
↓
Model Training
↓
Hyperparameter Tuning
↓
Model Evaluation
↓
Best Model Selection
↓
Model Saving
↓
Backend Deployment
↓
Real-Time Prediction
↓
Mobile Application

============================================================
41. COMPLETE IOT ARCHITECTURE
============================================================

Create detailed diagram:

SMOKEHOUSE
│
├── L1 Temperature
├── L1 Humidity
├── L2 Temperature
├── L2 Humidity
├── L3 Temperature
└── L3 Humidity
          ↓
        ESP32
          ↓
 ┌────────┴─────────┐
 ↓                  ↓
MicroSD            Wi-Fi
 ↓                  ↓
Offline          Backend API
Collection           ↓
                 Database
                     ↓
              Feature Processing
                     ↓
               ML Prediction
                     ↓
              Fire-Risk Rules
                     ↓
               Mobile App
                     ↓
                  Farmer

============================================================
42. BACKEND AND MOBILE APPLICATION
============================================================

Explain:

ESP32 sends sensor readings to backend.

Backend:

- Receives sensor data
- Validates data
- Stores data
- Generates features
- Calls ML model
- Stores prediction
- Evaluates fire-risk rules
- Sends results to mobile application

Mobile application displays:

- Batch ID
- Layer
- Temperature
- Humidity
- Remaining drying time
- Fire-risk status
- Historical trends
- Notifications

============================================================
43. MOBILE DASHBOARD
============================================================

Create a professional mobile UI mockup.

Example:

SMART RUBBER SMOKEHOUSE

Batch: B001

LAYER 1
Temperature: 72.4°C
Humidity: 58%
Remaining: 14.3 h
Risk: NORMAL

LAYER 2
Temperature: 65.1°C
Humidity: 63%
Remaining: 17.8 h
Risk: NORMAL

LAYER 3
Temperature: 59.8°C
Humidity: 70%
Remaining: 21.2 h
Risk: NORMAL

Last Updated:
09:00

Clearly label as illustrative.

============================================================
44. NOTIFICATION SYSTEM
============================================================

Create:

Sensor:
Every 1 hour

ML prediction:
Every 1 hour

Normal summary:
Every 6 hours

Warning:
Immediately

Critical:
Immediately

Example:

"Layer 1 temperature is increasing rapidly. Please inspect the layer and heat source."

Do not claim that the alert proves an actual fire.

============================================================
45. OVERALL MOBILE APPLICATION ARCHITECTURE
============================================================

Create:

IoT Device
↓
Backend API
↓
Database
↓
ML Prediction Service
↓
Fire-Risk Service
↓
Mobile API
↓
Farmer Mobile App

============================================================
46. SAMPLE DATASET FOR ENTIRE RESEARCH
============================================================

Create separate dataset examples for each component.

Component 1 sample:

Metrolac_Reading
Latex_Temperature
Latex_Volume
Corrected_DRC
Water_Required
Formic_Acid_Required
Coagulation_Time

Component 2:

Rainfall
Temperature
Humidity
Wet_Hours
Previous_DRC
Previous_Density
Tapping_Frequency
Tap_Decision
DRC_Stress
Bark_Rot_Risk

Component 3:

Dominant_Frequency
Damping_Ratio
Spectral_Centroid
Moisture/Quality_Target

Component 4:

Batch_ID
Timestamp
Layer_ID
Number_of_Sheets
Layer_Area_m2
Sheets_per_m2
Temperature_C
Humidity_%
Elapsed_Drying_Hours
Temperature_Change_1h
Humidity_Change_1h
Remaining_Drying_Hours
Fire_Risk_Level

Clearly mark all examples as synthetic/illustrative.

============================================================
47. SAMPLE COMPONENT 4 DATA
============================================================

Use example rows:

B001 | 06:00 | L1 | 180 | 6.0 | 30.0 | 68.2 | 64 | 0 | — | — | 20 | Normal

B001 | 07:00 | L1 | 180 | 6.0 | 30.0 | 69.4 | 63 | 1 | +1.2 | -1 | 19 | Normal

B001 | 08:00 | L1 | 180 | 6.0 | 30.0 | 71.0 | 61 | 2 | +1.6 | -2 | 18 | Normal

B001 | 09:00 | L1 | 180 | 6.0 | 30.0 | 73.5 | 59 | 3 | +2.5 | -2 | 17 | Warning

Also provide sample rows for L2 and L3.

Clearly mark these as illustrative.

============================================================
48. RESEARCH DATA COLLECTION PLAN
============================================================

Explain:

Component 1:
Collect latex measurements.

Component 2:
Collect weather and tapping information.

Component 3:
Collect acoustic recordings.

Component 4:
Collect hourly smokehouse sensor data.

For Component 4:

1. Obtain permission.
2. Visit smokehouse.
3. Identify three layers.
4. Install sensors.
5. Verify readings.
6. Record layer area.
7. Count sheets.
8. Create Batch_ID.
9. Start hourly collection.
10. Continue until drying completion.
11. Record actual completion time.
12. Repeat across many batches and smokehouses.
13. Create final dataset.

============================================================
49. FIELD DATA COLLECTION ETHICS / PERMISSION
============================================================

Include:

Permission should be obtained from the relevant smokehouse owner/operator and appropriate university/research authorities.

Data collection should minimize disruption to normal processing.

Any sensitive operational information should be handled appropriately.

============================================================
50. MODEL DEPLOYMENT
============================================================

Explain:

After model training:

Dataset
↓
Train model
↓
Evaluate
↓
Select best model
↓
Save trained model
↓
Deploy model to backend
↓
Receive new sensor data
↓
Preprocess using same pipeline
↓
Predict remaining drying time
↓
Return prediction
↓
Mobile application

============================================================
51. REAL-TIME PREDICTION EXAMPLE
============================================================

At 10:00:

Sensors measure:

L1:
Temperature = current value
Humidity = current value

L2:
Temperature = current value
Humidity = current value

L3:
Temperature = current value
Humidity = current value

Backend receives data.

Features are generated.

Model predicts:

L1 remaining time
L2 remaining time
L3 remaining time

Fire-risk rules evaluate all layers.

Mobile app updates.

At 11:00 the process repeats.

============================================================
52. MODEL MONITORING
============================================================

After deployment, monitor:

- Prediction error
- Sensor quality
- Missing readings
- Model drift
- Unusual environmental conditions
- False warnings
- Missed warnings
- Farmer feedback

============================================================
53. RESEARCH EVALUATION
============================================================

Evaluate:

Technical performance:
- Sensor reliability
- Data completeness
- Communication reliability
- Backend response
- Prediction latency

ML performance:
- MAE
- RMSE
- R²
- Classification metrics if fire-risk ML is used

Application performance:
- Usability
- Notification effectiveness
- Farmer understanding

Field performance:
- Drying-time prediction accuracy
- Layer-wise accuracy
- Practical usefulness

============================================================
54. RESEARCH NOVELTY
============================================================

Explain that the research contribution is the integrated framework combining:

- Rubber latex decision support
- Weather/tapping intelligence
- Acoustic rubber-sheet assessment
- IoT smokehouse monitoring
- Layer-wise drying-time prediction
- Fire-risk monitoring
- Mobile decision support

The novelty should be described as the proposed integration and application rather than claiming that each individual technology is new.

============================================================
55. EXPECTED BENEFITS
============================================================

Expected benefits:

1. Better decision support.
2. Reduced dependence on fixed drying times.
3. Improved understanding of layer-wise drying.
4. Real-time smokehouse monitoring.
5. Early warning of abnormal conditions.
6. Better use of environmental data.
7. Improved rubber processing efficiency.
8. Potential improvement in product quality.
9. Reduced unnecessary monitoring effort.
10. Mobile access to processing information.

Use "expected" rather than claiming confirmed results.

============================================================
56. LIMITATIONS
============================================================

Include:

- Sensor accuracy
- Smokehouse environmental harshness
- Limited initial dataset
- Different smokehouse designs
- Limited labelled fire events
- Sensor failures
- Internet availability
- Generalization between smokehouses
- Farmer adoption
- Difficulty obtaining accurate drying completion labels
- Potential distribution shift

============================================================
57. FUTURE WORK
============================================================

Potential future improvements:

- More sensors
- More environmental variables
- Automated smokehouse control
- Advanced time-series models
- LSTM/GRU/Temporal models
- Edge AI/TinyML
- Automated ventilation control
- Automated heat control
- Larger multi-region dataset
- More sophisticated fire-risk modelling
- Cloud scalability
- Offline-first mobile application

============================================================
58. COMPLETE RESEARCH IMPLEMENTATION ROADMAP
============================================================

Create a visual roadmap:

Phase 1
Literature Review

↓

Phase 2
Problem Definition

↓

Phase 3
System Design

↓

Phase 4
Component Development

↓

Phase 5
Data Collection

↓

Phase 6
Data Preprocessing

↓

Phase 7
Correlation & EDA

↓

Phase 8
ML Training

↓

Phase 9
Model Evaluation

↓

Phase 10
IoT Integration

↓

Phase 11
Backend Development

↓

Phase 12
Mobile Application

↓

Phase 13
System Integration

↓

Phase 14
Field Testing

↓

Phase 15
Final Evaluation

↓

Phase 16
Research Documentation

============================================================
59. OVERALL RESEARCH WORKFLOW
============================================================

Create a large final flowchart:

Research Problem
↓
Literature Review
↓
Research Gap
↓
Objectives
↓
System Design
↓
Four Components
↓
Data Collection
↓
Data Preprocessing
↓
EDA
↓
Correlation Analysis
↓
Feature Engineering
↓
ML Model Training
↓
Model Comparison
↓
Best Model Selection
↓
IoT Integration
↓
Backend
↓
Mobile Application
↓
Field Testing
↓
Evaluation
↓
Research Findings
↓
Conclusion & Future Work

============================================================
60. RESEARCH GAP
============================================================

Explain the research gap carefully.

Potential gaps addressed by the framework:

- Fragmented rubber-processing decision support
- Limited integrated IoT + ML solutions
- Limited layer-wise smokehouse monitoring
- Limited dynamic drying-time prediction
- Limited mobile-based processing decision support
- Manual environmental monitoring
- Limited data-driven safety monitoring

Do not claim absolute novelty without literature evidence.

Use wording such as:

"The proposed research aims to address..."

rather than:

"No previous system has ever..."

============================================================
61. FINAL CONTRIBUTION
============================================================

The research proposes an integrated intelligent framework that connects:

Rubber latex processing
+
Weather/tapping decisions
+
Rubber-sheet acoustic assessment
+
Smokehouse drying prediction
+
Fire-risk monitoring
+
Mobile decision support

Create a final visual showing all four components converging into:

"Intelligent Rubber Processing and Supply Chain Optimization Framework"

============================================================
62. IMPORTANT TECHNICAL WARNING
============================================================

Add a prominent box:

"Experimental values must not be invented."

All sample datasets, graphs and prediction values in this document are for:

- System demonstration
- Dataset design
- Workflow explanation
- UI demonstration

They are NOT final research results.

Final results must be generated from actual field data.

============================================================
63. FINAL RESEARCH SUMMARY
============================================================

End the document with:

The research proposes an Intelligent Framework for Precision Rubber Processing and Supply Chain Optimization using machine learning, IoT, mobile computing, weather intelligence and acoustic signal processing.

The framework consists of four complementary components:

1. Latex coagulation decision support.
2. Weather and tapping advisory.
3. Acoustic rubber-sheet quality assessment.
4. Smart smokehouse drying-time prediction and fire-risk monitoring.

Component 4 uses six sensors distributed across three smokehouse layers, collects environmental data hourly, incorporates sheet-loading density and drying progress, predicts remaining drying time separately for each layer, monitors abnormal heat conditions, and provides information to farmers through a mobile application.

The complete framework aims to transform selected rubber-processing activities into data-driven intelligent decision-support services.

============================================================
64. REQUIRED FIGURES
============================================================

The final PDF MUST contain at least these diagrams/figures:

Figure 1:
Overall Research Framework

Figure 2:
Input–Process–Output Model

Figure 3:
Component 1 Workflow

Figure 4:
Component 2 Weather/Tapping Workflow

Figure 5:
Component 3 Acoustic Processing Workflow

Figure 6:
Component 4 Smokehouse Sensor Layout

Figure 7:
Six-Sensor IoT Architecture

Figure 8:
Offline MicroSD Architecture

Figure 9:
Online IoT → Backend → ML → Mobile Architecture

Figure 10:
Layer-Wise Drying Prediction Workflow

Figure 11:
Fire-Risk Monitoring Workflow

Figure 12:
Correlation Analysis Workflow

Figure 13:
Machine Learning Training Pipeline

Figure 14:
Overall Research Workflow

Figure 15:
Research Implementation Roadmap

Figure 16:
Illustrative Component 4 Temperature Trend

Figure 17:
Illustrative Remaining Drying-Time Chart

Figure 18:
Illustrative Mobile Dashboard

============================================================
65. REQUIRED TABLES
============================================================

Include at least:

Table 1:
Research Components

Table 2:
Component 1 Inputs and Outputs

Table 3:
Component 2 Features and Predictions

Table 4:
Component 3 Acoustic Features

Table 5:
Component 4 Sensors

Table 6:
Component 4 Final Dataset Columns

Table 7:
Removed Parameters

Table 8:
Batch Definition

Table 9:
Drying-Time ML Models

Table 10:
Regression Evaluation Metrics

Table 11:
Fire-Risk Levels

Table 12:
Optional Fire-Risk ML Models

Table 13:
Correlation Analysis Variables

Table 14:
Data Preprocessing Checks

Table 15:
Technology Stack

Table 16:
Data Collection Schedule

Table 17:
Mobile Application Information

Table 18:
Research Phases

Table 19:
Potential Limitations

Table 20:
Expected Benefits

============================================================
66. DOCUMENT STYLE
============================================================

Use:

Primary colour:
Dark blue

Secondary:
Light blue

Background:
White

Use blue headings.

Use light-blue table headers.

Use blue borders where appropriate.

Use simple professional icons for:

- IoT
- Sensors
- Machine Learning
- Mobile
- Database
- Weather
- Rubber processing

Do not use overly decorative/fancy designs.

The PDF should look like a university engineering/data-science research document.

Use consistent terminology throughout.

============================================================
67. FINAL TITLE PAGE
============================================================

Title:

INTELLIGENT FRAMEWORK FOR PRECISION RUBBER PROCESSING AND SUPPLY CHAIN OPTIMIZATION

Subtitle:

Complete Research Framework, System Architecture, Data Pipeline and Implementation Plan

Include:

Final-Year Research Project

Four Research Components

Component 4:
Smart Smokehouse Drying-Time Prediction and Fire-Risk Monitoring System

Do not invent university, faculty, supervisor, student or group information unless provided separately.

============================================================
68. FINAL QUALITY CHECK
============================================================

Before generating the PDF, verify:

✓ All four components are included.

✓ Component 4 is explained in greater technical depth.

✓ Six sensors are included.

✓ Three smokehouse layers are included.

✓ Hourly data collection is included.

✓ Six-hour notification summary is included.

✓ Batch_ID is included.

✓ Smokehouse_ID is NOT an ML feature.

✓ Firewood_Amount_kg is removed.

✓ Number_of_Sheets is included.

✓ Layer_Area_m2 is included.

✓ Sheets_per_m2 is included.

✓ Remaining_Drying_Hours is included.

✓ Actual_Total_Drying_Hours is explained as target-generation information and not an ML input.

✓ Layer-wise drying prediction is included.

✓ Five candidate drying-time models are included.

✓ Fire-risk rule-based approach is included.

✓ Optional fire-risk ML approach is included.

✓ Correlation analysis is included.

✓ Pearson correlation is included.

✓ Spearman correlation is included.

✓ Correlation heatmap is included.

✓ Batch-aware train/test splitting is included.

✓ Data leakage warning is included.

✓ IoT architecture is included.

✓ ESP32 is included.

✓ MicroSD offline architecture is included.

✓ Wi-Fi online architecture is included.

✓ Backend is included.

✓ Database is included.

✓ Mobile application is included.

✓ Farmer notifications are included.

✓ Research roadmap is included.

✓ Research limitations are included.

✓ Future work is included.

✓ Sample values are clearly marked as illustrative.

✓ No fabricated experimental results are presented.

✓ All diagrams have captions.

✓ All tables have captions.

✓ The final PDF uses blue-and-white professional styling.

Generate the final PDF with all of the above content.