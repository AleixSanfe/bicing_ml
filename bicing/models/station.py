from django.db import models

class Station(models.Model):

    address = models.CharField(max_length = 200)
    name = models.CharField(max_length = 200)
    capacity = models.IntegerField(default = 0)
    lat = models.DecimalField(default = 0.0, max_digits = 10, decimal_places = 7)
    lng = models.DecimalField(default = 0.0, max_digits = 10, decimal_places = 7)
    alt = models.IntegerField(default = 0)

    class Meta:
        app_label = 'bicing'

    def toJson(self):
        r = {}
        for f in self._meta.fields:
            r[f.name] = str( getattr(self, f.name) )
        return r