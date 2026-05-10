/* =====================================================================
 * config.js — CẤU HÌNH TRUNG TÂM CHO 1 TRƯỜNG
 * =====================================================================
 *
 * 👉 KHI CLONE TEMPLATE CHO TRƯỜNG MỚI: chỉ cần sửa duy nhất file này.
 *    Toàn bộ code (index.html, qlcl.html, qlcl-app.js, app.js) đọc giá
 *    trị qua window.HSS_CFG nên không phải đụng vào nơi khác.
 *
 * 👉 Code.gs (Apps Script) là server-side, KHÔNG đọc được file này.
 *    Đổi tên trường, mã GV/Admin trên Code.gs hoặc qua Web Admin →
 *    Thông tin trường / Bảo mật (sẽ ghi vào sheet CauHinh + Script
 *    Properties — sau đó client tự sync về).
 *
 * Xem hướng dẫn đầy đủ: SETUP_TRUONG_MOI.md
 * ===================================================================== */
window.HSS_CFG = {
  // ── Định danh trường ─────────────────────────────────────────────────
  schoolName:    'Trường Tiểu học Diễn Tân',
  schoolShort:   'TH Diễn Tân',
  xa:            'Xã Quảng Châu',
  tinh:          'Tỉnh Nghệ An',
  diaChi:        '',                      // Để rỗng → tự ghép xa + tinh
  schoolYear:    '2025-2026',

  // ── Backend Google Apps Script ───────────────────────────────────────
  // Sau khi deploy Apps Script (Web app, Anyone access) → dán URL /exec vào đây
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbyt_zrQgOSM_Re1m7pEEtA5IeG6UZMqIND8sYPpkxS7bqHtF_8A3AhsbMZJ0OfyWsqw/exec',

  // ── Chrome Extension HSS Sync (đồng bộ CSDL ngành MOET) ──────────────
  // Cài extension từ thư mục hss-sync-extension → chrome://extensions/ →
  // Lấy ID hiển thị bên dưới tên extension → dán vào đây
  extId:         '',                      // VD: 'abcdefghijklmnopqrstuvwxyz123456'

  // ── GitHub Pages (URL public của website) ────────────────────────────
  // Dùng cho SEO meta (canonical, og:url, twitter:url)
  baseUrl:       'https://schoolrecords.github.io/tieuhocdientan/',

  // ── Drive root folder name (Apps Script tự tạo nếu chưa có) ──────────
  driveRootName: 'HoSoSo_TH'              // VD: 'HoSoSo_THDienTan'
};

/* Tự ghép diaChi nếu chỉ điền xa/tinh (giúp giảm trùng lặp khi clone) */
(function(){
  var c = window.HSS_CFG;
  if (!c.diaChi) {
    c.diaChi = [c.xa, c.tinh].filter(function(s){ return s && s.trim(); }).join(', ');
  }
  if (!c.schoolShort && c.schoolName) {
    c.schoolShort = c.schoolName.replace(/^Trường\s+(Tiểu\s+học\s+)?/i, 'TH ');
  }
})();
