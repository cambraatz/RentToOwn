from django.urls import path
from .views import DataFieldView, CreateDataView, GetData #, tableView
from rest_framework import routers

#router = routers.DefaultRouter()
#router.register(r'datafields', DataFieldView, 'datafield')

urlpatterns = [
    path('datafields', DataFieldView.as_view()),
    path('datafields/<str:user_id>', DataFieldView.as_view()),
    path('createdatafield', CreateDataView.as_view()),
    path('getdata', GetData.as_view()),
]

'''
urlpatterns = [
    path('datafield', dataFieldView.as_view()),
    path('tableview', tableView.as_view()),
]
'''