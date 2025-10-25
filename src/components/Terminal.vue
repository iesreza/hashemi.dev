<template>
  <div class="page-wrapper">
    <!-- Image Popup -->
    <ImagePopup
      :show="showImagePopup"
      @close="showImagePopup = false"
    />

    <div class="terminal-window">
      <TerminalHeader />

      <div class="terminal-container" @click="focusInput">
        <TerminalOutput
          ref="outputComponent"
          :welcome-text="welcomeText"
          :output-history="outputHistory"
        />

        <TerminalInput
          ref="inputComponent"
          v-model="currentCommand"
          :autocomplete-text="autocompleteText"
          @execute="executeCommand"
          @keydown="playTypingSound"
          @history-up="navigateHistory('up', clearAutocomplete)"
          @history-down="navigateHistory('down', clearAutocomplete)"
          @autocomplete="autoComplete"
          @input-change="updateAutocomplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ImagePopup from './terminal/ImagePopup.vue'
import TerminalHeader from './terminal/TerminalHeader.vue'
import TerminalOutput from './terminal/TerminalOutput.vue'
import TerminalInput from './terminal/TerminalInput.vue'
import { useVisitorInfo } from '../composables/useVisitorInfo'
import { useTypingSound } from '../composables/useTypingSound'
import { useTypewriter } from '../composables/useTypewriter'
import { useCommandHistory } from '../composables/useCommandHistory'
import { useAutocomplete } from '../composables/useAutocomplete'
import { useSystemInfo } from '../composables/useSystemInfo'
import { useGitHub } from '../composables/useGitHub'
import { getRandomFortune } from '../constants/fortunes'
import { parseMarkdown } from '../utils/markdown'
import { formatGitHubOutput, parseGitHubArgs } from '../utils/github'

// Component refs
const outputComponent = ref(null)
const inputComponent = ref(null)

// State
const currentCommand = ref('')
const outputHistory = ref([])
const welcomeText = ref('')
const showImagePopup = ref(false)

// Composables
const { visitorInfo, fetchVisitorInfo } = useVisitorInfo()
const { soundEnabled, playTypingSound } = useTypingSound()
const { systemInfo, detectSystemInfo } = useSystemInfo()
const { fetchMultipleAccounts } = useGitHub()

const scrollToBottom = () => {
  if (outputComponent.value?.outputRef) {
    outputComponent.value.outputRef.scrollTop = outputComponent.value.outputRef.scrollHeight
  }
}

const { isTyping, typeWriter, typeWelcomeMessage } = useTypewriter(scrollToBottom)
const { addToHistory, navigateHistory } = useCommandHistory(currentCommand)

// Commands definition
const commands = {
  help: {
    description: 'Show available commands',
    execute: () => {
      return `
<div class="help-output">
  <div class="welcome-intro">Hello, stranger from ${visitorInfo.value.ip} (${visitorInfo.value.city}). Welcome to my humble console—I'm Reza.</div>
  <div class="welcome-intro">Want to know more? Type <span class="cmd">whoami</span> or <span class="cmd">about</span> at the prompt. You can also try:</div>
  <br>
  <div class="md-li">• <span class="cmd">whoami</span> / <span class="cmd">about</span> - Learn about me</div>
  <div class="md-li">• <span class="cmd">contact</span> - Get my contact info</div>
  <div class="md-li">• <span class="cmd">wannaseeyou</span> - See my photo</div>
  <div class="md-li">• <span class="cmd">neofetch</span> - Display system information</div>
  <div class="md-li">• <span class="cmd">fortune</span> - Get random programming wisdom</div>
  <div class="md-li">• <span class="cmd">github</span> - Show GitHub activity</div>
  <div class="md-li">• <span class="cmd">sound</span> - Toggle typing sound effects</div>
  <div class="md-li">• <span class="cmd">cls</span> / <span class="cmd">clear</span> - Clear terminal</div>
  <div class="md-li">• <span class="cmd">help</span> - Show this help message</div>
</div>
      `
    }
  },
  whoami: {
    description: 'Who am I and what do I do',
    execute: async () => {
      try {
        const response = await fetch('/api/content/reza')
        const data = await response.json()
        return parseMarkdown(data.content)
      } catch (error) {
        return '<div class="error">Failed to load content. Make sure the backend server is running.</div>'
      }
    }
  },
  about: {
    description: 'Who am I and what do I do (alias for whoami)',
    execute: async () => {
      try {
        const response = await fetch('/api/content/reza')
        const data = await response.json()
        return parseMarkdown(data.content)
      } catch (error) {
        return '<div class="error">Failed to load content. Make sure the backend server is running.</div>'
      }
    }
  },
  contact: {
    description: 'Get my contact information',
    execute: async () => {
      try {
        const response = await fetch('/api/content/contact')
        const data = await response.json()
        return parseMarkdown(data.content)
      } catch (error) {
        return '<div class="error">Failed to load contact information. Make sure the backend server is running.</div>'
      }
    }
  },
  wannaseeyou: {
    description: 'See my photo',
    execute: () => {
      showImagePopup.value = true
      return null
    }
  },
  cls: {
    description: 'Clear the terminal',
    execute: () => {
      outputHistory.value = []
      return null
    }
  },
  clear: {
    description: 'Clear the terminal',
    execute: () => {
      outputHistory.value = []
      return null
    }
  },
  sound: {
    description: 'Toggle typing sound effects',
    execute: () => {
      soundEnabled.value = !soundEnabled.value
      const status = soundEnabled.value ? 'enabled' : 'disabled'
      return `<div class="success">Sound effects ${status}</div>`
    }
  },
  neofetch: {
    description: 'Display system information',
    execute: () => {
      return `
<div class="neofetch-output">
  <pre class="ascii-art">
    _______________
   /              /|
  /              / |
 /______________/  |
 |   hashemi.dev|  |
 |     _______  | /
 |    |       | |/
 |____|_______|/
  </pre>
  <div class="system-info">
    <div class="info-line"><span class="info-label">IP:</span> ${visitorInfo.value.ip}</div>
    <div class="info-line"><span class="info-label">Location:</span> ${visitorInfo.value.city}, ${visitorInfo.value.country || 'Unknown'}</div>
    <div class="info-line"><span class="info-label">Browser:</span> ${systemInfo.value.browser}</div>
    <div class="info-line"><span class="info-label">OS:</span> ${systemInfo.value.os}</div>
    <div class="info-line"><span class="info-label">Resolution:</span> ${systemInfo.value.screen}</div>
    <div class="info-line"><span class="info-label">CPU Cores:</span> ${systemInfo.value.cores}</div>
  </div>
</div>
      `
    }
  },
  fortune: {
    description: 'Display a random programming quote',
    execute: () => {
      const quote = getRandomFortune()
      return `<div class="fortune-text">${quote}</div>`
    }
  },
  github: {
    description: 'Show GitHub activity (iesreza, getevo, or both)',
    execute: async (args) => {
      const accounts = parseGitHubArgs(args)
      const results = await fetchMultipleAccounts(accounts)
      return formatGitHubOutput(results)
    }
  }
}

const { autocompleteText, updateAutocomplete, autoComplete, clearAutocomplete } = useAutocomplete(
  currentCommand,
  commands
)

// Execute command
const executeCommand = async () => {
  const command = currentCommand.value.trim()
  const commandLower = command.toLowerCase()

  if (command === '') return
  if (isTyping.value) return

  addToHistory(commandLower)

  let output = ''
  const baseCommand = commandLower.split(' ')[0]
  const args = commandLower.substring(baseCommand.length).trim()

  if (commands[commandLower]) {
    output = await commands[commandLower].execute(args)
  } else if (commands[baseCommand]) {
    output = await commands[baseCommand].execute(args)
  } else {
    output = `<div class="error">Command not found: ${commandLower}<br>Type '<span class="highlight">help</span>' to see available commands.</div>`
  }

  if (output !== null) {
    const index = outputHistory.value.length
    outputHistory.value.push({
      command: commandLower,
      output: ''
    })

    currentCommand.value = ''
    clearAutocomplete()
    await nextTick()
    scrollToBottom()

    // Determine typewriter duration based on command
    let duration = null
    if (baseCommand === 'whoami') {
      duration = 2000
    } else if (baseCommand === 'contact') {
      duration = 1000
    } else if (baseCommand === 'fortune') {
      duration = 1000
    } else if (baseCommand === 'github') {
      duration = 1500
    }

    await typeWriter(output, outputHistory.value[index], duration)
  } else {
    currentCommand.value = ''
    clearAutocomplete()
  }

  await nextTick()
  scrollToBottom()
}

const focusInput = () => {
  inputComponent.value?.inputRef?.focus()
}

// Handle keyboard events
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showImagePopup.value) {
    showImagePopup.value = false
  }
}

// Initialize
onMounted(async () => {
  detectSystemInfo()
  await fetchVisitorInfo()

  const welcomeMessage = `
<div class="help-output">
  <div class="welcome-intro">Hello, stranger from ${visitorInfo.value.ip} (${visitorInfo.value.city}). Welcome to my humble console—I'm Reza.</div>
  <div class="welcome-intro">Want to know more? Type <span class="cmd">whoami</span> or <span class="cmd">about</span> at the prompt. You can also try:</div>
  <br>
  <div class="md-li">• <span class="cmd">whoami</span> / <span class="cmd">about</span> - Learn about me</div>
  <div class="md-li">• <span class="cmd">contact</span> - Get my contact info</div>
  <div class="md-li">• <span class="cmd">wannaseeyou</span> - See my photo</div>
  <div class="md-li">• <span class="cmd">neofetch</span> - Display system information</div>
  <div class="md-li">• <span class="cmd">fortune</span> - Get random programming wisdom</div>
  <div class="md-li">• <span class="cmd">github</span> - Show GitHub activity</div>
  <div class="md-li">• <span class="cmd">sound</span> - Toggle typing sound effects</div>
  <div class="md-li">• <span class="cmd">cls</span> / <span class="cmd">clear</span> - Clear terminal</div>
  <div class="md-li">• <span class="cmd">help</span> - Show this help message</div>
</div>
  `

  await typeWelcomeMessage(welcomeText, welcomeMessage)
  focusInput()

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.page-wrapper {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #3d4270 0%, #4a5278 50%, #3d4270 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.terminal-window {
  width: 95%;
  height: 90%;
  max-width: 1800px;
  background: #282c34;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.terminal-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
  cursor: text;
  color: #abb2bf;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 0;
  }

  .terminal-window {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}
</style>

<!-- Global terminal styles -->
<style>
/* Styling for markdown content and terminal output */
.help-output,
.welcome-intro,
.markdown-content {
  color: #abb2bf;
  line-height: 1.8;
}

.welcome-intro {
  margin-bottom: 10px;
}

.cmd {
  color: #61dafb;
  font-weight: bold;
}

.md-h1 {
  color: #e5c07b;
  font-weight: bold;
  display: block;
  margin: 10px 0;
}

.md-h2 {
  color: #e06c75;
  font-weight: bold;
  display: block;
  margin: 8px 0;
}

.md-h3 {
  color: #c678dd;
  font-weight: bold;
  display: block;
  margin: 6px 0;
}

.md-bold {
  color: #e5c07b;
  font-weight: bold;
}

.md-italic {
  color: #c678dd;
  font-style: italic;
}

.md-li {
  color: #abb2bf;
  margin: 5px 0;
  line-height: 1.8;
}

.md-link {
  color: #61afef;
  text-decoration: none;
  border-bottom: 1px solid #61afef;
}

.md-link:hover {
  color: #528bff;
  border-bottom-color: #528bff;
}

.md-hr {
  border-top: 1px solid #4b5263;
  margin: 15px 0;
}

.error {
  color: #e06c75;
}

.success {
  color: #98c379;
}

.highlight {
  color: #e5c07b;
}

.fortune-text {
  color: #c678dd;
  font-style: italic;
  line-height: 1.8;
  margin: 10px 0;
}

/* GitHub feed styles */
.github-feed {
  margin: 15px 0;
}

.github-section {
  margin-bottom: 20px;
}

.github-header {
  color: #61dafb;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
}

.github-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  padding: 8px;
  border-left: 2px solid #4b5263;
  padding-left: 12px;
  transition: all 0.2s;
}

.github-item:hover {
  border-left-color: #61dafb;
  background: rgba(97, 218, 251, 0.05);
}

.github-icon {
  font-size: 16px;
  min-width: 20px;
}

.github-text {
  flex: 1;
  color: #abb2bf;
}

.github-time {
  color: #5c6370;
  font-size: 13px;
  min-width: 60px;
  text-align: right;
}

.github-empty {
  color: #5c6370;
  font-style: italic;
  padding: 10px 0;
}

.github-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #4b5263;
  color: #5c6370;
  font-size: 14px;
}

.github-footer .cmd {
  color: #61dafb;
  font-weight: bold;
}

/* Neofetch styles */
.neofetch-output {
  display: flex;
  gap: 30px;
  margin: 10px 0;
}

.ascii-art {
  color: #61afef;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.2;
  margin: 0;
}

.system-info {
  flex: 1;
}

.info-line {
  color: #abb2bf;
  margin: 5px 0;
  line-height: 1.8;
}

.info-label {
  color: #61afef;
  font-weight: bold;
  margin-right: 8px;
}
</style>
