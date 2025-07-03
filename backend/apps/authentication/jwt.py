from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()


class DebugJWTAuthentication(JWTAuthentication):
    """
    A custom JWT Authentication class for debugging purposes.
    This extends the standard JWTAuthentication to add more debugging.
    """

    def authenticate(self, request):
        print("DEBUG JWT Auth: Attempting to authenticate")

        header = self.get_header(request)
        if header is None:
            print("DEBUG JWT Auth: No Auth header found")
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            print("DEBUG JWT Auth: No token found in header")
            return None

        print(f"DEBUG JWT Auth: Raw token found: {raw_token[:20]}...")

        try:
            validated_token = self.get_validated_token(raw_token)
            print("DEBUG JWT Auth: Token validated successfully")
            print(f"DEBUG JWT Auth: Token payload: {validated_token}")

            user = self.get_user(validated_token)
            print(f"DEBUG JWT Auth: User retrieved: {user}, ID: {user.id}")

            # Set user on request explicitly to ensure middleware can access it
            request.auth_user = user

            return (user, validated_token)
        except InvalidToken as e:
            print(f"DEBUG JWT Auth: Invalid token: {str(e)}")
            raise
        except AuthenticationFailed as e:
            print(f"DEBUG JWT Auth: Authentication failed: {str(e)}")
            raise
        except Exception as e:
            print(f"DEBUG JWT Auth: Other exception: {str(e)}")
            raise

    def authenticate_header(self, request):
        print("DEBUG JWT Auth: authenticate_header called")
        return super().authenticate_header(request)
