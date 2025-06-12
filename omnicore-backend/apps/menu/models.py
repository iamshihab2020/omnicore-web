from django.db import models
from apps.tenants.models import Tenant
import uuid


class Category(models.Model):
    """Menu category model"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="categories"
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="category_images/", null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["display_order", "name"]
        unique_together = ["tenant", "name"]

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class MenuItem(models.Model):
    """Menu item model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="menu_items"
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, related_name="items", null=True, blank=True
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to="menu_item_images/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    preparation_time = models.IntegerField(
        default=0, help_text="Preparation time in minutes"
    )
    calories = models.IntegerField(default=0)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"


class MenuItemVariant(models.Model):
    """
    Variants for menu items (e.g., Small, Medium, Large for pizzas)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    menu_item = models.ForeignKey(
        MenuItem, on_delete=models.CASCADE, related_name="variants"
    )
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item Variant"
        verbose_name_plural = "Menu Item Variants"
        ordering = ["display_order", "name"]
        unique_together = ["menu_item", "name"]

    def __str__(self):
        return f"{self.menu_item.name} - {self.name}"


class MenuItemAddon(models.Model):
    """
    Add-ons for menu items (e.g., extra cheese, toppings, etc.)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="addons")
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item Addon"
        verbose_name_plural = "Menu Item Addons"

    def __str__(self):
        return f"{self.name} - {self.price}"


class MenuItemAddonGroup(models.Model):
    """
    Group of add-ons for menu items (e.g., toppings, sauces, etc.)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="addon_groups"
    )
    name = models.CharField(max_length=50)
    is_required = models.BooleanField(default=False)
    min_selections = models.IntegerField(default=0)
    max_selections = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item Addon Group"
        verbose_name_plural = "Menu Item Addon Groups"

    def __str__(self):
        return self.name


class MenuItemAddonGroupItem(models.Model):
    """
    Relationship between addon groups and addons
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group = models.ForeignKey(
        MenuItemAddonGroup, on_delete=models.CASCADE, related_name="items"
    )
    addon = models.ForeignKey(
        MenuItemAddon, on_delete=models.CASCADE, related_name="groups"
    )
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item Addon Group Item"
        verbose_name_plural = "Menu Item Addon Group Items"
        ordering = ["display_order"]
        unique_together = ["group", "addon"]

    def __str__(self):
        return f"{self.group.name} - {self.addon.name}"
