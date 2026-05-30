# Báo Cáo CI/CD - Season Project

## 1. Mô Hình Triển Khai Của Dự Án

Season Project đang sử dụng mô hình CI/CD tách riêng:

- CI được xử lý bằng GitHub Actions.
- CD cho frontend được xử lý bằng Vercel.
- CD cho backend được xử lý bằng Railway.
- Database production được host trên MongoDB Atlas.

Điều này có nghĩa là GitHub Actions đảm nhiệm việc kiểm tra chất lượng code và xác thực Docker image build thành công. Việc deploy production được các nền tảng managed hosting như Vercel và Railway tự động thực hiện sau khi code được push hoặc merge.

## 2. Production URLs

Frontend:

```text
https://season-project-m2li.vercel.app
```

Backend:

```text
https://season-project-production.up.railway.app
```

## 3. Cấu Hình Môi Trường

### Vercel Frontend

Frontend cần biến môi trường sau:

```env
API_URL=https://season-project-production.up.railway.app
```

Biến này được Next.js frontend sử dụng để rewrite các request `/api/*` sang backend đang chạy trên Railway.

### Railway Backend

Các biến môi trường quan trọng của backend:

```env
ALLOWED_ORIGINS=https://season-project-m2li.vercel.app
FRONTEND_PUBLIC_BASE_URL=https://season-project-m2li.vercel.app
BACKEND_PUBLIC_BASE_URL=https://season-project-production.up.railway.app
MONGO_URI=<MongoDB Atlas connection string>
JWT_ACCESS_SECRET=<production access secret>
JWT_REFRESH_SECRET=<production refresh secret>
PORT=3001
NODE_ENV=production
```

Ngoài ra backend còn có các cấu hình dịch vụ bên ngoài:

- Cloudinary
- PayOS
- Gmail OAuth2

Tất cả secret và production key được quản lý trong Vercel/Railway Environment Variables, không commit vào repository.

## 4. Docker Setup

Backend có Dockerfile phục vụ production:

```text
backend/Dockerfile
backend/.dockerignore
```

Backend Docker image:

- sử dụng Node.js 20 Alpine
- cài dependencies bằng `npm ci`
- build TypeScript bằng `npm run build`
- chạy production bằng `npm run start`
- không copy file `.env`
- không tự động chạy seed script
- exclude `season_data` khỏi production image

Cách cấu hình này phù hợp với production vì dữ liệu thật đã tồn tại trên MongoDB Atlas, không cần seed lại mỗi lần deploy.

## 5. GitHub Actions CI Pipeline

Workflow file:

```text
.github/workflows/ci-pipeline.yml
```

Tên workflow:

```text
CI Pipeline
```

Nhánh đang trigger hiện tại:

```yaml
push:
  branches:
    - Khoi-ci-cd
    - main

pull_request:
  branches:
    - Khoi-ci-cd
    - main
```

Workflow cũng hỗ trợ chạy thủ công:

```yaml
workflow_dispatch:
```

## 6. Các Job Trong CI

### Frontend lint and tests

Job này chạy:

```bash
cd frontend
npm ci
npm run lint
npm run test:cart
```

Do frontend cart test đang dùng `tsx` loader nằm trong backend dependencies, workflow cài backend dependencies trước khi chạy frontend test.

### Backend tests and build

Job này chạy:

```bash
cd backend
npm ci
npm test
npm run build
```

Mục đích:

- chạy test backend
- kiểm tra TypeScript backend build thành công
- đảm bảo code backend có thể tạo production output trong `dist/`

### Security audit

Job này chạy:

```bash
cd frontend
npm audit --audit-level=critical

cd backend
npm audit --audit-level=critical
```

Pipeline hiện chỉ fail nếu có lỗi bảo mật mức `critical`. Đây là mức hợp lý cho demo và thực tế dự án, vì một số dependency có thể có cảnh báo moderate/high nhưng cần framework upgrade hoặc cần đánh giá riêng trước khi sửa.

### Backend Docker image build and publish

Job này chỉ chạy sau khi các job trước pass:

```yaml
needs:
  - frontend-checks
  - backend-checks
  - security-audit
```

Job này build backend Docker image:

```bash
docker build ./backend
```

Nếu event không phải pull request, image sẽ được push lên GitHub Container Registry:

```text
ghcr.io/<owner>/<repo-name>-backend:<commit-sha>
ghcr.io/<owner>/<repo-name>-backend:latest
```

## 7. CD Flow

CD không được thực hiện trực tiếp trong GitHub Actions.

Thay vào đó:

- Vercel tự động deploy frontend.
- Railway tự động deploy backend.

Luồng triển khai hiện tại:

```text
Developer push code
-> GitHub repository nhận thay đổi
-> GitHub Actions chạy CI checks
-> Vercel deploy frontend
-> Railway deploy backend
```

Mô hình này đơn giản hơn so với việc tự viết toàn bộ deploy pipeline trong GitHub Actions, nhưng phù hợp với cách dự án đang được host trên Vercel và Railway.

## 8. File Đã Thêm Hoặc Chỉnh Sửa

CI/CD workflow:

```text
.github/workflows/ci-pipeline.yml
```

Backend Docker:

```text
backend/Dockerfile
backend/.dockerignore
```

Các file sửa để frontend lint pass:

```text
frontend/eslint.config.mjs
frontend/components/products/view-by-collection/collections-layout.tsx
frontend/components/sections/CampaignCollections.tsx
frontend/lib/fetcher.ts
frontend/lib/model/product/product.ts
```

Các file sửa để backend test pass:

```text
backend/tests/middleware/guest-session.test.ts
backend/tests/services/order-email.service.test.ts
```

## 9. Kết Quả Kiểm Tra Local

Các lệnh đã chạy ở local:

```bash
cd frontend
npm run lint
npm run test:cart
```

Kết quả:

```text
Passed
```

```bash
cd backend
npm test
npm run build
```

Kết quả:

```text
Passed
```

```bash
cd frontend
npm audit --audit-level=critical

cd backend
npm audit --audit-level=critical
```

Kết quả:

```text
Passed với ngưỡng audit-level=critical
```

## 10. Kịch Bản Demo

Kịch bản demo đề xuất:

1. Push một thay đổi nhỏ lên nhánh `Khoi-ci-cd`.
2. Mở tab GitHub Actions.
3. Chọn workflow `CI Pipeline`.
4. Cho thấy các job đang chạy hoặc đã pass:

```text
Frontend lint and tests
Backend tests and build
Security audit
Build and publish backend image
```

5. Mở Vercel Deployments để chứng minh frontend được deploy tự động.
6. Mở Railway Deployments để chứng minh backend được deploy tự động.
7. Mở frontend production:

```text
https://season-project-m2li.vercel.app
```

8. Mở backend health check:

```text
https://season-project-production.up.railway.app
```

## 11. So Sánh Với Pipeline CI/CD Đầy Đủ

Pipeline hiện tại đã có:

- lint frontend
- test frontend
- test backend
- build backend
- security audit
- build backend Docker image
- push backend image lên GHCR
- deploy frontend thông qua Vercel
- deploy backend thông qua Railway

Pipeline hiện tại chưa có:

- build frontend Docker image
- staging deployment
- smoke test sau deploy
- manual approval gate
- rollback tự động
- thông báo Slack/email
- deploy Railway trực tiếp từ GitHub Actions

Điều này chấp nhận được với phạm vi hiện tại vì Vercel và Railway đã cung cấp managed CD cho dự án.

## 12. Đoạn Tóm Tắt Có Thể Dùng Trong Báo Cáo

Season Project sử dụng GitHub Actions làm lớp CI và Vercel/Railway làm lớp CD. CI pipeline kiểm tra chất lượng code thông qua frontend linting, frontend cart tests, backend tests, backend TypeScript build, security audit và backend Docker image build. Sau khi code được push, Vercel tự động deploy frontend và Railway tự động deploy backend. Các production secrets được quản lý bên ngoài repository thông qua Environment Variables của Vercel và Railway.
