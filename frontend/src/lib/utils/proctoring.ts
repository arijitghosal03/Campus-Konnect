'use client';

export class ProctoringService {
  private mediaStream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private detectionInterval: NodeJS.Timeout | null = null;
  private tabSwitchCount = 0;
  private onViolation: (violation: any) => void = () => {};

  constructor(onViolationCallback: (violation: any) => void) {
    this.onViolation = onViolationCallback;
    this.setupEventListeners();
  }

  async initializeCamera(): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.mediaStream;
      this.videoElement.autoplay = true;
      this.videoElement.muted = true;

      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 480;
      this.context = this.canvas.getContext('2d');

      return true;
    } catch (error) {
      console.error('Failed to initialize camera:', error);
      this.recordViolation('camera_init_failed', 'Failed to initialize camera access');
      return false;
    }
  }

  startFaceDetection(): void {
    if (!this.videoElement || !this.canvas || !this.context) return;

    this.detectionInterval = setInterval(() => {
      this.detectFace();
    }, 2000);
  }

  private detectFace(): void {
    if (!this.videoElement || !this.canvas || !this.context) return;

    try {
      this.context.drawImage(this.videoElement, 0, 0, 640, 480);
      const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
      
      // Simulate face detection (in real implementation, use ML models)
      const faceDetected = this.simulateFaceDetection(imageData);
      
      if (!faceDetected) {
        this.recordViolation('no_face_detected', 'No face detected in camera feed');
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }

  private simulateFaceDetection(imageData: string): boolean {
    // In a real implementation, this would use TensorFlow.js or similar
    // For demo purposes, randomly return true/false
    return Math.random() > 0.1; // 90% chance of face being detected
  }

  takeScreenshot(): string | null {
    if (!this.canvas || !this.context || !this.videoElement) return null;
    
    this.context.drawImage(this.videoElement, 0, 0, 640, 480);
    return this.canvas.toDataURL('image/jpeg', 0.8);
  }

  private setupEventListeners(): void {
    // Tab switch detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.tabSwitchCount++;
        this.recordViolation('tab_switch', `Tab switched away from exam (Count: ${this.tabSwitchCount})`);
      }
    });

    // Window focus detection
    window.addEventListener('blur', () => {
      this.recordViolation('window_focus_lost', 'Window lost focus');
    });

    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.recordViolation('right_click_attempt', 'Attempted to open context menu');
    });

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isProhibitedKeyCombo(e)) {
        e.preventDefault();
        this.recordViolation('prohibited_shortcut', `Attempted prohibited shortcut: ${this.getKeyCombo(e)}`);
      }
    });

    // Prevent copy-paste
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      this.recordViolation('copy_attempt', 'Attempted to copy content');
    });

    document.addEventListener('paste', (e) => {
      e.preventDefault();
      this.recordViolation('paste_attempt', 'Attempted to paste content');
    });

    // Detect developer tools
    let devtools = { open: false, orientation: null };
    setInterval(() => {
      if (this.isDevToolsOpen()) {
        if (!devtools.open) {
          devtools.open = true;
          this.recordViolation('devtools_opened', 'Developer tools were opened');
        }
      } else {
        devtools.open = false;
      }
    }, 1000);
  }

  private isProhibitedKeyCombo(e: KeyboardEvent): boolean {
    const prohibited = [
      { key: 'F12' },
      { key: 'F5' },
      { key: 'r', ctrl: true },
      { key: 'R', ctrl: true },
      { key: 'i', ctrl: true, shift: true },
      { key: 'I', ctrl: true, shift: true },
      { key: 'j', ctrl: true, shift: true },
      { key: 'J', ctrl: true, shift: true },
      { key: 'c', ctrl: true },
      { key: 'C', ctrl: true },
      { key: 'v', ctrl: true },
      { key: 'V', ctrl: true },
      { key: 'x', ctrl: true },
      { key: 'X', ctrl: true },
      { key: 'a', ctrl: true },
      { key: 'A', ctrl: true },
      { key: 's', ctrl: true },
      { key: 'S', ctrl: true },
      { key: 'Tab', alt: true },
    ];

    return prohibited.some(combo => {
      return e.key === combo.key &&
             (!combo.ctrl || e.ctrlKey) &&
             (!combo.shift || e.shiftKey) &&
             (!combo.alt || e.altKey);
    });
  }

  private getKeyCombo(e: KeyboardEvent): string {
    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    parts.push(e.key);
    return parts.join('+');
  }

  private isDevToolsOpen(): boolean {
    const threshold = 160;
    return window.outerHeight - window.innerHeight > threshold ||
           window.outerWidth - window.innerWidth > threshold;
  }

  private recordViolation(type: string, description: string): void {
    const violation = {
      type,
      description,
      timestamp: new Date(),
      severityLevel: this.getSeverityLevel(type),
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        url: window.location.href,
      }
    };

    this.onViolation(violation);
  }

  private getSeverityLevel(type: string): 'low' | 'medium' | 'high' | 'critical' {
    const severity: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'tab_switch': 'high',
      'window_focus_lost': 'medium',
      'right_click_attempt': 'low',
      'prohibited_shortcut': 'medium',
      'copy_attempt': 'high',
      'paste_attempt': 'high',
      'devtools_opened': 'critical',
      'no_face_detected': 'high',
      'camera_init_failed': 'critical',
    };

    return severity[type] || 'medium';
  }

  enableFullscreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  disableFullscreen(): void {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  getTabSwitchCount(): number {
    return this.tabSwitchCount;
  }

  cleanup(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}

export default ProctoringService;