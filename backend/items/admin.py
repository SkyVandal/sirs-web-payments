from django.contrib import admin

from .models import Items


class ItemsAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'price')


admin.site.register(Items, ItemsAdmin)
