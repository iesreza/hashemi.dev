import { ref, nextTick } from 'vue'

/**
 * Composable for typewriter effect in terminal output
 * Displays text character by character with configurable speed
 *
 * @param {Function} scrollCallback - Callback to scroll to bottom after each update
 * @returns {Object} - Typewriter state and methods
 */
export function useTypewriter(scrollCallback) {
  const isTyping = ref(false)

  /**
   * Display text with typewriter effect
   * @param {string} htmlString - HTML string to display
   * @param {Object} outputItem - Output item to update
   * @param {number|null} targetDuration - Total duration in ms (null for 1ms per char)
   */
  const typeWriter = async (htmlString, outputItem, targetDuration = null) => {
    if (!outputItem) return

    isTyping.value = true

    // Strip HTML tags to get plain text for timing, but display with HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString
    const plainText = tempDiv.textContent || tempDiv.innerText || ''

    // Calculate speed based on target duration if provided
    let speed = 1 // Default: 1ms per character
    if (targetDuration && plainText.length > 0) {
      speed = targetDuration / plainText.length
    }

    // Type out progressively
    for (let i = 0; i <= plainText.length; i++) {
      // Find the position in the HTML that corresponds to this character count
      let charCount = 0
      let htmlIndex = 0
      const html = htmlString

      while (charCount < i && htmlIndex < html.length) {
        if (html[htmlIndex] === '<') {
          // Skip HTML tags
          const closeTag = html.indexOf('>', htmlIndex)
          if (closeTag !== -1) {
            htmlIndex = closeTag + 1
          } else {
            htmlIndex++
          }
        } else {
          charCount++
          htmlIndex++
        }
      }

      outputItem.output = html.substring(0, htmlIndex)

      await nextTick()
      scrollCallback?.()

      if (i < plainText.length) {
        await new Promise(resolve => setTimeout(resolve, speed))
      }
    }

    outputItem.output = htmlString
    isTyping.value = false
  }

  /**
   * Display welcome message with typewriter effect
   * @param {Ref<string>} welcomeTextRef - Ref to update with welcome text
   * @param {string} welcomeMessage - Full welcome message HTML
   */
  const typeWelcomeMessage = async (welcomeTextRef, welcomeMessage) => {
    const speed = 5 // 5ms per character for welcome message

    // Strip HTML tags to get plain text for character counting
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = welcomeMessage
    const plainText = tempDiv.textContent || tempDiv.innerText || ''

    // Type out progressively
    for (let i = 0; i <= plainText.length; i++) {
      // Find the position in the HTML that corresponds to this character count
      let charCount = 0
      let htmlIndex = 0
      const html = welcomeMessage

      while (charCount < i && htmlIndex < html.length) {
        if (html[htmlIndex] === '<') {
          // Skip HTML tags
          const closeTag = html.indexOf('>', htmlIndex)
          if (closeTag !== -1) {
            htmlIndex = closeTag + 1
          } else {
            htmlIndex++
          }
        } else {
          charCount++
          htmlIndex++
        }
      }

      welcomeTextRef.value = html.substring(0, htmlIndex)
      await nextTick()

      if (i < plainText.length) {
        await new Promise(resolve => setTimeout(resolve, speed))
      }
    }

    welcomeTextRef.value = welcomeMessage
  }

  return {
    isTyping,
    typeWriter,
    typeWelcomeMessage
  }
}
