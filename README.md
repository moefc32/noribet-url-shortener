# Noribet URL Shortener
<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="24" /></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/Package-PNPM-orange?style=flat-square" height="24" /></a>
<img src="https://img.shields.io/badge/Module-ECMAScript-yellow?style=flat-square" height="24" />

Noribet URL shortener application

![image](https://github.com/user-attachments/assets/90c838c1-8995-4521-af06-f8986d0babf6)

## Features
- Create, update, and delete short URLs
- Responsive design for use on both desktop and mobile devices
- Automatic database installation

## Stack Used
- [SvelteKit](https://svelte.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Flowbite Svelte](https://flowbite-svelte.com/)
- [SQLite](https://www.sqlite.org/)

## Local Preview
1. Clone this repository to your local computer
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Run the application in development mode
   ```sh
   pnpm run dev
   ```

## Deployment
1. Clone this repository to the development server
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Optimize the application for production
   ```sh
   pnpm run build
   ```
5. Serve the application using PM2
   ```sh
   pm2 start ecosystem.config.cjs
   ```
