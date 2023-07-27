# 이미지 설정
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
# 프로젝트 코드 복사
COPY . .
# Install dependencies
# RUN npm install

RUN npm install
RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm install @mui/icons-material
RUN npm install react-router-dom
RUN npm install framer-motion
RUN npm install react-modal
# RUN npm install react-draggable
# RUN npm install react-transition-group
# RUN npm install react-spring

# Build the Next.js application
# Start the application
CMD ["npm" ,"start"]