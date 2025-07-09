# Scripts

This directory contains utility scripts for maintaining and developing the AI-Demystified Jekyll site.

## Available Scripts

### `glossary_updater.py`

Updates the glossary entries JSON file by scanning for new markdown files in the glossary directory.

**Purpose:** Automatically creates new glossary entries for markdown files that don't have corresponding entries in the `glossary-entries.json` file, maintaining alphabetical order.

**Usage:**
```bash
python scripts/glossary_updater.py <glossary-entries.json> <directory_path>
```

**Example:**
```bash
python scripts/glossary_updater.py glossary-entries.json content/glossary/glossary_docs/
```

**What it does:**
- Reads existing entries from `glossary-entries.json`
- Scans the specified directory for `.md` files
- For each markdown file without a corresponding JSON entry:
  - Creates a new entry with the filename as the slug
  - Converts the filename to a proper title (e.g., "microsoft-bing" → "Microsoft Bing")
  - Generates the appropriate URL path
- Sorts all entries alphabetically by title
- Overwrites the original JSON file with the updated entries

**Requirements:**
- Python 3.6+
- Standard library only (no additional dependencies)

**Output:**
The script provides clear feedback about which files already have entries and which new entries are being created.