"""
URL configuration for tutle_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# urlpatterns 안에는 routing과 관련된 정보가 포함되어있음
urlpatterns = [
    # 장고가 기본적으로 가지고 있는 관리자 화면으로 이동하기 위한 routing
    path('', include('seaturtle.urls')),

    # firstapp.ulrs로 routing 하기위해
    # 1. include안의 인자를 실행할 app이름.ulrs로 바꾸어주고
    # 2. project안의 ulrs.py를 복사하여 app폴더 안에 붙여넣기
    # 3. app폴더 안의 ulrs.py내부에 path import와 urlpattern 만 남기고 제거


]
