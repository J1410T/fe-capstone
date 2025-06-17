#!/usr/bin/env node

/**
 * Project health check script
 * Analyzes the project for potential issues and improvements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Check if required files exist
 */
function checkRequiredFiles() {
  console.log('📋 Checking required files...\n');
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'vitest.config.ts',
    'eslint.config.js',
    'tailwind.config.js',
    'src/main.tsx',
    'src/App.tsx',
    'index.html',
    'README.md',
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  });
  
  return missingFiles;
}

/**
 * Check package.json configuration
 */
function checkPackageJson() {
  console.log('\n📦 Checking package.json configuration...\n');
  
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['dev', 'build', 'test', 'lint'];
    const missingScripts = [];
    
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`✅ Script: ${script}`);
      } else {
        console.log(`❌ Script: ${script} - MISSING`);
        missingScripts.push(script);
      }
    });
    
    // Check for common issues
    if (!packageJson.type || packageJson.type !== 'module') {
      console.log('⚠️  Consider setting "type": "module" for ES modules');
    } else {
      console.log('✅ ES modules configured');
    }
    
    if (!packageJson.engines) {
      console.log('⚠️  Consider adding "engines" field to specify Node.js version');
    } else {
      console.log('✅ Engines specified');
    }
    
    return { missingScripts };
    
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    return { missingScripts: [] };
  }
}

/**
 * Check TypeScript configuration
 */
function checkTypeScriptConfig() {
  console.log('\n🔧 Checking TypeScript configuration...\n');
  
  const tsConfigFiles = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'];
  
  tsConfigFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    
    if (fs.existsSync(filePath)) {
      try {
        const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${file} - Valid JSON`);
        
        // Check for strict mode
        if (config.compilerOptions && config.compilerOptions.strict) {
          console.log(`   ✅ Strict mode enabled`);
        } else {
          console.log(`   ⚠️  Consider enabling strict mode`);
        }
        
      } catch (error) {
        console.log(`❌ ${file} - Invalid JSON: ${error.message}`);
      }
    } else {
      console.log(`❌ ${file} - Missing`);
    }
  });
}

/**
 * Check project structure
 */
function checkProjectStructure() {
  console.log('\n🏗️  Checking project structure...\n');
  
  const expectedDirs = [
    'src',
    'src/components',
    'src/components/ui',
    'src/components/common',
    'src/pages',
    'src/lib',
    'src/types',
    'src/hooks',
    'src/contexts',
    'docs',
  ];
  
  expectedDirs.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`⚠️  ${dir}/ - Consider creating this directory`);
    }
  });
  
  // Check for barrel exports
  const barrelFiles = [
    'src/components/index.ts',
    'src/components/ui/index.ts',
    'src/components/common/index.ts',
    'src/lib/index.ts',
    'src/types/index.ts',
  ];
  
  console.log('\n📦 Checking barrel exports...');
  barrelFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`⚠️  ${file} - Consider adding barrel export`);
    }
  });
}

/**
 * Check test coverage
 */
function checkTestCoverage() {
  console.log('\n🧪 Checking test setup...\n');
  
  const testFiles = [
    'vitest.config.ts',
    'src/test/setup.ts',
  ];
  
  testFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing test configuration`);
    }
  });
  
  // Check for test files
  const srcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(srcPath)) {
    const testFiles = findTestFiles(srcPath);
    console.log(`📊 Found ${testFiles.length} test files`);
    
    if (testFiles.length === 0) {
      console.log('⚠️  No test files found - consider adding tests');
    } else {
      console.log('✅ Test files present');
    }
  }
}

/**
 * Find test files recursively
 */
function findTestFiles(dir) {
  let testFiles = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        testFiles = testFiles.concat(findTestFiles(filePath));
      } else if (file.includes('.test.') || file.includes('.spec.') || file.includes('__tests__')) {
        testFiles.push(filePath);
      }
    });
  } catch (error) {
    // Ignore errors for directories we can't read
  }
  
  return testFiles;
}

/**
 * Check documentation
 */
function checkDocumentation() {
  console.log('\n📚 Checking documentation...\n');
  
  const docFiles = [
    'README.md',
    'docs/architecture.md',
    'docs/components/common.md',
    'docs/components/forms.md',
    'docs/testing.md',
  ];
  
  docFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`⚠️  ${file} - Consider adding documentation`);
    }
  });
}

/**
 * Check for security issues
 */
function checkSecurity() {
  console.log('\n🔒 Checking security...\n');
  
  // Check for .env files
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  
  envFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  ${file} found - ensure it's in .gitignore`);
    }
  });
  
  // Check .gitignore
  const gitignorePath = path.join(projectRoot, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    
    const importantIgnores = ['.env', 'node_modules', 'dist', 'build'];
    const missingIgnores = [];
    
    importantIgnores.forEach(ignore => {
      if (gitignoreContent.includes(ignore)) {
        console.log(`✅ .gitignore includes ${ignore}`);
      } else {
        console.log(`⚠️  .gitignore missing ${ignore}`);
        missingIgnores.push(ignore);
      }
    });
    
  } else {
    console.log('❌ .gitignore missing');
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations() {
  console.log('\n💡 Recommendations:\n');
  
  const recommendations = [
    'Run `pnpm audit` to check for security vulnerabilities',
    'Run `pnpm dlx depcheck` to find unused dependencies',
    'Consider adding pre-commit hooks with husky',
    'Set up GitHub Actions for CI/CD',
    'Add JSDoc comments to complex functions',
    'Consider adding Storybook for component documentation',
    'Set up automated dependency updates with Renovate or Dependabot',
    'Add performance monitoring with tools like Lighthouse CI',
  ];
  
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

/**
 * Main health check function
 */
function main() {
  console.log('🏥 SRPM Project Health Check\n');
  console.log('=' .repeat(50));
  
  const missingFiles = checkRequiredFiles();
  const { missingScripts } = checkPackageJson();
  
  checkTypeScriptConfig();
  checkProjectStructure();
  checkTestCoverage();
  checkDocumentation();
  checkSecurity();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Health Check Summary:\n');
  
  if (missingFiles.length === 0 && missingScripts.length === 0) {
    console.log('🎉 Project health looks good!');
  } else {
    console.log('⚠️  Some issues found:');
    if (missingFiles.length > 0) {
      console.log(`   - ${missingFiles.length} missing files`);
    }
    if (missingScripts.length > 0) {
      console.log(`   - ${missingScripts.length} missing scripts`);
    }
  }
  
  generateRecommendations();
  
  console.log('\n✨ Health check completed!');
}

// Run the health check
main();
