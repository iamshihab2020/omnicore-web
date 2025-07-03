#!/usr/bin/env python
"""
tree.py - A script to print the directory tree structure of the omnicore-backend project.
This can be run from the project root to get an updated folder structure visualization.
"""

import os
import argparse
from pathlib import Path
import re


# ANSI color codes for prettier output
class Colors:
    BLUE = "\033[94m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    END = "\033[0m"


def is_excluded(path, exclude_patterns):
    """Check if path matches any of the exclude patterns."""
    path_str = str(path)
    return any(re.search(pattern, path_str) for pattern in exclude_patterns)


def print_tree(
    directory, prefix="", exclude_patterns=None, max_depth=None, current_depth=0
):
    """
    Recursively print the directory structure as a tree.

    Args:
        directory (Path): The directory to start from
        prefix (str): Prefix for the current line (used for indentation)
        exclude_patterns (list): List of regex patterns to exclude
        max_depth (int): Maximum depth to traverse
        current_depth (int): Current depth in the traversal
    """
    if exclude_patterns is None:
        exclude_patterns = []

    # Check max depth
    if max_depth is not None and current_depth > max_depth:
        return

    # Get contents sorted (dirs first, then files)
    contents = list(directory.iterdir())
    dirs = sorted([path for path in contents if path.is_dir()])
    files = sorted([path for path in contents if path.is_file()])

    # Process all directories
    for i, path in enumerate(dirs):
        if is_excluded(path, exclude_patterns):
            continue

        is_last = i == len(dirs) - 1 and len(files) == 0

        # Determine the connector and the next prefix
        if is_last:
            connector = "└── "
            next_prefix = prefix + "    "
        else:
            connector = "├── "
            next_prefix = prefix + "│   "

        # Print the directory name with color
        print(f"{prefix}{connector}{Colors.BLUE}{Colors.BOLD}{path.name}/{Colors.END}")

        # Recursively process subdirectory
        print_tree(path, next_prefix, exclude_patterns, max_depth, current_depth + 1)

    # Process all files
    for i, path in enumerate(files):
        if is_excluded(path, exclude_patterns):
            continue

        is_last = i == len(files) - 1

        # Determine the connector
        if is_last:
            connector = "└── "
        else:
            connector = "├── "

        # Color based on file extension
        if path.suffix in [".py"]:
            color = Colors.GREEN
        elif path.suffix in [".md", ".txt"]:
            color = Colors.YELLOW
        else:
            color = ""

        print(f"{prefix}{connector}{color}{path.name}{Colors.END}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate a tree view of the omnicore-backend project directory"
    )
    parser.add_argument(
        "-d",
        "--directory",
        type=str,
        default=".",
        help="Root directory to start from (default: current directory)",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="File to write the output to (default: print to console)",
    )
    parser.add_argument(
        "-x",
        "--exclude",
        type=str,
        nargs="+",
        default=[],
        help="Patterns to exclude (regex supported)",
    )
    parser.add_argument("--max-depth", type=int, help="Maximum depth to traverse")

    args = parser.parse_args()

    # Default exclude patterns
    default_excludes = [
        r"__pycache__",
        r"\.git",
        r"\.vscode",
        r"\.idea",
        r"venv",
        r"\.pyc$",
        r"\.pyo$",
        r"\.env$",
    ]

    # Combine user excludes with defaults
    exclude_patterns = default_excludes + args.exclude

    # Get the directory as a Path object
    directory = Path(args.directory).resolve()

    if not directory.exists():
        print(f"Error: Directory '{directory}' does not exist")
        return

    # Redirect output if needed
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            # Temporarily redirect stdout
            import sys

            old_stdout = sys.stdout
            sys.stdout = f

            print(f"Directory tree of {directory}:\n")
            print_tree(
                directory, exclude_patterns=exclude_patterns, max_depth=args.max_depth
            )

            sys.stdout = old_stdout
        print(f"Tree written to {args.output}")
    else:
        print(f"Directory tree of {directory}:\n")
        print_tree(
            directory, exclude_patterns=exclude_patterns, max_depth=args.max_depth
        )


if __name__ == "__main__":
    main()
