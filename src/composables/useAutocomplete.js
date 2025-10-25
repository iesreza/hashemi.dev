import { ref } from 'vue'

/**
 * Composable for terminal command autocomplete functionality
 * Provides Tab completion and live suggestions
 *
 * @param {Ref<string>} currentCommand - Ref to the current command input
 * @param {Object} commands - Available commands object
 * @returns {Object} - Autocomplete state and methods
 */
export function useAutocomplete(currentCommand, commands) {
  const autocompleteText = ref('')

  /**
   * Update autocomplete suggestion based on current input
   */
  const updateAutocomplete = () => {
    const input = currentCommand.value.toLowerCase()
    if (input === '') {
      autocompleteText.value = ''
      return
    }

    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input))

    if (matches.length > 0) {
      // Show the rest of the first match as suggestion
      autocompleteText.value = matches[0].substring(input.length)
    } else {
      autocompleteText.value = ''
    }
  }

  /**
   * Execute autocomplete when Tab is pressed
   * Completes to the first matching command
   */
  const autoComplete = () => {
    const input = currentCommand.value.toLowerCase()
    if (input === '') return

    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input))

    if (matches.length >= 1) {
      // Auto-complete to the first match
      currentCommand.value = matches[0]
      autocompleteText.value = ''
    }
  }

  /**
   * Clear autocomplete suggestion
   */
  const clearAutocomplete = () => {
    autocompleteText.value = ''
  }

  return {
    autocompleteText,
    updateAutocomplete,
    autoComplete,
    clearAutocomplete
  }
}
