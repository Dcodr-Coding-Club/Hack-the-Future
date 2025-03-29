from django.contrib import admin
from django.utils.html import format_html
from .models import Quiz

class QuizAdmin(admin.ModelAdmin):
    list_display = ('question', 'level', 'display_question_image')  
    search_fields = ('question',)  
    list_filter = ('level',)

    def display_question_image(self, obj):
        if obj.question_image:
            return format_html('<img src="{}" width="50" height="50" />', obj.question_image.url)
        return "No Image"

    display_question_image.short_description = "Question Image"

admin.site.register(Quiz, QuizAdmin)


from django.contrib import admin
from .models import WordMatchQuestion

admin.site.register(WordMatchQuestion)
