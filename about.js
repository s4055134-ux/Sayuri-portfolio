/* =========================================
   1. FLOWER CURSOR TRAIL EFFECT
   (Giữ nguyên thông số cũ)
   ========================================= */

let lastMouseX = 0;
let lastMouseY = 0;

function createFlower(x, y) {
    const flowerImageSrc = 'assets/homepage/flower-2.svg';
    const flower = document.createElement('img');
    flower.src = flowerImageSrc;
    flower.className = 'cursor-flower-magical';
    document.body.appendChild(flower);

    const randomScale = Math.random() * 0.3 + 0.5; 
    const randomRotation = Math.random() * 360;
    const moveX = (Math.random() - 0.5) * 100; 

    gsap.set(flower, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scale: 0, 
        rotation: randomRotation,
        opacity: 0,
        zIndex: 9999
    });

    const flowerTl = gsap.timeline({
        onComplete: () => {
            if (flower.parentNode) {
                flower.remove();
            }
        }
    });

    flowerTl.to(flower, {
        scale: randomScale,
        opacity: 0.9, 
        duration: 0.4,
        ease: "back.out(2)"
    })
    .to(flower, {
        y: "+=120", 
        x: `+=${moveX}`,
        rotation: "+=90",
        opacity: 0,
        duration: 1.8, 
        ease: "power1.in"
    }, "+=0.1");
}

window.addEventListener('mousemove', (e) => {
    const distance = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    if (distance > 15) { 
        createFlower(e.clientX, e.clientY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});


/* =========================================
   2. MAIN INTERACTIONS (DOM LOADED)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- A. MOBILE CHECK (Giữ nguyên) ---
    if (window.innerWidth <= 768) {
        gsap.set('.element[class*="flower-"] svg path', {
            fillOpacity: 1,
            stroke: "none",
            strokeDashoffset: 0
        });
    } else {
        // --- B. ARTISTIC FLOWER REVEAL (Chỉ chạy trên Desktop/Tablet) ---
        const allFlowers = document.querySelectorAll('.element[class*="flower-"]');
        const visibleFlowers = Array.from(allFlowers)
            .filter(flower => window.getComputedStyle(flower).display !== 'none')
            .sort((a, b) => {
                const getNum = (el) => {
                    const match = el.className.match(/flower-(\d+)/);
                    return match ? parseInt(match[1]) : 999;
                };
                return getNum(a) - getNum(b);
            });

        const masterTl = gsap.timeline({ delay: 0.2 });

        visibleFlowers.forEach((flower, index) => {
            const paths = flower.querySelectorAll('path');
            if (paths.length === 0) return;

            paths.forEach(path => {
                const length = path.getTotalLength();
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    fillOpacity: 0,
                    stroke: "#A53860",
                    strokeWidth: 1.2,
                    autoAlpha: 1
                });
            });

            const flowerTl = gsap.timeline();
            flowerTl.to(paths, {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: "power2.out",
                stagger: 0.05
            })
            .to(paths, {
                fillOpacity: 1,
                duration: 1.0,
                ease: "power1.in"
            }, "-=1.2");

            masterTl.add(flowerTl, index * 0.35); 
        });
    }

    // --- C. SECRET GARDEN: FLASHLIGHT HUNT (Giữ nguyên) ---
    const flashlight = document.querySelector('.flashlight');
    const butterflies = document.querySelectorAll('.element[class*="butterfly-"]');
    const lightRadius = 150; 

    if (flashlight && window.getComputedStyle(flashlight).display !== 'none') {
        gsap.to(flashlight, { opacity: 1, duration: 1, delay: 0.5 });

        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            gsap.to(flashlight, {
                x: mouseX,
                y: mouseY,
                duration: 0.2,
                ease: "power1.out"
            });

            butterflies.forEach(bf => {
                if (bf.classList.contains('found')) return;
                if (window.getComputedStyle(bf).display === 'none') return;

                const rect = bf.getBoundingClientRect();
                const bfCenterX = rect.left + rect.width / 2;
                const bfCenterY = rect.top + rect.height / 2;
                const dist = Math.hypot(mouseX - bfCenterX, mouseY - bfCenterY);

                if (dist < lightRadius) {
                    const opacity = 1 - (dist / lightRadius);
                    gsap.to(bf, {
                        opacity: opacity,
                        duration: 0.1,
                        overwrite: "auto"
                    });
                } else {
                    gsap.to(bf, {
                        opacity: 0,
                        duration: 0.3,
                        overwrite: "auto"
                    });
                }
            });
        });
    }

    // Sự kiện click bướm
    butterflies.forEach(bf => {
        bf.addEventListener('click', () => {
            if (bf.classList.contains('found')) {
                bf.classList.remove('found');
                gsap.to(bf, { scale: 1, duration: 0.3 });
            } else {
                bf.classList.add('found');
                gsap.fromTo(bf, 
                    { scale: 1 }, 
                    { scale: 1.2, duration: 0.3, ease: "back.out(1.7)", yoyo: true, repeat: 1 }
                );
                gsap.to(bf, { opacity: 1, duration: 0.2, overwrite: true });
            }
        });
    });

    // --- D. POLAROID CLICK TO REVEAL (ĐÃ FIX LỖI BAY VỊ TRÍ) ---
    const polaroidGroups = document.querySelectorAll('.click-group');

    polaroidGroups.forEach(group => {
        group.addEventListener('click', function() {
            
            // Chỉ chạy hiệu ứng nếu chưa mở
            if (!this.classList.contains('revealed')) {
                
                // 1. Kích hoạt CSS opacity: 1
                this.classList.add('revealed');

                // 2. Tìm các ảnh con bên trong (Frame và Logo/Art)
                const children = this.querySelectorAll('img, svg');

                // 3. Animate CÁC CON thay vì animate 'this' (group)
                // Sử dụng gsap.from để tưng từ nhỏ lên lớn, giữ nguyên vị trí CSS
                gsap.from(children, {
                    scale: 0.9,      // Tưng nhẹ từ 90%
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    clearProps: "scale" // Quan trọng: Xóa thuộc tính scale sau khi xong để không kẹt
                });
            }
        });
    });

});