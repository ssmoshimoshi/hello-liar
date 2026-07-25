/**
 * Web Haptics Utility for sensory confirmation on supported touchscreen devices.
 * Safely handles environments where navigator.vibrate is disabled or unsupported (iOS Safari / desktop).
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'echo' | 'pulse' | 'error';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10); // Subtle tick for simple tap (IG story, menu)
        break;
      case 'medium':
        navigator.vibrate(25); // Standard confirmation
        break;
      case 'heavy':
        navigator.vibrate([40, 30, 50]); // Heavy tactile thump for completion
        break;
      case 'echo':
        navigator.vibrate([15, 30, 15]); // Double heartbeat sensation ("SAYA RASAKAN INI")
        break;
      case 'pulse':
        navigator.vibrate([10, 40, 10, 40, 15]); // Rythmic build up during prolonged hold ("RAGU")
        break;
      case 'error':
        navigator.vibrate([50, 50, 50, 50, 50]); // Rapid warning
        break;
    }
  } catch {
    // Suppress errors on strict browser security contexts
  }
}
