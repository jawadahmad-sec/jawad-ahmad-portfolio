// Particle network
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.2 + 0.4;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
    }
}
for(let i=0; i<60; i++) particles.push(new Particle());
function animateParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for(let i=0; i<particles.length; i++) {
        for(let j=i+1; j<particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if(dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,255,136,${0.04 * (1- dist/100)})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Typing effect
const typingEl = document.getElementById('typingText');
const phrases = ['Linux & Networking Fundamentals', 'SOC Basics & Log Analysis', 'Hands-on Cybersecurity Labs'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
function typeLoop() {
    const current = phrases[phraseIndex];
    if (isDeleting) charIndex--;
    else charIndex++;
    typingEl.textContent = current.substring(0, charIndex);
    if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
    }
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    setTimeout(typeLoop, isDeleting ? 40 : 90);
}
typeLoop();

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });
revealElements.forEach(el => observer.observe(el));

// Navbar & back-to-top
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    backToTop.classList.toggle('visible', y > 500);
    navbar.style.boxShadow = y > 10 ? '0 4px 30px rgba(0,0,0,0.3)' : 'none';
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
        if (y >= sec.offsetTop - 150) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
}));

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fb = document.getElementById('formFeedback');
    const btn = this.querySelector('button');
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    if (!name || !email) {
        fb.textContent = '⚠️ Please fill required fields.';
        fb.style.color = '#ff3366';
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
        await fetch(this.action, { method: 'POST', body: new FormData(this) });
        fb.textContent = '✅ Message sent!';
        fb.style.color = '#00ff88';
    } catch {
        fb.textContent = '✅ Message recorded (demo).';
        fb.style.color = '#00ff88';
    }
    btn.disabled = false;
    btn.textContent = '📩 Send Message';
    setTimeout(() => { fb.textContent = ''; }, 5000);
});

// CV download tracking
function trackCVDownload() {
    if (typeof clarity === 'function') clarity('event', 'cv_download');
    if (typeof gtag === 'function') gtag('event', 'download', { event_category: 'CV' });
}