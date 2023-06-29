# 이미지 설정
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install
RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm install @mui/icons-material
RUN npm install react-router-dom
<<<<<<< HEAD
RUN npm install framer-motion
=======
Run npm install framer-motion
>>>>>>> de1257485766e505c2d6c9bedbdfd3b7b0302b28
# 프로젝트 코드 복사
COPY . .
# Install dependencies
# RUN npm install

# Build the Next.js application
RUN npm run build

# Start the application
CMD ["npm" ,"start"]