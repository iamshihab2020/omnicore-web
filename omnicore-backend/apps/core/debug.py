import json
import logging
import jwt
from django.http import JsonResponse
from django.conf import settings
from apps.tenants.models import TenantUser

logger = logging.getLogger(__name__)

class DebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request before the view is called
        if '/api/menu/' in request.path:
            # Log authentication info
            is_authenticated = hasattr(request, 'user') and request.user.is_authenticated
            user_email = getattr(request.user, 'email', 'unknown') if is_authenticated else 'anonymous'
            
            # Log headers
            tenant_slug = request.headers.get("X-Tenant-Slug")
            auth_header = request.headers.get("Authorization", "")
            
            print(f"DEBUG Path: {request.path}")
            print(f"DEBUG Method: {request.method}")
            print(f"DEBUG User: {user_email} (Authenticated: {is_authenticated})")
            print(f"DEBUG X-Tenant-Slug: {tenant_slug}")
            
            # Debug JWT token
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                print(f"DEBUG Token: {token[:20]}...")
                try:
                    # Try to decode token
                    decoded = jwt.decode(
                        token, 
                        settings.SECRET_KEY, 
                        algorithms=["HS256"],
                        options={"verify_signature": False}  # Just for debugging
                    )
                    print(f"DEBUG Token payload: {decoded}")
                    if 'user_id' in decoded:
                        print(f"DEBUG Token user_id: {decoded['user_id']}")
                        
                        # Manually validate if this is a valid user ID
                        from django.contrib.auth import get_user_model
                        User = get_user_model()
                        try:
                            user = User.objects.get(id=decoded['user_id'])
                            print(f"DEBUG Found user for token: {user.email} (ID: {user.id})")
                        except User.DoesNotExist:
                            print(f"DEBUG No user found for ID: {decoded['user_id']}")
                        except Exception as user_err:
                            print(f"DEBUG Error checking user: {str(user_err)}")
                except Exception as e:
                    print(f"DEBUG Token decode error: {str(e)}")
            else:
                print("DEBUG No valid Authorization header")
            
            # Check tenant context
            if hasattr(request, 'tenant'):
                print(f"DEBUG Tenant set: {request.tenant.name} ({request.tenant.slug})")
                
                # Check user-tenant relationship
                if is_authenticated:
                    try:
                        tenant_user = TenantUser.objects.get(
                            tenant=request.tenant,
                            user=request.user,
                            is_active=True
                        )
                        print(f"DEBUG User-Tenant relationship: {tenant_user.role}")
                    except TenantUser.DoesNotExist:
                        print("DEBUG User-Tenant relationship: NONE")
            else:
                print("DEBUG Tenant not set on request")
            
        response = self.get_response(request)
        
        # Process response after the view is called
        if '/api/menu/' in request.path:
            print(f"DEBUG Response status: {response.status_code}")
            if response.status_code == 403:
                print("DEBUG Permission denied in the view")
            
        return response
