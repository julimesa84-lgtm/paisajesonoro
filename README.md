# 🎵 Uniendo Sedes a través del Paisaje Sonoro

**Fundación Universitaria Bellas Artes - Semillero de Investigación Creación en Música. 2026**

Contenido grabado y creado por Juliana Mesa y estudiantes de la Fundación Universitaria Bellas Artes.

## 📋 Descripción

Aplicación web para editar composiciones de paisajes sonoros. Permite:
- 🎧 Arrastrar y soltar audios en una línea de tiempo visual
- 🎚️ Organizar múltiples pistas de audio
- ▶️ Reproducir composiciones completas
- 📥 Importar/exportar composiciones
- 📱 Totalmente responsive (funciona en móviles)

## 🚀 Despliegue

### Opción 1: Vercel (RECOMENDADO - Más Fácil)

#### Pasos:

1. **Crea una cuenta en Vercel:**
   - Ve a https://vercel.com
   - Click en "Sign Up"
   - Selecciona "Continue with GitHub"

2. **Conecta tu repositorio:**
   - Vercel te pedirá acceso a GitHub
   - Selecciona el repositorio `paisajesonoro`

3. **Vercel autodetectará la configuración:**
   - Framework: Node.js
   - Build Command: `npm install`
   - Output Directory: (déjalo vacío)

4. **Click en "Deploy"**

¡Listo! Tu aplicación tendrá una URL pública como: `https://paisajesonoro.vercel.app`

### Opción 2: Railway (FÁCIL)

1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Selecciona "Deploy from GitHub"
4. Elige el repositorio `paisajesonoro`
5. Railway detectará que es Node.js y desplegará automáticamente

### Opción 3: Render

1. Ve a https://render.com
2. Click en "New +"
3. Selecciona "Web Service"
4. Conecta tu repositorio de GitHub
5. Ambiente: Node
6. Build Command: `npm install`
7. Start Command: `node server.js`

## 💻 Desarrollo Local

### Requisitos:
- Node.js 14+ instalado

### Pasos:

```bash
# Clonar/descargar el proyecto
cd paisajesonoro

# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Abre en tu navegador
http://localhost:8000
```

## 📱 Acceso desde Móvil

Una vez desplegado, accede desde tu celular usando:

**URL pública de Vercel/Railway/Render**

Ejemplos:
- `https://paisajesonoro.vercel.app`
- `https://paisajesonoro.up.railway.app`
- `https://paisajesonoro.onrender.com`

## 🎯 Características

- **Drag & Drop**: Arrastra audios a la línea de tiempo
- **Múltiples pistas**: Crea cuantas pistas necesites
- **Reproducción sincronizada**: Escucha aunque sea correctamente
- **Preview de audios**: Escucha cada audio antes de agregarlo
- **Exportar/importar**: Guarda y carga tus composiciones
- **Responsive**: Funciona perfecto en móviles, tablets y desktop
- **Búsqueda**: Encuentra rápidamente los audios que necesitas

## 📂 Estructura de Archivos

```
paisajesonoro/
├── index.html          # Interfaz HTML
├── style.css          # Estilos responsive
├── app.js             # Lógica de la aplicación
├── server.js          # Servidor Node.js
├── vercel.json        # Configuración de Vercel
├── package.json       # Dependencias
├── *.wav              # Archivos de audio
└── README.md          # Este archivo
```

## 🔊 Audios Disponibles

La aplicación incluye 43 archivos de audio:
- Transportación (motos, buses, frenos)
- Sonidos mecánicos (motores, ruedas)
- Sonidos de objetos (pitidos, silbidos)
- Voz y risa
- Instrumentos musicales (cuerdas, piano, gravedad)
- Y más...

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Audio**: Web Audio API
- **Backend**: Node.js + Express
- **Deployment**: Vercel / Railway / Render

## 📄 Licencia

Copyright © 2026 - Fundación Universitaria Bellas Artes

## ✨ Autor

Compilado por Juliana Mesa Jaramillo
Semillero de Investigación Creación en Música

---

**¿Preguntas?** Abre un issue en GitHub

