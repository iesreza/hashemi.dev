<template>
  <div class="terminal-output" ref="outputRef">
    <!-- Welcome message -->
    <div class="welcome-message" v-if="welcomeText">
      <div v-html="welcomeText"></div>
    </div>

    <!-- Command output history -->
    <div v-for="(item, index) in outputHistory" :key="index" class="output-item">
      <TerminalPrompt />
      <div class="command-line-input">
        <span class="prompt-arrow">></span>
        <span class="command">{{ item.command }}</span>
      </div>
      <div class="command-output" v-html="item.output"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TerminalPrompt from './TerminalPrompt.vue'

defineProps({
  welcomeText: {
    type: String,
    default: ''
  },
  outputHistory: {
    type: Array,
    required: true
  }
})

const outputRef = ref(null)

defineExpose({
  outputRef
})
</script>

<style scoped>
.terminal-output {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  padding-right: 10px;
}

.terminal-output::-webkit-scrollbar {
  width: 6px;
}

.terminal-output::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-output::-webkit-scrollbar-thumb {
  background: #4b5263;
  border-radius: 3px;
}

.welcome-message {
  margin-bottom: 20px;
}

.output-item {
  margin-bottom: 20px;
}

.command-line-input {
  margin-bottom: 10px;
}

.prompt-arrow {
  color: #98c379;
  margin-right: 8px;
  font-weight: bold;
}

.command {
  color: #61dafb;
}

.command-output {
  margin-left: 0;
  line-height: 1.8;
  color: #abb2bf;
}
</style>
