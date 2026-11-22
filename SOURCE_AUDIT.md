# Đối chiếu trực tiếp với PDF "Cân nặng thay thế" (17 trang)

**Cách đánh số:** PDF trang 1–17 tương ứng trang sách in số 35–51.

**Nguyên tắc hiển thị mới (sau góp ý của phụ huynh):** Với 8 trang cân (35–42), **dòng hỏi cuối** được chọn làm *bài chính*. Các dòng hỏi trước đó là phép luyện trung gian, được giữ lại trong **Bố mẹ → Luyện thêm**. Với 9 trang tìm giá trị hình (43–51), mỗi khung bài tập là một bài chính. Đây là cách phân nhóm cho website, không phải nhãn được in trong tài liệu.

## 8 câu chính ở trang cân (đối chiếu hình dòng cuối)

| Trang sách | Dòng cuối trong PDF — chuyển thành câu hỏi | Đáp án website | Câu luyện thêm (các dòng trước) |
|---|---|---|---|
| 35 (PDF 1) | 1 bắp cải / mớ rau = ? cà tím | 2 cà tím | 1 cà tím = ? hành; 2 cà tím = ? hành; 1 bắp cải = ? hành |
| 36 (PDF 2) | 1 bó rau = ? bắp ngô | 2 ngô | 1 khoai = ? bó rau; 1 khoai = ? ngô; 2 bó rau = ? ngô |
| 37 (PDF 3) | 2 máy kéo = ? ô tô đỏ | 1 ô tô | 1 trực thăng = ? ô tô; 1 trực thăng = ? máy kéo; 2 ô tô = ? máy kéo |
| 38 (PDF 4) | 1 xe tải = ? xe máy | 4 xe máy | 1 xe tải = ? ô tô vàng; 1 ô tô vàng = ? xe máy; 2 ô tô vàng = ? xe máy |
| 39 (PDF 5) | 2 táo = ? lê | 1 lê | 1 táo = ? cam; 2 táo = ? cam; 1 lê = ? cam |
| 40 (PDF 6) | 2 ve sầu = ? kiến | 8 kiến | 1 ve sầu = ? ong; 1 ong = ? kiến; 1 ve sầu = ? kiến |
| 41 (PDF 7) | 1 chuối = ? dâu tây | 2 dâu tây | 1 xoài = ? chuối; 2 xoài = ? dâu; 1 xoài = ? dâu; 2 chuối = ? dâu |
| 42 (PDF 8) | 1 quả cam = ? ly kem | **2 ly kem (theo giả định 8 bánh)** | 1 kem = ? donut; 2 kem = ? donut; 2 cam = ? donut; 1 cam = ? donut |

**Lưu ý bắt buộc về trang 42:** Ảnh scan ở cân giữa thể hiện **7 chiếc donut (4+3)**, trong khi để suy ra đáp số nguyên ở chuỗi câu hỏi lại cần **8 chiếc**. Bản game tạm sử dụng giả định *2 cam = 8 donut*, có chú thích trong **Bố mẹ**, không khẳng định đây chính xác là dữ kiện gốc. Nếu giữ nguyên 7 donut thì kết quả câu cuối là **1 cam = 1,75 ly kem**, không phù hợp thao tác kéo nguyên vật thể. Cần phụ huynh xác minh bản sách gốc nếu muốn dùng câu này như bài kiểm tra chuẩn.

## 18 bài chính dạng giá trị hình (hai khung mỗi trang)

| Trang sách | Khung trên (đáp số) | Khung dưới (đáp số) |
|---|---|---|
| 43 | táo đỏ = 2 | táo xanh = 3 |
| 44 | măng cụt + miếng dưa = 5 | xoài + dâu = 7 |
| 45 | dâu + kiwi = 8 | dưa hấu + cam = 9 |
| 46 | tẩy + đồ gọt + bút chì = 7 | bóng rổ + bóng đá + bóng chuyền = 8 |
| 47 | sóc + ếch = 5 | sao + hình vuông = 10 |
| 48 | tim = 2 | cây thường + lá = 4 |
| 49 | quả đỏ + chuối + nho = 6 | hai loại kẹo + kẹo mút = 9 |
| 50 | kim cương + đồng hồ + đĩa bay = 6 | quà xanh + quà nâu + quà vàng = 6 |
| 51 | trụ + chóp + lập phương = 10 | ớt xanh + ớt đỏ + ớt vàng = 9 |

Những nhóm hình dễ nhầm đã được vẽ riêng bằng SVG (bắp cải/bó rau, cây thường/cây có quả, màu quà, màu ớt và hai loại kẹo) để không phụ thuộc việc emoji trên từng thiết bị có hiển thị màu khác nhau.

## Kiểm thử

- `node tests/test_bank.js` — dữ liệu 52 dòng, 328 bước gợi ý, đáp án hợp lệ.
- `node tests/test_pdf_mapping.js` — đối chiếu **cố định** 8 câu cuối trang PDF; xác nhận 18 bài tìm số ở 9 trang sau; phân chia chính/luyện thêm.
- `python tests/test_browser_fast.py` — kiểm thử cả 26 bài chính và 26 câu luyện thêm trên màn hình 1280 / 390 / 320px.
- `python tests/test_interactions.py` — kéo thả, đợi bé bấm Kiểm tra, lời giải thay thế và nút phát lại.