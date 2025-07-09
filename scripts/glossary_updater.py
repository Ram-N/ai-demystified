#!/usr/bin/env python3
"""
Jekyll AI-Demystified Glossary Updater

This script updates the glossary-entries.json file by comparing existing entries
with .md files in a specified directory. It adds new entries for files that
don't have corresponding JSON entries and maintains alphabetical order.
"""

import json
import os
import sys
from pathlib import Path


def slugify_to_title(filename):
    """
    Convert a slugified filename to a proper title.
    
    Args:
        filename (str): Filename without extension (e.g., "microsoft-bing")
    
    Returns:
        str: Title-cased string (e.g., "Microsoft Bing")
    """
    # Replace hyphens and underscores with spaces
    title = filename.replace('-', ' ').replace('_', ' ')
    # Title case each word
    return title.title()


def load_glossary_entries(json_file_path):
    """
    Load existing glossary entries from JSON file.
    
    Args:
        json_file_path (str): Path to the glossary-entries.json file
    
    Returns:
        list: List of glossary entry dictionaries
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {json_file_path}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {json_file_path}")
        sys.exit(1)


def get_md_files(directory_path):
    """
    Get all .md files from the specified directory.
    
    Args:
        directory_path (str): Path to directory containing .md files
    
    Returns:
        list: List of filenames without .md extension
    """
    directory = Path(directory_path)
    if not directory.exists():
        print(f"Error: Directory {directory_path} does not exist")
        sys.exit(1)
    
    md_files = []
    for file_path in directory.glob("*.md"):
        md_files.append(file_path.stem)  # filename without extension
    
    return md_files


def save_glossary_entries(json_file_path, entries):
    """
    Save glossary entries to JSON file with proper formatting.
    
    Args:
        json_file_path (str): Path to the glossary-entries.json file
        entries (list): List of glossary entry dictionaries
    """
    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(entries, f, indent=2, ensure_ascii=False)
        print(f"Updated {json_file_path} successfully")
    except Exception as e:
        print(f"Error saving {json_file_path}: {e}")
        sys.exit(1)


def main():
    """Main function to update glossary entries."""
    if len(sys.argv) != 3:
        print("Usage: python script.py <glossary-entries.json> <directory_path>")
        print("Example: python script.py glossary-entries.json content/glossary/glossary_docs/")
        sys.exit(1)
    
    json_file_path = sys.argv[1]
    directory_path = sys.argv[2]
    
    # Load existing glossary entries
    print(f"Loading glossary entries from {json_file_path}...")
    glossary_entries = load_glossary_entries(json_file_path)
    
    # Get existing slugs for quick lookup
    existing_slugs = {entry['slug'] for entry in glossary_entries}
    
    # Get all .md files from directory
    print(f"Scanning directory {directory_path} for .md files...")
    md_files = get_md_files(directory_path)
    
    # Process each .md file
    new_entries_added = 0
    for filename in md_files:
        if filename in existing_slugs:
            print(f"✓ Found existing entry for: {filename}")
        else:
            print(f"+ Creating new entry for: {filename}")
            new_entry = {
                "slug": filename,
                "title": slugify_to_title(filename),
                "url": f"/content/glossary/{filename}"
            }
            glossary_entries.append(new_entry)
            new_entries_added += 1
    
    if new_entries_added > 0:
        # Sort entries alphabetically by title
        print(f"Sorting {len(glossary_entries)} entries alphabetically by title...")
        glossary_entries.sort(key=lambda x: x['title'].lower())
        
        # Save updated entries
        save_glossary_entries(json_file_path, glossary_entries)
        print(f"Added {new_entries_added} new entries to the glossary")
    else:
        print("No new entries needed - all .md files already have corresponding JSON entries")


if __name__ == "__main__":
    main()