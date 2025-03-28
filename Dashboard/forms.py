from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser

# Signup Form
class SignupForm(UserCreationForm):
    email = forms.EmailField()
    name = forms.CharField(max_length=100)
    age = forms.IntegerField()

    class Meta:
        model = CustomUser
        fields = ["name", "age", "email", "password1", "password2"]

# Login Form
class LoginForm(AuthenticationForm):
    username = forms.EmailField(label="Email")
