const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const execSync = require('child_process').execSync;

let config;
let categories = [];
let items = [];
let stackableCategories = ['Ammo', 'Consumables', 'Recipes', 'Ingredients'];

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

// Display items in pages for selection
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

// Select an item from the list
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

// Get rarity for an item
function getItemRarity() {
    const rarities = ['common', 'uncommon', 'rare', 'superior', 'legendary'];
    const rarityChoice = readlineSync.keyInSelect(rarities, 'Select item rarity');
    return rarities[rarityChoice] || 'common';
}

// Get level for an item
function getItemLevel() {
    return readlineSync.questionInt('Enter item level (1-30): ', {
        limit: '$<30',
        limitMessage: 'Please enter a valid level (1-30).'
    });
}

// Get count if the item is stackable
function getItemCount(category) {
    if (stackableCategories.includes(category)) {
        return readlineSync.questionInt('Enter item count (default is 1): ', {
            defaultInput: 1,
            limit: '$<10000',
            limitMessage: 'Please enter a valid count (1-10000).'
        });
    } else {
        return null;  // No count needed for non-stackable items
    }
}

// Generate command for adding an item
function generateAddItemCommand(item) {
    const isAmmoArchetype = item.category === 'AmmoArchetype';
    const rarity = isAmmoArchetype ? null : getItemRarity();  // Skip rarity for AmmoArchetype
    const level = isAmmoArchetype ? null : getItemLevel();    // Skip level for AmmoArchetype
    const count = getItemCount(item.category);

    let command = `di2save player inventory add --file ${config.saveFilePath} --name ${item.name}`;

    // Only add rarity and level for non-AmmoArchetype items
    if (!isAmmoArchetype && rarity) {
        command += ` --rarity ${rarity}`;
    }
    if (!isAmmoArchetype && level) {
        command += ` --level ${level}`;
    }

    // Add count for all items (including AmmoArchetype)
    if (count) {
        command += ` --count ${count}`;
    }

    // Append --no-version-safety to the command
    command += " --no-version-safety";

    console.log('\nGenerated command:');
    console.log(command);
    return command;
}


// Generate command for editing an item
function generateEditItemCommand(item) {
    const itemId = readlineSync.question('Enter the item ID to edit: ').trim();
    if (!itemId) {
        console.log('Error: Item ID is required.');
        return null;
    }

    const rarity = getItemRarity();
    const level = getItemLevel();
    const count = getItemCount(item.category);

    let command = `di2save player inventory edit --file ${config.saveFilePath} --item ${itemId} --rarity ${rarity} --level ${level}`;
    if (count) {
        command += ` --count ${count}`;
    }

    // Append --no-version-safety to the command
    command += " --no-version-safety";

    console.log('\nGenerated command for editing:');
    console.log(command);
    return command;
}


// Execute the generated command
function executeCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('Command executed successfully!');
    } catch (error) {
        console.error('Error executing the command:', error.message);
    }
}

// Main menu and program flow
function main() {
    loadConfig();
    loadItems();
    loadCategories();

    console.log('Welcome to the Dead Island 2 Save Editor Command Generator!');
    console.log('Choose an action:');
    console.log('1. Add an item to inventory');
    console.log('2. Edit an existing item in inventory');
    console.log('3. Exit');
    
    const choice = readlineSync.question('Enter your choice: ').trim();

    if (choice === '1') {
        const item = selectItem();
        if (item) {
            const command = generateAddItemCommand(item);
            const execute = readlineSync.keyInYNStrict('Do you want to execute this command?');
            if (execute && command) {
                executeCommand(command);
            } else {
                console.log('Command execution canceled.');
            }
        }
    } else if (choice === '2') {
        const item = selectItem();
        if (item) {
            const command = generateEditItemCommand(item);
            const execute = readlineSync.keyInYNStrict('Do you want to execute this command?');
            if (execute && command) {
                executeCommand(command);
            } else {
                console.log('Command execution canceled.');
            }
        }
    } else if (choice === '3') {
        console.log('Exiting...');
    } else {
        console.log('Invalid choice.');
    }
}

main();
