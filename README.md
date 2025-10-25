# Reza Hashemi - Terminal Portfolio

A retro terminal-style personal portfolio website built with Vue 3 and Express backend.

## Features

- **Interactive Terminal Interface**: Fully functional command-line interface with typewriter effect
- **IP Geolocation**: Displays visitor's IP and location on welcome
- **Markdown Content**: Loads content dynamically from markdown files
- **Image Popup**: View photo with click-outside-to-close functionality
- **Command History**: Navigate through previous commands using arrow keys (↑/↓)
- **Auto-complete**: Real-time command suggestions with Tab completion
- **Responsive Design**: Works on desktop (80% screen) and mobile (fullscreen)
- **Modern Aesthetics**: Dark blue gradient background with Mac-style terminal window

## Available Commands

- `whoami` - Display detailed information about Reza (loaded from data/reza.md)
- `contact` - Get contact information (loaded from data/contact.md)
- `wannaseeyou` - View photo in a popup (public/data/reza-hashemi.jpg)
- `help` - Display welcome message and available commands
- `cls` / `clear` - Clear the terminal screen

## Installation

1. Install dependencies:
```bash
npm install
```

2. **Add your photo**: Place your photo at `public/data/reza-hashemi.jpg`

3. Run both backend and frontend servers:
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Backend server (http://localhost:3000)
npm run server

# Terminal 2 - Frontend (http://localhost:5173)
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Customization

### Content Files

Edit the markdown files to update your information:

1. **About/Bio**: Edit `data/reza.md` - This appears when users type `whoami`
2. **Contact Info**: Edit `data/contact.md` - This appears when users type `contact`
3. **Photo**: Replace `public/data/reza-hashemi.jpg` with your own photo

### Welcome Message

The welcome message is generated dynamically and shows:
- Visitor's IP address and location (fetched from backend)
- List of available commands

### Backend Customization

Edit `server.js` to:
- Change IP geolocation logic (currently returns mock data)
- Add more API endpoints for additional content
- Integrate with external geolocation services (ipapi.co, ip-api.com, etc.)

## Color Scheme

Modern dark theme with:
- Background gradient: `#3d4270` to `#4a5278` (dark blue/purple)
- Terminal background: `#282c34` (dark charcoal)
- Primary text: `#abb2bf` (light gray)
- Commands: `#61dafb` (cyan)
- Highlights: `#e5c07b` (yellow/gold)
- Success/Path: `#98c379` (green)

**Important**: All markdown content maintains uniform text size - only colors change to preserve terminal aesthetic.

## Project Structure

```
hashemi.dev/
├── server.js              # Express backend server
├── data/                  # Markdown content files
│   ├── reza.md           # About/bio content
│   └── contact.md        # Contact information
├── public/
│   └── data/
│       └── reza-hashemi.jpg  # Your photo (add this!)
├── src/
│   ├── main.js
│   ├── App.vue
│   └── components/
│       └── Terminal.vue   # Main terminal component
└── package.json
```

## Technologies Used

- **Frontend**: Vue 3 (Composition API), Vite
- **Backend**: Node.js, Express, CORS
- **Styling**: CSS3 with custom animations and gradients
- **Features**: Typewriter effect, markdown parsing, image popup

## How It Works

1. **Page Load**: Frontend fetches visitor info from backend (`/api/visitor`)
2. **Welcome Message**: Displays with typewriter effect showing IP and location
3. **Commands**: User types commands which execute functions
4. **Content Loading**: `whoami` and `contact` fetch markdown from backend
5. **Markdown Parsing**: Custom parser converts MD to HTML with uniform text size
6. **Image Popup**: `wannaseeyou` opens overlay with photo

## Notes

- Backend runs on `http://localhost:3000`
- Frontend runs on `http://localhost:5173` (or next available port)
- All text in terminal maintains same size (terminal aesthetic)
- Markdown headers, lists, links styled with colors only

## License

MIT License - feel free to use this for your own portfolio!
