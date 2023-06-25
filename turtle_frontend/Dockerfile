# 이미지 설정
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 프로젝트 코드 복사
COPY . .
# Install dependencies
# RUN npm install

# Build the Next.js application
RUN npm run build

# Start the application
CMD ["npm" ,"start"]