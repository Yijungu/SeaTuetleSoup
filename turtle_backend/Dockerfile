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

RUN apt-get update && apt-get install -y cron
ADD crontab /etc/cron.d/hello-cron
RUN chmod 0644 /etc/cron.d/hello-cron
RUN crontab /etc/cron.d/hello-cron

CMD service cron start && python manage.py runserver
