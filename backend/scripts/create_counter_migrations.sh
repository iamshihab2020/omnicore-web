#!/bin/bash

# Navigate to the project directory
cd $(dirname "$0")/../..

# Make migrations
python manage.py makemigrations settings

# Apply migrations
python manage.py migrate

echo "Counter model migrations have been created and applied."
