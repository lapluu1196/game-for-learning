# ⚖️ Cân vui — Bài toán tư duy bằng hình cho bé

Website tĩnh HTML/CSS/JS (không backend và không thu thập dữ liệu), dựa trên bộ PDF 17 trang *Phương pháp so sánh và thay thế* (trang in 35–51).

## Đã sửa lỗi chọn câu hỏi theo PDF

**Mặc định: 26 bài chính, 5 bài/lượt → 6 lượt.** Với mỗi trang cân, bài chính là **dòng hỏi cuối trang**, không phải phép cân mẫu. Ví dụ bài đầu tiên, trang in 35:

`🥬 = ? 🍆` (**1 bắp cải bằng 2 cà tím**) — từ `🍆 = 🧅🧅` và `🥬 = 🧅🧅🧅🧅`.

Tiếp theo lần lượt là: `1 bó rau = ? bắp ngô` (trang 36), `2 máy kéo = ? ô tô đỏ` (trang 37), `1 xe tải = ? xe máy` (trang 38)... Sau 8 bài cân là **18 bài tìm giá trị hình** ở trang 43–51.

**Không xóa câu PDF nào:** 26 câu điền “Nặng bằng…” còn lại là **Luyện thêm (26 câu, cũng 6 lượt)**. Phụ huynh bấm **👨‍👩‍👧 Bố mẹ → Luyện thêm** để bật; bé chỉ thấy hình trong lúc chơi. Tổng cộng vẫn đủ **52 câu** trong tài liệu.

Đối chiếu đầy đủ từng trang, nguồn gốc câu hỏi và cảnh báo trang 42: xem [SOURCE_AUDIT.md](SOURCE_AUDIT.md).

## Trải nghiệm

- Bé xem hai cân mẫu, rồi thực hiện câu hỏi có hình và dấu `?`.
- Kéo/thả hoặc chạm để thêm, chạm vật trên đĩa để bớt. Khi cân ngang **không tự hiện popup**; chỉ hiện kết quả khi bé bấm **✓ Kiểm tra**.
- Bóng đèn 💡: thay theo từng nhóm (ví dụ 2 củ hành → 1 cà tím), chia đều 2/3 và phát lại hoạt hình.
- Bài tìm giá trị hình: chọn một trong 3 số lớn, rồi bấm Kiểm tra.
- Hướng dẫn và giải thích dài nằm trong **Bố mẹ**, không chiếm màn hình của bé.
- Các vật dễ nhầm đã có hình SVG phân biệt rõ màu và hình dáng.
- Tiến độ chỉ lưu `localStorage` trên thiết bị; hai chế độ cùng ghi nhớ những câu đã hoàn thành bằng ID gốc.

## Chạy / deploy

Mở `index.html` cùng thư mục với `questions.js`, `logic.js`, `app.js` hoặc chạy:

```bash
python3 -m http.server 8080
```

Repository GitHub public: `lapluu1196/game-for-learning`. GitHub Pages nếu đã bật **Deploy from a branch → main → /(root)** sẽ tự xuất bản cập nhật tại:

https://lapluu1196.github.io/game-for-learning/

**Đặc biệt:** trang in 42 có bất nhất số donut (scan có vẻ 7 chiếc, nhưng cần 8 để có đáp số nguyên). Ứng dụng gắn nhãn giả định cho bố mẹ; không coi dữ kiện sửa là nguyên văn PDF.

## Kiểm thử

```bash
node tests/test_bank.js
node tests/test_pdf_mapping.js
python tests/test_browser_fast.py
python tests/test_interactions.py
```

Hai script Python cần Playwright/Chromium cài sẵn; kiểm thử Node không cần gói ngoài.