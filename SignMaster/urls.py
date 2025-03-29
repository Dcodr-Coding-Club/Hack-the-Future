

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('/plan',include("AIPlanner.urls")),
    path('',include("Dashboard.urls")),
    path('gamification/',include("gamification.urls")),
    path('dashboard/', include('asl_sign.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
