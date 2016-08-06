from django.contrib import auth
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm


class UserAuthenticationForm(AuthenticationForm):
    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request, *args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'required': True})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'required': True})


class UserRegistrationForm(UserCreationForm):
    def __init__(self, request=None, **kwargs):
        super().__init__(**kwargs)
        self.request = request

        self.fields['username'].widget.attrs.update({'class': 'form-control', 'required': True})
        self.fields['password1'].widget.attrs.update({'class': 'form-control', 'required': True})
        self.fields['password2'].widget.attrs.update({'class': 'form-control', 'required': True})

    def save(self, commit=True, login=False):
        user = super().save(commit=commit)

        if commit and login:
            user = auth.authenticate(username=self.cleaned_data['username'], password=self.cleaned_data['password1'])
            auth.login(self.request, user)

        return user
