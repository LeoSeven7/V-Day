document.addEventListener("DOMContentLoaded", () => {
    const revealButton = document.getElementById("revealButton");
    const gift = document.getElementById("gift");
    const confettiCanvas = document.getElementById("confettiCanvas");
    const nameInput = document.getElementById("nameInput");
    const personalizedMessage = document.querySelector(".message");
    const countdown = document.getElementById("countdown");
    const generateMessageButton = document.getElementById("generateMessage");
    let interval;
    let animationFrame;

    // Error handling
    if (!revealButton || !gift || !nameInput || !personalizedMessage || !confettiCanvas) {
        console.error("Critical elements missing!");
        return;
    }

    // Load saved name
    nameInput.value = localStorage.getItem("valentineName") || "";

    // Countdown Timer (UTC)
    const targetDate = new Date("2025-02-14T00:00:00Z").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(interval);
            countdown.textContent = "Happy Valentine's Day!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s left!`;
    }

    interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Resize handler
    window.addEventListener("resize", () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });

    // Cursor sparkles
    document.addEventListener("mousemove", (e) => {
        const sparkle = document.createElement("div");
        sparkle.className = "cursor-sparkle";
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    });

    // Message Generator
    const messages = [
        "You’re the peanut butter to my jelly!",
        "I’d choose you in every lifetime ❤️",
        "You’re my favorite notification.",
        "My heart skips a beat when you smile.",
        "You’re my forever upgrade.",
        "Life without you would be WiFi without internet.",
        "You’re my ‘Ctrl + S’ – my constant save point.",
        "I love you more than coffee… and that’s saying a lot!",
        "You’re my favorite adventure.",
        "Forever wouldn’t be long enough with you."
    ];

    // Reveal Gift
    revealButton.addEventListener("click", () => {
        const trimmedName = nameInput.value.trim();

        if (!trimmedName) {
            nameInput.classList.add("error-shake");
            setTimeout(() => nameInput.classList.remove("error-shake"), 500);
            return;
        }

        localStorage.setItem("valentineName", trimmedName);
        gift.classList.remove("hidden");
        revealButton.style.display = "none";

        // Confetti
        if (confettiCanvas.getContext) {
            const confetti = confettiCanvas.getContext('2d');
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
            launchConfetti(confetti);
        }
    });

    // Generate Messages
    generateMessageButton.addEventListener("click", () => {
        const name = localStorage.getItem("valentineName");
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        personalizedMessage.textContent = name 
            ? `${randomMessage} - ${name} ❤️` 
            : randomMessage;
    });

    // Confetti System
    function launchConfetti(ctx) {
        const confettiColors = ['#ff3366', '#ff6699', '#ffffff'];
        const confettiPieces = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * ctx.canvas.width,
            y: Math.random() * ctx.canvas.height - ctx.canvas.height,
            r: Math.random() * 4 + 1,
            d: Math.random() * ctx.canvas.height,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            tilt: Math.random() * 15,
        }));

        function draw() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            confettiPieces.forEach(p => {
                p.y += 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
        }

        function update() {
            confettiPieces.forEach(p => {
                if (p.y > ctx.canvas.height) {
                    p.y = -p.d;
                    p.x = Math.random() * ctx.canvas.width;
                }
            });
        }

        function animate() {
            draw();
            update();
            animationFrame = requestAnimationFrame(animate);
        }

        animate();
        setTimeout(() => cancelAnimationFrame(animationFrame), 10000);
    }
});