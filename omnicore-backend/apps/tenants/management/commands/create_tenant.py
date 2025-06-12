from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from apps.authentication.models import User
from apps.tenants.models import Tenant, TenantUser
import getpass


class Command(BaseCommand):
    help = 'Creates a new tenant with an owner'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, help='Name of the tenant')
        parser.add_argument('--email', type=str, help='Email of the tenant owner')
        parser.add_argument('--password', type=str, help='Password for the tenant owner')
        parser.add_argument('--first_name', type=str, help='First name of the tenant owner')
        parser.add_argument('--last_name', type=str, help='Last name of the tenant owner')

    def handle(self, *args, **options):
        # Get tenant name
        tenant_name = options.get('name')
        if not tenant_name:
            tenant_name = input('Enter tenant name: ')
        
        # Get owner email
        owner_email = options.get('email')
        if not owner_email:
            owner_email = input('Enter owner email: ')
        
        # Check if email already exists
        if User.objects.filter(email=owner_email).exists():
            raise CommandError(f'User with email {owner_email} already exists')
        
        # Get owner first name
        owner_first_name = options.get('first_name')
        if not owner_first_name:
            owner_first_name = input('Enter owner first name: ')
        
        # Get owner last name
        owner_last_name = options.get('last_name')
        if not owner_last_name:
            owner_last_name = input('Enter owner last name: ')
        
        # Get password
        password = options.get('password')
        if not password:
            password = getpass.getpass('Enter password: ')
            password_confirm = getpass.getpass('Confirm password: ')
            
            if password != password_confirm:
                raise CommandError('Passwords do not match')
        
        # Create owner
        self.stdout.write('Creating user...')
        user = User.objects.create_user(
            email=owner_email,
            password=password,
            first_name=owner_first_name,
            last_name=owner_last_name,
            is_active=True
        )
        
        # Create tenant
        self.stdout.write('Creating tenant...')
        tenant = Tenant.objects.create(
            name=tenant_name,
            slug=slugify(tenant_name),
            owner=user,
            is_active=True
        )
        
        # Create tenant-user relationship
        self.stdout.write('Creating tenant-user relationship...')
        TenantUser.objects.create(
            tenant=tenant,
            user=user,
            role='owner',
            is_active=True
        )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created tenant "{tenant_name}" with owner {owner_email}'))
