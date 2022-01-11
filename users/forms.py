from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User

class CustomUserCreationForm(UserCreationForm):    
    class Meta:        
        model = User        
        fields = ('username', 'email', 'firstName', 'lastName')

class CustomUserChangeForm(UserChangeForm):    
    class Meta:        
        model = User        
        fields = UserChangeForm.Meta.fields