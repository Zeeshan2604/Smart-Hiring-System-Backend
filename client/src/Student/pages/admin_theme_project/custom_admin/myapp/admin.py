from django.contrib import admin
from django.urls import path
from django.utils.html import format_html
from myapp.models import MyModel

admin.site.site_header = "My Custom Admin"
admin.site.site_title = "Admin Panel"
admin.site.index_title = "Welcome to My Custom Admin"
# CSS for custom styling
internal_css = """
    <style>
    body {
        background-color: #f0f8ff; /* Light blue background */
        font-family: Arial, sans-serif;
    }
    .header, #header, .module h2, #content h1, .breadcrumbs {
        background-color: #005f99; /* Darker blue */
        color: white;
    }
    .header a, .breadcrumbs a {
        color: #ffffff;
    }
    .module h2 {
        font-size: 20px;
        padding: 10px;
    }
    #content {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }
    input[type='submit'] {
        background-color: #005f99;
        color: white;
        border-radius: 4px;
        padding: 8px 16px;
    }
    input[type='submit']:hover {
        background-color: #004466;
    }
    @media (max-width: 768px) {
        #content, .breadcrumbs {
            padding: 10px;
        }
        input[type='submit'] {
            width: 100%;
        }
    }
    </style>
"""

class CustomAdminSite(admin.AdminSite):
    def each_context(self, request):
        context = super().each_context(request)
        context['internal_css'] = internal_css
        return context

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('', self.admin_view(self.index), name='index'),
        ]
        return custom_urls + urls

    def index(self, request, extra_context=None):
        context = {'internal_css': self.each_context(request)['internal_css']}
        return super().index(request, extra_context=context)


# Create instance of the custom admin site
admin_site = CustomAdminSite(name='my_custom_admin')
admin_site.register(MyModel)  # Register any models here
