from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include("Dashboard.urls")),
    path('gamification/',include("gamification.urls")),
    path('plan/', include("AIPlanner.urls", namespace='AIPlanner')),
    path('speech/', include('speech_to_text.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
