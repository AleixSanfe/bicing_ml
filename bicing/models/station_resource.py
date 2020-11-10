from django.db import models
from import_export import resources
from bicing.models.station import Station

class StationResource(resources.ModelResource):

    class Meta:
        app_label = 'bicing'
        #id, address, name, capacity, lat, lng, alt
        model = Station
        import_id_fields = ['id', 'address', 'name', 'capacity', 'lat', 'lng', 'alt']
        fields = ('id', 'address', 'name', 'capacity', 'lat', 'lng', 'alt')