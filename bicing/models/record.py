from django.db import models
from jsonfield import JSONField
import collections
from datetime import datetime, timedelta

from bicing.models.station import Station

class Record(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    ini_dt = models.DateTimeField('init date')
    fin_dt = models.DateTimeField('final date')
    values = JSONField(load_kwargs={'object_pairs_hook': collections.OrderedDict})

    class Meta:
        app_label = 'bicing'

    # INSTANCE METHODS
    def updateValues(self,dt,fields):

        k = self.__buildKey(dt)
        self.values[k]['ba'] = self.values[k]['ba'] + int(fields[1])
        self.values[k]['ma'] = self.values[k]['ma'] + int(fields[2])
        self.values[k]['ea'] = self.values[k]['ea'] + int(fields[3])
        self.values[k]['da'] = self.values[k]['da'] + int(fields[4])
        self.values[k]['c'] = self.values[k]['c'] + 1
        self.save()

    def __buildKey(self,dt):
        mins = int( dt.strftime("%M") ) - ( int( dt.strftime("%M") ) % 15 )
        k = str(dt.isoweekday())+""+dt.strftime("-%H-")+str(mins).zfill(2)
        return k

    def toObject(self):
        r = {}
        for f in self._meta.fields:
            if( f.name == "station" ):
                r[f.name] = getattr(self, f.name).id
            elif( f.name == "values" ):
                r[f.name] = getattr(self, f.name)
            else:
                r[f.name] = str( getattr(self, f.name) )
        return r

    # CLAS METHODS

    @classmethod
    def build(cls,id,ini,fin):
        new_week = cls.__buildRecordValues()

        new_record = Record(station_id= id,ini_dt = ini, fin_dt = fin, values = new_week)
        new_record.save()
        
        return new_record

    @classmethod
    def buildIniFin(cls,dt):
        i = (dt - timedelta(dt.weekday())).replace(hour=0,minute=0,second=0)
        f = (i + timedelta(days=6)).replace(hour=23,minute=45,second=0)
        return [i,f]

    @classmethod
    def __buildRecordValues(cls):
        W = {}
        for wd in range(7):
            _wd = str(wd+1)
            for h in range(24):
                _h = str(h).zfill(2)
                for m in range(4):

                    z = "{}-{}-{}".format( _wd , _h , str(m*15).zfill(2) )
                    W[z] = {'ba': 0,'ma': 0,'ea': 0,'da': 0,'c': 0}

        return W

    @classmethod
    def toJson(cls,objs):
        r = list()
        for obj in objs:
            r.append( obj.toObject() )
        return r