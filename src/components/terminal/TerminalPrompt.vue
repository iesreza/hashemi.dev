<template>
  <div class="prompt-line">
    <span class="prompt-symbol">#</span>
    <span class="prompt-user">{{ user }}</span>
    <span class="prompt-in">in</span>
    <span class="prompt-path">{{ path }}</span>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: String,
    default: 'user'
  },
  path: {
    type: String,
    default: '~/reza-hashemi'
  }
})
</script>

<style scoped>
.prompt-line {
  display: flex;
  align-items: center;
}

.prompt-symbol {
  color: #e5c07b;
  margin-right: 6px;
  font-weight: bold;
}

.prompt-user {
  color: #e5c07b;
  margin-right: 6px;
}

.prompt-in {
  color: #98c379;
  margin-right: 6px;
}

.prompt-path {
  color: #61afef;
}
</style>
