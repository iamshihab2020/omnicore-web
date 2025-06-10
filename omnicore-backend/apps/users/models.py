from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
from core.models.abstract_models import TimeStampedModel, SoftDeleteModel
from tenants_app.models import Tenant


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "SUPER_ADMIN")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    Custom User model that supports using email instead of username
    and includes tenant relationship and role.
    """

    ROLE_CHOICES = [
        ("SUPER_ADMIN", "Super Admin"),
        ("TENANT", "Tenant"),
        ("MANAGER", "Manager"),
        ("STAFF", "Staff"),
        ("CASHIER", "Cashier"),
        ("WAITER", "Waiter"),
    ]

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # User role
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="STAFF")

    # Multi-tenancy: link users to their tenant (except super admins)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="users", null=True, blank=True
    )

    # Custom permissions for this user within their tenant
    permissions = models.JSONField(default=dict, blank=True)

    # The profile picture of the user
    profile_picture = models.ImageField(
        upload_to="users/profile_pictures/", null=True, blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name if self.first_name else self.email

    @property
    def is_tenant_owner(self):
        """Check if user is the main tenant owner."""
        return self.role == "TENANT"

    @property
    def is_super_admin(self):
        """Check if user is a super admin."""
        return self.role == "SUPER_ADMIN"
