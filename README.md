# ⚖️ Cân vui – học so sánh và thay thế

Game HTML tĩnh, thiết kế cho bé 5–6 tuổi **chưa biết đọc**. Mục tiêu là hiểu rằng hai nhóm có cùng khối lượng giả định thì có thể thay thế cho nhau, sau đó chia hai bên thành **2 hoặc 3 nhóm bằng nhau**.

## Chơi thử

- Trực tiếp: mở `index.html` bằng trình duyệt.
- Trong mạng nhà: chạy `python3 -m http.server 8080 --bind 0.0.0.0` trong thư mục này, rồi mở `http://IP-SERVER:8080/`.
- GitHub Pages (miễn phí với repo **public**): vào **Settings → Pages → Build and deployment → Deploy from a branch**, chọn nhánh `main`, thư mục `/(root)` và **Save**. Khi đã xuất bản, địa chỉ dự kiến là <https://lapluu1196.github.io/game-for-learning/>. Không cần build hay GitHub Actions.

> GitHub Pages là website **công khai**, không phải môi trường riêng tư nội bộ. Không đưa thông tin cá nhân của bé, ảnh riêng, hoặc tài liệu gia đình lên repo.

## Cách sử dụng

- **👀**: hai cân mẫu. Chạm để đảo vị trí hai bên và nhìn chúng vẫn bằng nhau.
- **🎯**: câu hỏi chỉ có hình `🥬 = ? 🌽`.
- **🌽 ↗**: kéo bắp ngô lớn lên đĩa cân bên phải bằng ngón tay hoặc chuột. Chạm vào hình lớn để thêm nhanh. Chạm vật trên cân để bớt; hoặc kéo nó ra khỏi đĩa. `↻` làm lại. Không có nút cộng/trừ.
- **✓ Kiểm tra**: sau khi thả các vật, cân sẽ nghiêng hoặc ngang tương ứng; **KHÔNG** tự hiện kết quả khi cân ngang. Chỉ khi bé chủ động bấm **Kiểm tra** mới xác nhận. Nếu chưa đúng, vẫn được thử lại tự do và được gợi ý nhìn đĩa nặng hơn.
- **💡**: gợi ý bằng hình theo từng bước. Với bài bắp cải/cà tím, lê/táo và trực thăng/máy kéo: **gom thành từng cặp → lấy nhóm vật cũ ra → đặt vật mới tương đương ngay vào vị trí đó → lặp lại nhóm tiếp theo**. Hai bài củ khoai dùng cách **chia đều hai phía thành 2 hoặc 3 nhóm**. Bấm **›** để xem từng bước, **↻** trong phần gợi ý để xem lại hiệu ứng thay thế.
- **👨‍👩‍👧 Bố mẹ**: hướng dẫn và giải thích đầy đủ **bằng hình + lời nói** cho từng bài.
- **🔊**: đọc câu hỏi bằng giọng đọc hệ thống (nếu trình duyệt có giọng tiếng Việt).
- Khi **Kiểm tra** đúng, ba ngôi sao nhỏ ⭐⭐⭐ và đáp án **bằng hình rất lớn** hiện dưới cái cân, **không dùng popup che mất cân**. Bé quyết định khi nào bấm mũi tên sang bài sau. Không chấm điểm, không đồng hồ, không yêu cầu biết chữ.

## Nội dung

1. **Rau và ngô, chia đôi** (PDF trang ảnh 2): 🥔 = 2🥬 và 🥔 = 4🌽 → 2🥬 = 4🌽 → chia 2 nhóm → 🥬 = 2🌽.
2. **Bắp cải và cà tím** (PDF trang ảnh 1): 🍆 = 2🧅 và 🥬 = 4🧅 → 🥬 = (🧅🧅) + (🧅🧅) → 🥬 = 🍆 + (🧅🧅) → 🥬 = 🍆🍆.
3. **Lê và táo** (PDF trang ảnh 5): 🍐 = 4🍊 và 🍎 = 2🍊 → 🍐 = (🍊🍊) + (🍊🍊) → 🍐 = 🍎 + (🍊🍊) → 🍐 = 🍎🍎.
4. **Trực thăng** (PDF trang ảnh 3): 🚁 = 2🚗 và 🚗 = 2🚜 → 🚁 = 🚗 + 🚗 → 🚁 = 🚜🚜 + 🚗 → 🚁 = 🚜🚜 + 🚜🚜 = 4🚜.
5. **Luyện thêm chia ba** (ví dụ tự xây dựng, không lấy nguyên từ PDF): 🥔 = 3🥬 và 🥔 = 6🌽 → 3🥬 = 6🌽 → chia 3 nhóm → 🥬 = 2🌽.

Chỉ có năm bài mẫu để kiểm chứng cách học; emoji có thể hiển thị khác nhau trên iOS/Android/Windows. Về sau có thể thay emoji bằng hình minh họa riêng và tách ngân hàng bài ra JSON.

## Rà soát bài học / đảm bảo đúng về toán

Trong mã nguồn, mỗi bài có bảng khối lượng giả định `mass` và được chạy qua hàm `auditLessons()` khi tải trang. Hàm kiểm tra:

- Hai bên của **mọi cân mẫu** và **mọi bước gợi ý** có tổng khối lượng bằng nhau.
- Mỗi thao tác thay nhóm có khối lượng cũ = khối lượng mới, **và phải dựa vào một cân mẫu có thật của bài**. Kết luận cuối cùng khớp câu hỏi.
- Bài 1 và 5 chia đều **cả hai bên**; bài 2–4 thay **từng nhóm** chứ không nhảy thẳng tới đáp án. Không đổi 2 chiếc ô tô thành 2 máy kéo: mỗi ô tô mới đổi được 2 máy kéo.

Số bước: bài 1 có 5 bước, bài 2–4 có 6 bước, bài 5 có 5 bước. Bài 5 là bài **mở rộng**, không chép nguyên từ PDF.

## Kỹ thuật / riêng tư

Không phụ thuộc thư viện, tài khoản, cookie, localStorage hay API ngoài. Không thu thập kết quả chơi hoặc dữ liệu của bé. Không tải hình ảnh/âm thanh ngoài. Có nhãn truy cập cho nút và tôn trọng `prefers-reduced-motion`.

## Kiểm thử nhanh

- Bài 1, 2, 3, 5: kéo/chạm thêm 2 vật → cân ngang nhưng **chưa hoàn thành**. Đợi bao lâu tùy thích, bấm **Kiểm tra** mới hiện 3 sao.
- Bài 4: thêm 4 máy kéo → cân ngang, sau đó **Kiểm tra**.
- Đặt 1 vật rồi bấm Kiểm tra: kết quả chưa đúng, không hiện sao, có thể thêm tiếp. Đặt quá nhiều: đĩa phải nặng hơn, vẫn sửa được.
- Thử kéo thả bằng chuột, chạm trên màn hình điện thoại, kéo vật ra khỏi đĩa, chạm vật để bớt.
- Kiểm tra tự động với `python test_smoke.py` (Playwright và Chromium): 320 px, 390 px, desktop và chạm trên mobile.
- Mở 💡 và bấm `›` tới màn chia nhóm: bài 1 có 2 nhóm, bài 5 có 3 nhóm.
- Mở 👨‍👩‍👧 Bố mẹ để xem 5 hoặc 6 bước giải bằng hình và lời; đóng sẽ trả về bài.
- Bấm 💡 đến từng cặp thay thế: bấm **›**, quan sát hình cũ nhấc ra và hình mới đi vào; bấm **↻** để phát lại. Bài 2: 🧅🧅 → 🍆 hai lần. Bài 3: 🍊🍊 → 🍎 hai lần. Bài 4: 🚗 → 🚜🚜 hai lần.
- Kiểm thử mọi bước tự động: `python tests/test_hints.py` (cần Playwright và Chromium), trên desktop và mobile 390 px và 320 px.