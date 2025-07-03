from django.db import models
from apps.tenants.models import Tenant
from apps.authentication.models import User
import uuid


class POSSession(models.Model):
    """
    Model to represent a POS session (from open to close)
    """
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='pos_sessions')
    
    opened_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='opened_sessions', null=True)
    closed_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='closed_sessions', null=True)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    closing_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    
    expected_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    cash_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    card_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    other_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    opened_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'POS Session'
        verbose_name_plural = 'POS Sessions'
    
    def __str__(self):
        return f"Session {self.id[:8]} - {self.get_status_display()}"


class CashMovement(models.Model):
    """
    Model to record cash movements (cash in/out) during a POS session
    """
    MOVEMENT_TYPE_CHOICES = (
        ('in', 'Cash In'),
        ('out', 'Cash Out'),
    )
    
    REASON_CHOICES = (
        ('float', 'Float/Opening Balance'),
        ('sale', 'Sale'),
        ('refund', 'Refund'),
        ('withdrawal', 'Cash Withdrawal'),
        ('deposit', 'Cash Deposit'),
        ('petty_cash', 'Petty Cash'),
        ('other', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(POSSession, on_delete=models.CASCADE, related_name='cash_movements')
    
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    notes = models.TextField(blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='cash_movements', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Cash Movement'
        verbose_name_plural = 'Cash Movements'
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.amount}"
