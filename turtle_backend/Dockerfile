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