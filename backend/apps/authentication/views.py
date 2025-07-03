from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.conf import settings
import uuid

from .serializers import (
    UserSerializer, 
    RegisterSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from .models import PasswordResetToken

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain view to add user details to response"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Get user from request
            email = request.data.get('email', '')
            try:
                user = User.objects.get(email=email)
                # Add user details to the response
                user_serializer = UserSerializer(user)
                response.data['user'] = user_serializer.data
                
                # Add tenant information
                from apps.tenants.models import TenantUser
                from apps.tenants.serializers import TenantSerializer
                
                tenant_users = TenantUser.objects.filter(user=user, is_active=True)
                tenants_data = []
                
                for tenant_user in tenant_users:
                    tenant_data = TenantSerializer(tenant_user.tenant).data
                    tenant_data['role'] = tenant_user.role
                    tenants_data.append(tenant_data)
                
                response.data['tenants'] = tenants_data
            except User.DoesNotExist:
                pass
                
        return response


class LogoutView(APIView):
    """Logout view to blacklist the refresh token"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": "Error logging out."}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    """Register a new user"""
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class UserDetailsView(generics.RetrieveUpdateAPIView):
    """Get or update the authenticated user's details"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class PasswordChangeView(APIView):
    """Change password for authenticated user"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Request password reset via email"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                
                # Create or update reset token
                token = PasswordResetToken.objects.create(
                    user=user,
                    expires_at=timezone.now() + timedelta(hours=24)
                )
                
                # Here you would typically send an email with the reset link
                # For this example, we'll just return the token
                reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token.token}"
                
                # TODO: Send email with reset_url
                
                return Response({
                    "detail": "Password reset link sent to email.",
                    # In production, don't return the token directly
                    "token": token.token 
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                # To prevent user enumeration, always return success even if user not found
                return Response({"detail": "If this email exists, a password reset link was sent."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Confirm password reset with token"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token_uuid = serializer.validated_data['token']
            token = get_object_or_404(PasswordResetToken, token=token_uuid, is_used=False)
            
            # Check if token is expired
            if token.expires_at < timezone.now():
                return Response({"token": "Token has expired."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Reset the password
            user = token.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Mark token as used
            token.is_used = True
            token.save()
            
            return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
