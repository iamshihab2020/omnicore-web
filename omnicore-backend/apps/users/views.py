from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
)
from core.permissions.permissions import IsSuperAdmin, IsTenant

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view that uses our enhanced serializer
    """

    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view
    """

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Add user details to response if available
        try:
            # Extract user ID from the refresh token
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            user_id = token.payload.get("user_id")

            if user_id:
                user = User.objects.get(id=user_id)
                response.data["user"] = UserSerializer(user).data
        except Exception:
            # If any error occurs during token processing, just return the original response
            pass

        return response


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response_data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to get or update user details
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """
    API endpoint for user logout - blacklist the refresh token
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST
            )


class TestAuthView(APIView):
    """
    A simple view to test if JWT authentication is working
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_data = {
            "id": request.user.id,
            "email": request.user.email,
            "role": request.user.role,
            "is_authenticated": request.user.is_authenticated,
        }

        if request.user.tenant:
            user_data["tenant"] = {
                "id": request.user.tenant.id,
                "name": request.user.tenant.name,
            }

        return Response({"message": "Authentication successful!", "user": user_data})
