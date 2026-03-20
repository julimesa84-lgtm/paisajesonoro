// Estado global de la aplicación
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext();
let composition = {
  tracks: [],
  duration: 0
};
let audioCache = {};
let playingClips = [];
let isPlaying = false;
let startTime = 0;
let playbackOffset = 0;
let trackCount = 1;

// Obtener lista de audios del servidor
async function loadAudiosList() {
  try {
    const response = await fetch('/');
    const html = await response.text();
    const audioFiles = [];
    
    // Buscar archivos .wav en el HTML o usar lista conocida
    const wavFiles = ['Bus.wav', 'Bus2.wav', 'CUERDA1.WAV', 'Freno.wav', 'Freno2.wav', 
                     'Manguera.wav', 'Manguera2.wav', 'Manguera3.wav', 'Moto.wav', 'Moto2.wav',
                     'Moto3.wav', 'Moto4.wav', 'Moto5.wav', 'MotoEstereo.wav', 'Motor+freno.wav',
                     'Motor.wav', 'Motor2.wav', 'Motor3.wav', 'Motor4.wav', 'Motor5.wav',
                     'Motos.wav', 'Musica remontada.wav', 'Musica.wav', 'ObjArrastrado.wav',
                     'Pitos.wav', 'Pitos2.wav', 'Pitos3.wav', 'Pitos4.wav', 'Risa.wav',
                     'Ritmo.wav', 'Ritmo2.wav', 'Rueda.wav', 'Ruedas2.wav', 'Ruido.wav',
                     'Silbido.wav', 'Voces.wav', 'Voz.wav', 'Voz2.wav', 'Voz3.wav', 'Voz4.wav',
                     'campanita.wav', 'cuerdas.wav', 'cuerdas2.wav', 'gravepiano.wav', 'madera.wav', 'piano ex.wav'];
    
    updateAudiosList(wavFiles);
  } catch (error) {
    console.error('Error cargando audios:', error);
  }
}

// Estado para preview
let previewSource = null;
let currentPreview = null;

// Actualizar lista de audios en el DOM
function updateAudiosList(files, searchTerm = '') {
  const audiosList = document.getElementById('audiosList');
  const filtered = files.filter(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
  
  audiosList.innerHTML = filtered.map(file => `
    <div class="audio-item-wrapper">
      <div class="audio-item" draggable="true" data-audio="${file}">
        🔊 ${file}
      </div>
      <button class="preview-btn" data-audio="${file}" title="Reproducir preview">▶</button>
    </div>
  `).join('');
  
  // Agregar listeners de drag
  document.querySelectorAll('.audio-item').forEach(item => {
    item.addEventListener('dragstart', handleAudioDragStart);
  });
  
  // Agregar listeners de preview
  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPreview(btn.dataset.audio, btn);
    });
  });
}

// Reproducir preview de un audio
async function playPreview(audioFile, btnElement) {
  try {
    // Detener preview actual si existe
    if (previewSource) {
      try {
        previewSource.stop(0);
      } catch(e) {}
      previewSource = null;
    }
    
    // Cambiar estado del botón
    document.querySelectorAll('.preview-btn').forEach(btn => {
      btn.textContent = '▶';
      btn.classList.remove('playing');
    });
    
    // Si es el mismo botón, solo pausar
    if (currentPreview === audioFile) {
      currentPreview = null;
      return;
    }
    
    // Cargar audio si no está en cache
    if (!audioCache[audioFile]) {
      try {
        let response = await fetch(`/${audioFile}`);
        
        if (!response.ok) {
          response = await fetch(`/${audioFile.toLowerCase()}`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          throw new Error('Archivo vacío');
        }
        
        audioCache[audioFile] = await audioContext.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error('Error cargando preview:', error);
        alert('No se pudo cargar el audio para preview');
        return;
      }
    }
    
    // Reproducir preview
    const audioBuffer = audioCache[audioFile];
    previewSource = audioContext.createBufferSource();
    previewSource.buffer = audioBuffer;
    previewSource.connect(audioContext.destination);
    
    // Cambiar estado del botón
    btnElement.textContent = '⏸';
    btnElement.classList.add('playing');
    currentPreview = audioFile;
    
    previewSource.start(0);
    
    // Limpiar cuando termine
    previewSource.onended = () => {
      btnElement.textContent = '▶';
      btnElement.classList.remove('playing');
      currentPreview = null;
      previewSource = null;
    };
    
  } catch (error) {
    console.error('Error reproduciendo preview:', error);
    alert('Error reproduciendo preview: ' + error.message);
  }
}

// Crear pista inicial
function createInitialTrack() {
  const tracksContainer = document.getElementById('tracksContainer');
  const track = document.createElement('div');
  track.className = 'track';
  track.id = 'track-0';
  track.innerHTML = `
    <div class="track-header">Pista 1</div>
    <div class="track-content"></div>
  `;
  tracksContainer.appendChild(track);
  
  // Agregar listeners
  const trackContent = track.querySelector('.track-content');
  trackContent.addEventListener('dragover', onTrackDragOver);
  trackContent.addEventListener('dragleave', onTrackDragLeave);
  trackContent.addEventListener('drop', onTrackDrop);
  
  composition.tracks.push({ id: 'track-0', clips: [] });
}

// Crear nueva pista
function createTrack(trackNumber) {
  const tracksContainer = document.getElementById('tracksContainer');
  const track = document.createElement('div');
  track.className = 'track';
  track.id = `track-${trackNumber}`;
  track.innerHTML = `
    <div class="track-header">Pista ${trackNumber + 1}</div>
    <div class="track-content"></div>
  `;
  tracksContainer.appendChild(track);
  composition.tracks.push({ id: `track-${trackNumber}`, clips: [] });
  
  // Agregar listeners
  const trackContent = track.querySelector('.track-content');
  trackContent.addEventListener('dragover', onTrackDragOver);
  trackContent.addEventListener('dragleave', onTrackDragLeave);
  trackContent.addEventListener('drop', onTrackDrop);
}

// Añadir nueva pista
function addNewTrack() {
  const newTrackNumber = trackCount;
  createTrack(newTrackNumber);
  trackCount++;
  updateCompositionInfo();
}

// Drag and Drop handlers
function handleAudioDragStart(e) {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('audio', e.target.dataset.audio);
}

function onTracksContainerDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  document.getElementById('tracksContainer').classList.add('drag-over');
}

function onTracksContainerDragLeave(e) {
  if (e.target.id === 'tracksContainer') {
    document.getElementById('tracksContainer').classList.remove('drag-over');
  }
}

function onTrackDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  e.target.classList.add('drag-over');
}

function onTrackDragLeave(e) {
  e.target.classList.remove('drag-over');
}

function onTrackDrop(e) {
  e.preventDefault();
  e.target.classList.remove('drag-over');
  
  const audioFile = e.dataTransfer.getData('audio');
  const track = e.target.closest('.track');
  const trackId = track.id;
  
  // Calcular posición basada en X
  const rect = e.target.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  const position = Math.max(0, relativeX / 50); // 50px = 1 segundo
  
  loadAudioAndAddClip(audioFile, trackId, position);
}

// Cargar audio y agregar clip
async function loadAudioAndAddClip(audioFile, trackId, position) {
  try {
    if (!audioCache[audioFile]) {
      try {
        // Intentar cargar con el nombre exacto
        let response = await fetch(`/${audioFile}`);
        
        // Si no existe, intentar con diferentes variaciones
        if (!response.ok) {
          response = await fetch(`/${audioFile.toLowerCase()}`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} para ${audioFile}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          throw new Error(`Archivo vacío: ${audioFile}`);
        }
        
        try {
          audioCache[audioFile] = await audioContext.decodeAudioData(arrayBuffer);
        } catch (decodeError) {
          console.error(`Error decodificando ${audioFile}:`, decodeError);
          alert(`No se puede decodificar el audio: ${audioFile}`);
          return;
        }
      } catch (fetchError) {
        console.error(`Error descargando ${audioFile}:`, fetchError);
        alert(`No se pudo cargar el archivo: ${audioFile}`);
        return;
      }
    }
    
    const audioBuffer = audioCache[audioFile];
    const duration = audioBuffer.duration;
    
    addClipToTrack(trackId, audioFile, position, duration, audioBuffer);
    updateCompositionInfo();
  } catch (error) {
    console.error('Error cargando audio:', error);
    alert('Error: ' + error.message);
  }
}

// Agregar clip a la pista
function addClipToTrack(trackId, audioFile, position, duration, audioBuffer) {
  const track = document.getElementById(trackId);
  const trackContent = track.querySelector('.track-content');
  
  const clipId = 'clip-' + Date.now();
  const clip = document.createElement('div');
  clip.className = 'audio-clip';
  clip.id = clipId;
  clip.style.left = (position * 50) + 'px';
  clip.style.width = (duration * 50) + 'px';
  clip.innerHTML = `
    <span>${audioFile.replace('.wav', '').replace('.WAV', '')}</span>
    <div class="clip-handle"></div>
    <button class="clip-close">×</button>
  `;
  
  trackContent.appendChild(clip);
  
  // Guardar en composición
  const trackData = composition.tracks.find(t => t.id === trackId);
  if (trackData) {
    trackData.clips.push({
      id: clipId,
      file: audioFile,
      position,
      duration,
      buffer: audioBuffer
    });
  }
  
  // Actualizar duración total
  const maxDuration = Math.max(...composition.tracks.flatMap(t => 
    t.clips.map(c => c.position + c.duration)
  ));
  composition.duration = maxDuration;
  
  // Agregar listeners
  clip.addEventListener('click', () => selectClip(clipId));
  clip.querySelector('.clip-close').addEventListener('click', (e) => {
    e.stopPropagation();
    removeClip(clipId, trackId);
  });
  
  const handle = clip.querySelector('.clip-handle');
  handle.addEventListener('mousedown', (e) => startResize(e, clipId, trackId));
  
  clip.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('clip-close') || e.target.classList.contains('clip-handle')) return;
    startDrag(e, clipId, trackId);
  });
}

// Seleccionar clip
function selectClip(clipId) {
  document.querySelectorAll('.audio-clip').forEach(c => c.classList.remove('selected'));
  document.getElementById(clipId).classList.add('selected');
}

// Eliminar clip
function removeClip(clipId, trackId) {
  document.getElementById(clipId).remove();
  
  const trackData = composition.tracks.find(t => t.id === trackId);
  if (trackData) {
    trackData.clips = trackData.clips.filter(c => c.id !== clipId);
  }
  updateCompositionInfo();
}

// Arrastrar clip
let dragStartX, dragStartLeft;

function startDrag(e, clipId, trackId) {
  dragStartX = e.clientX;
  const clip = document.getElementById(clipId);
  dragStartLeft = parseInt(clip.style.left) || 0;
  
  function handleMouseMove(e) {
    const delta = e.clientX - dragStartX;
    const newLeft = Math.max(0, dragStartLeft + delta);
    clip.style.left = newLeft + 'px';
  }
  
  function handleMouseUp() {
    const newPosition = (parseInt(clip.style.left) / 50) || 0;
    const clipData = composition.tracks.find(t => t.id === trackId)
      ?.clips.find(c => c.id === clipId);
    if (clipData) clipData.position = newPosition;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    updateCompositionInfo();
  }
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

// Redimensionar clip
let resizeStartX, resizeStartWidth;

function startResize(e, clipId, trackId) {
  e.stopPropagation();
  resizeStartX = e.clientX;
  const clip = document.getElementById(clipId);
  resizeStartWidth = parseInt(clip.style.width) || 0;
  
  function handleMouseMove(e) {
    const delta = e.clientX - resizeStartX;
    const newWidth = Math.max(50, resizeStartWidth + delta);
    clip.style.width = newWidth + 'px';
  }
  
  function handleMouseUp() {
    const newDuration = (parseInt(clip.style.width) / 50) || 0;
    const clipData = composition.tracks.find(t => t.id === trackId)
      ?.clips.find(c => c.id === clipId);
    if (clipData) clipData.duration = newDuration;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    updateCompositionInfo();
  }
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

// Reproducción
function updatePlayhead() {
  if (!isPlaying) return;
  
  const currentTime = audioContext.currentTime - startTime;
  const position = currentTime * 50; // 50px = 1 segundo
  document.getElementById('playhead').style.left = position + 'px';
  
  // Actualizar tiempo actual
  const seconds = Math.floor(currentTime);
  const minutes = Math.floor(seconds / 60);
  document.getElementById('currentTime').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  
  // Detener si superamos la duración
  if (currentTime > composition.duration) {
    stop();
    return;
  }
  
  requestAnimationFrame(updatePlayhead);
}

function play() {
  if (isPlaying) return;
  
  // Resume desde el offset actual o desde el principio
  const startPosition = playbackOffset;
  isPlaying = true;
  startTime = audioContext.currentTime - startPosition;
  
  // Reproducir clips que deben sonar ahora
  composition.tracks.forEach(track => {
    track.clips.forEach(clip => {
      const clipStart = clip.position;
      const clipEnd = clip.position + clip.duration;
      
      // Solo reproducir clips que están dentro del rango de reproducción
      if (clipEnd > startPosition && clipStart < composition.duration) {
        const source = audioContext.createBufferSource();
        source.buffer = clip.buffer;
        source.connect(audioContext.destination);
        
        // Calcular offset dentro del clip
        const offsetInClip = Math.max(0, startPosition - clipStart);
        const startTime_internal = Math.max(0, clipStart - startPosition);
        
        // Iniciar el clip
        source.start(audioContext.currentTime + startTime_internal, offsetInClip);
        playingClips.push(source);
      }
    });
  });
  
  updatePlayhead();
}

function pause() {
  if (!isPlaying) return;
  isPlaying = false;
  playbackOffset = audioContext.currentTime - startTime;
  
  // Detener todos los clips
  playingClips.forEach(clip => {
    try {
      clip.stop(0);
    } catch(e) {}
  });
  playingClips = [];
}

function stop() {
  isPlaying = false;
  playingClips.forEach(clip => {
    try {
      clip.stop(0);
    } catch(e) {}
  });
  playingClips = [];
  playbackOffset = 0;
  document.getElementById('playhead').style.left = '0px';
  document.getElementById('currentTime').textContent = '00:00';
}

// Hacer click en la línea de tiempo para posicionar el playhead
function seek(time) {
  playbackOffset = time;
  if (isPlaying) {
    pause();
    play();
  } else {
    document.getElementById('playhead').style.left = (time * 50) + 'px';
  }
}

// Información de composición
function updateCompositionInfo() {
  const totalDuration = Math.ceil(composition.duration);
  const totalClips = composition.tracks.reduce((sum, t) => sum + t.clips.length, 0);
  const totalTracks = composition.tracks.length;
  
  document.getElementById('compositionInfo').textContent = 
    `Duración: ${totalDuration}s | Audios: ${totalClips} | Pistas: ${totalTracks}`;
}

// Exportar composición
function exportComposition() {
  const data = {
    title: 'Uniendo Sedes a través del Paisaje Sonoro',
    duration: composition.duration,
    tracks: composition.tracks.map(t => ({
      id: t.id,
      clips: t.clips.map(c => ({
        file: c.file,
        position: c.position,
        duration: c.duration
      }))
    }))
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'composicion-paisaje-sonoro.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Importar composición
function importComposition() {
  document.getElementById('importFile').click();
}

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const json = await file.text();
    const data = JSON.parse(json);
    
    // Limpiar composición actual
    clearComposition();
    
    // Restaurar tracks
    data.tracks.forEach((trackData, index) => {
      if (index === 0) {
        // Usar track inicial
      } else {
        createTrack(index);
      }
      
      // Restaurar clips
      trackData.clips.forEach(async (clipData) => {
        await loadAudioAndAddClip(clipData.file, `track-${index}`, clipData.position);
      });
    });
  } catch (error) {
    console.error('Error importando:', error);
    alert('Error al importar composición');
  }
});

// ========== MOBILE MENU ========== 
let mobilePanelOpen = false;

function toggleMobilePanel() {
  const audioPanel = document.getElementById('audioPanel');
  const overlay = document.getElementById('panelOverlay');
  
  if (mobilePanelOpen) {
    audioPanel.classList.remove('open');
    overlay.classList.remove('open');
    mobilePanelOpen = false;
  } else {
    audioPanel.classList.add('open');
    overlay.classList.add('open');
    mobilePanelOpen = true;
  }
}

function closeMobilePanel() {
  const audioPanel = document.getElementById('audioPanel');
  const overlay = document.getElementById('panelOverlay');
  
  audioPanel.classList.remove('open');
  overlay.classList.remove('open');
  mobilePanelOpen = false;
}

// Limpiar composición
function clearComposition() {
  stop();
  document.getElementById('tracksContainer').innerHTML = '';
  composition = { tracks: [], duration: 0 };
  trackCount = 1;
  createInitialTrack();
  updateCompositionInfo();
}

// Event listeners
document.getElementById('playBtn').addEventListener('click', play);
document.getElementById('pauseBtn').addEventListener('click', pause);
document.getElementById('stopBtn').addEventListener('click', stop);
document.getElementById('addTrackBtn').addEventListener('click', addNewTrack);
document.getElementById('exportBtn').addEventListener('click', exportComposition);
document.getElementById('importBtn').addEventListener('click', importComposition);
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('¿Estás seguro de que quieres limpiar toda la composición?')) {
    clearComposition();
  }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const wavFiles = ['Bus.wav', 'Bus2.wav', 'CUERDA1.WAV', 'Freno.wav', 'Freno2.wav', 
                   'Manguera.wav', 'Manguera2.wav', 'Manguera3.wav', 'Moto.wav', 'Moto2.wav',
                   'Moto3.wav', 'Moto4.wav', 'Moto5.wav', 'MotoEstereo.wav', 'Motor+freno.wav',
                   'Motor.wav', 'Motor2.wav', 'Motor3.wav', 'Motor4.wav', 'Motor5.wav',
                   'Motos.wav', 'Musica remontada.wav', 'Musica.wav', 'ObjArrastrado.wav',
                   'Pitos.wav', 'Pitos2.wav', 'Pitos3.wav', 'Pitos4.wav', 'Risa.wav',
                   'Ritmo.wav', 'Ritmo2.wav', 'Rueda.wav', 'Ruedas2.wav', 'Ruido.wav',
                   'Silbido.wav', 'Voces.wav', 'Voz.wav', 'Voz2.wav', 'Voz3.wav', 'Voz4.wav',
                   'campanita.wav', 'cuerdas.wav', 'cuerdas2.wav', 'gravepiano.wav', 'madera.wav', 'piano ex.wav'];
  updateAudiosList(wavFiles, e.target.value);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  // ========== MOBILE MENU SETUP ========== 
  const togglePanelBtn = document.getElementById('togglePanelBtn');
  const closePanelBtn = document.getElementById('closePanelBtn');
  const panelOverlay = document.getElementById('panelOverlay');
  const audioPanel = document.getElementById('audioPanel');
  
  if (togglePanelBtn) {
    togglePanelBtn.addEventListener('click', toggleMobilePanel);
  }
  
  if (closePanelBtn) {
    closePanelBtn.addEventListener('click', closeMobilePanel);
  }
  
  if (panelOverlay) {
    panelOverlay.addEventListener('click', closeMobilePanel);
  }
  
  // Cerrar panel al seleccionar un audio
  const audioItems = document.querySelectorAll('.audio-item');
  audioItems.forEach(item => {
    item.addEventListener('dragstart', () => {
      closeMobilePanel();
    });
  });
  
  const tracksContainer = document.getElementById('tracksContainer');
  tracksContainer.addEventListener('dragover', onTracksContainerDragOver);
  tracksContainer.addEventListener('dragleave', onTracksContainerDragLeave);
  tracksContainer.addEventListener('drop', onTrackDrop);
  
  // Click en la línea de tiempo para posicionar el playhead
  const timeline = document.querySelector('.timeline');
  timeline.addEventListener('click', (e) => {
    if (e.target === timeline || e.target.id === 'tracksContainer') {
      const rect = timeline.getBoundingClientRect();
      const x = e.clientX - rect.left + timeline.scrollLeft;
      const time = x / 50; // 50px = 1 segundo
      seek(time);
    }
  });
  
  createInitialTrack();
  loadAudiosList();
  updateCompositionInfo();
});
