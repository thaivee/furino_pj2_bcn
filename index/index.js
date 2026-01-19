document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById('slider-view4');
    const nextBtn = document.getElementById('next-btn-view4');
    const dots = document.querySelectorAll('#dots-container-view4 .dot');
    const cards = document.querySelectorAll('.slide-card');

    if (slider && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollAmount = cards[0].offsetWidth + 24;
            slider.scrollLeft += scrollAmount;

            if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
                slider.scrollLeft = 0;
            }
        });

      
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const scrollAmount = cards[0].offsetWidth + 24;
                slider.scrollLeft = index * scrollAmount;
            });
        });

        slider.addEventListener('scroll', () => {
            const scrollAmount = cards[0].offsetWidth + 24;
            const currentIndex = Math.round(slider.scrollLeft / scrollAmount);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        });

        let isDown = false;
        let startX;
        let scrollLeftPos;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeftPos = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeftPos - walk;
        });
    }

    const galleryTrack = document.getElementById('gallery-track-view5');
    if (galleryTrack) {
        galleryTrack.addEventListener('mouseenter', () => {
            galleryTrack.style.animationPlayState = 'paused';
        });
        galleryTrack.addEventListener('mouseleave', () => {
            galleryTrack.style.animationPlayState = 'running';
        });
    }


    
});