const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('--- Setting up Backend ---');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'backend') });

  console.log('--- Setting up Frontend ---');
  if (!fs.existsSync(path.join(__dirname, 'frontend'))) {
    execSync('npx.cmd -y create-vite@latest frontend --template react', { stdio: 'inherit', cwd: __dirname });
  }
  
  console.log('--- Installing Frontend Dependencies ---');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });
  
  console.log('--- Installing Frontend UI Libraries ---');
  const uiDeps = 'tailwindcss postcss autoprefixer framer-motion three @react-three/fiber @react-three/drei chart.js react-chartjs-2 react-router-dom lucide-react clsx tailwind-merge';
  execSync(`npm install ${uiDeps}`, { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });

  console.log('--- Initializing Tailwind ---');
  execSync('npx.cmd -y tailwindcss init -p', { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });

  console.log('SETUP COMPLETE SUCCESS');
} catch (error) {
  console.error('SETUP FAILED:', error.message);
}
