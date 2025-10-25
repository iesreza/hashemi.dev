<template>
  <div class="page-wrapper">
    <!-- Image Popup -->
    <div v-if="showImagePopup" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <img src="/data/reza-hashemi.jpg" alt="Reza Hashemi" class="popup-image" />
        <div class="popup-caption">Reza Hashemi</div>
      </div>
    </div>

    <div class="terminal-window">
      <div class="terminal-header">
        <div class="window-controls">
          <span class="control close"></span>
          <span class="control minimize"></span>
          <span class="control maximize"></span>
        </div>
        <div class="terminal-title">github.com/iesreza</div>
      </div>

      <div class="terminal-container" @click="focusInput">
        <div class="terminal-output" ref="outputRef">
          <div class="welcome-message" v-if="welcomeText">
            <div v-html="welcomeText"></div>
          </div>

          <div v-for="(item, index) in outputHistory" :key="index" class="output-item">
            <div class="command-line">
              <span class="prompt-symbol">#</span>
              <span class="prompt-user">user</span>
              <span class="prompt-in">in</span>
              <span class="prompt-path">~/reza-hashemi</span>
            </div>
            <div class="command-line-input">
              <span class="prompt-arrow">></span>
              <span class="command">{{ item.command }}</span>
            </div>
            <div class="command-output" v-html="item.output"></div>
          </div>
        </div>

        <div class="input-line">
          <div class="prompt-line">
            <span class="prompt-symbol">#</span>
            <span class="prompt-user">user</span>
            <span class="prompt-in">in</span>
            <span class="prompt-path">~/reza-hashemi</span>
          </div>
          <div class="input-wrapper">
            <span class="prompt-arrow">></span>
            <div class="input-container">
              <input
                ref="inputRef"
                v-model="currentCommand"
                @keydown="playTypingSound"
                @keydown.enter="executeCommand"
                @keydown.up.prevent="navigateHistory('up')"
                @keydown.down.prevent="navigateHistory('down')"
                @keydown.tab.prevent="autoComplete"
                @input="updateAutocomplete"
                type="text"
                class="terminal-input"
                placeholder="Type a command or 'help' for list of commands"
                autofocus
              />
              <span v-if="autocompleteText" class="autocomplete-suggestion">{{ currentCommand }}{{ autocompleteText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const inputRef = ref(null)
const outputRef = ref(null)
const currentCommand = ref('')
const outputHistory = ref([])
const commandHistory = ref([])
const historyIndex = ref(-1)
const isTyping = ref(false)
const welcomeText = ref('')
const autocompleteText = ref('')
const visitorInfo = ref({ ip: '192.168.1.3', city: 'Milan' })
const showImagePopup = ref(false)

// Sound effect state
const soundEnabled = ref(true)
const audioContext = ref(null)

// System info state
const systemInfo = ref({
  browser: '',
  os: '',
  screen: '',
  cores: ''
})

// Fortune quotes collection (60 quotes)
const fortunes = [
  // Programming Wisdom
  '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
  '"Make it work, make it right, make it fast." - Kent Beck',
  '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
  '"The most damaging phrase in the language is: We\'ve always done it this way." - Grace Hopper',
  '"Premature optimization is the root of all evil." - Donald Knuth',
  '"Clean code always looks like it was written by someone who cares." - Robert C. Martin',

  // Tech Humor
  '"It works on my machine." ¯\\_(ツ)_/¯',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton',
  '"99 little bugs in the code, 99 bugs in the code. Take one down, patch it around, 127 bugs in the code..."',
  '"A SQL query walks into a bar, walks up to two tables and asks... Can I join you?"',
  '"How many programmers does it take to change a light bulb? None, that\'s a hardware problem."',
  '"Java is to JavaScript what car is to carpet." - Chris Heilmann',
  '"There are 10 types of people: those who understand binary and those who don\'t."',
  '"Debugging is like being the detective in a crime movie where you are also the murderer."',
  '"A user interface is like a joke. If you have to explain it, it\'s not that good."',
  '"Programming is 10% writing code and 90% understanding why it\'s not working."',

  // Developer Culture
  '"Talk is cheap. Show me the code." - Linus Torvalds',
  '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
  '"Software is a great combination between artistry and engineering." - Bill Gates',
  '"The computer was born to solve problems that did not exist before." - Bill Gates',
  '"Good code is its own best documentation." - Steve McConnell',
  '"Deleted code is debugged code." - Jeff Sickel',
  '"Code never lies, comments sometimes do." - Ron Jeffries',
  '"Programming isn\'t about what you know; it\'s about what you can figure out." - Chris Pine',
  '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
  '"The best thing about a boolean is even if you are wrong, you are only off by a bit."',

  // Motivational
  '"Every great developer you know got there by solving problems they were unqualified to solve until they actually did it." - Patrick McKenzie',
  '"The most important property of a program is whether it accomplishes the intention of its user." - C.A.R. Hoare',
  '"It\'s not a bug – it\'s an undocumented feature."',
  '"Learning to code is learning to create and innovate." - Enda Kenny',
  '"The best way to predict the future is to implement it." - David Heinemeier Hansson',
  '"Code is poetry." - WordPress',
  '"The function of good software is to make the complex appear to be simple." - Grady Booch',
  '"Software and cathedrals are much the same – first we build them, then we pray." - Sam Redwine',
  '"Don\'t worry if it doesn\'t work right. If everything did, you\'d be out of a job." - Mosher\'s Law',
  '"Before software can be reusable it first has to be usable." - Ralph Johnson',

  // Bug & Debug Humor
  '"If debugging is the process of removing bugs, then programming must be the process of putting them in." - Edsger Dijkstra',
  '"Weeks of coding can save you hours of planning."',
  '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." - Dan Salomon',
  '"No code has zero bugs, it just has bugs you haven\'t found yet."',
  '"The cheapest, fastest, and most reliable components are those that aren\'t there." - Gordon Bell',
  '"Real programmers count from 0."',
  '"Keyboard not found. Press F1 to continue."',
  '"To err is human, but to really foul things up you need a computer." - Paul Ehrlich',
  '"I\'m not anti-social; I\'m just not user friendly."',
  '"Home is where you don\'t have to `cd`."',

  // Backend & Systems
  '"There is no cloud, it\'s just someone else\'s computer."',
  '"A good programmer is someone who always looks both ways before crossing a one-way street." - Doug Linder',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." - Bill Gates',
  '"Testing leads to failure, and failure leads to understanding." - Burt Rutan',
  '"The question of whether a computer can think is no more interesting than the question of whether a submarine can swim." - Edsger Dijkstra',
  '"Hofstadter\'s Law: It always takes longer than you expect, even when you take into account Hofstadter\'s Law." - Douglas Hofstadter',
  '"The best performance improvement is the transition from the nonworking state to the working state." - John Ousterhout',
  '"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live." - John Woods',
  '"Documentation is a love letter that you write to your future self." - Damian Conway',
  '"Legacy code is code without tests." - Michael Feathers'
]

// Get random fortune
const getRandomFortune = () => {
  const randomIndex = Math.floor(Math.random() * fortunes.length)
  return fortunes[randomIndex]
}

// Markdown to HTML converter with uniform text size
const parseMarkdown = (markdown) => {
  // Simple markdown parser that maintains uniform text size
  let html = markdown
    // Headers - convert to span with color only
    .replace(/^### (.*$)/gim, '<span class="md-h3">$1</span>')
    .replace(/^## (.*$)/gim, '<span class="md-h2">$1</span>')
    .replace(/^# (.*$)/gim, '<span class="md-h1">$1</span>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<span class="md-bold">$1</span>')
    // Lists
    .replace(/^\* (.*$)/gim, '<div class="md-li">• $1</div>')
    .replace(/^- (.*$)/gim, '<div class="md-li">• $1</div>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>')
    // Horizontal rule
    .replace(/^---$/gim, '<div class="md-hr"></div>')
    // Italic
    .replace(/\*(.*?)\*/g, '<span class="md-italic">$1</span>')
    // Clean up multiple newlines to single break
    .replace(/\n\n+/g, '<br>')
    // Remove single newlines between block elements
    .replace(/(<\/div>)\n/g, '$1')
    .replace(/(<\/span>)\n/g, '$1<br>')
    // Remove remaining single newlines
    .replace(/\n/g, ' ')

  return `<div class="markdown-content">${html}</div>`
}

const closePopup = () => {
  showImagePopup.value = false
}

// Handle keyboard events
const handleKeyDown = (event) => {
  // Close popup on Escape key
  if (event.key === 'Escape' && showImagePopup.value) {
    closePopup()
  }
}

// Initialize audio context for typing sound
const initAudioContext = () => {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
  }
}

// Play typing sound effect
const playTypingSound = () => {
  if (!soundEnabled.value) return

  initAudioContext()
  const ctx = audioContext.value

  // Create a short click sound
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = 800
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.02)
}

// Detect system information
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

const commands = {
  help: {
    description: 'Show available commands',
    execute: () => {
      return `
<div class="help-output">
  <div class="welcome-intro">Hello, stranger from ${visitorInfo.value.ip} (${visitorInfo.value.city}). Welcome to my humble console—I'm Reza.</div>
  <div class="welcome-intro">Want to know more? Type <span class="cmd">whoami</span> at the prompt. You can also try:</div>
  <br>
  <div class="md-li">• <span class="cmd">whoami</span> - Learn about me</div>
  <div class="md-li">• <span class="cmd">contact</span> - Get my contact info</div>
  <div class="md-li">• <span class="cmd">wannaseeyou</span> - See my photo</div>
  <div class="md-li">• <span class="cmd">neofetch</span> - Display system information</div>
  <div class="md-li">• <span class="cmd">fortune</span> - Get random programming wisdom</div>
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
        const response = await fetch('http://localhost:3000/api/content/reza')
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
        const response = await fetch('http://localhost:3000/api/content/contact')
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
  }
}

const typeWriter = async (text, index, targetDuration = null) => {
  const htmlString = text
  let currentIndex = 0

  const outputItem = outputHistory.value[index]
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
    currentIndex = i

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
    scrollToBottom()

    if (i < plainText.length) {
      await new Promise(resolve => setTimeout(resolve, speed))
    }
  }

  outputItem.output = htmlString
  isTyping.value = false
}

const executeCommand = async () => {
  const command = currentCommand.value.trim()
  const commandLower = command.toLowerCase()

  if (command === '') return
  if (isTyping.value) return // Prevent new commands while typing

  commandHistory.value.push(commandLower)
  historyIndex.value = commandHistory.value.length

  let output = ''

  // Handle commands with flags like "social -a"
  const baseCommand = commandLower.split(' ')[0]

  if (commands[commandLower]) {
    output = await commands[commandLower].execute()
  } else if (commands[baseCommand]) {
    output = await commands[baseCommand].execute()
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
    autocompleteText.value = ''
    await nextTick()
    scrollToBottom()

    // Start typewriter effect with duration based on command
    let duration = null // Default: 1ms per character
    if (baseCommand === 'whoami') {
      duration = 2000 // 2 seconds for whoami (faster)
    } else if (baseCommand === 'contact') {
      duration = 1000 // 1 second for contact
    } else if (baseCommand === 'fortune') {
      duration = 1000 // 1 second for fortune
    }

    await typeWriter(output, index, duration)
  } else {
    currentCommand.value = ''
    autocompleteText.value = ''
  }

  await nextTick()
  scrollToBottom()
}

const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return

  if (direction === 'up') {
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentCommand.value = commandHistory.value[historyIndex.value]
      autocompleteText.value = ''
    }
  } else if (direction === 'down') {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++
      currentCommand.value = commandHistory.value[historyIndex.value]
      autocompleteText.value = ''
    } else {
      historyIndex.value = commandHistory.value.length
      currentCommand.value = ''
      autocompleteText.value = ''
    }
  }
}

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

const autoComplete = () => {
  const input = currentCommand.value.toLowerCase()
  if (input === '') return

  const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input))

  if (matches.length === 1) {
    currentCommand.value = matches[0]
    autocompleteText.value = ''
  } else if (matches.length > 1) {
    // Auto-complete to the first match
    currentCommand.value = matches[0]
    autocompleteText.value = ''
  }
}

const focusInput = () => {
  inputRef.value?.focus()
}

const scrollToBottom = () => {
  if (outputRef.value) {
    outputRef.value.scrollTop = outputRef.value.scrollHeight
  }
}

const fetchVisitorInfo = async () => {
  // Helper function to check if IP is IPv6
  const isIPv6 = (ip) => ip && ip.includes(':')

  // Try multiple IP geolocation APIs in sequence, preferring IPv4
  const apis = [
    {
      url: 'https://api.ipify.org?format=json',
      url2: 'https://get.geojs.io/v1/ip/geo.json',
      parse: async (data) => {
        // First get IP from ipify (more likely to be IPv4)
        const ip = data.ip
        if (isIPv6(ip)) {
          return null // Skip if IPv6
        }
        // Then get location info
        try {
          const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json')
          const geoData = await geoResponse.json()
          return {
            ip: ip,
            city: geoData.city,
            country: geoData.country
          }
        } catch {
          return { ip: ip, city: 'Unknown', country: 'Unknown' }
        }
      }
    },
    {
      url: 'https://get.geojs.io/v1/ip/geo.json',
      parse: (data) => {
        if (isIPv6(data.ip)) {
          return null // Skip if IPv6
        }
        return {
          ip: data.ip,
          city: data.city,
          country: data.country
        }
      }
    },
    {
      url: 'https://ipapi.co/json/',
      parse: (data) => {
        if (isIPv6(data.ip)) {
          return null // Skip if IPv6
        }
        return {
          ip: data.ip,
          city: data.city,
          country: data.country_name
        }
      }
    },
    {
      url: 'https://ipwho.is/',
      parse: (data) => {
        if (isIPv6(data.ip)) {
          return null // Skip if IPv6
        }
        return {
          ip: data.ip,
          city: data.city,
          country: data.country
        }
      }
    }
  ]

  for (const api of apis) {
    try {
      const response = await fetch(api.url)
      const data = await response.json()
      const parsed = await api.parse(data)

      if (parsed) {
        visitorInfo.value = parsed
        console.log('Fetched visitor info from:', api.url, visitorInfo.value)
        return // Success, exit
      } else {
        console.log(`Got IPv6 from ${api.url}, trying next...`)
      }
    } catch (error) {
      console.log(`Failed to fetch from ${api.url}, trying next...`)
    }
  }

  // If all APIs fail, use default values
  console.log('All APIs failed, using default visitor info')
  visitorInfo.value = { ip: '192.168.1.3', city: 'Milan', country: 'Italy' }
}

const typeWelcomeMessage = async () => {
  // First show system info in neofetch style
  const systemInfoMessage = `
<div class="neofetch-output">
  <div class="neofetch-header">
    <pre class="ascii-art">    _______________
   /              /|
  /              / |
 /______________/  |
 |   hashemi.dev|  |
 |     _______  | /
 |    |       | |/
 |____|_______|/</pre>
    <div class="system-info">
      <div class="info-line"><span class="info-label">Visitor IP</span> ${visitorInfo.value.ip}</div>
      <div class="info-line"><span class="info-label">Location</span> ${visitorInfo.value.city}, ${visitorInfo.value.country || 'Unknown'}</div>
      <div class="info-line"><span class="info-label">Browser</span> ${systemInfo.value.browser}</div>
      <div class="info-line"><span class="info-label">OS</span> ${systemInfo.value.os}</div>
      <div class="info-line"><span class="info-label">Resolution</span> ${systemInfo.value.screen}</div>
      <div class="info-line"><span class="info-label">CPU Cores</span> ${systemInfo.value.cores}</div>
    </div>
  </div>
</div>
<br>
  `

  const welcomeMessage = systemInfoMessage + `
    <div class="welcome-intro">Hello, stranger from ${visitorInfo.value.ip} (${visitorInfo.value.city}). Welcome to my humble console—I'm Reza.</div>
    <div class="welcome-intro">Want to know more? Type <span class="cmd">whoami</span> at the prompt. You can also try:</div>
    <br>
    <div class="md-li">• <span class="cmd">whoami</span></div>
    <div class="md-li">• <span class="cmd">contact</span></div>
    <div class="md-li">• <span class="cmd">wannaseeyou</span></div>
    <div class="md-li">• <span class="cmd">neofetch</span></div>
    <div class="md-li">• <span class="cmd">fortune</span></div>
    <div class="md-li">• <span class="cmd">sound</span></div>
    <div class="md-li">• <span class="cmd">help</span></div>
    <div class="md-li">• <span class="cmd">cls</span></div>
  `

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = welcomeMessage
  const plainText = tempDiv.textContent || tempDiv.innerText || ''

  // Calculate speed for 2 second duration
  const targetDuration = 2000 // 2 seconds
  const speed = plainText.length > 0 ? targetDuration / plainText.length : 1

  for (let i = 0; i <= plainText.length; i++) {
    let charCount = 0
    let htmlIndex = 0
    const html = welcomeMessage

    while (charCount < i && htmlIndex < html.length) {
      if (html[htmlIndex] === '<') {
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

    welcomeText.value = html.substring(0, htmlIndex)
    await nextTick()

    if (i < plainText.length) {
      await new Promise(resolve => setTimeout(resolve, speed))
    }
  }

  welcomeText.value = welcomeMessage
}

onMounted(async () => {
  detectSystemInfo()
  await fetchVisitorInfo()
  await typeWelcomeMessage()
  focusInput()

  // Add keyboard event listener for Escape key
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // Remove keyboard event listener
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
  width: 80%;
  height: 80%;
  background: #282c34;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

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

.welcome-text {
  color: #abb2bf;
  font-size: 16px;
  margin-bottom: 10px;
}

.server-text {
  color: #abb2bf;
  margin-bottom: 10px;
}

.intro {
  color: #abb2bf;
  margin-bottom: 15px;
}

.output-item {
  margin-bottom: 20px;
}

.command-line {
  margin-bottom: 3px;
}

.command-line-input {
  margin-bottom: 10px;
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

.input-line {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.prompt-line {
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: flex;
  align-items: center;
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

.highlight {
  color: #61dafb;
  font-weight: bold;
}

.error {
  color: #e06c75;
}

/* Command output styling */
:deep(.help-output),
:deep(.about-output),
:deep(.skills-output),
:deep(.projects-output),
:deep(.experience-output),
:deep(.contact-output),
:deep(.social-output) {
  line-height: 1.8;
}

:deep(.section-title) {
  color: #61dafb;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-decoration: underline;
}

:deep(.help-command) {
  color: #61dafb;
  font-weight: normal;
  margin-bottom: 2px;
  margin-top: 8px;
}

:deep(.help-command:first-child) {
  margin-top: 0;
}

:deep(.help-desc) {
  color: #abb2bf;
  padding-left: 20px;
  margin-bottom: 0;
}

:deep(.cmd) {
  color: #61dafb;
  font-weight: bold;
}

:deep(.skill-category) {
  margin: 8px 0;
}

:deep(.category-name) {
  color: #e5c07b;
  font-weight: bold;
  display: inline;
}

:deep(.skill-list) {
  display: inline;
  margin-left: 10px;
  color: #abb2bf;
}

:deep(.project) {
  margin: 15px 0;
  padding-left: 10px;
}

:deep(.project-name) {
  color: #61dafb;
  font-weight: bold;
  margin-bottom: 5px;
}

:deep(.project-desc) {
  margin-left: 15px;
  margin-bottom: 3px;
  color: #abb2bf;
}

:deep(.project-tech) {
  margin-left: 15px;
  color: #5c6370;
  font-style: italic;
}

:deep(.job) {
  margin: 15px 0;
  padding-left: 10px;
}

:deep(.job-title) {
  color: #61dafb;
  font-weight: bold;
}

:deep(.job-company) {
  color: #e5c07b;
  margin-bottom: 5px;
}

:deep(.job-desc) {
  margin-left: 15px;
  margin: 3px 0 3px 15px;
  color: #abb2bf;
}

:deep(.contact-item),
:deep(.social-item) {
  margin: 10px 0;
  padding-left: 10px;
}

:deep(.contact-label) {
  color: #e5c07b;
  font-weight: bold;
  margin-right: 10px;
}

:deep(.social-icon) {
  color: #98c379;
  margin-right: 5px;
}

:deep(a) {
  color: #61dafb;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(.autocomplete) {
  color: #5c6370;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 0;
  }

  .terminal-window {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .terminal-container {
    padding: 15px;
  }

  .terminal-input {
    font-size: 14px;
  }

  .terminal-title {
    font-size: 11px;
  }
}

/* Popup Styles */
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
  z-index: 1000;
  cursor: pointer;
}

.popup-content {
  max-width: 90%;
  max-height: 90%;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.popup-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.popup-caption {
  color: #abb2bf;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 500;
  background: rgba(40, 44, 52, 0.9);
  padding: 10px 30px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Markdown Content Styles - All same size */
:deep(.markdown-content) {
  line-height: 1.8;
  color: #abb2bf;
}

:deep(.md-h1),
:deep(.md-h2),
:deep(.md-h3) {
  color: #61dafb;
  font-weight: bold;
  font-size: inherit; /* Same size as regular text */
  display: block;
  margin: 10px 0 5px 0;
}

:deep(.md-bold) {
  color: #e5c07b;
  font-weight: bold;
}

:deep(.md-italic) {
  font-style: italic;
  color: #98c379;
}

:deep(.md-li) {
  margin: 5px 0;
  padding-left: 10px;
  color: #abb2bf;
}

:deep(.md-link) {
  color: #61dafb;
  text-decoration: underline;
}

:deep(.md-link:hover) {
  text-decoration: underline;
  opacity: 0.8;
}

:deep(.md-hr) {
  border-top: 1px solid #4b5263;
  margin: 15px 0;
}

:deep(.welcome-intro) {
  color: #abb2bf;
  line-height: 1.8;
  margin: 5px 0;
}

/* Neofetch styles */
:deep(.neofetch-output) {
  margin: 10px 0;
}

:deep(.neofetch-header) {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

:deep(.ascii-art) {
  color: #61dafb;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.2;
  margin: 0;
}

:deep(.system-info) {
  flex: 1;
}

:deep(.info-line) {
  margin: 5px 0;
  display: flex;
  gap: 10px;
}

:deep(.info-label) {
  color: #61dafb;
  font-weight: bold;
  min-width: 100px;
  display: inline-block;
}

:deep(.info-label)::after {
  content: ':';
  margin-left: 2px;
}

/* Success message */
:deep(.success) {
  color: #98c379;
}

/* Fortune styles */
:deep(.fortune-text) {
  color: #e5c07b;
  font-style: italic;
  line-height: 1.8;
  margin: 10px 0;
}
</style>
