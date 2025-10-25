import { ref } from 'vue'

/**
 * Composable for detecting and storing system information
 * Detects browser, OS, screen resolution, and CPU cores
 *
 * @returns {Object} - System info state and detection method
 */
export function useSystemInfo() {
  const systemInfo = ref({
    browser: '',
    os: '',
    screen: '',
    cores: ''
  })

  /**
   * Detect system information from navigator and window
   */
  const detectSystemInfo = () => {
    const ua = navigator.userAgent

    // Detect browser
    let browser = 'Unknown'
    if (ua.includes('Firefox/')) {
      const version = ua.match(/Firefox\/(\d+\.\d+)/)
      browser = `Firefox ${version ? version[1] : ''}`
    } else if (ua.includes('Edg/')) {
      const version = ua.match(/Edg\/(\d+\.\d+)/)
      browser = `Edge ${version ? version[1] : ''}`
    } else if (ua.includes('Chrome/')) {
      const version = ua.match(/Chrome\/(\d+\.\d+)/)
      browser = `Chrome ${version ? version[1] : ''}`
    } else if (ua.includes('Safari/')) {
      const version = ua.match(/Version\/(\d+\.\d+)/)
      browser = `Safari ${version ? version[1] : ''}`
    }

    // Detect OS
    let os = 'Unknown'
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11'
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1'
    else if (ua.includes('Windows NT 6.2')) os = 'Windows 8'
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7'
    else if (ua.includes('Mac OS X')) {
      const version = ua.match(/Mac OS X (\d+[._]\d+)/)
      os = `macOS ${version ? version[1].replace('_', '.') : ''}`
    } else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'

    // Screen resolution
    const screen = `${window.screen.width}x${window.screen.height}`

    // CPU cores
    const cores = navigator.hardwareConcurrency || 'Unknown'

    systemInfo.value = {
      browser,
      os,
      screen,
      cores
    }
  }

  return {
    systemInfo,
    detectSystemInfo
  }
}
