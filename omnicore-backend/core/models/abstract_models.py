from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    created and modified fields.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """
    An abstract base class model that provides soft delete functionality
    """

    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def delete(self, using=None, keep_parents=False):
        """
        Soft delete the object by setting is_active to False and
        recording the time of deletion
        """
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """
        Permanently delete the object from the database
        """
        return super().delete(using, keep_parents)

    class Meta:
        abstract = True
