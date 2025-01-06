
  /**
   * Handles audio segment playback and management
   */
  class DialogAudioManager {
    constructor() {
      this._segments = new Map();
      this._isPlaying = false;
      this._currentSegment = null;
    }
  
    // Getters/setters
    get isPlaying() { return this._isPlaying; }
    
    // Load audio segments
    registerSegment(id, audioElement) {
      this._segments.set(id, audioElement);
    }
  
    // Play specific segment with callback
    playSegment(number, onComplete) {
      if (this._isPlaying) return false;
  
      const segment = this._segments.get(number);
      if (!segment) return false;
  
      this._isPlaying = true;
      this._currentSegment = segment;
      
      segment.play();
      segment.onended(() => this._handleSegmentComplete(onComplete));
      
      return true;
    }
  
    // Private methods
    _handleSegmentComplete(callback) {
      this._isPlaying = false;
      this._currentSegment = null;
      if (callback) callback();
    }
  }
  