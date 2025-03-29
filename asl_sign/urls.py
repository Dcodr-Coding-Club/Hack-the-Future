from django.urls import path
from .views import text_to_sign, input_page

urlpatterns = [
    path('input/', input_page, name='input_page'),  # ✅ Default page for input
    path('text-to-sign/', text_to_sign, name='text_to_sign'),
]
