from django.urls import path, include

urlpatterns = [
    path("counters/", include("apps.settings.counters.urls")),
    path("vat/", include("apps.settings.vat.urls")),
    # Add more settings modules here as needed
    # path("subscription/", include("apps.settings.subscription.urls")),
]
