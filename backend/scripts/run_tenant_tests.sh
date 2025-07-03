#!/bin/bash

echo "Running MenuItemViewSet tenant tests..."
cd omnicore-backend
python manage.py test apps.menu.tests.MenuItemViewSetTestCase
