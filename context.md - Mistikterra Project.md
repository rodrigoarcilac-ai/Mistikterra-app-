# **Mistikterra — Documento de Contexto y Especificación de Proyecto**

**Proyecto:** Aplicación y Plataforma Web de Turismo Espiritual & Esotérico Premium  
**Marca:** Mistikterra — Awakening Experiences  
**Público Objetivo:** Clientes del sector premium/lujo, predominantemente mayores de 40 años.

## **1\. Resumen Ejecutivo y Misión**

Mistikterra ofrece experiencias de viaje espirituales y esotéricas de alto nivel. La aplicación busca resolver la fricción logística en tiempo real durante los viajes (itinerarios, cambios imprevistos, puntos de encuentro), brindando una experiencia visual refinada, sobria y extremadamente legible y accesible.

## **2\. Identidad Visual y Sistema de Diseño (UI/UX)**

| Elemento | Especificación | Justificación / Aplicación |
| :---- | :---- | :---- |
| **Color Primario de Fondo** | Charcoal Profundo / Negro Noche (\#121212 o \#1E1C1A) | Elegancia, misticismo y menor fatiga visual. |
| **Color de Acento** | Dorado Champán / Oro Místico (\#D4AF37 o \#C5A880) | Reflejo del logotipo; utilizado en bordes finos, iconos y llamadas a la acción. |
| **Color de Texto Primario** | Blanco Cálido / Marfil (\#F5F5F0) | Máximo contraste accesible sobre fondos oscuros para usuarios mayores de 40 años. |
| **Tipografía de Títulos** | Cinzel / Cormorant Garamond / Playfair Display | Estética clásica, ceremonial, refinada y esotérica de lujo. |
| **Tipografía de Lectura** | Inter / Montserrat / Lato (16px a 18px base) | Alta legibilidad en textos informativos, horarios y direcciones. |

## **3\. Alcance Funcional por Fases**

### **Fase 1: MVP Logístico (Núcleo Esencial)**

> * **Autenticación Sencilla:** Acceso por número de teléfono (código SMS) o enlace mágico por correo, evitando contraseñas complejas.  
> * **Punto de Encuentro Activo:** Módulo principal destacado con cuenta regresiva, dirección, mapa de acceso rápido y botón de confirmación.  
> * **Itinerario Diario y Modo Offline:** Consulta de la agenda del día sin depender de conexión constante a datos móviles.  
> * **Panel de Control para la Guía:** Interfaz simplificada para que la anfitriona emita alertas prioritarias y actualice ubicaciones en un solo toque.

### **Fase 2: Experiencia y Conexión**

> * **Guía de Destino y Recomendaciones:** Sugerencias de sitios sagrados, miradores, tiendas esotéricas y gastronomía para tiempos libres.  
> * **Canal de Comunicados Oficiales:** Tablero unidireccional de avisos importantes.  
> * **Botón de Asistencia Directa:** Enlace rápido de contacto para emergencias o soporte personalizado.

### **Fase 3: Gestión Administrativa y Financiera**

> * **Módulo de Saldos:** Visualización clara y privada de estados de cuenta, abonos realizados y pagos pendientes del paquete de viaje.

## **4\. Arquitectura Tecnológica Sugerida**

> * **Frontend:** React (con Vite) para plataforma web / React Native (Expo) para aplicaciones móviles iOS y Android.  
> * **Backend y Base de Datos:** Firebase (Cloud Firestore, Authentication, Cloud Storage) bajo capa gratuita Spark.  
> * **Estilos:** Tailwind CSS con paleta personalizada de dorados y negros o CSS Modules.  
> * **Control de Versiones:** Repositorio en GitHub con despliegues automatizados (Vercel / Netlify).