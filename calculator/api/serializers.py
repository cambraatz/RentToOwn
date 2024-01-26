from rest_framework import serializers
from .models import DataField

class DataFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataField
        fields = '__all__'

class CreateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataField
        fields = '__all__'

'''
class createTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = dataField
        fields = '__all__'
'''