#Descripción del Proyecto
Pagina Web con el Perfil de Deejay Fishman, un DJ Crosover con grande cobertura y amplia experiencia, en el sitio encontraremos eventos y noticias que pueden compartir por todos los medios y redes sociales


#Agents Rules
-   Cada función nueva debe incluir una línea de comentario encima en Español.
-   Todas las variables y funciones deben escribirse en camelCase
-   No uses snake_case
-   Trabajar todas las acciones y getters con stores, en la carpeta store
-   Folder /stores, se cargan los nuevos stores creados

## Características Implementadas
- Publicaciones de Eventos para compartir por WhastApp y redes sociales
- Publicaciones de Noticias para compartir por WhastApp y redes sociales


### Tablas Supabase
- Profiles (profiles) / Usuarios
- Eventos (events) / Eventos Temporales, con fecha del evento
- Imagenes Eventos (images_events) / Galeria de imagenes de los eventos
- News (news) / Noticias sobre deejays y demás temas por el administrador
- Imagenes Noticias  (images_news) / Categorías de las propiedades, Apartamento, Casa, Finca, Lote, Local
- Status (status) / Estado de los eventos
- Vistas Eventos (event_views ) / Vistas de los eventos
- Vistas Noticias (news_views ) / Vistas de las Noticias


### Funcionalidades Principales

- **Autenticación y gestión de usuarios** 
- **Gestión de Noticias** con CRUD completo solo admin
- **Gestión de Eventos** con CRUD completo solo admin


### Funcionalidades Especificas

- **Usuario Admin (role_id: 1)**
	-- Crea y edita de Eventos con el CRUD completo
	-- Crea y edita de Noticias con el CRUD completo


###  Módulos Implementados

1. **Autenticación** - Login, registro y gestión de perfiles
2. **Gestión de Noticias** con CRUD completo solo admin
3. **Gestión de Eventos** con CRUD completo solo admin

##  Stack Tecnológico

- **Frontend**: Nuxt 3 - Dark Mode
- **Rendering**: SSR
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Estado**: Pinia
- **Base de Datos Local**: IndexedDB
- **PWA**: Workbox (configurado)