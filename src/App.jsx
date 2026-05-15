import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Cpu, Volume2, Database, HardDrive, Layers, Activity, ChevronDown, Plus, X } from 'lucide-react';

const Matrix = ({ rows, cols, active = false, label, type = 'frozen' }) => {
  const getCellColor = (r, c) => {
    if (type === 'frozen') return 'rgba(255, 255, 255, 0.12)';
    if (!active) return 'rgba(255,255,255,0.08)';

    if (type === 'A') {
      const hue = (c * 20 + r * 15 + 180) % 360;
      return `hsla(${hue}, 80%, 55%, 0.85)`;
    }
    if (type === 'B') {
      const hue = (r * 20 + c * 15 + 280) % 360;
      return `hsla(${hue}, 80%, 55%, 0.85)`;
    }
    return 'rgba(255, 255, 255, 0.04)';
  };

  const getBorderColor = () => {
    if (type === 'frozen') return 'rgba(255, 255, 255, 0.15)';
    if (!active) return 'rgba(255, 255, 255, 0.15)';
    if (type === 'A') return 'rgba(45, 212, 191, 0.4)';
    if (type === 'B') return 'rgba(129, 140, 248, 0.4)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '6px',
          padding: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          border: `1px solid ${getBorderColor()}`,
          boxShadow: active ? `0 0 40px ${getBorderColor()}` : '0 20px 40px rgba(0,0,0,0.5)',
          transition: 'all 0.5s ease',
          backdropFilter: 'blur(10px)'
        }}
      >
        {Array.from({ length: rows }).map((_, r) => (
          Array.from({ length: cols }).map((_, c) => (
            <motion.div
              key={`${r}-${c}`}
              animate={{
                backgroundColor: getCellColor(r, c),
                scale: active ? [1, 1.15, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: active ? Infinity : 0,
                delay: (r * cols + c) * 0.03,
                ease: "easeInOut"
              }}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            />
          ))
        ))}
      </motion.div>
      <div className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
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
  const matrixSeparation = useTransform(scrollYProgress, [0.45, 0.55], [0, 150]);
  const loraAlpha = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  // Section 4: Training Process
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 1, 1, 1]);

  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setIsTraining(latest > 0.75);
    });
  }, [scrollYProgress]);

  return (
    <>
      <div className="bg-container">
        <div className="orb" />
        <div className="grid-bg" />
        <div className="noise-bg" />
      </div>

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
          zIndex: 100,
          boxShadow: '0 0 20px var(--accent-cyan)'
        }}
      />

      <main style={{ position: 'relative' }}>

        {/* Section 1: Hero */}
        <motion.section
          className="section"
          style={{ opacity: opacity1, y: y1, pointerEvents: pointerEvents1, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}
        >
          <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '900px' }}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                <Brain size={48} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h1 className="gradient-text">Whisper LoRA</h1>
              <h2 className="gradient-text-accent" style={{ fontSize: '2.5rem' }}>A Visual Journey into Low-Rank Adaptation</h2>
              <p style={{ margin: '1.5rem auto 3rem', maxWidth: '700px', fontSize: '1.5rem' }}>
                Fine-tuning large speech models requires massive compute.
                Discover how <strong style={{ color: 'white' }}>LoRA</strong> makes it lightweight, elegant, and perfectly efficient.
              </p>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}
              >
                <span className="mono" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>SCROLL TO EXPLORE</span>
                <ChevronDown size={24} />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2: The Problem */}
        <motion.section
          className="section"
          style={{ opacity: opacity2, y: y2, position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 20 }}
        >
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '5rem' }}>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ color: '#ef4444', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>01 // THE CHALLENGE</div>
              <h2 style={{ fontSize: '3.5rem' }}>The <span style={{ color: '#ef4444' }}>Heavyweight</span> Matrix</h2>
              <p style={{ marginBottom: '2.5rem', fontSize: '1.25rem' }}>
                Pre-trained models like Whisper contain billions of parameters.
                Traditionally, fine-tuning means updating every single weight in this massive matrix <strong style={{ color: 'white', fontFamily: 'JetBrains Mono' }}>W</strong>.
              </p>

              {/* Whisper Data Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                    <Database size={24} color="var(--accent-light)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Parameters</div>
                    <div className="mono" style={{ fontWeight: 700, fontSize: '1.1rem' }}>1.55 Billion</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Large-v2 Model</div>
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                    <Layers size={24} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Architecture</div>
                    <div className="mono" style={{ fontWeight: 700, fontSize: '1.1rem' }}>32 Blocks</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Encoders / Decoders</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="card" style={{ flex: 1, borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                  <HardDrive size={24} color="#ef4444" style={{ marginBottom: '1rem' }} />
                  <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '1.1rem' }}>VRAM Exhaustion</div>
                </div>
                <div className="card" style={{ flex: 1, borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                  <Cpu size={24} color="#ef4444" style={{ marginBottom: '1rem' }} />
                  <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '1.1rem' }}>Compute Heavy</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Matrix rows={10} cols={10} label="Pre-trained Weights (W)" type="frozen" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    border: '2px dashed rgba(239, 68, 68, 0.6)',
                    borderRadius: '24px',
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
            <div className="mono" style={{ color: 'var(--accent-light)', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>02 // THE SOLUTION</div>
            <h2 style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>The <span className="gradient-text-accent">Elegant</span> Split</h2>
            <p style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '4rem', fontSize: '1.25rem' }}>
              Instead of updating <strong style={{ color: 'white' }}>W</strong>, we freeze it. We introduce a small update matrix <strong style={{ color: 'white' }}>ΔW</strong>,
              which we decompose into two low-rank matrices: <strong style={{ color: 'var(--accent-light)' }}>B</strong> and <strong style={{ color: 'var(--accent-cyan)' }}>A</strong>.
              <br /><br />
              <span className="mono" style={{ fontSize: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                W' = W + (B × A)
              </span>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '350px', position: 'relative' }}>

              {/* Frozen W */}
              <motion.div style={{ position: 'absolute', x: useTransform(matrixSeparation, [0, 150], [0, -350]) }}>
                <Matrix rows={10} cols={10} label="Frozen (W) d×d" type="frozen" />
              </motion.div>

              {/* Plus Sign */}
              <motion.div
                style={{
                  position: 'absolute',
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 150], [0, -120]),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'
                }}
              >
                <Plus size={40} color="var(--text-secondary)" strokeWidth={1} />
              </motion.div>

              {/* Matrix B */}
              <motion.div
                style={{
                  position: 'absolute',
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 150], [0, 60])
                }}
              >
                <Matrix rows={10} cols={2} label="B (d×r)" type="B" active={false} />
              </motion.div>

              {/* Multiply Sign */}
              <motion.div
                style={{
                  position: 'absolute',
                  opacity: loraAlpha,
                  paddingRight: "5rem",
                  paddingBottom: "0.4rem",
                  x: useTransform(matrixSeparation, [0, 150], [0, 190]),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'
                }}
              >
                <X size={40} color="var(--text-secondary)" strokeWidth={1} />
              </motion.div>

              {/* Matrix A */}
              <motion.div
                style={{
                  position: 'absolute',
                  opacity: loraAlpha,
                  x: useTransform(matrixSeparation, [0, 150], [0, 320])
                }}
              >
                <Matrix rows={2} cols={10} label="A (r×d)" type="A" active={false} />
              </motion.div>

            </div>

            <motion.div style={{ opacity: loraAlpha, marginTop: '3rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>By setting the <strong className="gradient-text-accent">Rank (r) &lt;&lt; Dimension (d)</strong>, the number of trainable parameters plummets.</p>
              <div className="card" style={{ display: 'inline-block', borderColor: 'rgba(45, 212, 191, 0.3)', background: 'rgba(45, 212, 191, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Activity size={24} color="var(--accent-cyan)" />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>Example Reduction:</span>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>100 weights reduced to 40 (<strong style={{ color: 'var(--accent-cyan)' }}>-60% smaller</strong>).</span>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>For Whisper's millions of parameters per layer, this saves Gigabytes of memory!</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 4: Training with Synthetic Data */}
        <motion.section
          className="section"
          style={{ opacity: opacity4, position: 'fixed', top: 0, left: 0, right: 0, pointerEvents: 'auto', zIndex: 40 }}
        >
          <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '4rem', alignItems: 'center' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <div className="mono" style={{ color: 'var(--accent-cyan)', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>03 // EXECUTION</div>
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Training in <span className="gradient-text-accent">Action</span></h2>
                <p style={{ fontSize: '1.2rem' }}>
                  We feed synthetic audio data into the frozen Whisper model. The gradients <strong>only update</strong> the tiny <strong style={{ color: 'var(--accent-light)' }}>B</strong> and <strong style={{ color: 'var(--accent-cyan)' }}>A</strong> matrices.
                </p>
              </div>

              <div className="card" style={{ borderColor: isTraining ? 'rgba(45, 212, 191, 0.4)' : 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Database size={24} color={isTraining ? "var(--accent-cyan)" : "var(--text-secondary)"} style={{ transition: 'color 0.5s' }} />
                    <span style={{ fontWeight: 600, fontSize: '1.1rem', color: isTraining ? 'white' : 'var(--text-secondary)', transition: 'color 0.5s' }}>Synthetic Data Stream</span>
                  </div>
                  {isTraining && <span className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', background: 'rgba(45,212,191,0.1)', padding: '4px 8px', borderRadius: '4px' }}>PROCESSING</span>}
                </div>

                {/* Simulated Audio Waveform */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '60px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isTraining ? {
                        height: ['15%', `${Math.random() * 85 + 15}%`, '15%']
                      } : { height: '15%' }}
                      transition={{
                        duration: 0.4 + Math.random() * 0.6,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{
                        flex: 1,
                        background: isTraining ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        borderRadius: '4px',
                        opacity: isTraining ? 0.8 : 0.3
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="card" style={{ flex: 1, borderColor: 'rgba(45, 212, 191, 0.2)', background: 'rgba(45, 212, 191, 0.05)' }}>
                  <Zap size={24} color="#2dd4bf" style={{ marginBottom: '1rem' }} />
                  <div style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '1.1rem' }}>Low VRAM</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>~8GB requirement</div>
                </div>
                <div className="card" style={{ flex: 1, borderColor: 'rgba(129, 140, 248, 0.2)', background: 'rgba(129, 140, 248, 0.05)' }}>
                  <Volume2 size={24} color="#818cf8" style={{ marginBottom: '1rem' }} />
                  <div style={{ color: '#818cf8', fontWeight: 600, fontSize: '1.1rem' }}>High Quality</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Maintains accuracy</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '32px', padding: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Matrix rows={8} cols={8} label="Frozen Whisper (W)" type="frozen" />
                <div style={{ display: 'flex', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}>
                  <Plus size={32} color="var(--text-secondary)" strokeWidth={1} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <Matrix rows={8} cols={2} label="Updating B" type="B" active={isTraining} />
                  <div style={{ display: 'flex', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}>
                    <X size={32} color="var(--text-secondary)" strokeWidth={1} />
                  </div>
                  <Matrix rows={2} cols={8} label="Updating A" type="A" active={isTraining} />
                </div>
              </div>

              <AnimatePresence>
                {isTraining && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                      marginTop: '4rem',
                      padding: '1.25rem 2.5rem',
                      background: 'linear-gradient(90deg, rgba(129,140,248,0.15), rgba(45,212,191,0.15))',
                      borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: '0 10px 30px rgba(45,212,191,0.1)'
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 15px #2dd4bf' }}
                    />
                    <span className="mono" style={{ fontWeight: 600, letterSpacing: '2px', color: 'white' }}>WEIGHT UPDATES ACTIVE</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.section>

        {/* Dummy space for scrolling */}
        <div style={{ height: '400vh' }} />

      </main >
    </>
  );
}

export default App;
