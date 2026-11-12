"""
WSGI config for kantin_project project.

It exposes the WSGI callable as a module-level variable named ``application``.
For Vercel deployment, the callable is also exposed as ``app``.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kantin_project.settings')

application = get_wsgi_application()

# Alias untuk serverless function Vercel
app = application
