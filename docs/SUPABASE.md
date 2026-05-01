# 🗃️ Database Schema – Deejay Fishman

## 📌 Propósito

Definir la estructura de la base de datos para gestionar:

* Profiles (profiles) / Usuarios
* Roles (roles) / Roles de los perfiles
* Events (events) / Eventos Presentados
* Images Events (images_events) /Imagenes que contiene el evento
* Sponsor (sponsor) /Clientes - Pautas
* Sponsor Data (sponsor_data) / Datos de vistas y clics por los clientes

Este esquema soporta múltiples clientes que presentan visualizaciones y clics constantes

---

# 🧩 Entidades Principales

## 👤 profiles (Usuarios del sistema)

| Campo      | Tipo | Descripción             |
| ---------- | ---- | ----------------------- |
| id         | uuid | PK (Auth Supabase)      |
| full_name  | text | Nombre Usuario          |
| email      | text | Email del usuario       |
| avatar_url | text | Avatar                  |
| created_at | date | Fecha de creación       |
| role_id    | int8 | FK → roles              |

---

## 🛍️ events

| Campo       | Tipo    | Descripción           |
| ----------- | ------- | --------------------- |
| id          | int8    | PK                    |
| name        | text    | Nombre del evento     |
| description | text    | Descripción           |
| price       | numeric | Precio actual         |
| user_id     | uuid    | creador del evento    |
| views       | numeric | Vistas del Evento     |
| created_at  | date    | Fecha de creación     |
| date_event  | date    | Fecha del Evento      |

---

## 🖼️ images_events

| Campo      | Tipo | Descripción   |
| ---------- | ---- | ------------- |
| id         | int8 | PK            |
| event_id   | int8 | FK → events   |
| image_url  | text | URL imagen    |
| created_at | date | Fecha         |


---

## 👥 sponsor

| Campo         | Tipo      | Descripción     |
| ------------- | --------- | --------------- |
| id            | int8      | PK              |
| created_at    | date      | Fecha           |
| name          | text      | Nombre completo |
| description   | varchar   | Descripcion     |
| img_url       | text      | ruta imagen     |
| phone         | numeric   | Whatsapp        |
| instagram     | text      | Instagram       |
| facebook      | text      | Facebook        |
| address       | text      | Dirección       |
| status        | bool      | Estado          |


---

## 🧾 sponsor_data (Datos de la Pauta)

| Campo        | Tipo    | Descripción                     |
| ------------ | ------- | ------------------------------- |
| id           | int8    | PK                              |
| created_at   | date    | Fecha                           |
| updated_at   | date    | Fecha                           |
| views        | numeric | Vistas de la pauta              |
| phone_clics  | numeric | Clics para Whatsapp             |
| data_clics   | numeric | Clics para visualizar           |
| sponsor_id   | int8    | FK → sponsor                    |


---
