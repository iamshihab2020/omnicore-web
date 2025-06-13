from django.urls import path, include

urlpatterns = [
    path("counters/", include("apps.settings.counters.urls")),
    # Add more settings modules here as needed
    # path("tax/", include("apps.settings.tax.urls")),
    # path("subscription/", include("apps.settings.subscription.urls")),
]
