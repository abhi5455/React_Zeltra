# React ZELTRA

A powerful CLI tool to quickly scaffold React projects with popular libraries and configurations pre-setup.

## Features

✅ **Vite** - Lightning fast build tool  
✅ **TypeScript** - Type-safe development  
✅ **Tailwind CSS** - Utility-first CSS framework  
✅ **ESLint** - Code linting and formatting  
✅ **React Router** - Client-side routing  
✅ **Zustand/Redux Toolkit** - State management  
✅ **Lucide Icons** - Beautiful icon library  
✅ **Axios** - HTTP client

## Installation

### Global Installation
```bash
npm install -g react-zeltra
```

### Use with npx (Recommended)
```bash
npx react-zeltra
```

## Usage

Simply run the command and follow the interactive prompts:

```bash
react-zeltra
```

Or with npx:
```bash
npx react-zeltra
```
## Why “ZELTRA”? 
Because it’s a mashup of the things that usually give you headaches: </br>
Zustand / Redux, ESLint, Lucide, Tailwind, React Router, Axios… boom, ZELTRA! ⚡ </br> 
Everything you need, all in one, no more hunting around for configs.

## What it does

1. 🚀 Creates a new Vite React project
2. 📦 Installs and configures selected packages
3. ⚙️ Sets up configuration files automatically
4. 🎨 Configures Tailwind CSS with proper content paths
5. 🔍 Sets up ESLint with React and TypeScript rules
6. 🧭 Creates basic React Router setup
7. ✨ Ready to use project structure

## Generated Project Structure

```
my-react-app/
├── src/
│   ├── App.tsx         # Main app component with routing (if selected)
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind directives (if selected)
├── tailwind.config.js  # Tailwind configuration
├── .eslintrc.json      # ESLint configuration  
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## Requirements

- Node.js 16 or higher
- npm or yarn

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
