# Dead Island 2 Save Editor Command Generator

Welcome to the **Dead Island 2 Save Editor Command Generator**! This tool allows you to easily generate commands to add, remove, or edit items in your Dead Island 2 save game file.

## Features

- **Add Items to Inventory**: Generate commands to add items to your Dead Island 2 inventory.
- **Remove Items from Inventory**: Generate commands to remove items by entry ID.
- **Edit Items in Inventory**: Modify item attributes such as rarity, level, seed, and durability.

## Requirements

Before you can use this tool, make sure you have the following:

- [Node.js](https://nodejs.org/) installed on your system (version 14.x or higher).
- Your *DECRYPTED* Dead Island 2 save game file (e.g., `ue4savegame.ps4.sav`).
- CSV files containing item data (`Items.csv`, `Weapon_Types.csv`, `Categories.csv`, `Rarities.csv`).

## Setup Instructions

### Step 1: Install Node.js

If you don’t have Node.js installed, follow these steps:

1. Download the [Node.js installer](https://nodejs.org/en/download/).
2. Install Node.js by running the downloaded installer and following the instructions.

### Step 2: Download and Extract the Tool

1. [Download this tool]((https://github.com/Atomic0utlaw/DI2SE/archive/refs/heads/main.zip)).
2. Extract the contents to a folder of your choice.

### Step 3: Install Dependencies

In the extracted folder, open a terminal (or Command Prompt on Windows) and run the following command to install the required Node.js dependencies:

```
npm install
```

This will install readline-sync and any other necessary dependencies.

### Step 4: Configure the Tool

Place your save file (ue4savegame.ps4.sav) in the project directory.
Make sure the CSV files (Items.csv, Weapon_Types.csv, Categories.csv, Rarities.csv) are in the same directory or update the paths in config.json if they are stored elsewhere.

### Step 5: Running the Tool
Once the dependencies are installed and everything is set up, run the following command in the terminal to start the tool:

```
npm start
```

You will be presented with a menu to choose actions like adding, removing, or editing items in your inventory.

## Usage
- Menu Options
- Add an item to inventory: Add an item from the available categories and weapons.
- Remove an item from inventory: Remove an item by its entry ID.
- Edit an item in inventory: Modify an existing item’s attributes such as rarity, level, and durability.
- Exit: Exit the tool.

### Follow the on-screen prompts to generate the appropriate command.

Example Commands
Add an item:

```
di2save player inventory add --file ue4savegame.ps4.sav --name "Item Name" --type "Weapon Type" --rarity "Rare" --level 10 --no-version-safety
```

Remove an item:

```
di2save player inventory rm --file ue4savegame.ps4.sav 12345 --no-version-safety
```

Edit an item:

```
di2save player inventory edit --file ue4savegame.ps4.sav --item 12345 --seed 56789 --rarity "Epic" --level 15 --durability 100 --no-version-safety
```

## Troubleshooting
Issue: The tool doesn’t start.
Solution: Make sure Node.js is installed correctly and dependencies are up to date by running npm install.

Issue: Incorrect item/category data.
Solution: Ensure your CSV files are correctly formatted and located in the correct directory.

## Contributing
If you'd like to contribute, feel free to fork the repository, create a new branch, and submit a pull request.

## To Do:
- Add more advanced inventory management features.
- Include additional configuration options for customizing the save file path and CSV locations.
- License
- This project is licensed under the MIT License - see the LICENSE file for details.

Enjoy your modified Dead Island 2 save game!

vbnet
Copy code

### Explanation of Sections:
- **Features**: Highlights what the tool can do.
- **Requirements**: Lists software requirements for the tool to run.
- **Setup Instructions**: Guides users on how to set up the tool and dependencies.
- **Usage**: Explains the basic functionality and command generation.
- **Example Commands**: Provides sample commands the user can expect when using the tool.
- **Troubleshooting**: Offers solutions for common issues.
- **Contributing**: Allows other developers to contribute or track features still to be added.

This `README.md` is designed for GitHub and provides a clear, step-by-step gui
