<template>
  <div class="input-line">
    <TerminalPrompt />
    <div class="input-wrapper">
      <span class="prompt-arrow">></span>
      <div class="input-container">
        <input
          ref="inputRef"
          :value="modelValue"
          @keydown="$emit('keydown', $event)"
          @keydown.enter="$emit('execute')"
          @keydown.up.prevent="$emit('history-up')"
          @keydown.down.prevent="$emit('history-down')"
          @keydown.tab.prevent="$emit('autocomplete')"
          @input="$emit('update:modelValue', $event.target.value); $emit('input-change')"
          type="text"
          class="terminal-input"
          :placeholder="placeholder"
          autofocus
        />
        <span v-if="autocompleteText" class="autocomplete-suggestion">
          {{ modelValue }}{{ autocompleteText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TerminalPrompt from './TerminalPrompt.vue'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  autocompleteText: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Type a command or \'help\' for list of commands'
  }
})

defineEmits([
  'update:modelValue',
  'execute',
  'keydown',
  'history-up',
  'history-down',
  'autocomplete',
  'input-change'
])

const inputRef = ref(null)

defineExpose({
  inputRef
})
</script>

<style scoped>
.input-line {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.prompt-arrow {
  color: #98c379;
  margin-right: 8px;
  font-weight: bold;
}

.input-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #61dafb;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  caret-color: #abb2bf;
  position: relative;
  z-index: 2;
}

.terminal-input::placeholder {
  color: #4b5263;
  opacity: 0.6;
}

.autocomplete-suggestion {
  position: absolute;
  left: 0;
  color: #4b5263;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  pointer-events: none;
  z-index: 1;
  white-space: pre;
  opacity: 0.5;
}
</style>
