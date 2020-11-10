from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from django.core import serializers
import json

from bicing.models.station import Station
from bicing.models.record import Record

from datetime import datetime

def index(request):
    #return HttpResponse("Hello, world. You're at the polls index.")
    stations = Station.objects.order_by('id')
    stations_list = [ s.toJson() for s in stations  ]
    
    context = {'stations': json.dumps(stations_list), 'selected': json.dumps(None)}
    return render(request, 'bicing/index.html', context)

def show(request,station_id):

    stations = Station.objects.order_by('id')
    stations_list = [ s.toJson() for s in stations  ]
    
    context = {
        'stations': json.dumps(stations_list),
        'selected': Station.objects.get(id = station_id).toJson()
    }
    return render(request, 'bicing/index.html', context)

def show_json(request,station_id):

    print( request.content_type )

    records = Record.toJson( Record.objects.filter(station_id = station_id,ini_dt__gte=datetime(2019,4,1,0,0)).order_by('-ini_dt') )

    data = {
        'station': Station.objects.get(id = station_id).toJson(),
        'records': records
    }

    return JsonResponse(data)