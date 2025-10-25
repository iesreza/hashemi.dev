import { ref } from 'vue'

/**
 * Composable for managing terminal command history
 * Allows navigation through previously executed commands using arrow keys
 *
 * @param {Ref<string>} currentCommand - Ref to the current command input
 * @returns {Object} - History state and navigation methods
 */
export function useCommandHistory(currentCommand) {
  const commandHistory = ref([])
  const historyIndex = ref(-1)

  /**
   * Add a command to history
   * @param {string} command - Command to add
   */
  const addToHistory = (command) => {
    commandHistory.value.push(command)
    historyIndex.value = commandHistory.value.length
  }

  /**
   * Navigate through command history
   * @param {string} direction - 'up' or 'down'
   * @param {Function} clearAutocomplete - Callback to clear autocomplete
   */
  const navigateHistory = (direction, clearAutocomplete) => {
    if (commandHistory.value.length === 0) return

    if (direction === 'up') {
      if (historyIndex.value > 0) {
        historyIndex.value--
        currentCommand.value = commandHistory.value[historyIndex.value]
        clearAutocomplete?.()
      }
    } else if (direction === 'down') {
      if (historyIndex.value < commandHistory.value.length - 1) {
        historyIndex.value++
        currentCommand.value = commandHistory.value[historyIndex.value]
        clearAutocomplete?.()
      } else {
        historyIndex.value = commandHistory.value.length
        currentCommand.value = ''
        clearAutocomplete?.()
      }
    }
  }

  return {
    commandHistory,
    historyIndex,
    addToHistory,
    navigateHistory
  }
}
