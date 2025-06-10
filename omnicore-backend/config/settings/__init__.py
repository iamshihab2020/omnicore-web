import os

# Set the default settings module based on environment
environment = os.getenv("DJANGO_ENV", "dev")

if environment == "production":
    from .prod import *
else:
    from .dev import *
