const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8000;

// Middleware para servir archivos estáticos con búsqueda case-insensitive
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  const ext = path.extname(filePath).toLowerCase();
  
  // Si es un archivo de audio
  if (['.wav', '.mp3', '.ogg'].includes(ext)) {
    // Intentar encontrar el archivo con cualquier caso
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    
    try {
      const files = fs.readdirSync(dir);
      const match = files.find(f => f.toLowerCase() === fileName.toLowerCase());
      
      if (match) {
        const actualPath = path.join(dir, match);
        return res.sendFile(actualPath);
      }
    } catch (err) {
      console.error('Error buscando archivo:', err);
    }
  }
  
  next();
});

app.use(express.static(__dirname));
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/export', (req, res) => {
  const composition = req.body;
  res.json({ success: true, message: 'Composición lista para descargar' });
});

app.listen(PORT, () => {
  console.log(`🎵 Servidor corriendo en http://localhost:${PORT}`);
});
