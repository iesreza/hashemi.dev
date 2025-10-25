<template>
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="show" class="popup-overlay" @click="$emit('close')">
        <div class="popup-content" @click.stop>
          <img :src="imageSrc" :alt="imageAlt" class="popup-image" />
          <div class="popup-caption">{{ imageAlt }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  imageSrc: {
    type: String,
    default: '/data/reza-hashemi.jpg'
  },
  imageAlt: {
    type: String,
    default: 'Reza Hashemi - System Architect and Backend Engineer specializing in Golang and Distributed Systems'
  }
})

defineEmits(['close'])
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
}

.popup-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
}

.popup-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

.popup-caption {
  margin-top: 20px;
  color: #abb2bf;
  font-family: 'Courier New', monospace;
  font-size: 18px;
}

/* Transition animations */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active .popup-content,
.popup-leave-active .popup-content {
  transition: transform 0.3s ease;
}

.popup-enter-from .popup-content,
.popup-leave-to .popup-content {
  transform: scale(0.9);
}
</style>
