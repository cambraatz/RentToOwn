from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('Welcome', index),
    path('Calculator', index),
    path('Tutorial', index),
    path('Support', index),
    path('datafield/<str:user_id>', index),
]