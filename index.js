#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

console.log(chalk.green("Quickstart React Setup"));

process.on('SIGINT', () => {
    console.log(chalk.red('\nSetup interrupted. Exiting...'));
    console.log(chalk.yellow('You can re-run the command to start over.'));
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log(chalk.red('\nSetup interrupted. Exiting...\n'));
    console.log(chalk.red(`Error: ${err.message}`));
    console.log(chalk.yellow('You can re-run the command to start over.'));
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log(chalk.red('\nSetup terminated. Exiting...'));
    process.exit(1);
});

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-react-app',
        validate: (input) => {
            if (input.trim() === '') return 'Project name cannot be empty';
            if (!/^[a-z0-9-_]+$/i.test(input)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: true
    },
    {
        type: 'confirm',
        name: 'eslint',
        message: 'Include ESLint?',
        default: true
    },
    {
        type: 'confirm',
        name: 'tailwind',
        message: 'Include Tailwind CSS?',
        default: true
    },
    {
        type: "confirm",
        name: "router",
        message: "Add React Router?",
        default: true,
    },
    {
        type: 'list',
        name: 'stateManagement',
        message: 'Choose a state management library:',
        choices: ['None', 'Zustand', 'Redux Toolkit'],
    },
    {
        type: 'confirm',
        name: 'icons',
        message: 'Include Lucide Icons?',
        default: true
    },
    {
        type: 'confirm',
        name: 'axios',
        message: 'Include axios?',
        default: true
    }
];

// Helper function to run commands safely
function runCommand(command, options = {}) {
    try {
        console.log(chalk.gray(`Running: ${command}`));
        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.log(chalk.red(`Failed to execute: ${command}`));
        console.log(chalk.red(`Error details: ${error.message}`));
        throw error;
    }
}

// Helper function to write file safely
function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
        console.log(chalk.green(`Created: ${filePath}`));
    } catch (error) {
        console.log(chalk.red(`Failed to create: ${filePath}`));
        throw error;
    }
}

inquirer.prompt(questions).then(async (answers) => {
    const { projectName, typescript, eslint, tailwind, router, stateManagement, icons, axios } = answers;

    console.log(chalk.blue(`Creating project: ${projectName}`));

    try {
        // Create Vite React project
        const viteCommand = typescript
            ? `npm create vite@latest ${projectName} -- --template react-ts`
            : `npm create vite@latest ${projectName} -- --template react`;

        runCommand(viteCommand);

        // Change to project directory
        const projectPath = path.resolve(projectName);
        process.chdir(projectPath);

        console.log(chalk.blue('Installing dependencies...'));
        runCommand('npm install');

        // Install additional packages
        const devDependencies = [];
        const dependencies = [];

        if (tailwind) {
            devDependencies.push('tailwindcss', '@tailwindcss/vite');
        }

        if (eslint) {
            devDependencies.push(
                'eslint',
                'eslint-config-prettier',
                'eslint-plugin-react',
                'eslint-plugin-react-hooks',
                'eslint-plugin-react-refresh'
            );
            if (typescript) {
                devDependencies.push(
                    '@typescript-eslint/eslint-plugin',
                    '@typescript-eslint/parser'
                );
            }
        }

        if (router) {
            dependencies.push('react-router-dom');
            if (typescript) {
                devDependencies.push('@types/react-router-dom');
            }
        }

        if (stateManagement === 'Zustand') {
            dependencies.push('zustand');
        } else if (stateManagement === 'Redux Toolkit') {
            dependencies.push('@reduxjs/toolkit', 'react-redux');
        }

        if (icons) {
            dependencies.push('lucide-react');
        }

        if (axios) {
            dependencies.push('axios');
        }

        // Install dependencies
        if (dependencies.length > 0) {
            console.log(chalk.blue('Installing dependencies...'));
            runCommand(`npm install ${dependencies.join(' ')}`);
        }

        if (devDependencies.length > 0) {
            console.log(chalk.blue('Installing dev dependencies...'));
            runCommand(`npm install -D ${devDependencies.join(' ')}`);
        }

        // Configure Tailwind
        if (tailwind) {
            console.log(chalk.blue('Configuring Tailwind CSS...'));

            // Create tailwind.config.js manually (more reliable than npx init)
            const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
            writeFile('tailwind.config.js', tailwindConfig);

            // const viteConfigPath = path.join(projectPath, `vite.config.${typescript ? 'ts' : 'js'}`);
            const viteConfigPath = `vite.config.${typescript ? 'ts' : 'js'}`;
            const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})`;
            writeFile(viteConfigPath, viteConfig);

            // Update CSS file
            const indexCssPath = 'src/index.css';
            const tailwindCSS = `@import "tailwindcss";`;
            writeFile(indexCssPath, tailwindCSS);
        }

        // Configure ESLint
        if (eslint) {
            console.log(chalk.blue('Configuring ESLint...'));

            const eslintConfig = {
                root: true,
                env: { browser: true, es2020: true },
                extends: [
                    'eslint:recommended',
                    '@typescript-eslint/recommended',
                    'eslint-config-prettier'
                ].filter(Boolean),
                ignorePatterns: ['dist', '.eslintrc.cjs'],
                parser: typescript ? '@typescript-eslint/parser' : undefined,
                plugins: ['react-refresh'].concat(typescript ? ['@typescript-eslint'] : []),
                rules: {
                    'react-refresh/only-export-components': [
                        'warn',
                        { allowConstantExport: true },
                    ],
                },
            };

            if (!typescript) {
                eslintConfig.extends = eslintConfig.extends.filter(ext => !ext.includes('typescript'));
                delete eslintConfig.parser;
                eslintConfig.plugins = eslintConfig.plugins.filter(plugin => plugin !== '@typescript-eslint');
            }

            writeFile('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
        }

        // Create basic router setup
        if (router) {
            console.log(chalk.blue('Setting up React Router...'));

            const appContent = typescript ? `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function Home() {
  return <h1>Home Page</h1>
}

function About() {
  return <h1>About Page</h1>
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <a href="/">Home</a> | <a href="/about">About</a>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
` : `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function Home() {
  return <h1>Home Page</h1>
}

function About() {
  return <h1>About Page</h1>
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <a href="/">Home</a> | <a href="/about">About</a>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
`;

            writeFile(`src/App.${typescript ? 'tsx' : 'jsx'}`, appContent);
        }

        console.log(chalk.green(`\nSetup completed successfully!`));
        console.log(chalk.blue('\n📦 Installed packages:'));
        if (tailwind) console.log(chalk.green('  ✓ Tailwind CSS'));
        if (eslint) console.log(chalk.green('  ✓ ESLint'));
        if (router) console.log(chalk.green('  ✓ React Router'));
        if (stateManagement !== 'None') console.log(chalk.green(`  ✓ ${stateManagement}`));
        if (icons) console.log(chalk.green('  ✓ Lucide Icons'));
        if (axios) console.log(chalk.green('  ✓ Axios'));

        console.log(chalk.yellow(`\nNext steps:`));
        console.log(chalk.cyan(`   cd ${projectName}`));
        console.log(chalk.cyan(`   npm run dev\n`));

    } catch (error) {
        console.log(chalk.red('\nSetup failed!'));
        console.log(chalk.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
