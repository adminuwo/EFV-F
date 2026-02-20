const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: true });
const container = document.getElementById('particles-js') || document.body;

if (document.getElementById('particles-js')) {
    document.getElementById('particles-js').appendChild(canvas);
} else {
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
}

let particles = [];
let bgCanvas = document.createElement('canvas');
let bgCtx = bgCanvas.getContext('2d', { alpha: true });
const particleCount = 80;
const starCount = 500;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;

    drawStaticStars();

    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.6 ? '#FFD369' : (Math.random() > 0.3 ? '#7d5fff' : '#1abc9c'),
            pulse: Math.random() * 0.04,
            opacity: Math.random()
        });
    }
}

function drawStaticStars() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * bgCanvas.width;
        const y = Math.random() * bgCanvas.height;
        const size = Math.random() * 1.8;
        const opacity = Math.random() * 0.9;

        bgCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        bgCtx.beginPath();
        bgCtx.arc(x, y, size, 0, Math.PI * 2);
        bgCtx.fill();
    }
}

let isPaused = false;
document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
});

function animate() {
    if (isPaused) {
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgCanvas, 0, 0);

    particles.forEach(p => {
        p.opacity += p.pulse;
        if (p.opacity > 1 || p.opacity < 0.2) p.pulse *= -1;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Add a small glow to particles
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
animate();

