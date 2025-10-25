<template>
  <div class="terminal-header">
    <div class="window-controls">
      <span class="control close"></span>
      <span class="control minimize"></span>
      <span class="control maximize"></span>
    </div>
    <div class="terminal-title">{{ title }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'github.com/iesreza'
  }
})
</script>

<style scoped>
.terminal-header {
  background: #21252b;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #181a1f;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}

.control.close {
  background: #ff5f56;
}

.control.minimize {
  background: #ffbd2e;
}

.control.maximize {
  background: #27c93f;
}

.terminal-title {
  color: #abb2bf;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  text-align: center;
  flex: 1;
  margin-right: 60px;
}
</style>
