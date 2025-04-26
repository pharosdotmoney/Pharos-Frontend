'use client';

import { useState, useEffect, useRef } from 'react';

export default function StablecoinAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize canvas and particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
      
      // Create particles
      const particleCount = Math.floor((width * height) / 10000);
      const newParticles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.8 ? '#C6D130' : '#ffffff',
        opacity: Math.random() * 0.5 + 0.2
      }));
      
      setParticles(newParticles);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [canvasRef]);
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw grid pattern
      ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      
      for (let x = 0; x <= dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }
      
      // Update and draw particles
      const updatedParticles = particles.map(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color === '#C6D130' 
          ? `rgba(198, 209, 48, ${particle.opacity})` 
          : `rgba(255, 255, 255, ${particle.opacity * 0.5})`;
        ctx.fill();
        
        return particle;
      });
      
      // Draw connections between nearby particles
      ctx.lineWidth = 0.3;
      for (let i = 0; i < updatedParticles.length; i++) {
        for (let j = i + 1; j < updatedParticles.length; j++) {
          const dx = updatedParticles[i].x - updatedParticles[j].x;
          const dy = updatedParticles[i].y - updatedParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
            ctx.lineTo(updatedParticles[j].x, updatedParticles[j].y);
            
            const opacity = 1 - distance / 100;
            if (updatedParticles[i].color === '#C6D130' || updatedParticles[j].color === '#C6D130') {
              ctx.strokeStyle = `rgba(198, 209, 48, ${opacity * 0.3})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
            }
            
            ctx.stroke();
          }
        }
      }
      
      // Draw central stablecoin visualization
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      // Draw outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(198, 209, 48, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw inner circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(198, 209, 48, 0.1)';
      ctx.fill();
      
      // Draw dollar symbol
      ctx.font = 'bold 60px Arial';
      ctx.fillStyle = '#C6D130';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', centerX, centerY);
      
      // Draw pulsating glow
      const time = timestamp / 1000;
      const glowSize = 90 + Math.sin(time * 2) * 10;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 60,
        centerX, centerY, glowSize
      );
      gradient.addColorStop(0, 'rgba(198, 209, 48, 0.3)');
      gradient.addColorStop(1, 'rgba(198, 209, 48, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw data points around the circle
      const dataPoints = 12;
      const radius = 120;
      
      for (let i = 0; i < dataPoints; i++) {
        const angle = (i / dataPoints) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Draw connecting line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(198, 209, 48, ${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw data point
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#C6D130';
        ctx.fill();
      }
      
      // Draw text labels
      const labels = ['SECURE', 'STABLE', 'VERIFIED', 'BACKED'];
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'white';
      
      labels.forEach((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * (radius + 30);
        const y = centerY + Math.sin(angle) * (radius + 30);
        
        ctx.fillText(label, x, y);
      });
      
      setParticles(updatedParticles);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, dimensions]);
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0"
      />
    </div>
  );
} 