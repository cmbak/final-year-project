from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Category, Label, Quiz, User

admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Label)
admin.site.register(Quiz)
