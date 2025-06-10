from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Security settings
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Static files handling
STATIC_ROOT = BASE_DIR / "staticfiles"

# Whitelist allowed hosts
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "example.com").split(",")

# Restrict CORS in production
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "https://example.com").split(
    ","
)
CORS_ALLOW_ALL_ORIGINS = False
SECURE_BROWSER_XSS_FILTER = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = "DENY"

# Only use HTTPS for session cookies
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
