from django.urls import path, include

urlpatterns = [
    path("table/", include("apps.management.table.urls")),
]
