# ⚖️ Cân vui – 52 câu toán tư duy, mỗi lượt 5 câu

Ứng dụng HTML/CSS/JavaScript thuần, dành cho bé 5–6 tuổi chưa đọc thành thạo. Chuyển thể **toàn bộ 52 câu hỏi** trong 17 trang PDF “Phương pháp so sánh và thay thế” mà gia đình cung cấp, theo đúng thứ tự trang. **Không đưa ảnh trang sách lên GitHub**, chỉ dùng hình minh họa emoji/SVG.

## Chương trình

| Trang trong PDF | Trang in | Nội dung | Số câu |
|---|---|---|---:|
| 1 | 35 | Bắp cải – cà tím – củ hành | 4 |
| 2 | 36 | Khoai – rau – ngô | 4 |
| 3 | 37 | Trực thăng – ô tô – máy kéo | 4 |
| 4 | 38 | Xe tải – ô tô – xe máy | 4 |
| 5 | 39 | Lê – táo – cam | 4 |
| 6 | 40 | Ve sầu – ong – kiến | 4 |
| 7 | 41 | Xoài – chuối – dâu | 5 |
| 8 | 42 | Cam – kem – bánh vòng (xem chú ý nguồn) | 5 |
| 9–17 | 43–51 | Tìm giá trị đồ vật qua phép cộng, phép trừ, chia đều | 18 |
| **Tổng** | | | **52** |

Chia theo thứ tự đề gốc thành **11 lượt**: 10 lượt có 5 câu, lượt cuối 2 câu. Có nút ‹/› chuyển lượt và 5 chấm chọn câu. Tiến độ đánh dấu đã học được lưu bằng `localStorage` **chỉ trên thiết bị đang dùng** (không tải dữ liệu lên máy chủ).

## Hai cách chơi

**34 câu cân/thay thế:** nhìn hai cân mẫu → nhìn câu hỏi dạng hình `🥬 = ? 🍆` → kéo/chạm vật vào đĩa phải → cân nghiêng/ngang trực tiếp → bé **chủ động** bấm **✓ Kiểm tra**. Chạm vật đã đặt hoặc kéo ra khỏi đĩa để bớt. Không có popup che cân.

**18 câu tìm số:** nhìn các phép tính mẫu bằng hình → chọn một trong ba số lớn → bấm **✓ Kiểm tra**. Dữ kiện gồm cả phép trừ, bài toán hai hoặc ba loại hình; gợi ý làm rõ cách thay giá trị hình đã biết và tách số thành các nhóm bằng nhau.

**💡 Gợi ý bằng hình:** từng phép cân mẫu → gom nhóm → bỏ vật cũ/đặt vật tương đương → chia đều khi cần → kết quả. Có nút lùi, tiến và phát lại chuyển động. Không yêu cầu bé đọc văn bản.

**👨‍👩‍👧 Bố mẹ:** lời nói gợi ý, từng bước minh họa và ghi chú tài liệu gốc. **🔊** đọc câu hỏi qua giọng của trình duyệt (nếu có giọng tiếng Việt).

## ⚠️ Bất nhất ở trang in 42 (trang 8 của PDF)

Ở hình cân giữa, bản scan có vẻ thể hiện **7 chiếc bánh vòng (4 bên trái + 3 bên phải)** tương ứng **2 quả cam**. Tuy nhiên các câu tìm “1 cam = mấy bánh vòng / mấy ly kem?” đòi một kết quả nguyên; nếu đúng 7 bánh thì sẽ phát sinh 3,5 bánh và 1,75 ly kem. Vì vậy, trong website hiện **giả định 2 quả cam = 8 chiếc bánh vòng** (để có thể luyện theo định dạng lớp 1), và **ghi rõ đây chỉ là giả định** trong bảng “Bố mẹ” của cả 5 câu trang 42. Đề gốc không được chỉnh sửa. Gia đình nên đối chiếu với bản in gốc để xác nhận trước khi cho bé học phần này.

Nếu muốn bám đúng hình scan là 7, cần thiết kế lại cách trả lời bằng phân số hoặc loại các câu cam khỏi lượt học ở độ tuổi này; không nên giấu sai khác.

## Chạy thử tại nhà

```bash
# trong thư mục tải về (có index.html, questions.js, logic.js, app.js)
python3 -m http.server 8080 --bind 0.0.0.0
```

Trên máy tính đang chạy: `http://localhost:8080/`. Trên điện thoại cùng Wi‑Fi: `http://<IP-máy-chủ>:8080/`. Không cần Node, npm, backend, tài khoản hay kết nối mạng ngoài.

## GitHub Pages miễn phí

Repo hiện tại: https://github.com/lapluu1196/game-for-learning

Trong **Settings → Pages**, chọn **Deploy from a branch**, **main** → **/(root)** → **Save**. Khi xuất bản xong, địa chỉ dự kiến: https://lapluu1196.github.io/game-for-learning/.

> ⚠️ Repo public và GitHub Pages đều công khai. Đừng đẩy lên ảnh riêng, tên, điểm số hoặc dữ liệu cá nhân của bé.

## Cấu trúc mã nguồn

- `index.html`: giao diện và CSS, không thư viện bên ngoài.
- `questions.js`: ngân hàng 52 câu, trang nguồn, dữ kiện, đáp án, cảnh báo bất nhất.
- `logic.js`: giải từng bước bằng phép thay thế thật, tìm đường đổi vật, nhóm/chia đều, suy luận giá trị hình và kiểm định đáp án.
- `app.js`: điều khiển lượt, tương tác kéo thả/cảm ứng, giọng đọc, gợi ý, cửa sổ bố mẹ, lưu tiến độ cục bộ.
- `tests/test_bank.js`: kiểm thử 52 đáp án, cân mẫu, đường thay thế, 17 trang nguồn và 328 bước gợi ý.
- `tests/test_browser_fast.py`: kiểm thử Chromium đủ 52 câu & 328 gợi ý ở 1280/390/320 px.
- `tests/test_interactions.py`: kiểm thử kéo, chạm, kiểm tra thủ công, phép tính đúng/sai, phát lại thay thế.

Chạy nhanh:

```bash
node tests/test_bank.js
# tùy chọn kiểm thử giao diện (cần pip install playwright, đã cài Chromium)
python tests/test_browser_fast.py
python tests/test_interactions.py
```

Khi bổ sung câu hỏi về sau, giữ thứ tự trang PDF, ghi nguồn trong `questions.js` và chạy kiểm thử trước khi phát hành.