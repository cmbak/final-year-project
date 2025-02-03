from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Answer, Category, Label, Question, Quiz, QuizLabels, User

admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Label)
admin.site.register(Quiz)
admin.site.register(QuizLabels)
admin.site.register(Question)
admin.site.register(Answer)
