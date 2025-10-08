#!/usr/bin/env node

/**
 * Coverage Report Script
 * Generates detailed coverage reports and analysis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    });
  } catch (error) {
    log(`Error running command: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function generateCoverageReport() {
  log('🧪 Generating Coverage Report...', 'cyan');
  
  // Run tests with coverage
  log('Running tests with coverage...', 'blue');
  runCommand('npm run test:coverage');
  
  // Check if coverage directory exists
  const coverageDir = path.join(process.cwd(), 'coverage');
  if (!fs.existsSync(coverageDir)) {
    log('Coverage directory not found. Running tests first...', 'yellow');
    runCommand('npm test -- --coverage');
  }
  
  return coverageDir;
}

function analyzeCoverage(coverageDir) {
  log('📊 Analyzing Coverage Data...', 'cyan');
  
  const lcovPath = path.join(coverageDir, 'lcov.info');
  const htmlPath = path.join(coverageDir, 'index.html');
  const jsonPath = path.join(coverageDir, 'coverage-summary.json');
  
  // Check if coverage files exist
  if (!fs.existsSync(lcovPath)) {
    log('LCOV coverage file not found', 'red');
    return;
  }
  
  if (!fs.existsSync(jsonPath)) {
    log('JSON coverage summary not found', 'red');
    return;
  }
  
  // Read coverage summary
  const coverageSummary = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Display coverage summary
  log('\n📈 Coverage Summary:', 'bright');
  log('==================', 'bright');
  
  Object.entries(coverageSummary).forEach(([file, stats]) => {
    if (file === 'total') {
      log(`\n${file.toUpperCase()}:`, 'bright');
    } else {
      log(`\n${file}:`, 'blue');
    }
    
    Object.entries(stats).forEach(([metric, value]) => {
      const percentage = value.pct;
      const color = percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red';
      log(`  ${metric}: ${percentage}% (${value.covered}/${value.total})`, color);
    });
  });
  
  return coverageSummary;
}

function generateCoverageBadge(coverageSummary) {
  log('\n🏆 Generating Coverage Badge...', 'cyan');
  
  const total = coverageSummary.total;
  const overallCoverage = total.lines.pct;
  
  // Generate badge URL
  const badgeUrl = `https://img.shields.io/badge/coverage-${overallCoverage}%25-${overallCoverage >= 80 ? 'green' : overallCoverage >= 60 ? 'yellow' : 'red'}`;
  
  // Create badge markdown
  const badgeMarkdown = `![Coverage](${badgeUrl})`;
  
  // Save badge to file
  const badgePath = path.join(process.cwd(), 'coverage-badge.md');
  fs.writeFileSync(badgePath, badgeMarkdown);
  
  log(`Coverage badge saved to: ${badgePath}`, 'green');
  log(`Badge: ${badgeMarkdown}`, 'blue');
  
  return badgeMarkdown;
}

function checkCoverageThresholds(coverageSummary) {
  log('\n🎯 Checking Coverage Thresholds...', 'cyan');
  
  const thresholds = {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
    hooks: { branches: 85, functions: 90, lines: 85, statements: 85 },
    services: { branches: 85, functions: 90, lines: 85, statements: 85 },
    utils: { branches: 90, functions: 95, lines: 90, statements: 90 },
  };
  
  let allPassed = true;
  
  // Check global thresholds
  log('\nGlobal Thresholds:', 'bright');
  Object.entries(thresholds.global).forEach(([metric, threshold]) => {
    const actual = coverageSummary.total[metric].pct;
    const passed = actual >= threshold;
    const color = passed ? 'green' : 'red';
    const status = passed ? '✅' : '❌';
    
    log(`  ${status} ${metric}: ${actual}% (threshold: ${threshold}%)`, color);
    
    if (!passed) allPassed = false;
  });
  
  // Check specific directory thresholds
  Object.entries(thresholds).forEach(([dir, dirThresholds]) => {
    if (dir === 'global') return;
    
    const dirFiles = Object.keys(coverageSummary).filter(file => 
      file.includes(`src/${dir}/`) && file !== 'total'
    );
    
    if (dirFiles.length > 0) {
      log(`\n${dir.toUpperCase()} Thresholds:`, 'bright');
      
      Object.entries(dirThresholds).forEach(([metric, threshold]) => {
        const dirStats = dirFiles.reduce((acc, file) => {
          acc.covered += coverageSummary[file][metric].covered;
          acc.total += coverageSummary[file][metric].total;
          return acc;
        }, { covered: 0, total: 0 });
        
        const actual = dirStats.total > 0 ? (dirStats.covered / dirStats.total) * 100 : 0;
        const passed = actual >= threshold;
        const color = passed ? 'green' : 'red';
        const status = passed ? '✅' : '❌';
        
        log(`  ${status} ${metric}: ${actual.toFixed(1)}% (threshold: ${threshold}%)`, color);
        
        if (!passed) allPassed = false;
      });
    }
  });
  
  if (allPassed) {
    log('\n🎉 All coverage thresholds passed!', 'green');
  } else {
    log('\n⚠️  Some coverage thresholds failed!', 'red');
  }
  
  return allPassed;
}

function generateCoverageReport() {
  log('\n📋 Generating Detailed Coverage Report...', 'cyan');
  
  const reportPath = path.join(process.cwd(), 'COVERAGE_REPORT.md');
  
  const report = `# Coverage Report

Generated on: ${new Date().toISOString()}

## Overview

This report provides detailed coverage analysis for the application.

## Coverage Summary

### Global Coverage
- **Lines**: ${coverageSummary.total.lines.pct}%
- **Functions**: ${coverageSummary.total.functions.pct}%
- **Branches**: ${coverageSummary.total.branches.pct}%
- **Statements**: ${coverageSummary.total.statements.pct}%

### Coverage by Directory

#### Hooks (src/hooks/)
- **Lines**: ${getDirCoverage('src/hooks/', 'lines')}%
- **Functions**: ${getDirCoverage('src/hooks/', 'functions')}%
- **Branches**: ${getDirCoverage('src/hooks/', 'branches')}%
- **Statements**: ${getDirCoverage('src/hooks/', 'statements')}%

#### Services (src/services/)
- **Lines**: ${getDirCoverage('src/services/', 'lines')}%
- **Functions**: ${getDirCoverage('src/services/', 'functions')}%
- **Branches**: ${getDirCoverage('src/services/', 'branches')}%
- **Statements**: ${getDirCoverage('src/services/', 'statements')}%

#### Utils (src/utils/)
- **Lines**: ${getDirCoverage('src/utils/', 'lines')}%
- **Functions**: ${getDirCoverage('src/utils/', 'functions')}%
- **Branches**: ${getDirCoverage('src/utils/', 'branches')}%
- **Statements**: ${getDirCoverage('src/utils/', 'statements')}%

## Files with Low Coverage

${getLowCoverageFiles()}

## Recommendations

1. **Focus on uncovered lines** in critical business logic
2. **Add integration tests** for complex user flows
3. **Mock external dependencies** to improve test reliability
4. **Use test-driven development** for new features

## Coverage Reports

- **HTML Report**: \`coverage/index.html\`
- **LCOV Report**: \`coverage/lcov.info\`
- **JSON Summary**: \`coverage/coverage-summary.json\`

## Commands

\`\`\`bash
# Run tests with coverage
npm run test:coverage

# View HTML coverage report
open coverage/index.html

# Generate this report
node scripts/coverage-report.js
\`\`\`
`;

  fs.writeFileSync(reportPath, report);
  log(`Coverage report saved to: ${reportPath}`, 'green');
  
  return reportPath;
}

function getDirCoverage(dir, metric) {
  const dirFiles = Object.keys(coverageSummary).filter(file => 
    file.includes(dir) && file !== 'total'
  );
  
  if (dirFiles.length === 0) return 'N/A';
  
  const dirStats = dirFiles.reduce((acc, file) => {
    acc.covered += coverageSummary[file][metric].covered;
    acc.total += coverageSummary[file][metric].total;
    return acc;
  }, { covered: 0, total: 0 });
  
  return dirStats.total > 0 ? (dirStats.covered / dirStats.total * 100).toFixed(1) : '0.0';
}

function getLowCoverageFiles() {
  const lowCoverageFiles = Object.entries(coverageSummary)
    .filter(([file, stats]) => file !== 'total' && stats.lines.pct < 80)
    .sort((a, b) => a[1].lines.pct - b[1].lines.pct);
  
  if (lowCoverageFiles.length === 0) {
    return 'No files with low coverage found.';
  }
  
  return lowCoverageFiles.map(([file, stats]) => 
    `- **${file}**: ${stats.lines.pct}% (${stats.lines.covered}/${stats.lines.total} lines)`
  ).join('\n');
}

function main() {
  log('🚀 Starting Coverage Analysis...', 'bright');
  
  try {
    // Generate coverage
    const coverageDir = generateCoverageReport();
    
    // Analyze coverage
    const coverageSummary = analyzeCoverage(coverageDir);
    
    if (!coverageSummary) {
      log('Failed to analyze coverage data', 'red');
      process.exit(1);
    }
    
    // Generate badge
    generateCoverageBadge(coverageSummary);
    
    // Check thresholds
    const thresholdsPassed = checkCoverageThresholds(coverageSummary);
    
    // Generate detailed report
    generateCoverageReport();
    
    // Final summary
    log('\n✨ Coverage Analysis Complete!', 'green');
    log(`HTML Report: ${path.join(coverageDir, 'index.html')}`, 'blue');
    log(`Coverage Badge: coverage-badge.md`, 'blue');
    log(`Detailed Report: COVERAGE_REPORT.md`, 'blue');
    
    if (!thresholdsPassed) {
      log('\n⚠️  Some coverage thresholds were not met.', 'yellow');
      process.exit(1);
    }
    
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateCoverageReport,
  analyzeCoverage,
  generateCoverageBadge,
  checkCoverageThresholds,
};
