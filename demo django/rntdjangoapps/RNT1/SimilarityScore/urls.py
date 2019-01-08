from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name = 'upload-home'),
    path('score1', views.score_page, name = 'score-page'),
    # path('score_results/', views.score_page, name = 'score-result_page')
]