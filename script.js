const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const questionSection = document.getElementById('questionSection');
const resultSection = document.getElementById('resultSection');
const loveAudio = document.getElementById('loveAudio');

let noClickCount = 0;

// Khi click vào nút "Không"
btnNo.addEventListener('click', () => {
    noClickCount++;
    
    // Giảm kích thước nút "Không"
    const currentSize = parseFloat(window.getComputedStyle(btnNo).fontSize);
    btnNo.style.fontSize = (currentSize - 3) + 'px';
    btnNo.style.padding = (15 - noClickCount * 2) + 'px ' + (30 - noClickCount * 3) + 'px';
    
    // Tăng kích thước nút "Có"
    const currentYesSize = parseFloat(window.getComputedStyle(btnYes).fontSize);
    btnYes.style.fontSize = (currentYesSize + 3) + 'px';
    btnYes.style.padding = (15 + noClickCount * 2) + 'px ' + (30 + noClickCount * 3) + 'px';
    
    // Di chuyển nút "Không" ngẫu nhiên
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    
    // Tạo vị trí ngẫu nhiên
    const randomX = Math.random() * 100 - 50;
    const randomY = Math.random() * 100 - 50;
    
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Nếu nút quá nhỏ, ẩn nó
    if (noClickCount >= 5) {
        btnNo.style.opacity = '0';
        btnNo.style.pointerEvents = 'none';
    }
});

// Khi click vào nút "Có"
btnYes.addEventListener('click', () => {
    // Ẩn phần câu hỏi
    questionSection.style.display = 'none';
    
    // Hiển thị phần kết quả
    resultSection.classList.add('active');
    
    // Phát nhạc
    loveAudio.play().catch(error => {
        console.log('Không thể phát nhạc tự động:', error);
    });
    
    // Tạo hiệu ứng tim bay
    createFloatingHearts();
});

// Tạo hiệu ứng tim bay
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-50px';
        heart.style.animation = `floatHeart ${Math.random() * 3 + 5}s linear`;
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 500);
}

// Thêm animation cho các tim bay
const style = document.createElement('style');
style.textContent = `
    @keyframes floatHeart {
        0% {
            bottom: -10%;
            opacity: 0;
            transform: translateX(0) rotate(0deg);
        }
        25% {
            opacity: 1;
        }
        75% {
            opacity: 1;
        }
        100% {
            bottom: 110%;
            opacity: 0;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);