document.addEventListener("DOMContentLoaded", () => {
    const s1 = document.querySelector('.section-1');
    const s2 = document.querySelector('.section-2');
    const s3 = document.querySelector('.section-3');

    // ================================================= 
    // 1. THIẾT LẬP CHUYỂN CẢNH (CROSS-FADE)
    // ================================================= 
    gsap.set([s1, s2, s3], { position: "absolute", top: 0, left: 0 });
    gsap.set([s2, s3], { opacity: 0, display: 'none', zIndex: 1 });
    gsap.set(s1, { opacity: 1, display: 'block', zIndex: 2 });

    function transition(fadeOut, fadeIn) {
        gsap.set(document.querySelectorAll('.w-butterfly-4, .w-butterfly-5'), { pointerEvents: 'none' });
        const tl = gsap.timeline();
        gsap.set(fadeIn, { display: 'block', opacity: 0, zIndex: 3 });
        gsap.set(fadeOut, { zIndex: 2 });

        tl.to(fadeIn, { opacity: 1, duration: 1.2, ease: "sine.inOut" })
          .to(fadeOut, { 
            opacity: 0, 
            duration: 0.1, 
            onComplete: () => {
                fadeOut.style.display = 'none';
                gsap.set(fadeIn, { zIndex: 2 });
                gsap.set(document.querySelectorAll('.w-butterfly-4, .w-butterfly-5'), { pointerEvents: 'auto' });
            }
        });
    }

    s1.querySelector('.w-butterfly-4').onclick = () => transition(s1, s2);
    s2.querySelector('.w-butterfly-4').onclick = () => transition(s2, s3);
    s3.querySelector('.w-butterfly-4').onclick = () => transition(s3, s1);
    s1.querySelector('.w-butterfly-5').onclick = () => transition(s1, s3);
    s2.querySelector('.w-butterfly-5').onclick = () => transition(s2, s1);
    s3.querySelector('.w-butterfly-5').onclick = () => transition(s3, s2);

    // ================================================= 
    // 2. HIỆU ỨNG LẬT THẺ NGANG - LẬT TỪ BÊN PHẢI QUA
    // ================================================= 
    const mainCards = document.querySelectorAll('.main-flip-card');
    mainCards.forEach(card => {
        const inner = card.querySelector('.flip-card-inner');
        card.addEventListener('mouseenter', () => {
            gsap.to(inner, { rotateY: -180, duration: 1.5, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(inner, { rotateY: 0, duration: 1.5, ease: "power2.out" });
        });
    });

    // ================================================= 
    // 3. HIỆU ỨNG HOA RƠI (CHỈ CHẠY TRÊN DESKTOP > 768px)
    // ================================================= 
    let lastX = 0, lastY = 0;

    window.addEventListener("mousemove", (e) => {
        // KIỂM TRA CHIỀU RỘNG MÀN HÌNH TRƯỚC KHI TẠO HOA
        if (window.innerWidth > 768) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const dist = Math.hypot(mouseX - lastX, mouseY - lastY);

            if (dist > 15) {
                spawnFlower(mouseX, mouseY);
                lastX = mouseX; 
                lastY = mouseY;
            }
        }
    });

    function spawnFlower(x, y) {
        let currentFlowerImg = '';
        if (window.getComputedStyle(s1).opacity > 0 && window.getComputedStyle(s1).display !== 'none') {
            currentFlowerImg = 'assets/homepage/flower-2.svg';
        } else if (window.getComputedStyle(s2).opacity > 0 && window.getComputedStyle(s2).display !== 'none') {
            currentFlowerImg = 'assets/work/purple/Flower-2.1.svg';
        } else if (window.getComputedStyle(s3).opacity > 0 && window.getComputedStyle(s3).display !== 'none') {
            currentFlowerImg = 'assets/work/red/Flower-2.2.svg';
        }

        if (!currentFlowerImg) return;

        const flower = document.createElement('img');
        flower.src = currentFlowerImg;
        flower.className = 'cursor-flower-magical';
        document.body.appendChild(flower);

        const randomScale = Math.random() * 0.3 + 0.1;
        const randomRotation = Math.random() * 360;
        const moveX = (Math.random() - 0.5) * 100;

        gsap.set(flower, { 
            x: x, y: y, scale: 0, opacity: 0, 
            rotation: randomRotation, xPercent: -50, yPercent: -50, zIndex: 9999
        });

        const flowerTl = gsap.timeline({ onComplete: () => flower.remove() });
        flowerTl.to(flower, { duration: 0.4, scale: randomScale, opacity: 0.8, ease: "back.out(2)" })
                .to(flower, { duration: 1.8, y: "+=120", x: `+=${moveX}`, rotation: "+=90", opacity: 0, ease: "power1.in" }, "+=0.1");
    }
});