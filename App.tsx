
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  CheckCircle2, Zap, Activity, Clock, 
  PhoneOff, Target, Layers, 
  TrendingDown, AlertTriangle, Timer
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  AnimatePresence,
  motion,
  TargetAndTransition,
  Variants,
} from 'framer-motion';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Scroll Hook */
function useScroll(threshold = 0) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return scrolled;
}

// --- Tech Particles Layer (Native Canvas) ---

const TechParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const connectionDistance = 150;
    const mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(93, 214, 44, 0.4)';
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(93, 214, 44, ${0.1 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};

// --- Logo Component ---

const BMKLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <svg viewBox="0 0 400 180" className="h-full w-auto fill-white" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="90" r="75" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M80 35 C 100 50, 110 70, 80 90 C 50 110, 60 130, 80 145" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.5" />
      <path d="M80 15 L 80 165 M 5 90 L 155 90" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M80 60 L 88 90 L 80 120 L 72 90 Z" fill="currentColor" />
      <path d="M50 90 L 80 82 L 110 90 L 80 98 Z" fill="currentColor" />
      <g transform="translate(170, 45)">
        <path d="M0 0 H30 C50 0, 50 35, 30 35 H0 V0 Z M0 45 H35 C55 45, 55 80, 35 80 H0 V45 Z" fill="currentColor" />
        <path d="M65 0 H85 L100 30 L115 0 H135 V80 H115 V30 L100 60 L85 30 V80 H65 V0 Z" fill="currentColor" />
        <path d="M150 0 H170 V35 L195 0 H220 L190 40 L225 80 H200 L170 45 V80 H150 V0 Z" fill="currentColor" />
        <text x="75" y="115" fontSize="28" fontWeight="300" letterSpacing="6" className="font-sans">LABS</text>
      </g>
    </svg>
  </div>
);

// --- Unicorn Studio Background Component ---

const UnicornBackground: React.FC = () => {
  return (
    <div 
      className="aura-background-component top-0 w-full h-screen -z-10 absolute pointer-events-none overflow-hidden" 
      data-alpha-mask="100"
      style={{ 
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 100%, transparent)', 
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 100%, transparent)' 
      }}
    >
      <div data-us-project="ZPruWnhzwuk5Tf6nc1q0" className="absolute w-full h-full left-0 top-0 -z-10"></div>
    </div>
  );
};

// --- TextEffect Component implementation ---

type PresetType = 'blur' | 'shake' | 'scale' | 'fade' | 'slide';

type TextEffectProps = {
  children: React.ReactNode;
  per?: 'word' | 'char' | 'line';
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  segmentWrapperClassName?: string;
};

const defaultStaggerTimes: Record<'char' | 'word' | 'line', number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: 'line' | 'word' | 'char';
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className='block'>
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden='true'
        variants={variants}
        className='inline-block whitespace-pre'
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className='inline-block whitespace-pre'>
        {segment.split('').map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden='true'
            variants={variants}
            className='inline-block whitespace-pre'
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = 'AnimationComponent';

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps) {
  const textContent = typeof children === 'string' ? children : (children?.toString() || '');
  let segments: string[];

  if (per === 'line') {
    segments = textContent.split('\n');
  } else if (per === 'word') {
    segments = textContent.split(/(\s+)/);
  } else {
    segments = textContent.split('');
  }

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;
  const ariaLabel = per === 'line' ? undefined : textContent;

  const stagger = defaultStaggerTimes[per];

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition)?.transition
            ?.staggerChildren || stagger,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  };

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          exit='exit'
          aria-label={ariaLabel}
          variants={delayedContainerVariants}
          className={cn('whitespace-pre-wrap', className)}
          onAnimationComplete={onAnimationComplete}
        >
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}

// --- Icons & UI Parts ---

const MenuToggleIcon = ({ open }: { open: boolean }) => (
  <div className="relative size-5 flex flex-col justify-center gap-1.5">
    <span className={cn("h-0.5 w-full bg-current transition-all", open && "rotate-45 translate-y-2")} />
    <span className={cn("h-0.5 w-full bg-current transition-all", open && "opacity-0")} />
    <span className={cn("h-0.5 w-full bg-current transition-all", open && "-rotate-45 -translate-y-2")} />
  </div>
);

// --- High Performance Components ---

const ShinyButton: React.FC<{ text: string; className?: string; onClick?: () => void }> = ({ text, className, onClick }) => (
  <button className={cn("shiny-cta focus:outline-none", className)} onClick={onClick}>
    <span>{text}</span>
  </button>
);

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(20);

  const links = [
    { label: 'System', href: '#system' },
    { label: 'The Science', href: '#science' },
    { label: 'Guarantee', href: '#guarantee' },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent',
        scrolled 
          ? 'h-16 bg-background/80 backdrop-blur-xl border-white/5 shadow-2xl' 
          : 'h-24 bg-transparent border-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex h-full items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <BMKLogo className={cn("transition-all duration-500", scrolled ? "h-10" : "h-16")} />
        </div>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className={cn(
                "text-sm font-semibold transition-all duration-300",
                scrolled ? "text-zinc-400 hover:text-white" : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </a>
          ))}
          <ShinyButton text="Book a Demo" className={cn("transition-all duration-500", scrolled ? "scale-90" : "scale-100")} />
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-zinc-300">
          <MenuToggleIcon open={open} />
        </button>
      </nav>

      <div className={cn('fixed inset-0 top-0 z-50 flex flex-col bg-background p-6 transition-all duration-500 md:hidden', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}>
        <div className="flex justify-between items-center mb-12">
           <BMKLogo className="h-10" />
           <button onClick={() => setOpen(false)} className="text-zinc-300">
             <MenuToggleIcon open={open} />
           </button>
        </div>
        <div className="flex flex-col gap-8 text-center">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-3xl font-black text-white" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <ShinyButton text="Book a Demo" className="mt-8 py-5 text-xl" onClick={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
};

const Hero: React.FC = () => {
  const [isAfter, setIsAfter] = useState(true);

  const statsData = [
    { name: 'W1', value: isAfter ? 12 : 3 },
    { name: 'W2', value: isAfter ? 24 : 5 },
    { name: 'W3', value: isAfter ? 18 : 4 },
    { name: 'W4', value: isAfter ? 38 : 6 },
    { name: 'W5', value: isAfter ? 45 : 4 },
  ];

  return (
    <section id="system" className="relative pt-40 pb-20 overflow-hidden min-h-[95vh] flex flex-col justify-center">
      {/* Background Stack: Unicorn Gradient + Technical Particles + Grid */}
      <UnicornBackground />
      <TechParticles />
      <div className="absolute inset-0 hero-bg-grid -z-20 opacity-20 pointer-events-none animate-grid-move" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] animate-glow"></div>
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[600px] bg-gradient-to-t from-brand-600/10 via-brand-500/5 to-transparent rounded-[100%] blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold tracking-widest uppercase mb-8 animate-[fadeIn_1s_ease-out_forwards]">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
          Performance Laboratory // BMK LABS
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center leading-[0.9] mb-8 text-white animate-[fadeIn_1s_ease-out_0.2s_forwards] opacity-0">
          Tree Service Ads But<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">No Booked Quotes?</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed mb-12 max-w-2xl text-center animate-[fadeIn_1s_ease-out_0.4s_forwards] opacity-0">
          TreeFlow AI is the first <span className="text-white font-medium">performance-based</span> marketing engine built exclusively for tree services. No monthly retainers. Just booked estimates.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-24 animate-[fadeIn_1s_ease-out_0.6s_forwards] opacity-0">
          <ShinyButton text="Schedule Your Demo" />
          <button className="inline-flex items-center justify-center px-10 py-4 bg-zinc-900 border border-white/5 text-white text-base font-medium rounded-full hover:bg-zinc-800 transition-all backdrop-blur-sm">
            Watch Logic Video
          </button>
        </div>

        <div className="w-full perspective-container flex justify-center animate-[fadeIn_1.2s_ease-out_0.8s_forwards] opacity-0">
          <div className="tilted-card relative w-full max-w-5xl liquid-glass rounded-3xl border border-white/5 shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 space-y-4">
                <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Weekly Volume</div>
                  <div className="text-3xl font-bold text-white mb-2">{isAfter ? '45' : '4'} <span className="text-sm font-normal text-zinc-500">Estimates</span></div>
                  <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1", isAfter ? 'bg-brand-500/10 text-brand-500' : 'bg-red-500/10 text-red-500')}>
                    {isAfter ? <Activity size={10} /> : <TrendingDown size={10} />}
                    {isAfter ? '+1125% Uplift' : 'Stagnant'}
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">AI Response Latency</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-brand-500">&lt;90s</div>
                    <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full w-[95%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-6 bg-zinc-900/20 border border-white/5 rounded-2xl p-6 flex flex-col h-[300px]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-white">System Growth Engine</h4>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Live Laboratory Data</p>
                  </div>
                  <div className="flex bg-zinc-800 rounded p-1">
                    <button onClick={() => setIsAfter(false)} className={cn("px-3 py-1 text-[10px] font-bold rounded", !isAfter ? 'bg-white text-black' : 'text-zinc-500')}>BEFORE</button>
                    <button onClick={() => setIsAfter(true)} className={cn("px-3 py-1 text-[10px] font-bold rounded", isAfter ? 'bg-brand-500 text-black' : 'text-zinc-500')}>AFTER</button>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5DD62C" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#5DD62C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ background: '#121214', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#5DD62C' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#5DD62C" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="bg-brand-500 rounded-2xl p-6 h-full text-black relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div>
                    <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Zap size={20} className="text-black" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Performance Unlocked</h4>
                    <p className="text-black/70 text-xs leading-relaxed">67% Increase in booking efficiency detected after system deployment.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-black/10 p-2 rounded-lg backdrop-blur-sm uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Verified Results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HighImpactScience: React.FC = () => {
  return (
    <section id="science" className="relative py-40 md:py-60 bg-background overflow-hidden flex flex-col items-center justify-center text-center px-6 transition-colors duration-700">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg viewBox="0 0 1440 800" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5DD62C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5DD62C" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M-100 600 C 200 400, 400 700, 720 500 S 1100 200, 1540 550 L 1540 800 L -100 800 Z" fill="url(#waveGrad)" className="animate-pulse-slow" />
          <path d="M-100 600 C 200 400, 400 700, 720 500 S 1100 200, 1540 550" fill="none" stroke="#5DD62C" strokeWidth="3" filter="url(#glow)" strokeDasharray="2000" strokeDashoffset="2000" className="animate-[pathDraw_4s_ease-out_forwards]" />
          <g className="animate-[fadeIn_2s_ease-out_forwards] opacity-0">
            <circle cx="200" cy="510" r="6" fill="#fff" filter="url(#glow)" />
            <circle cx="450" cy="620" r="6" fill="#fff" filter="url(#glow)" />
            <circle cx="720" cy="500" r="6" fill="#fff" filter="url(#glow)" />
            <circle cx="1000" cy="320" r="6" fill="#fff" filter="url(#glow)" />
            <circle cx="1300" cy="450" r="6" fill="#fff" filter="url(#glow)" />
          </g>
          <g stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1">
            <line x1="200" y1="510" x2="200" y2="800" />
            <line x1="450" y1="620" x2="450" y2="800" />
            <line x1="720" y1="500" x2="720" y2="800" />
            <line x1="1000" y1="320" x2="1000" y2="800" />
            <line x1="1300" y1="450" x2="1300" y2="800" />
          </g>
        </svg>
      </div>
      <style>{`
        @keyframes pathDraw { to { stroke-dashoffset: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes numberGlow { 0%, 100% { text-shadow: 0 0 30px rgba(93, 214, 44, 0.15); } 50% { text-shadow: 0 0 60px rgba(93, 214, 44, 0.4); } }
      `}</style>
      <div className="relative z-10 max-w-5xl flex flex-col items-center">
        <div className="flex flex-wrap justify-center items-center gap-x-4 mb-6">
          <TextEffect per="word" preset="blur" delay={0.5} className="text-white text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]" children="Power Up Your Sales Engine" />
          <div className="w-16 h-8 md:w-24 md:h-12 bg-brand-500 rounded-full flex items-center p-1 md:p-1.5 shadow-[0_0_30px_rgba(93,214,44,0.4)] animate-[fadeIn_1s_ease-out_1s_forwards] opacity-0">
             <div className="h-full aspect-square bg-white rounded-full shadow-lg translate-x-full md:translate-x-[calc(100%+8px)]" />
          </div>
        </div>
        <TextEffect per="word" preset="fade" delay={1} className="text-white/60 text-lg md:text-2xl font-semibold tracking-tight max-w-3xl mb-12" children="Studies show that responding to a lead within 5 minutes increases their conversion rate by:" />
        <div className="relative flex flex-col items-center justify-center animate-[fadeIn_1s_ease-out_1.5s_forwards] opacity-0">
          <span className="text-[10rem] md:text-[16rem] font-black text-brand-500/20 tracking-tighter leading-none select-none animate-[numberGlow_4s_infinite_alternate]">900%</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500/5 blur-[150px] -z-10 rounded-full" />
        </div>
        <p className="mt-8 text-zinc-700 text-[10px] font-mono tracking-[0.3em] uppercase animate-[fadeIn_1s_ease-out_2s_forwards] opacity-0">Source: InsideSales.com Performance Research</p>
      </div>
    </section>
  );
};

const ProblemSection: React.FC = () => {
  return (
    <section id="results" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col text-center max-w-3xl mx-auto mb-20 items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-bold uppercase tracking-widest mb-6"><AlertTriangle size={12} />The Profit Leak</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">Traditional Agencies Ignore <span className="text-zinc-600">Lead Decay.</span></h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left w-full max-w-2xl">
            {[{ icon: <TrendingDown className="text-red-500" />, text: "73% of ad spend is wasted on low-intent clicks" }, { icon: <Clock className="text-red-500" />, text: "Leads go cold after 5 minutes of no contact" }, { icon: <PhoneOff className="text-red-500" />, text: "64% of potential estimates never get scheduled" }, { icon: <Target className="text-red-500" />, text: "Competitors steal hot leads within seconds" }].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-red-500/30 transition-all group">
                <div className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-zinc-400 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const GuaranteeSection: React.FC = () => {
  return (
    <section id="guarantee" className="py-24 bg-background relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">The $0 Retainer Guarantee</h2>
        <div className="liquid-glass p-8 md:p-12 rounded-[40px] border border-brand-500/10 shadow-2xl relative overflow-hidden group">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <h3 className="text-2xl font-bold text-white">No Result, No Fee.</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">We only earn when you secure booked estimates from qualified homeowners.</p>
              <div className="space-y-4">
                {['$0 Monthly Retainer', '30-Day Measurable Results', 'Full Data Transparency'].map((item) => (
                  <div key={item} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center"><CheckCircle2 size={14} className="text-brand-500" /></div><span className="text-zinc-200 font-medium text-sm">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/40 rounded-3xl border border-white/5 backdrop-blur-sm">
              <div className="text-6xl font-bold text-white mb-2 tracking-tighter">100%</div>
              <div className="text-brand-500 font-bold uppercase tracking-widest text-[10px] mb-6">Performance Aligned</div>
              <ShinyButton text="Claim My Territory" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-background text-zinc-300 overflow-x-hidden min-h-screen selection:bg-brand-500 selection:text-black">
      <Header />
      <Hero />
      <HighImpactScience />
      <ProblemSection />
      <GuaranteeSection />
      <footer className="bg-background border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8 text-center">
          <BMKLogo className="h-16 grayscale opacity-80" />
          <div className="text-[11px] text-zinc-600 font-mono tracking-[0.4em] uppercase">© 2025 BMK LABS. Performance Marketing System v4.2</div>
          <div className="flex gap-8">
             <a href="#" className="text-xs text-zinc-500 hover:text-brand-500 transition-colors">Privacy Laboratory</a>
             <a href="#" className="text-xs text-zinc-500 hover:text-brand-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
