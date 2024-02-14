const fs = require('fs');
const path = require('path');

// Helper function to process input and generate counts
function processText(text, options) {
    const counts = {
        lines: options.includes('-l') ? (text.match(/\n/g) || []).length : undefined,
        words: options.includes('-w') ? (text.trim().split(/\s+/).length) : undefined,
        bytes: options.includes('-c') ? Buffer.byteLength(text, 'utf8') : undefined,
        chars: options.includes('-m') ? [...text].length : undefined,
    };
    return counts;
}

// Format and print the counts based on options
function printCounts(counts, fileName) {
    let result = '';
    if (counts.lines !== undefined) result += `${counts.lines} `;
    if (counts.words !== undefined) result += `${counts.words} `;
    if (counts.bytes !== undefined) result += `${counts.bytes} `;
    if (counts.chars !== undefined) result += `${counts.chars} `;
    console.log(`${result}${fileName}`);
}

// Process files or stdin based on arguments
const args = process.argv.slice(2);
const options = args.filter(arg => arg.startsWith('-'));
const files = args.filter(arg => !arg.startsWith('-'));

if (files.length > 0) {
    // Process each file
    files.forEach(file => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${file}: ${err}`);
                return;
            }
            const counts = processText(data, options);
            printCounts(counts, path.basename(file));
        });
    });
} else {
    // Process standard input
    let inputData = '';
    process.stdin.on('data', data => {
        inputData += data;
    });
    process.stdin.on('end', () => {
        const counts = processText(inputData, options);
        printCounts(counts, 'stdin');
    });
}
