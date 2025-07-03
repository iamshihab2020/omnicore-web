#!/bin/bash

# Navigate to the project directory
cd $(dirname "$0")/../..

# Run tests for the settings app
python manage.py test apps.settings.counters

echo "Counter tests completed."
