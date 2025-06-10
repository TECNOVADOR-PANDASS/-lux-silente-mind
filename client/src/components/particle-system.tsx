import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export default function ParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 5; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: i * 1000,
        duration: Math.random() * 10 + 15,
      });
    }
    setParticles(initialParticles);

    // Create new particles periodically
    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: Date.now(),
        x: Math.random() * 100,
        delay: 0,
        duration: Math.random() * 10 + 15,
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Remove particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000 + 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{ left: `${particle.x}vw` }}
          initial={{ y: "100vh", rotate: 0, opacity: 0 }}
          animate={{ 
            y: "-100vh", 
            rotate: 360, 
            opacity: [0, 1, 1, 0] 
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay / 1000,
            ease: "linear",
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: particle.duration
            }
          }}
        />
      ))}
    </div>
  );
}
