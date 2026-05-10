# Hướng dẫn dựng Hồ sơ số cho 1 trường tiểu học mới

Đây là TEMPLATE rỗng — đã loại bỏ toàn bộ dữ liệu của trường gốc.
Mỗi trường mới chỉ cần làm 5 bước dưới đây, không phải đụng vào code.

---

## Tổng quan kiến trúc

```
┌─ GitHub Pages (frontend tĩnh) ────┐         ┌─ Google Apps Script ─┐
│  index.html · qlcl.html           │ ◀──────▶│  Code.gs (backend)   │
│  app.js · qlcl-app.js · config.js │  JSONP  │  bound vào Sheet HSS │
│  templates-hocba/*.docx           │         └──────────────────────┘
└───────────────────────────────────┘                    │
            │                                            ▼
            │                                  ┌──────────────────┐
            ▼                                  │  Google Sheet    │
┌─ Chrome Extension HSS Sync ─┐                │  - Danh muc HSS  │
│  hss-sync-extension/        │ ──────────────▶│  - DSGV          │
│  (đồng bộ điểm lên CSDL     │                │  - DS HocSinh    │
│   ngành MOET tự động)       │                │  - CauHinh ...   │
└─────────────────────────────┘                └──────────────────┘
```

**1 file config duy nhất**: `config.js` ở thư mục gốc — chứa mọi thứ riêng cho 1 trường.
Toàn bộ HTML/JS đọc giá trị qua `window.HSS_CFG`. Code.gs (server) đọc qua sheet `CauHinh`.

---

## Bước 1 — Tạo Google Sheet + deploy Apps Script

1. Vào https://sheets.new → đặt tên Sheet (vd: `HSS_THDienTan`).
2. **Tiện ích mở rộng → Apps Script** → xoá code mẫu → dán toàn bộ `Code.gs` từ template.
3. Lưu (Ctrl+S) → đặt tên project (vd: `HSS_THDienTan`).
4. Trong editor, chọn hàm **`setupAll`** ở dropdown → ▶ Run → cấp quyền Drive/Sheets/Mail.
5. Quay lại Sheet, F5 → các tab tự xuất hiện:
   - HSS (6 tab): `Danh muc HSS`, `DSGV`, `DS HocSinh`, `Hinh Anh`, `CauHinh`, `MinhChung`
   - KĐCL phụ trợ: `_Index_BaoCao`, `HSS_FileCheck`
   - QLCL Status: `HSS_Status`
   - QLCL Template (8 tab): `Config`, `Lop`, `Users`, `NhanXet`, `GK1`, `CK1`, `GK2`, `CN`
6. Sau đó chạy thêm **`setupSignatureSchema`** một lần — tạo cột schema cho chữ ký HT/dấu/GVCN.
7. **Triển khai → New deployment → ⚙ → Web app**:
   - Description: `HSS API v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** → copy URL `/exec` (dạng `https://script.google.com/macros/s/AKfyc.../exec`).

> 💡 Mỗi lần sửa Code.gs phải bấm **New version → Deploy** lại. URL `/exec` mới chỉ thay đổi nếu thầy bấm "New deployment" thay vì "Manage deployments → Edit → New version".

---

## Bước 2 — Sửa `config.js` (file duy nhất cần đụng)

Mở file `config.js`, điền 6 trường:

```js
window.HSS_CFG = {
  schoolName:    'Trường Tiểu học Diễn Tân',           // Đầy đủ có chữ "Trường"
  schoolShort:   'TH Diễn Tân',                        // Hiển thị compact
  xa:            'Xã Quảng Châu',                      // Có prefix "Xã"
  tinh:          'Tỉnh Nghệ An',                       // Có prefix "Tỉnh"
  diaChi:        '',                                   // Để rỗng → tự ghép xa + tinh
  schoolYear:    '2025-2026',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfyc.../exec',  // URL ở Bước 1
  extId:         '',                                   // Điền sau khi cài Extension (Bước 4)
  baseUrl:       'https://schoolrecords.github.io/tieuhocdientan/',  // GitHub Pages của trường
  driveRootName: 'HoSoSo_THDienTan'                    // Tên folder gốc trên Drive
};
```

> ⚠ Phải cấu hình `appsScriptUrl` xong mới chạy được — nếu rỗng, web sẽ load nhưng không gọi được backend.

---

## Bước 3 — Sửa SEO meta thủ công trong `index.html`

Crawler (Zalo/Facebook) đọc HTML tĩnh trước khi JS chạy → các meta SEO phải sửa tay.
Mở `index.html`, sửa 8 chỗ ở đầu file (đã đánh dấu trong block comment `⚠ KHI CLONE TEMPLATE`):

| Vị trí | Thay |
|--------|------|
| `<title>` | "Hồ sơ số - Trường Tiểu học Diễn Tân" |
| `<meta name="description">` | "Hồ sơ số chính thức cho Trường Tiểu học Diễn Tân..." |
| `<link rel="canonical">` | URL GitHub Pages |
| `<meta property="og:url">` | URL GitHub Pages |
| `<meta property="og:title">` | Tên trường |
| `<meta property="og:description">` | Mô tả |
| `<meta property="og:image">` | URL ảnh banner (1200×630) |
| `<meta name="twitter:*">` | Tương tự og:* |

Sau đó upload `og-banner.jpg` (1200×630) vào gốc website → làm mới cache scrape:
- Facebook/Messenger: https://developers.facebook.com/tools/debug/
- Zalo: gửi link vào 1 chat bất kỳ rồi dán lại.

---

## Bước 4 — Cài Chrome Extension HSS Sync (đồng bộ MOET)

Extension giúp 1 click đẩy điểm lên CSDL ngành MOET (truong.csdl.moet.gov.vn).

1. Mở Chrome → `chrome://extensions/` → bật **Developer mode** (góc phải trên).
2. **Load unpacked** → chọn thư mục `hss-sync-extension` (trong dự án).
3. Sau khi load → xem **ID** hiển thị bên dưới tên extension (32 ký tự) → copy.
4. Quay lại `config.js`, dán vào `extId`:
   ```js
   extId: 'abcdefghijklmnopqrstuvwxyz123456',
   ```
5. Click icon extension → cài đặt → dán `appsScriptUrl` (cùng URL ở Bước 1) → Save.

> 💡 Cài 1 lần trên máy nào sẽ làm việc trên máy đó. Mỗi giáo viên/admin muốn dùng chức năng đồng bộ MOET phải tự cài extension.

---

## Bước 5 — Push lên GitHub Pages

1. Tạo repo GitHub mới (vd: `Schoolrecords/tieuhocdientan`) — public.
2. Push toàn bộ thư mục dự án (sau khi sửa config) lên repo:
   ```bash
   git init
   git remote add origin https://github.com/Schoolrecords/tieuhocdientan.git
   git add .
   git commit -m "feat: setup ban dau cho TH Dien Tan"
   git branch -M main
   git push -u origin main
   ```
3. GitHub repo → Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → Save.
4. Sau ~1 phút, web sẽ live tại `https://schoolrecords.github.io/tieuhocdientan/`.
5. Truy cập web → **Admin → Thông tin trường** → nhập:
   - Tên trường, địa chỉ, Hiệu trưởng, Phó HT, năm học
   - Upload logo, dấu trường, chữ ký Hiệu trưởng (PNG nền trong suốt)
6. **Admin → Bảo mật** → đặt 2 mã:
   - Mã Giáo viên (vd: `GV-DienTan-2026`) — dùng để sửa điểm/nhận xét
   - Mã Admin (vd: `Admin-DienTan-2026`) — dùng cho Admin panel
7. Phổ biến mã qua Zalo nhóm trường.

---

## Sau setup — nhập dữ liệu lần đầu

### Cách 1: Qua Web Admin (khuyến nghị)
- **Admin → Nhập dữ liệu** → tải mẫu Excel → fill → upload trở lại.
- Hệ thống tự ghi vào sheet tương ứng (DS HocSinh, DSGV, ...).

### Cách 2: Migrate từ Sheet QLCL cũ (nếu trường đã có sẵn)
- Apps Script editor → chọn hàm `migrateQlclFromExternal` → ▶ Run.
- Paste Sheet ID nguồn (Sheet QLCL cũ) → enter.
- Script copy 9 tab Q_* sang Sheet HSS hiện tại. Tab đã tồn tại sẽ skip.

---

## Checklist hoàn tất

- [ ] Sheet HSS đã tạo, chạy `setup`, thấy đủ tab `DS HocSinh`, `DSGV`, `CauHinh`, `Hinh Anh`, `Danh muc HSS`, `MinhChung`...
- [ ] Apps Script đã deploy Web app (Anyone access), copy URL `/exec`
- [ ] `config.js` đã điền đủ `schoolName`, `xa`, `tinh`, `appsScriptUrl`, `baseUrl`, `driveRootName`
- [ ] `index.html` đã sửa 8 meta SEO + upload `og-banner.jpg`
- [ ] Chrome Extension đã cài, lấy ID dán vào `config.js → extId`
- [ ] GitHub Pages đã live, mở web không lỗi console
- [ ] Đã nhập tên trường, Hiệu trưởng, mã GV/Admin qua Web Admin

---

## Đặc tả 5 mảng tính năng

| Mảng | Đường dẫn | Mục đích |
|------|-----------|----------|
| **Hồ sơ số (HSS)** | `index.html#records` | 109 hồ sơ leaf — nơi tập trung link Drive |
| **KĐCL-TĐG** | `index.html` (click "Hệ thống KĐCL") | Tự đánh giá theo TT 17/2018 + TT 22/2024 |
| **QL Chất lượng** | `qlcl.html` | Sổ điểm, NLPC, xếp loại theo TT 27/2020 |
| **Học bạ** | `templates-hocba/Mau-HocBa-Lop{1..5}.docx` | Xuất Word + PDF học bạ chuẩn TT 27 |
| **Đồng bộ MOET** | `hss-sync-extension/` | Push điểm lên CSDL ngành (cần Chrome Extension) |

---

## Hỗ trợ

Khi gặp lỗi, kiểm tra theo thứ tự:
1. Console (F12) — có error JS không?
2. Network (F12) — request đến `script.google.com` có 200 OK không?
3. Apps Script editor → **Executions** — xem log lỗi backend.
4. Sheet `CauHinh` — đã có row `school_name_full`, `school_addr` chưa?

Liên hệ tác giả template: Chung Trần · Zalo 0913 031 073.
