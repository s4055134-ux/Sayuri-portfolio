document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       1. INTRO ANIMATION (LOGIC: RELOAD & INTERNAL CHECK)
       ========================================= */
    const overlay = document.querySelector('#intro-overlay');
    const paths = document.querySelectorAll('.intro-path');

    // --- KIỂM TRA ĐIỀU KIỆN CHẠY ANIMATION ---
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry && navEntry.type === 'reload';
    const isInternal = document.referrer.includes(window.location.hostname);

    // Chạy khi: (Là Reload) HOẶC (Truy cập mới từ bên ngoài)
    const shouldRunAnimation = isReload || !isInternal;

    if (!shouldRunAnimation) {
        // A. NẾU KHÔNG CẦN CHẠY -> Ẩn ngay lập tức
        if (overlay) overlay.style.display = 'none';

    } else {
        // B. NẾU CẦN CHẠY
        
        if (paths.length > 0) {
            // Setup ban đầu: Ẩn nét vẽ
            paths.forEach(path => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                gsap.set(path, { opacity: 1 }); 
            });

            // Tạo Timeline cho Intro
            const introTl = gsap.timeline();

            // BƯỚC 1: Vẽ nét Logo (Stroke Animation)
            introTl.to(paths, {
                strokeDashoffset: 0,
                duration: 2.5, 
                ease: "power2.inOut",
                stagger: 0.1 
            });

            // BƯỚC 2: Mờ nét vẽ đi (Strokes fade out)
            introTl.to(paths, {
                opacity: 0,
                duration: 0.6, // Mờ nhanh các nét vẽ
                ease: "power1.out"
            });

        // BƯỚC 3: Ẩn Overlay đi
            introTl.to(overlay, {
                opacity: 0,
                duration: 2.0,    
                ease: "power1.inOut",
                onComplete: () => {
                    overlay.style.display = 'none'; 
                }
            }); 

        } else {
            if (overlay) overlay.style.display = 'none';
        }
    }

    /* =========================================
       2. MENU INTERACTION (BUTTERFLY REVEAL)
       ========================================= */
    const hamburger = document.querySelector('.hamburger-menu');
    const menuTextContainer = document.querySelector('.menu-text-container');
    
    const fadeOuts = [
        '.title-container', 
        '.flower-1', 
        '.flower-2', 
        '.butterfly-1', 
        '.butterfly-2', 
        '.butterfly-4', 
        '.butterfly-5'
    ];

    const bfTop = document.querySelector('.butterfly-3'); 
    const bfBot = document.querySelector('.butterfly-6'); 
    
    const menuTl = gsap.timeline({ 
        paused: true, 
        reversed: true,
        onReverseComplete: () => {
            gsap.set([bfTop, bfBot], { clearProps: "all" });
            gsap.set(menuTextContainer, { display: 'none' });
        }
    });

    gsap.set([bfTop, bfBot], { transition: "none", webkitTransition: "none" });

    // Timeline Menu
    menuTl.set(menuTextContainer, { display: 'block' }, "start")
          .to(fadeOuts, {
              duration: 0.6, 
              opacity: 0, 
              stagger: 0.05, 
              ease: "power2.inOut"
          }, "start");

    menuTl.to(bfTop, {
        duration: 1.2,
        top: "37%",       
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotation: 30.5,      
        scale: 0.8,       
        ease: "expo.inOut"
    }, "start+=0.1");

    menuTl.to(bfBot, {
        duration: 1.2,
        top: "57%",       
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotation: -30.5,      
        scale: 0.8,
        ease: "expo.inOut",
        right: "auto",    
        bottom: "auto"    
    }, "start+=0.1");

    menuTl.fromTo(['.item-about', '.item-work'], 
        { opacity: 0, y: 20 }, 
        { duration: 0.7, opacity: 1, y: 0, stagger: 0.15, ease: "power2.out" },
        "-=0.5" 
    );

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            if (menuTl.reversed()) {
                menuTl.play();
            } else {
                menuTl.reverse();
            }
        });
    }

    /* =========================================
       3. FLOWER TRAIL (DESKTOP ONLY)
       ========================================= */
    const flowerImg = 'assets/homepage/flower-2.svg';
    let lastX = 0, lastY = 0;

    window.addEventListener("mousemove", (e) => {
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
        const flower = document.createElement('img');
        flower.src = flowerImg;
        flower.className = 'cursor-flower-magical';
        document.body.appendChild(flower);

        const randomScale = Math.random() * 0.3 + 0.1;
        const randomRotation = Math.random() * 360;
        const moveX = (Math.random() - 0.5) * 100;

        gsap.set(flower, { 
            x: x, 
            y: y, 
            scale: 0, 
            opacity: 0, 
            rotation: randomRotation,
            xPercent: -50,
            yPercent: -50,
            zIndex: 999 
        });

        const flowerTl = gsap.timeline({ 
            onComplete: () => { if(flower.parentNode) flower.remove(); } 
        });

        flowerTl.to(flower, { 
            duration: 0.4, 
            scale: randomScale, 
            opacity: 1, 
            ease: "back.out(2)" 
        })
        .to(flower, { 
            duration: 1.8, 
            y: "+=120", 
            x: `+=${moveX}`, 
            rotation: "+=90", 
            opacity: 0, 
            ease: "power1.in" 
        }, "+=0.1");
    }
});