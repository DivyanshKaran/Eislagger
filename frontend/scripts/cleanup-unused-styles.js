#!/usr/bin/env node

/**
 * CSS Cleanup Script
 * Identifies and removes unused CSS classes and styles
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  srcDir: 'src',
  cssFiles: ['src/app/globals.css', 'src/styles/**/*.css'],
  tsxFiles: 'src/**/*.{tsx,ts}',
  outputFile: 'unused-styles-report.md',
  dryRun: true, // Set to false to actually remove unused styles
};

// Extract CSS classes from files
function extractClassesFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classRegex = /className\s*=\s*["'`]([^"'`]+)["'`]/g;
  const classes = new Set();
  
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    const classString = match[1];
    // Split by spaces and filter out template literals and dynamic classes
    classString.split(/\s+/).forEach(cls => {
      if (cls && !cls.includes('${') && !cls.includes('{') && !cls.includes('}')) {
        classes.add(cls);
      }
    });
  }
  
  return Array.from(classes);
}

// Extract CSS classes from CSS files
function extractCSSClasses(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classRegex = /\.([a-zA-Z][a-zA-Z0-9_-]*)/g;
  const classes = new Set();
  
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    classes.add(match[1]);
  }
  
  return Array.from(classes);
}

// Get all files
function getAllFiles(pattern) {
  return glob.sync(pattern, { cwd: process.cwd() });
}

// Main cleanup function
function cleanupUnusedStyles() {
  console.log('🔍 Analyzing CSS usage...');
  
  // Get all TSX/TS files
  const tsxFiles = getAllFiles(config.tsxFiles);
  console.log(`📁 Found ${tsxFiles.length} TSX/TS files`);
  
  // Get all CSS files
  const cssFiles = getAllFiles(config.cssFiles);
  console.log(`🎨 Found ${cssFiles.length} CSS files`);
  
  // Extract used classes from TSX files
  const usedClasses = new Set();
  tsxFiles.forEach(file => {
    const classes = extractClassesFromFile(file);
    classes.forEach(cls => usedClasses.add(cls));
  });
  
  console.log(`✅ Found ${usedClasses.size} used CSS classes`);
  
  // Extract defined classes from CSS files
  const definedClasses = new Set();
  cssFiles.forEach(file => {
    const classes = extractCSSClasses(file);
    classes.forEach(cls => definedClasses.add(cls));
  });
  
  console.log(`🎨 Found ${definedClasses.size} defined CSS classes`);
  
  // Find unused classes
  const unusedClasses = Array.from(definedClasses).filter(cls => !usedClasses.has(cls));
  
  console.log(`❌ Found ${unusedClasses.length} potentially unused classes`);
  
  // Generate report
  const report = generateReport(usedClasses, definedClasses, unusedClasses, tsxFiles, cssFiles);
  
  // Write report
  fs.writeFileSync(config.outputFile, report);
  console.log(`📊 Report written to ${config.outputFile}`);
  
  // Show summary
  console.log('\n📋 Summary:');
  console.log(`   Used classes: ${usedClasses.size}`);
  console.log(`   Defined classes: ${definedClasses.size}`);
  console.log(`   Unused classes: ${unusedClasses.length}`);
  console.log(`   Usage ratio: ${((usedClasses.size / definedClasses.size) * 100).toFixed(1)}%`);
  
  if (unusedClasses.length > 0) {
    console.log('\n⚠️  Potentially unused classes:');
    unusedClasses.slice(0, 20).forEach(cls => console.log(`   - ${cls}`));
    if (unusedClasses.length > 20) {
      console.log(`   ... and ${unusedClasses.length - 20} more`);
    }
  }
  
  return {
    usedClasses,
    definedClasses,
    unusedClasses,
    usageRatio: usedClasses.size / definedClasses.size,
  };
}

// Generate markdown report
function generateReport(usedClasses, definedClasses, unusedClasses, tsxFiles, cssFiles) {
  const timestamp = new Date().toISOString();
  
  return `# CSS Cleanup Report

Generated: ${timestamp}

## Summary

- **Used Classes**: ${usedClasses.size}
- **Defined Classes**: ${definedClasses.size}
- **Unused Classes**: ${unusedClasses.length}
- **Usage Ratio**: ${((usedClasses.size / definedClasses.size) * 100).toFixed(1)}%

## Files Analyzed

### TSX/TS Files (${tsxFiles.length})
${tsxFiles.map(file => `- ${file}`).join('\n')}

### CSS Files (${cssFiles.length})
${cssFiles.map(file => `- ${file}`).join('\n')}

## Unused Classes (${unusedClasses.length})

${unusedClasses.map(cls => `- \`${cls}\``).join('\n')}

## Used Classes (${usedClasses.size})

${Array.from(usedClasses).sort().map(cls => `- \`${cls}\``).join('\n')}

## Recommendations

1. **Review unused classes** - Some may be used dynamically or in templates
2. **Check for false positives** - Classes used in JavaScript strings or computed values
3. **Consider keeping utility classes** - Even if unused now, they might be needed later
4. **Remove confirmed unused classes** - Only after thorough review

## Next Steps

1. Review the unused classes list
2. Check for dynamic usage patterns
3. Remove confirmed unused classes
4. Re-run the analysis to verify cleanup

---
*Generated by CSS Cleanup Script*
`;
}

// Run the cleanup
if (require.main === module) {
  try {
    const result = cleanupUnusedStyles();
    
    if (result.unusedClasses.length > 0) {
      console.log('\n💡 Tip: Review the unused classes before removing them.');
      console.log('   Some classes might be used dynamically or in templates.');
    } else {
      console.log('\n🎉 No unused classes found!');
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

module.exports = { cleanupUnusedStyles };
