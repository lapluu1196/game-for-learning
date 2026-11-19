# ⚖️ Cân vui — học so sánh và thay thế bằng hình

Trò chơi HTML tĩnh dành cho bé 5–6 tuổi chưa biết đọc. Không cần cài đặt, đăng nhập, database hay thư viện JavaScript bên ngoài.

## Chơi
- 👀 Xem hai cân mẫu, chạm để đảo vị trí hai bên.
- 🎯 Câu hỏi **chỉ bằng hình ảnh** như `🥬 = ? 🌽`.
- Chạm **🌽 ＋** để thêm vật, **−** để bớt, **↻** để chơi lại. Cân nghiêng hoặc ngang lập tức.
- **💡** mở hướng dẫn từng bước bằng hình: thay thế → chia đều 2/3 nhóm → kết luận.
- **👨‍👩‍👧 Bố mẹ** mở hướng dẫn và lời giải chi tiết có hình minh họa.
- **🔊** nghe câu hỏi nếu thiết bị hỗ trợ giọng tiếng Việt.
- Không đồng hồ, không phạt khi sai.

## Bài tập
1. Rau/ngô: 🥔 = 2🥬 và 🥔 = 4🌽 → chia 2 → 🥬 = 2🌽 (PDF trang 2).
2. Bắp cải/cà tím: 🍆 = 2🧅, 🥬 = 4🧅 → 🥬 = 2🍆 (PDF trang 1).
3. Lê/táo: 🍐 = 4🍊, 🍎 = 2🍊 → 🍐 = 2🍎 (PDF trang 5).
4. Trực thăng/máy kéo: 🚁 = 2🚗, 🚗 = 2🚜 → 🚁 = 4🚜 (PDF trang 3).
5. Bổ sung **chia 3 nhóm**: 🥔 = 3🥬, 🥔 = 6🌽 → 🥬 = 2🌽 (bài mở rộng, không lấy nguyên từ PDF).

## Chạy trong nhà
Mở `index.html` trong trình duyệt, hoặc chạy `python3 -m http.server 8080 --bind 0.0.0.0` trong thư mục này. Truy cập bằng địa chỉ IP của máy chủ trong LAN.

## GitHub Pages miễn phí
Với repo **public**, chỉ cần bật một lần tại [Settings → Pages](https://github.com/lapluu1196/game-for-learning/settings/pages). Ở mục **Build and deployment**, chọn **Deploy from a branch**; đặt **Branch = main** và **Folder = /(root)** rồi bấm **Save**. URL dự kiến: https://lapluu1196.github.io/game-for-learning/.

**Lưu ý riêng tư:** GitHub Pages và toàn bộ mã của repo public đều công khai. Không đưa dữ liệu cá nhân/ảnh riêng của bé lên repo. Bản hiện tại không thu thập, lưu trữ hay gửi bất kỳ dữ liệu học tập nào.

## Kiểm thử
Mã nguồn không phụ thuộc gói npm. Đáp án lần lượt là **2, 2, 2, 4, 2**. Đã thử trên trình duyệt Chromium ở kích thước desktop và mobile; kiểm tra mở phần bố mẹ, chuyển bài, gợi ý chia 2 và chia 3, các đáp án và lỗi JavaScript.
