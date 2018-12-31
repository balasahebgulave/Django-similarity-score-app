from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name = 'upload-home'),
    path('score/', views.score_page, name = 'score-page')
]