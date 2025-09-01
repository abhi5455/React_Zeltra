#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";

console.log(chalk.green("Quickstart React Setup"))

process.on('SIGINT', () => {
    console.log(chalk.red('\nSetup interrupted. Exiting...'));
    console.log(chalk.yellow('You can re-run the command to start over.'));
    process.exit(1);
})

process.on('uncaughtException', (err) => {
    console.log(chalk.red('\nSetup interrupted. Exiting...\n'));
    console.log(chalk.yellow('You can re-run the command to start over.'));
    process.exit(1);
})

process.on('SIGTERM', () => {
    console.log(chalk.red('\nSetup terminated. Exiting...'));
    process.exit(1);
})

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'project_name:',
        default: 'my-react-app'
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
        choices: ['None', 'Zustand'],
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
]

inquirer.prompt(questions).then(answers => {
    const { projectName, typescript, eslint, tailwind, router, stateManagement, icons, axios } = answers;

    console.log(chalk.blue(`Creating project: ${projectName}`));

    // Create Vite React project
    execSync(`npm create vite@latest ${projectName}`, { stdio: 'inherit' });

    //Install Tailwind if chosen
    if(tailwind){
        console.log(chalk.blue('Setting up Tailwind CSS...'));
        // Install Tailwind and dependencies
        execSync(`npm install -D tailwindcss postcss autoprefixer`, {
            cwd: `${projectName}`,
            stdio: 'inherit' });

        // Initialize Tailwind config
        execSync(`npx tailwindcss init -p`, {
            cwd: `${projectName}`,
            stdio: 'inherit',
            shell: true
        }, );
    }

    // Install ESLint if chosen
    // if(eslint){
    //     console.log(chalk.blue('Setting up ESLint...'));
    //     execSync(`npm install -D eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks ${typescript ? 'eslint-plugin-@typescript-eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser' : ''}`, { cwd: `${projectName}`, stdio: 'inherit' });
    // }

    // Install React Router if chosen
    if(router){
        console.log(chalk.blue('Installing React Router...'));
        execSync(`npm install react-router-dom`, { cwd: `${projectName}`, stdio: 'inherit' });
    }

    // Install state management if chosen
    if(stateManagement === 'Zustand'){
        console.log(chalk.blue('Installing Zustand...'));
        execSync(`npm install zustand`, { cwd: `${projectName}`, stdio: 'inherit' });
    }

    // Install Lucide Icons if chosen
    if(icons){
        console.log(chalk.blue('Installing Lucide Icons...'));
        execSync(`npm install lucide-react`, { cwd: `${projectName}`, stdio: 'inherit' });
    }

    if(axios){
        console.log(chalk.blue('Installing axios...'));
        execSync(`npm install axios`, { cwd: `${projectName}`, stdio: 'inherit' });
    }

    console.log(chalk.green(`\nSetup completed!`));
    console.log(chalk.yellow(`\nNext steps:`));
    console.log(chalk.cyan(`   cd ${projectName}`));
    console.log(chalk.cyan(`   npm install`));
    console.log(chalk.cyan(`   npm run dev`));
})
