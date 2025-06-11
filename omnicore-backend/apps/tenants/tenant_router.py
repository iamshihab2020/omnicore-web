from django.db import connections
from django.conf import settings
import threading

# Thread-local storage for the current tenant
_thread_local = threading.local()


class TenantRouter:
    """
    Database router that routes queries based on the current tenant

    This is a placeholder for a more complex router that would handle
    actual database isolation for tenants. In a production system, you might
    use actual database separation, schema separation, or other isolation techniques.
    """

    def _get_tenant_db(self):
        """
        Get the database connection name for the current tenant.
        Currently returns 'default' since we're using a single database with row-level tenant filtering.
        In a real implementation, this might return different connection names.
        """
        return "default"

    def db_for_read(self, model, **hints):
        """
        All read operations go to the tenant's database
        """
        if hasattr(model, "tenant_id"):
            return self._get_tenant_db()
        return "default"

    def db_for_write(self, model, **hints):
        """
        All write operations go to the tenant's database
        """
        if hasattr(model, "tenant_id"):
            return self._get_tenant_db()
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both objects are in the same tenant
        """
        # If both objects have tenant_id attribute, ensure they're the same
        if hasattr(obj1, "tenant_id") and hasattr(obj2, "tenant_id"):
            return obj1.tenant_id == obj2.tenant_id

        # Allow relations if at least one object doesn't have tenant_id
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure all migrations run on the default database
        """
        return True
