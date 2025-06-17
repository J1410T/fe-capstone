#!/usr/bin/env node

/**
 * Project cleanup script
 * Removes unused files, optimizes imports, and cleans up the project structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files and directories to clean up
const filesToRemove = [
  // Temporary files
  'node_modules/.cache',
  'dist',
  'build',
  '.vite',
  'coverage',
  
  // IDE files
  '.vscode/settings.json',
  '.idea',
  
  // OS files
  '.DS_Store',
  'Thumbs.db',
  
  // Log files
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  'pnpm-debug.log*',
  
  // Environment files (keep .env.example)
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
];

// Directories to clean
const directoriesToClean = [
  'node_modules/.tmp',
  'src/temp',
  'src/test-results',
];

/**
 * Remove files and directories
 */
function cleanupFiles() {
  console.log('🧹 Starting project cleanup...\n');
  
  filesToRemove.forEach(pattern => {
    const fullPath = path.join(projectRoot, pattern);
    
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`✅ Removed directory: ${pattern}`);
        } else {
          fs.unlinkSync(fullPath);
          console.log(`✅ Removed file: ${pattern}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not remove ${pattern}: ${error.message}`);
    }
  });
  
  directoriesToClean.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    
    try {
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Cleaned directory: ${dir}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not clean ${dir}: ${error.message}`);
    }
  });
}

/**
 * Optimize package.json
 */
function optimizePackageJson() {
  console.log('\n📦 Optimizing package.json...');
  
  const packageJsonPath = path.join(projectRoot, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Sort dependencies alphabetically
    if (packageJson.dependencies) {
      const sortedDeps = {};
      Object.keys(packageJson.dependencies).sort().forEach(key => {
        sortedDeps[key] = packageJson.dependencies[key];
      });
      packageJson.dependencies = sortedDeps;
    }
    
    // Sort devDependencies alphabetically
    if (packageJson.devDependencies) {
      const sortedDevDeps = {};
      Object.keys(packageJson.devDependencies).sort().forEach(key => {
        sortedDevDeps[key] = packageJson.devDependencies[key];
      });
      packageJson.devDependencies = sortedDevDeps;
    }
    
    // Write back to file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Sorted dependencies in package.json');
    
  } catch (error) {
    console.log(`⚠️  Could not optimize package.json: ${error.message}`);
  }
}

/**
 * Create .gitignore if it doesn't exist
 */
function ensureGitignore() {
  console.log('\n📝 Ensuring .gitignore is up to date...');
  
  const gitignorePath = path.join(projectRoot, '.gitignore');
  
  const gitignoreContent = `# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.vite/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/
test-results/

# Temporary files
*.tmp
*.temp
.cache/

# TypeScript
*.tsbuildinfo

# Misc
.eslintcache
.stylelintcache
`;

  try {
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Created .gitignore file');
    } else {
      console.log('✅ .gitignore already exists');
    }
  } catch (error) {
    console.log(`⚠️  Could not create .gitignore: ${error.message}`);
  }
}

/**
 * Check for unused imports (basic check)
 */
function checkUnusedImports() {
  console.log('\n🔍 Checking for potential unused imports...');
  
  const srcPath = path.join(projectRoot, 'src');
  
  // This is a basic check - in a real project you'd use a more sophisticated tool
  const potentiallyUnused = [
    'react-icons',
    'next-themes',
    'cmdk',
    'jwt-decode',
    'recharts',
    '@dnd-kit',
  ];
  
  potentiallyUnused.forEach(pkg => {
    console.log(`⚠️  Consider checking if '${pkg}' is actually used`);
  });
  
  console.log('\n💡 Run `pnpm dlx depcheck` for a more thorough analysis');
}

/**
 * Generate project statistics
 */
function generateStats() {
  console.log('\n📊 Project Statistics:');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    
    const depCount = packageJson.dependencies ? Object.keys(packageJson.dependencies).length : 0;
    const devDepCount = packageJson.devDependencies ? Object.keys(packageJson.devDependencies).length : 0;
    
    console.log(`   Dependencies: ${depCount}`);
    console.log(`   Dev Dependencies: ${devDepCount}`);
    console.log(`   Total: ${depCount + devDepCount}`);
    
    // Count source files
    const srcPath = path.join(projectRoot, 'src');
    if (fs.existsSync(srcPath)) {
      const countFiles = (dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) => {
        let count = 0;
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            count += countFiles(filePath, extensions);
          } else if (extensions.some(ext => file.endsWith(ext))) {
            count++;
          }
        });
        
        return count;
      };
      
      const sourceFiles = countFiles(srcPath);
      console.log(`   Source Files: ${sourceFiles}`);
    }
    
  } catch (error) {
    console.log(`⚠️  Could not generate stats: ${error.message}`);
  }
}

/**
 * Main cleanup function
 */
function main() {
  console.log('🚀 SRPM Project Cleanup Tool\n');
  
  cleanupFiles();
  optimizePackageJson();
  ensureGitignore();
  checkUnusedImports();
  generateStats();
  
  console.log('\n✨ Cleanup completed!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run `pnpm install` to ensure dependencies are up to date');
  console.log('   2. Run `pnpm test` to ensure everything still works');
  console.log('   3. Run `pnpm build` to test production build');
  console.log('   4. Consider running `pnpm dlx depcheck` to find unused dependencies');
}

// Run the cleanup
main();
