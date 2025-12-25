document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy tham số 'view' từ đường dẫn URL (ví dụ: ?view=s1)
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    // 2. Khai báo các section
    const s1 = document.querySelector('.showcase-s1');
    const s2 = document.querySelector('.showcase-s2');
    const s3 = document.querySelector('.showcase-s3');

    // Hàm reset: Ẩn tất cả section trước khi quyết định hiện cái nào
    function hideAll() {
        if(s1) s1.style.display = 'none';
        if(s2) s2.style.display = 'none';
        if(s3) s3.style.display = 'none';
    }

    // 3. Logic hiển thị (Xử lý kỹ phần CSS đang ẩn)
    
    // TRƯỜNG HỢP 1: Người dùng chọn GRAPHIC (Section 1)
    if (view === 's1') {
        hideAll();
        if (s1) {
            // Vì CSS gốc đang set "display: none", ta bắt buộc phải set "flex" để nó hiện ra
            s1.style.display = 'flex'; 
        }
    } 
    
    // TRƯỜNG HỢP 2: Người dùng chọn CODE (Section 2)
    else if (view === 's2') {
        hideAll();
        if (s2) {
            // Tương tự s1, phải ép "display: flex" đè lên CSS ẩn
            s2.style.display = 'flex';
        }
    } 
    
    // TRƯỜNG HỢP 3: Người dùng chọn ILLUSTRATION (Section 3)
    else if (view === 's3') {
        hideAll();
        if (s3) {
            // Section 3 đặc biệt: Desktop là Flex, Mobile là Grid.
            // Ta set rỗng ('') để trình duyệt tự lấy style từ file CSS (work.css)
            s3.style.display = ''; 
        }
    } 
    
    // MẶC ĐỊNH: Nếu vào trang mà không có tham số (view=...), hiện Section 3
    else {
        hideAll();
        if (s3) s3.style.display = '';
    }
});