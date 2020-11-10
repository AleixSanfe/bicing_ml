from django.contrib import admin
from bicing.models.record import Record
from bicing.models.station import Station

from django.shortcuts import render, redirect
from django import forms
from django.urls import path

from datetime import datetime
import csv

class CsvImportForm(forms.Form):
    csv_file = forms.FileField()

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    change_list_template = "admin/records_changelist.html"
    list_display = ['station_id', 'ini_dt', 'fin_dt']

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [ path('import-csv/', self.import_csv) ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]

            i = 0
            for line in list(csv_file)[1:]: 
                self.__procesRecordHistoric(line)
                i = i + 1
                if( i % 1000 == 0 ):
                    print(i)

            self.message_user(request, "Your csv file has been imported")
            return redirect("..")

        form = CsvImportForm()
        payload = {"form": form, 'app_label': 'HELLO WORLD'}
        return render( request, "admin/records_csv_form.html", payload )

    def __procesRecordHistoric(self,line):
        fields = str(line).split(",")
        station_id = int( fields[0][2:] )

        if( not Station.objects.filter(id=station_id).exists() ):
            return

        historic_datetime = datetime.fromtimestamp( int(fields[-2]) )
        ini , fin = Record.buildIniFin(historic_datetime)

        try:
            record = Record.objects.get(station_id=station_id,ini_dt=ini,fin_dt=fin)
        except Record.DoesNotExist:
            record = Record.build(station_id,ini,fin)

        record.updateValues(historic_datetime,fields)
