from django.contrib import admin
from bicing.models.station import Station
from bicing.models.station_resource import StationResource
from import_export.admin import ImportExportModelAdmin

@admin.register(Station)
class StationAdmin(ImportExportModelAdmin):
    resource_class = StationResource
    list_display = ['id', 'name', 'capacity', 'lat', 'lng', 'alt']
    search_fields = ('id', 'name', )
    ordering = ('id',)