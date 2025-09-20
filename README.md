<div align="center">

# ⚡ ATSify — AI-powered Resume Analyzer

[![Made with Java](https://img.shields.io/badge/Java-21-red?logo=oracle&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=0A0A0A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-%F0%9F%9A%80-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A developer-first tool that helps candidates tailor resumes to job descriptions using LLM analysis, with an ATS-style score and actionable tips.

<img src="ui/public/banner-placeholder.png" alt="Project Banner" width="100%"/>

<i>Replace the banner image with a wide screenshot or a custom graphic (1920×480 recommended)</i>

</div>

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Architecture](#-architecture)
- [Features](#-features)
- [Quickstart](#-quickstart)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [Notable Files](#-notable-files)
- [Development Notes](#-development-notes)
- [Roadmap](#-roadmap)
- [Why This Matters](#-why-this-matters)
- [Runbook (Windows)](#-runbook-windows)
- [Security & Privacy](#-security--privacy)
- [License](#-license)

---

## 🔎 Overview

ATSify parses resumes (PDF/DOCX), analyzes them against a job description using Spring AI (Ollama), and returns:

- ✅ An ATS-style score
- 💡 Strengths and gaps
- 🧰 Concrete, personalized improvement tips

> Dev-friendly emails via MailDev: HTML emails (Thymeleaf) are captured locally — no real emails sent.

---

## 🎥 Demo

- Landing / Analyze
  - GIF: `ui/public/demo-analyze.gif`
  - Screenshot: `ui/public/screenshot-analyze.png`

- Results
  - GIF: `ui/public/demo-results.gif`
  - Screenshot: `ui/public/screenshot-results.png`

- Contact (MailDev inbox)
  - GIF: `ui/public/demo-maildev.gif`
  - Screenshot: `ui/public/screenshot-maildev.png`

Paste your files into `ui/public/` and update the filenames above. Example embeds:

```markdown
![Analyze](ui/public/screenshot-analyze.png)
![Results](ui/public/screenshot-results.png)
![MailDev](ui/public/screenshot-maildev.png)
```

---

## 🏗️ Architecture

- `ui/` — React + Vite + TypeScript SPA
  - Components: `AnalyzePage.tsx`, `ResultPage.tsx`, `ContactPage.tsx`, `Layout.tsx`
  - API client: `ui/src/lib/api.ts`
- `api/` — Spring Boot REST API (Java 21)
  - Controllers: `ResumeController`, `ContactController`
  - Services: `ResumeServiceImpl`, `ResumeAnalysisServiceImpl`, `ContactServiceImpl`
  - DTOs: `JobDescriptionRequest`, `ResumeAnalysisResponse`, `ContactMessageRequest`
  - AI: `AiConfig` + Spring AI (Ollama)
  - Email: `EmailService` (Thymeleaf), templates under `api/src/main/resources/templates/`
- `docker-compose.yml` — MailDev (SMTP capture + web inbox)

Data flow:
1. UI uploads resume + job description → `POST /api/resume/analyze`.
2. API extracts text (PDFBox/POI), calls Spring AI (Ollama), returns structured analysis.
3. UI contact form → `POST /api/contact` → API renders HTML email (Thymeleaf) → sent to MailDev.

---

## ✨ Features

- 📄 Resume parsing: PDF via Apache PDFBox, DOCX via Apache POI.
- 🤖 LLM analysis: Spring AI + Ollama (`mistral:latest` by default).
- 📬 Contact flow: Validated DTOs, async HTML email (Thymeleaf), and MailDev capture.
- 🔐 Clean separation: UI on 5173; API on 8080 with CORS.
- 🧪 Dev-first experience: No external email accounts needed.

---

## 🚀 Quickstart

Prereqs:
- Node 18+ and npm
- Java 21 and Maven
- Docker (for MailDev; optional for Ollama if you prefer containerized)

1) Start MailDev (captures emails — no real emails sent)

```bash
# From project root
docker compose up -d maildev
# Web UI → http://localhost:1080
# SMTP   → localhost:1025
```

2) Start the API (dev profile)

```bash
cd api
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
# API → http://localhost:8080
```

3) Start the UI

```bash
cd ui
npm install
npm run dev
# UI → http://localhost:5173
```

4) Use the app
- Analyze: upload resume + paste job description → score + tips.
- Contact: submit a message → check MailDev at http://localhost:1080.

---

## ⚙️ Configuration

Backend:
- `api/src/main/resources/application.yml`
  - Spring AI (Ollama):
    ```yaml
    spring:
      ai:
        ollama:
          base-url: http://localhost:11434
          chat:
            options:
              model: mistral:latest
    ```
- `api/src/main/resources/application-dev.yml` (Dev SMTP via MailDev):
  ```yaml
  spring:
    mail:
      host: localhost
      port: 1025
      username: ""
      password: ""
      properties:
        mail:
          smtp:
            auth: false
            starttls:
              enable: false
  app:
    contact:
      to: support@atsify.dev
  ```

Frontend:
- `ui/src/lib/api.ts`: `baseURL: "http://localhost:8080"`

---

## 📡 API Endpoints

- `POST /api/resume/analyze`
  - multipart/form-data
    - `file`: Resume file (PDF/DOCX)
    - `job`: JSON Blob `{ role: string; jobDescription: string }`
  - returns: `ResumeAnalysisResponse` (metrics, score, tips)

- `POST /api/contact`
  - JSON: `{ name: string; email: string; message: string }`
  - returns: `202 Accepted`

---

## 🗂 Notable Files

- Backend
  - `api/src/main/java/com/example/api/controller/ResumeController.java`
  - `api/src/main/java/com/example/api/controller/ContactController.java`
  - `api/src/main/java/com/example/api/service/impl/ResumeServiceImpl.java`
  - `api/src/main/java/com/example/api/service/impl/ResumeAnalysisServiceImpl.java`
  - `api/src/main/java/com/example/api/service/impl/ContactServiceImpl.java`
  - `api/src/main/java/com/example/api/email/EmailService.java`
  - `api/src/main/resources/templates/contact_message.html`
  - `api/pom.xml` — PDFBox, POI, Spring AI, Thymeleaf, Mail, Validation

- Frontend
  - `ui/src/components/AnalyzePage.tsx`, `ResultPage.tsx`, `ContactPage.tsx`
  - `ui/src/lib/api.ts`
  - `ui/src/main.tsx` (Toast container)

---

## 🧑‍💻 Development Notes

- Profiles
  - Dev: `-Dspring-boot.run.profiles=dev` → MailDev (no auth/TLS), safe local testing.
  - Prod: real SMTP (auth + STARTTLS/TLS) and set `app.contact.to` to your inbox.

- MailDev auth (optional)
  - Protect Web UI (1080):
    ```yaml
    environment:
      MAILDEV_WEB_USER: admin
      MAILDEV_WEB_PASS: supersecret
    ```
  - Require SMTP auth (for testing):
    ```yaml
    environment:
      MAILDEV_INCOMING_USER: ${TEST_MAIL_USERNAME}
      MAILDEV_INCOMING_PASS: ${TEST_MAIL_PASSWORD}
    ```
    And in Spring: set `spring.mail.username/password` and `mail.smtp.auth: true`.

- React event pooling
  - In `ContactPage.tsx`, capture `formEl` before `await` to safely call `formEl.reset()`.

---

## 🎯 Why This Matters

- **User impact**: Measurable guidance to bridge resume ↔ role requirements.
- **Modern stack**: Spring Boot 3 + React + Spring AI; clean separation of concerns.
- **Production mindset**: DTO validation, async emails, templating, profiles.
- **Developer experience**: One-command MailDev; fast local iteration; clear docs.

---

## 🪟 Runbook (Windows)

```powershell
# From project root
# 1) Start MailDev
docker compose up -d

# 2) Start API (dev)
cd api
mvn clean spring-boot:run -Dspring-boot.run.profiles=default

# 3) Start UI
cd ..\ui
npm install
npm run dev
```

---
