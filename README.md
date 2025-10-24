# HMBP# 🏠 Home Management System (HMS)

> **Version:** 1.0  
> **Maintainer:** Yukendiran K  
> **Advisor:** ChatGPT (GPT-5)  
> **License:** MIT  
> **Last Updated:** October 2025  

---

## 🌟 Overview

The **Home Management System (HMS)** is a **modular, intelligent platform** for managing household finances, predicting expenses, and fostering social connectivity.  

It unifies:
- **Expense tracking** across multiple modules (grocery, electronics, etc.)
- **Financial planning** for EMIs, savings, and assets
- **AI-driven price forecasting**
- **Social interaction** with chat and media sharing
- **Marketplace** for second-quality or pre-owned product selling

HMS is designed as a **cloud-native**, **AI-ready**, and **scalable microservice architecture** built for real-world extensibility.

---

## 🧩 Key Features

| Category | Description |
|-----------|--------------|
| 💰 Expense Tracker | Track and categorize daily spending across multiple modules |
| 🏦 Financial Hub | Manage EMIs, bills, savings, and assets |
| 🤖 Forecast Engine | Predict future prices and spending trends |
| 💬 Social Platform | Chat, share posts, and connect with other users |
| 🛒 Marketplace | Buy/sell pre-owned items within your social network |
| 📈 AI Integration | Personalized insights and automated recommendations |

---

## 🧱 System Architecture

The project follows a **modular service-oriented architecture** (SOA), with clear separation between core components.

```mermaid
flowchart TD
    subgraph Frontend[Frontend Layer]
        UI[Streamlit / React]
    end

    subgraph API[Backend Layer]
        FAPI[FastAPI Services]
        AUTH[Auth Service (OAuth2 + JWT)]
        CHAT[Chat Service (WebSocket)]
        MLAPI[ML Prediction API]
        MARKET[Marketplace API]
    end

    subgraph DATA[Data Layer]
        PG[PostgreSQL]
        SF[Snowflake / Delta Lake]
        BLOB[Azure Blob / S3]
    end

    subgraph PIPELINE[Pipeline Layer]
        AF[Airflow / Prefect]
        MLFlow[MLflow + Model Registry]
    end

    subgraph OBS[Observability]
        GRAF[Grafana]
        PROM[Prometheus]
        LOKI[Loki Logs]
    end

    UI --> FAPI
    FAPI --> AUTH
    FAPI --> PG
    FAPI --> MLAPI
    MLAPI --> SF
    FAPI --> MARKET
    MARKET --> BLOB
    FAPI --> CHAT
    AF --> MLFlow
    MLFlow --> MLAPI
    FAPI --> PROM
    FAPI --> LOKI
    PROM --> GRAF
