// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 5px 30px rgba(59, 130, 246, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill level bars
            if (entry.target.classList.contains('skill-card')) {
                const levelBar = entry.target.querySelector('.skill-level-fill');
                if (levelBar) {
                    const level = levelBar.getAttribute('data-level');
                    let width = 0;
                    switch(level) {
                        case 'Beginner': width = 25; break;
                        case 'Intermediate': width = 50; break;
                        case 'Advanced': width = 75; break;
                        case 'Expert': width = 100; break;
                    }
                    setTimeout(() => {
                        levelBar.style.width = width + '%';
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .skill-card, .project-card, .timeline-item, .contact-method').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Animate numbers or counters if needed
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add active state to navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Cursor trail effect (optional - can be enabled)
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', (e) => {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = e.pageX + 'px';
        dot.style.top = e.pageY + 'px';
        document.body.appendChild(dot);
        
        setTimeout(() => {
            dot.remove();
        }, 1000);
    });
};

// Initialize on page load
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');

    // Trigger any initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    // Initialize drag and drop functionality
    initializeDragAndDrop();
});

// Add typing effect to tagline (optional)
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    type();
};

// Drag and Drop functionality for customization
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let originalPosition = { x: 0, y: 0 };

// Make elements draggable
function makeElementDraggable(element) {
    element.style.cursor = 'grab';
    element.style.position = 'relative';
    element.style.zIndex = '10';

    element.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left mouse button

        draggedElement = element;
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        originalPosition.x = rect.left - parentRect.left;
        originalPosition.y = rect.top - parentRect.top;

        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';

        // Add visual feedback
        element.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
        element.style.transform = 'scale(1.05)';

        e.preventDefault();
    });

    element.addEventListener('mousemove', (e) => {
        if (draggedElement !== element) return;

        const parentRect = element.parentElement.getBoundingClientRect();
        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;

        // Constrain to parent bounds
        const maxX = parentRect.width - element.offsetWidth;
        const maxY = parentRect.height - element.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        element.style.left = constrainedX + 'px';
        element.style.top = constrainedY + 'px';
    });

    element.addEventListener('mouseup', () => {
        if (draggedElement !== element) return;

        draggedElement = null;
        element.style.cursor = 'grab';
        element.style.zIndex = '10';

        // Remove visual feedback
        element.style.boxShadow = '';
        element.style.transform = '';

        // Save position (you can extend this to save to localStorage or send to server)
        saveElementPosition(element);
    });

    element.addEventListener('mouseleave', () => {
        if (draggedElement === element) {
            // Continue dragging even when mouse leaves the element
        }
    });
}

// Save element position
function saveElementPosition(element) {
    const position = {
        id: element.id || element.className,
        left: element.style.left,
        top: element.style.top
    };

    // Save to localStorage for persistence
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');
    const existingIndex = positions.findIndex(p => p.id === position.id);

    if (existingIndex >= 0) {
        positions[existingIndex] = position;
    } else {
        positions.push(position);
    }

    localStorage.setItem('elementPositions', JSON.stringify(positions));

    // You can also send this to your backend API here
    console.log('Element position saved:', position);
}

// Load saved positions
function loadSavedPositions() {
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');

    positions.forEach(position => {
        const element = document.querySelector(`#${position.id}`) ||
                       document.querySelector(`.${position.id.split(' ').join('.')}`);
        if (element) {
            element.style.left = position.left;
            element.style.top = position.top;
        }
    });
}

// Initialize drag and drop for draggable elements
function initializeDragAndDrop() {
    // Make specific elements draggable
    const draggableElements = document.querySelectorAll('.profile-image-wrapper, .skill-card, .project-card, .contact-method');

    draggableElements.forEach(element => {
        makeElementDraggable(element);
    });

    // Load saved positions
    loadSavedPositions();
}

// Keyboard shortcuts for precise positioning
document.addEventListener('keydown', (e) => {
    if (!draggedElement) return;

    const step = e.shiftKey ? 10 : 1; // Larger steps with Shift

    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            adjustElementPosition(draggedElement, 0, -step);
            break;
        case 'ArrowDown':
            e.preventDefault();
            adjustElementPosition(draggedElement, 0, step);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            adjustElementPosition(draggedElement, -step, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            adjustElementPosition(draggedElement, step, 0);
            break;
        case 'Escape':
            // Reset to original position
            if (draggedElement) {
                draggedElement.style.left = originalPosition.x + 'px';
                draggedElement.style.top = originalPosition.y + 'px';
                draggedElement.style.cursor = 'grab';
                draggedElement.style.zIndex = '10';
                draggedElement.style.boxShadow = '';
                draggedElement.style.transform = '';
                draggedElement = null;
            }
            break;
    }
});

// Adjust element position with keyboard
function adjustElementPosition(element, deltaX, deltaY) {
    const currentLeft = parseInt(element.style.left) || 0;
    const currentTop = parseInt(element.style.top) || 0;

    const parentRect = element.parentElement.getBoundingClientRect();
    const maxX = parentRect.width - element.offsetWidth;
    const maxY = parentRect.height - element.offsetHeight;

    const newX = Math.max(0, Math.min(currentLeft + deltaX, maxX));
    const newY = Math.max(0, Math.min(currentTop + deltaY, maxY));

    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
}
