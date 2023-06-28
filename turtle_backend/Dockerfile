# 이미지 설정
FROM python:3.9

# 환경변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 작업 디렉토리 설정
WORKDIR /code

# 의존성 설치
COPY requirements.txt /code/
RUN pip install -r requirements.txt

# 프로젝트 코드 복사
COPY . /code/

# Install cron
RUN apt-get update && apt-get install -y cron

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/hello-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/hello-cron

# Apply cron job
RUN crontab /etc/cron.d/hello-cron

# Run the command on container startup
CMD ["cron", "-f", "&&", "python", "manage.py", "runserver", "0.0.0.0:8000"]
