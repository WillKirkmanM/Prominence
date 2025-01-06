let audioContext = null;

// Initialize audio context on user interaction
document.getElementById('cutButton').addEventListener('click', async () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const file = document.getElementById('audioFile').files[0];
    if (file) {
        await cutAudio(file);
    }
});

// Enable button when file is selected
document.getElementById('audioFile').addEventListener('change', (e) => {
    document.getElementById('cutButton').disabled = !e.target.files.length;
});

async function loadAudio(file) {
    const arrayBuffer = await file.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

async function cutAudio(file) {
    const audioBuffer = await loadAudio(file);
    const cutPoints = [2.5, 5.5, 9.5]; // Time points in seconds
    
    const segments = [
        { start: 0, end: 2.5 },
        { start: 2.5, end: 6 },
        { start: 6, end: 10 },
        { start: 10, end: audioBuffer.duration }
    ];

    segments.forEach((segment, index) => {
        const segmentDuration = segment.end - segment.start;
        const segmentBuffer = new AudioBuffer({
            numberOfChannels: audioBuffer.numberOfChannels,
            length: Math.floor(segmentDuration * audioBuffer.sampleRate),
            sampleRate: audioBuffer.sampleRate
        });

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = new Float32Array(segmentBuffer.length);
            audioBuffer.copyFromChannel(channelData, channel, segment.start * audioBuffer.sampleRate);
            segmentBuffer.copyToChannel(channelData, channel);
        }

        // Convert buffer to WAV and save
        const wavBlob = audioBufferToWav(segmentBuffer);
        const url = URL.createObjectURL(wavBlob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `segment_${index + 1}.wav`;
        link.click();
    });
}

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const wav = new ArrayBuffer(44 + buffer.length * blockAlign);
    const view = new DataView(wav);
    
    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * blockAlign, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * blockAlign, true);

    // Write audio data
    const offset = 44;
    const data = new Float32Array(buffer.length);
    buffer.copyFromChannel(data, 0);
    
    for (let i = 0; i < buffer.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset + i * bytesPerSample, sample * 0x7FFF, true);
    }

    return new Blob([wav], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Usage example:
// cutAudio('./assets/audio/voice.mp3');