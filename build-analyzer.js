#!/usr/bin/env node

/**
 * Build Analysis Script
 * Analyzes the production build size and performance
 * 
 * Run with: npm run analyze-build
 */

const fs = require('fs');
const path = require('path');

const __dirname = path.dirname(require.main.filename || process.argv[1]);
const distDir = path.join(__dirname, 'dist');

/**
 * Get all files in dist directory
 */
function getDistFiles(dir = distDir, files = []) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Dist directory not found: ${dir}`);
    console.log('   Run: npm run build');
    process.exit(1);
  }

  const entries = fs.readdirSync(dir);

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getDistFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

/**
 * Calculate file sizes
 */
function analyzeFiles() {
  const files = getDistFiles();
  let totalSize = 0;

  const stats = files
    .map(file => {
      const size = fs.statSync(file).size;
      totalSize += size;
      const ext = path.extname(file);

      return {
        name: path.relative(distDir, file),
        size,
        sizeKB: size / 1024,
        sizePercent: 0,
        type: ext || 'unknown',
      };
    })
    .sort((a, b) => b.size - a.size);

  // Calculate percentages
  stats.forEach(stat => {
    stat.sizePercent = (stat.size / totalSize) * 100;
  });

  return { stats, totalSize };
}

/**
 * Group files by type
 */
function groupByType(stats) {
  return stats.reduce((acc, stat) => {
    const type = stat.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(stat);
    return acc;
  }, {});
}

/**
 * Print analysis report
 */
function printReport() {
  console.log('\n📦 Build Analysis Report\n');
  console.log('=' .repeat(70));

  const { stats, totalSize } = analyzeFiles();
  const grouped = groupByType(stats);

  // Total stats
  console.log(`\n📊 Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 Total Files: ${stats.length}\n`);

  // By type
  console.log('📈 Size by File Type:');
  console.log('-'.repeat(70));

  Object.entries(grouped)
    .sort((a, b) => {
      const aSizeSum = a[1].reduce((sum, stat) => sum + stat.size, 0);
      const bSizeSum = b[1].reduce((sum, stat) => sum + stat.size, 0);
      return bSizeSum - aSizeSum;
    })
    .forEach(([type, files]) => {
      const typeSize = files.reduce((sum, stat) => sum + stat.size, 0);
      const percent = (typeSize / totalSize) * 100;
      const bar = '█'.repeat(Math.round(percent / 2));
      console.log(
        `  ${type.padEnd(10)} ${(typeSize / 1024).toFixed(2).padStart(10)} KB  ${bar.padEnd(25)} ${percent.toFixed(1)}%`
      );
    });

  // Largest files
  console.log('\n\n🔝 Top 10 Largest Files:');
  console.log('-'.repeat(70));

  stats.slice(0, 10).forEach((stat, idx) => {
    const bar = '█'.repeat(Math.round(stat.sizePercent / 0.5));
    console.log(
      `  ${(idx + 1).toString().padStart(2)}. ${stat.name.padEnd(40)} ${stat.sizeKB.toFixed(2).padStart(10)} KB  ${bar.padEnd(15)} ${stat.sizePercent.toFixed(1)}%`
    );
  });

  // Optimization recommendations
  console.log('\n\n💡 Optimization Recommendations:');
  console.log('-'.repeat(70));

  const jsFiles = grouped['.js'] || [];
  const largeJs = jsFiles.filter(f => f.sizeKB > 100);

  if (largeJs.length > 0) {
    console.log(`\n  ⚠️  Found ${largeJs.length} JS files > 100KB (consider code splitting):`);
    largeJs.slice(0, 5).forEach(file => {
      console.log(`      • ${file.name} (${file.sizeKB.toFixed(2)} KB)`);
    });
  }

  // Check for duplicate patterns
  const fileNames = stats.map(s => s.name);
  const vendorCount = fileNames.filter(n => n.includes('vendor')).length;
  if (vendorCount > 1) {
    console.log(`\n  📦 Multiple vendor chunks detected: ${vendorCount}`);
    console.log('      Consider optimizing chunk strategy');
  }

  // CSS optimization
  const cssFiles = grouped['.css'] || [];
  const totalCss = cssFiles.reduce((sum, f) => sum + f.size, 0);
  if (totalCss > 100 * 1024) {
    console.log(`\n  🎨 CSS total size: ${(totalCss / 1024).toFixed(2)} KB`);
    console.log('      Consider: removing unused styles, using CSS modules');
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

/**
 * Check for common optimization opportunities
 */
function checkOptimizations() {
  console.log('🔍 Checking for optimization opportunities...\n');

  const { stats } = analyzeFiles();

  // Check for source maps
  const sourceMaps = stats.filter(s => s.name.endsWith('.js.map'));
  if (sourceMaps.length > 0) {
    const totalMapSize = sourceMaps.reduce((sum, s) => sum + s.size, 0);
    console.log(`⚠️  Source maps found: ${(totalMapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('   Remove in production builds: vite.config.ts → build.sourcemap = false\n');
  }

  // Check bundle health
  const totalSize = stats.reduce((sum, s) => sum + s.size, 0);
  const totalSizeMB = totalSize / 1024 / 1024;

  if (totalSizeMB > 5) {
    console.log(`⚠️  Bundle size: ${totalSizeMB.toFixed(2)} MB (consider > 2MB as large)`);
    console.log('   Actions:');
    console.log('   • Implement route-based code splitting');
    console.log('   • Use lazy loading for images');
    console.log('   • Enable gzip compression');
    console.log('   • Review dependencies for duplicates\n');
  } else if (totalSizeMB > 2) {
    console.log(`ℹ️  Bundle size: ${totalSizeMB.toFixed(2)} MB (acceptable for complex apps)`);
    console.log('   Continue monitoring and optimize as needed\n');
  } else {
    console.log(`✅ Bundle size: ${totalSizeMB.toFixed(2)} MB (good!)\n`);
  }
}

// Run analysis
try {
  printReport();
  checkOptimizations();
} catch (error) {
  console.error('❌ Error analyzing build:', error);
  process.exit(1);
}
