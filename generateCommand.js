const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { execSync } = require('child_process');

let config;
let categories = [];
let items = [];

// Load config and CSV files
function loadConfig() {
    config = require('./config.json');
    console.log('Config loaded:', config);
}

function loadCSV(filePath) {
    console.log(`Reading CSV from: ${filePath}`);
    const file = fs.readFileSync(filePath, 'utf8');
    return Papa.parse(file, { header: true, skipEmptyLines: true }).data;
}

function loadItems() {
    items = loadCSV(config.csvPaths.items);
}

function loadCategories() {
    categories = loadCSV(config.csvPaths.categories);
}

function displayItemList(page, itemsPerPage) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = items.slice(startIndex, endIndex);
    
    console.log(`\nShowing items ${startIndex + 1} to ${Math.min(endIndex, items.length)} of ${items.length}:`);
    
    currentPageItems.forEach((item, index) => {
        console.log(`${startIndex + index + 1}. ${item.name}`);
    });

    if (endIndex < items.length) {
        console.log("\nEnter 'next' to see more items.");
    }
}

function selectItem() {
    const itemsPerPage = 50;
    let page = 0;

    while (true) {
        displayItemList(page, itemsPerPage);
        const choice = readlineSync.question('Enter the item number (or "next" to continue, "exit" to cancel): ').trim();

        if (choice === 'exit') {
            console.log('Exiting...');
            return null;
        }

        if (choice.toLowerCase() === 'next') {
            if ((page + 1) * itemsPerPage < items.length) {
                page++;
            } else {
                console.log("You're already on the last page.");
            }
            continue;
        }

        const itemIndex = parseInt(choice) - 1;
        if (itemIndex >= 0 && itemIndex < items.length) {
            console.log(`You selected: ${items[itemIndex].name}`);
            return items[itemIndex]; // Return selected item
        } else {
            console.log('Invalid choice. Please try again.');
        }
    }
}

function getItemRarity() {
    const rarities = ['common', 'uncommon', 'rare', 'superior', 'legendary'];
    const rarityChoice = readlineSync.keyInSelect(rarities, 'Select item rarity');
    return rarities[rarityChoice] || 'common';
}

function getItemLevel() {
    const level = readlineSync.questionInt('Enter item level (e.g., 10): ', {
        limit: '$<1000',
        limitMessage: 'Please enter a valid level (1-1000).'
    });
    return level;
}

function getItemCount() {
    const count = readlineSync.questionInt('Enter item count (default is 1): ', {
        defaultInput: 1,
        limit: '$<10000',
        limitMessage: 'Please enter a valid count (1-10000).'
    });
    return count;
}

function getSeed() {
    const seed = readlineSync.questionInt('Enter item seed (default is 0): ', {
        defaultInput: 0,
        limit: '$<10000',
        limitMessage: 'Please enter a valid seed (0-10000).'
    });
    return seed;
}

function generateAddItemCommand(item) {
    const rarity = getItemRarity();
    const level = getItemLevel();
    const count = getItemCount();
    
    const command = `di2save player inventory add --file ${config.saveFilePath} --name ${item.name} --rarity ${rarity} --level ${level} --count ${count}`;
    
    console.log('\nGenerated command:');
    console.log(command);
    return command;
}

function generateEditItemCommand(item) {
    const seed = getSeed();
    const rarity = getItemRarity();
    const level = getItemLevel();
    const count = getItemCount();
    
    const command = `di2save player inventory edit --file ${config.saveFilePath} --item ${item.name} --seed ${seed} --rarity ${rarity} --level ${level} --count ${count}`;
    
    console.log('\nGenerated command:');
    console.log(command);
    return command;
}

function executeAddItemCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('Item added successfully!');
    } catch (error) {
        console.error('Error executing the command:', error.message);
    }
}

function executeEditItemCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('Item edited successfully!');
    } catch (error) {
        console.error('Error executing the command:', error.message);
    }
}

function main() {
    loadConfig();
    loadItems();
    loadCategories();

    console.log('Welcome to the Dead Island 2 Save Editor Command Generator!');
    console.log('Choose an action:');
    console.log('1. Add an item to inventory');
    console.log('2. Edit an item in inventory');
    console.log('3. Exit');
    
    const choice = readlineSync.question('Enter your choice: ').trim();

    if (choice === '1') {
        // Add an item to inventory
        const item = selectItem();
        if (item) {
            const command = generateAddItemCommand(item);
            const execute = readlineSync.keyInYNStrict('Do you want to execute this command?');
            if (execute) {
                executeAddItemCommand(command);
            } else {
                console.log('Command execution canceled.');
            }
        }
    } else if (choice === '2') {
        // Edit an item in inventory
        const item = selectItem();
        if (item) {
            const command = generateEditItemCommand(item);
            const execute = readlineSync.keyInYNStrict('Do you want to execute this command?');
            if (execute) {
                executeEditItemCommand(command);
            } else {
                console.log('Command execution canceled.');
            }
        }
    } else if (choice === '3') {
        console.log('Exiting...');
        return;
    } else {
        console.log('Invalid choice.');
    }
}

main();
