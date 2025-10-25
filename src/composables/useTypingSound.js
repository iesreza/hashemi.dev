import { ref } from 'vue'

/**
 * Composable for terminal typing sound effects
 * Creates short click sounds when keys are pressed
 *
 * @returns {Object} - Sound control methods and state
 */
export function useTypingSound() {
  const soundEnabled = ref(true)
  const audioContext = ref(null)

  /**
   * Initialize Web Audio API context
   */
  const initAudioContext = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  /**
   * Play a short typing click sound
   */
  const playTypingSound = () => {
    if (!soundEnabled.value) return

    initAudioContext()
    const ctx = audioContext.value

    // Create a short click sound using oscillator
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.02)
  }

  return {
    soundEnabled,
    playTypingSound
  }
}
