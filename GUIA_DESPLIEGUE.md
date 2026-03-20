# 📢 GUÍA DE DESPLIEGUE PÚBLICO

## ✨ Tu aplicación será accesible desde cualquier celular del mundo

---

## 🎯 OPCIÓN 1: VERCEL (RECOMENDADA)

### ¿Por qué Vercel?
- ✅ Gratis para proyectos públicos
- ✅ Solo 3 clicks para desplegar
- ✅ URL pública automática
- ✅ Muy rápido
- ✅ Actualizaciones automáticas con cada push a GitHub

### PASOS PASO A PASO:

#### PASO 1: Sube tu código a GitHub
```bash
git add .
git commit -m "Paisaje sonoro app lista para producción"
git push origin main
```

#### PASO 2: Crea una cuenta Vercel
1. Abre https://vercel.com
2. Click en "Sign Up"
3. Elige "Continue with GitHub"
4. Autoriza Vercel para acceder a GitHub
5. GitHub te pedirá contraseña - ingresa tu contraseña de GitHub

#### PASO 3: Importa tu proyecto
1. En Vercel, click en "Add New..."
2. Elige "Project"
3. Click en "Import Git Repository"
4. Busca "paisajesonoro" en la lista
5. Click en "Import"

#### PASO 4: Configura el proyecto
- **Project Name**: paisajesonoro (o el que quieras)
- **Framework Preset**: Other (Node.js)
- **Environment**: Dejar en blanco
- Click en "Deploy"

#### PASO 5: ¡Espera 2-3 minutos!
Vercel compilará y desplegará tu app. Cuando termine, te mostrará la URL pública.

**Tu URL será algo como:**
```
https://paisajesonoro.vercel.app
```

### Accede desde tu celular:
1. Abre tu celular
2. Ve a: `https://paisajesonoro.vercel.app`
3. ¡Listo! Tu app está funcionando

---

## 🚂 OPCIÓN 2: RAILWAY

### ¿Por qué Railway?
- ✅ Muy fácil para Node.js
- ✅ Gratis los primeros $5 de crédito
- ✅ UI muy sencilla
- ✅ Soporte en español

### PASOS:

1. Abre https://railway.app
2. Click en "Start a New Project"
3. Click en "Deploy from GitHub repo"
4. Autoriza Railway en GitHub
5. Selecciona "paisajesonoro"
6. Railway detectará Node.js automáticamente
7. Click en "Deploy"

**Tu URL será algo como:**
```
https://paisajesonoro.up.railway.app
```

---

## 🎨 OPCIÓN 3: RENDER

### PASOS:

1. Abre https://render.com
2. Regístrate o inicia sesión
3. Click en "New +"
4. Selecciona "Web Service"
5. "Connect a repository"
6. Autoriza Render en GitHub
7. Selecciona "paisajesonoro"
8. Establece:
   - **Name**: paisajesonoro
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
9. Click en "Create Web Service"

**Tu URL será algo como:**
```
https://paisajesonoro.onrender.com
```

---

## 📱 COMPARTIR TU APP

Una vez desplegada, puedes compartir:

### Con amigos:
```
"Mira mi app de paisaje sonoro: https://paisajesonoro.vercel.app"
```

### Con QR (escaneable desde celular):
Cualquiera de estas plataformas (Vercel, Railway, Render) 
te permite generar un código QR automáticamente en su dashboard.

### Características que verán:
- ✅ Pueden arrastrar audios a la línea de tiempo
- ✅ Pueden reproducir las composiciones
- ✅ Pueden agregar más pistas
- ✅ Pueden descargar sus creaciones
- ✅ Funciona en cualquier celular (iOS, Android)
- ✅ Funciona en tablet y desktop también

---

## 🔄 ACTUALIZAR LA APP

Cada vez que hagas cambios en tu código:

```bash
# Haz tus cambios en los archivos

# Sube a GitHub
git add .
git commit -m "Descripción del cambio"
git push origin main
```

**Vercel/Railway/Render se actualizarán automáticamente** 
en 1-2 minutos.

---

## 🆘 PROBLEMAS COMUNES

### "No funciona el audio"
- Asegúrate de que `server.js` está sirviendo los archivos .wav
- Comprueba que todos los .wav están en `/workspaces/paisajesonoro/`

### "Error 502 o 503"
- Espera 5 minutos
- Recarga la página
- Si persiste, revisa los logs en el dashboard

### "La app es muy lenta"
- Usa Vercel (es más rápido)
- Considera usar CDN de audios en el futuro

---

## 📊 COMPARACIÓN DE PLATAFORMAS

| Característica | Vercel | Railway | Render |
|---|---|---|---|
| Facilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Precio | Gratis | $5 crédito | Gratis con límites |
| Velocidad | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ |
| Soporte | Excelente | Bueno | Bueno |
| GitHub integración | Automática | Manual | Manual |

---

## ✅ CHECKLIST ANTES DE DESPLEGAR

- [ ] Código subido a GitHub
- [ ] `package.json` actualizado
- [ ] `server.js` funcionando localmente
- [ ] `vercel.json` en la raíz del proyecto
- [ ] Todos los .wav en el directorio principal
- [ ] Probaste en `http://localhost:8000`

---

**¡Listo! Ahora tu app estará disponible para todo el mundo 🌍**

Cualquier persona con la URL podrá:
- Crear composiciones
- Descargarlas
- Usar la app sin instalar nada

¿Te funciona? Comparte la URL con más gente. 😊
