// Three.js Scene Setup
let scene, camera, renderer, hearts = [];
let isIntensified = false;

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer
    const canvas = document.getElementById('threeCanvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xff69b4, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff1493, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        createHeart3D();
    }
    
    // Animation loop
    animate();
    
    // Resize handler
    window.addEventListener('resize', onWindowResize);
}

function createHeartShape() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    
    return shape;
}

function createHeart3D() {
    const heartShape = createHeartShape();
    
    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5
    };
    
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    
    // Random gradient material
    const colors = [
        0xff1493, // Deep pink
        0xff69b4, // Hot pink
        0xff6b9d, // Pink
        0xc71585, // Medium violet red
        0xdb7093  // Pale violet red
    ];
    
    const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        emissive: 0x330011,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    
    const heart = new THREE.Mesh(geometry, material);
    
    // Random position
    heart.position.x = (Math.random() - 0.5) * 60;
    heart.position.y = (Math.random() - 0.5) * 60;
    heart.position.z = (Math.random() - 0.5) * 60;
    
    // Random rotation
    heart.rotation.x = Math.random() * Math.PI;
    heart.rotation.y = Math.random() * Math.PI;
    heart.rotation.z = Math.random() * Math.PI;
    
    // Random scale
    const scale = Math.random() * 0.3 + 0.2;
    heart.scale.set(scale, scale, scale);
    
    // Custom properties for animation
    heart.userData = {
        rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: Math.random() * 5 + 3,
        initialY: heart.position.y
    };
    
    scene.add(heart);
    hearts.push(heart);
    
    return heart;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate each heart
    hearts.forEach(heart => {
        // Rotation
        heart.rotation.x += heart.userData.rotationSpeed.x;
        heart.rotation.y += heart.userData.rotationSpeed.y;
        heart.rotation.z += heart.userData.rotationSpeed.z;
        
        // Floating motion
        heart.position.y = heart.userData.initialY + 
            Math.sin(Date.now() * heart.userData.floatSpeed * 0.001) * heart.userData.floatRange;
        
        // Pulsing scale
        const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        const baseScale = heart.scale.x / pulse;
        heart.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse);
    });
    
    // Rotate camera slowly
    camera.position.x = Math.sin(Date.now() * 0.0001) * 5;
    camera.position.y = Math.cos(Date.now() * 0.0002) * 3;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to intensify hearts when "Yes" is clicked
function intensifyHearts() {
    if (isIntensified) return;
    isIntensified = true;
    
    // Add more hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = createHeart3D();
            // Make them spin faster
            heart.userData.rotationSpeed.x *= 3;
            heart.userData.rotationSpeed.y *= 3;
            heart.userData.rotationSpeed.z *= 3;
        }, i * 100);
    }
    
    // Make existing hearts spin faster temporarily
    hearts.forEach(heart => {
        const originalSpeed = { ...heart.userData.rotationSpeed };
        heart.userData.rotationSpeed.x *= 3;
        heart.userData.rotationSpeed.y *= 3;
        heart.userData.rotationSpeed.z *= 3;
        
        // Restore speed after 5 seconds
        setTimeout(() => {
            heart.userData.rotationSpeed = originalSpeed;
        }, 5000);
    });
}

// Initialize when page loads
window.addEventListener('load', initThreeJS);

// Export for use in main script
window.intensifyHearts = intensifyHearts;
