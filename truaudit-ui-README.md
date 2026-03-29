# TruAudit Pro — Frontend

React-based user interface for TruAudit Pro, a compliance audit management application built for organizations operating under the AS9100D / ISO 9001 quality management standard.

## Purpose

This repository contains the client-side application. It provides the interface through which two user types interact with the system:

- **Auditors** — log audits, submit results, and post improvement recommendations
- **QMS Managers** — review audit results, resolve corrective actions, and address recommendations

## Role in the Application

This project is the frontend layer only. It communicates with the TruAudit Pro REST API (`truaudit-api`) over HTTP, sending and receiving JSON. All business logic and data persistence are handled by the API — this project is responsible for presenting data and capturing user input.

## Pages (MVP)

- Login
- Log Audit
- Dashboard
- Results (with filtering)
- Recommendations

## Tech Stack

- React
- TypeScript
- CSS (see `/design/truaudit-style-guide.html` for style guide)

## Design Documents

The `/design` folder contains:

- `truaudit-style-guide.html` — colors, typography, components, and form elements
