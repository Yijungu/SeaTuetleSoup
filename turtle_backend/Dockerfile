# Dockerfile
FROM python:3.9

WORKDIR /code

COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY . /code/

ENV DATABASE_HOST db
ENV DATABASE_NAME mydatabase
ENV DATABASE_USER myuser
ENV DATABASE_PASSWORD mypassword

RUN chmod -R 777 /code #권한 설정
RUN apt-get update
RUN apt-get install -y cron && touch ./cron.log #crontab 설치 및 로그파일 생성

CMD service cron start && python manage.py runserver
