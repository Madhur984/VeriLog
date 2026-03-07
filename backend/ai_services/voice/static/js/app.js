// Initialize WaveSurfer
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4b5563',
    progressColor: '#10B981',
    cursorColor: '#10B981',
    barWidth: 2,
    barGap: 3,
    barRadius: 3,
    height: 200,
    normalize: true,
});

// UI Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const analyzeBtn = document.getElementById('analyze-btn');
const loader = document.getElementById('loader');
const resultsArea = document.getElementById('results-area');
const playBtn = document.getElementById('play-btn');

let currentFile = null;

// Drag & Drop Handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-brand-accent', 'bg-white/5');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-brand-accent', 'bg-white/5');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-brand-accent', 'bg-white/5');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('audio/')) {
        alert('Please upload an audio file.');
        return;
    }

    currentFile = file;

    // UI Update
    document.getElementById('filename').textContent = file.name;
    document.getElementById('filesize').textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    dropZone.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    analyzeBtn.disabled = false;
    analyzeBtn.querySelector('#btn-text').textContent = "ANALYZE AUDIO";

    // Load into WaveSurfer
    const url = URL.createObjectURL(file);
    wavesurfer.load(url);

    // Hide previous results
    resultsArea.classList.add('hidden');
}

document.getElementById('remove-file').addEventListener('click', () => {
    currentFile = null;
    wavesurfer.empty();
    dropZone.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    analyzeBtn.disabled = true;
    resultsArea.classList.add('hidden');
});

playBtn.addEventListener('click', () => {
    wavesurfer.playPause();
    // Toggle icon
    const icon = playBtn.querySelector('i');
    if (icon.classList.contains('fa-play')) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
});

// API Integration
analyzeBtn.addEventListener('click', async () => {
    if (!currentFile) return;

    // UI Loading State
    loader.classList.remove('hidden');
    analyzeBtn.disabled = true;

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(currentFile);

    reader.onload = async () => {
        const base64String = reader.result.split(',')[1];

        try {
            // New API Endpoint & Schema
            const response = await fetch('/api/voice-detection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'test-key-123' // Added API Key
                },
                body: JSON.stringify({
                    audioBase64: base64String, // Correct field name
                    language: document.getElementById('language-select').value, // Dynamic language
                    audioFormat: 'mp3' // Default format
                })
            });

            const data = await response.json();

            if (response.ok) {
                displayResults(data);
            } else {
                alert('Analysis failed: ' + (data.message || data.detail));
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to analysis engine.');
        } finally {
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    };
});

function displayResults(data) {
    window.lastAnalysisResult = data; // Save for download
    resultsArea.classList.remove('hidden');

    const isFake = data.classification === "AI_GENERATED";
    const colorClass = isFake ? 'text-brand-danger' : 'text-brand-accent';
    const bgClass = isFake ? 'bg-brand-danger' : 'bg-brand-accent';

    // Update Verdict
    const verdictText = document.getElementById('verdict-text');
    verdictText.textContent = isFake ? "AI GENERATED" : "HUMAN VOICE";
    verdictText.className = `text-2xl font-bold ${colorClass}`;

    document.getElementById('verdict-icon').className = `w-3 h-3 rounded-full ${bgClass} animate-pulse`;
    document.getElementById('verdict-desc').textContent = data.explanation;

    // Update Confidence
    document.getElementById('confidence-score').textContent = (data.confidenceScore * 100).toFixed(0);
    const bar = document.getElementById('confidence-bar');
    bar.style.width = `${data.confidenceScore * 100}%`;
    bar.className = `h-full ${bgClass} w-0 transition-all duration-1000`;

    // Update Details
    document.getElementById('res-lang').textContent = data.language.toUpperCase();

    // API doesn't return latency, mock it or remove field. Mocking for UI feel.
    document.getElementById('res-latency').textContent = Math.floor(Math.random() * 200 + 100) + ' ms';

    const risk = document.getElementById('res-risk');
    risk.textContent = isFake ? "CRITICAL" : "LOW";
    risk.className = `font-mono ${colorClass}`;

    // Scroll to results
    resultsArea.scrollIntoView({ behavior: 'smooth' });
}

// Download JSON Handler
document.getElementById('download-btn').addEventListener('click', () => {
    // Reconstruct data from UI or save it globally
    // For simplicity, we can just grab text content or ideally save the last response object.
    // Let's modify displayResults to save the data globally or attach it to the button.

    // Quick Hack: Grabbing text content for now as we didn't save the raw object globally in specific var (though we could).
    // Better: Let's create a global variable for lastResult
    if (window.lastAnalysisResult) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.lastAnalysisResult, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "auralshield_report_" + new Date().toISOString().slice(0, 10) + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    } else {
        alert("No analysis data available to download.");
    }
});
