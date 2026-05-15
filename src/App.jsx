import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Cpu, Volume2, Database, HardDrive, Layers } from 'lucide-react';

const Matrix = ({ rows, cols, active = false, label, type = 'frozen', customColors = {} }) => {
  const getCellColor = (r, c) => {
    if (type === 'frozen') return 'var(--frozen-color)';
    if (!active) return 'rgba(255,255,255,0.05)';
    
    // Animate colors based on row/col to simulate training updates
    if (type === 'A') {
      const hue = (c * 30 + r * 10) % 360;
      return `hsla(${hue}, 80%, 60%, 0.8)`;
    }
    if (type === 'B') {
      const hue = (r * 30 + c * 10 + 120) % 360;
      return `hsla(${hue}, 80%, 60%, 0.8)`;
    }
    return 'var(--frozen-color)';
  };

  return (
    <div className="matrix-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div 
        className="matrix-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '4px',
          padding: '12px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          Array.from({ length: cols }).map((_, c) => (
            <motion.div
              key={`${r}-${c}`}
              className="matrix-cell"
              animate={{
                backgroundColor: getCellColor(r, c),
                scale: active ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 2,
                repeat: active ? Infinity : 0,
                delay: (r * cols + c) * 0.05,
                ease: "easeInOut"
              }}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px'
              }}
            />
          ))
        ))}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, fontFamily: 'monospace' }}>
        {label}
      </div>
    </div>
  );
};

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Section 1: Intro
  const y1 = useTransform(scrollYProgress, [0, 0.15], ['0vh', '-100vh']);
  const opacity1 = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const pointerEvents1 = useTransform(scrollYProgress, (v) => v > 0.1 ? 'none' : 'auto');

  // Section 2: The Problem
  const opacity2 = useTransform(scrollYProgress, [0.1, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.1, 0.2], [100, 0]);

  // Section 3: LoRA Splitting
  const opacity3 = useTransform(scrollYProgress, [0.35, 0.45, 0.65, 0.75], [0, 1, 1, 0]);
  const matrixSeparation = useTransform(scrollYProgress, [0.45, 0.55], [0, 100]);
  const loraAlpha = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  // Section 4: Training Process
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 1, 1, 1]);
  
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest > 0.75) {
        setIsTraining(true);
      } else {
        setIsTraining(false);
      }
    });
  }, [scrollYProgress]);

  return (
    <>
      <div className="grid-bg" />
      
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--accent-light), var(--accent-cyan))',
          transformOrigin: '0%',
          scaleX,
          zIndex: 100
        }}
      />

      <main style={{ position: 'relative' }}>
        
        {/* Section 1: Hero */}
        <motion.section 
          className="section" 
          style={{ opacity: opacity1, y: y1, pointerEvents: pointerEvents1, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}
        >
          <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Brain size={64} style={{ color: 'var(--accent-light)', margin: '0 auto 2rem' }} />
              <h1 className="gradient-text">Whisper LoRA</h1>
              <h2>A Visual Journey into Low-Rank Adaptation</h2>
              <p style={{ margin: '0 auto 2rem' }}>
                Fine-tuning large speech models like Whisper requires massive compute. 
                Discover how LoRA makes it lightweight, elegant, and efficient.
              </p>
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ color: 'var(--text-secondary)', marginTop: '4rem' }}
              >
                Scroll to begin the journey ↓
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2: The Problem */}
        <motion.section 
          className="section" 
          style={{ opacity: opacity2, y: y2, position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 20 }}
        >
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: 1 }}>
              <h2 className="gradient-text" style={{ fontSize: '2rem' }}>The Heavyweight Challenge</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Pre-trained models like Whisper contain billions of parameters. 
                Traditionally, fine-tuning means updating every single weight in this massive matrix <strong style={{ color: 'white' }}>W</strong>.
              </p>

              {/* Whisper Data Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Database size={24} color="var(--accent-light)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Parameters</div>
                    <div style={{ fontWeight: 600 }}>1.55 Billion (Large-v2)</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Layers size={24} color="var(--accent-cyan)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Architecture</div>
                    <div style={{ fontWeight: 600 }}>32 Encoders / 32 Decoders</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <HardDrive size={24} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>High VRAM Usage</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <Cpu size={24} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>Slow Training</div>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Matrix rows={12} cols={12} label="Pre-trained Weights (W)" type="frozen" />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  style={{ 
                    position: 'absolute', 
                    inset: '-10px', 
                    border: '2px solid rgba(239, 68, 68, 0.5)', 
                    borderRadius: '16px',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 3: The LoRA Solution */}
        <motion.section 
          className="section" 
          style={{ opacity: opacity3, position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 30 }}
        >
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>The Elegant Split</h2>
            <p style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '4rem' }}>
              Instead of updating <strong style={{color:'white'}}>W</strong>, we freeze it. We introduce a small update matrix <strong style={{color:'white'}}>ΔW</strong>, 
              which we decompose into two low-rank matrices: <strong style={{color:'var(--accent-light)'}}>B</strong> and <strong style={{color:'var(--accent-cyan)'}}>A</strong>.
              <br/><br/>
              <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px' }}>
                W' = W + (B × A)
              </span>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '300px', position: 'relative' }}>
              
              {/* Frozen W */}
              <motion.div style={{ position: 'absolute', x: useTransform(matrixSeparation, [0, 100], [0, -300]) }}>
                <Matrix rows={12} cols={12} label="Frozen (W) d×d" type="frozen" />
              </motion.div>

              {/* Plus Sign */}
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  fontSize: '2rem', 
                  fontWeight: 300, 
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 100], [0, -100])
                }}
              >
                +
              </motion.div>

              {/* Matrix B */}
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 100], [0, 50])
                }}
              >
                <Matrix rows={12} cols={2} label="B (d×r)" type="B" active={false} />
              </motion.div>

              {/* Multiply Sign */}
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  fontSize: '2rem', 
                  fontWeight: 300, 
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 100], [0, 150])
                }}
              >
                ×
              </motion.div>

              {/* Matrix A */}
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 100], [0, 250])
                }}
              >
                <Matrix rows={2} cols={12} label="A (r×d)" type="A" active={false} />
              </motion.div>

            </div>
            
            <motion.div style={{ opacity: loraAlpha, marginTop: '2rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <p style={{ marginBottom: '0.5rem' }}>By setting the <strong>Rank (r) &lt;&lt; Dimension (d)</strong>, the number of trainable parameters plummets.</p>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Example Reduction:</span> 144 weights reduced to just 48 (<strong>~66% smaller</strong>). For Whisper's millions of parameters per layer, this saves Gigabytes of memory!
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 4: Training with Synthetic Data */}
        <motion.section 
          className="section" 
          style={{ opacity: opacity4, position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'auto', zIndex: 40 }}
        >
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Training in Action</h2>
                <p>
                  We feed synthetic audio data into the frozen Whisper model. The gradients only update the tiny <strong style={{color:'var(--accent-light)'}}>B</strong> and <strong style={{color:'var(--accent-cyan)'}}>A</strong> matrices.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '1.5rem', 
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Database size={20} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 600 }}>Synthetic Batch</span>
                </div>
                
                {/* Simulated Audio Waveform */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px' }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isTraining ? {
                        height: ['20%', `${Math.random() * 80 + 20}%`, '20%']
                      } : { height: '20%' }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{
                        width: '8px',
                        background: 'var(--accent-cyan)',
                        borderRadius: '4px',
                        opacity: 0.8
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: 'rgba(45, 212, 191, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                  <Zap size={24} color="#2dd4bf" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: '#2dd4bf', fontWeight: 600 }}>Low VRAM</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>~8GB requirement</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(129, 140, 248, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                  <Volume2 size={24} color="#818cf8" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ color: '#818cf8', fontWeight: 600 }}>High Quality</div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>Same accuracy</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Matrix rows={8} cols={8} label="Frozen Whisper (W)" type="frozen" />
                <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>+</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Matrix rows={8} cols={2} label="Updating B" type="B" active={isTraining} />
                  <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>×</div>
                  <Matrix rows={2} cols={8} label="Updating A" type="A" active={isTraining} />
                </div>
              </div>
              
              <AnimatePresence>
                {isTraining && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: '3rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(90deg, rgba(129,140,248,0.2), rgba(45,212,191,0.2))',
                      borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 10px #2dd4bf' }} />
                    <span style={{ fontWeight: 500, letterSpacing: '1px' }}>SYNTHETIC DATA TRAINING ACTIVE</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </motion.section>

        {/* Dummy space for scrolling */}
        <div style={{ height: '400vh' }} />

      </main>
    </>
  );
}

export default App;
