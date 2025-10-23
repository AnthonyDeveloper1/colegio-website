/**
 * PageTransition Component
 * 
 * Wrapper simple con transición CSS ligera entre páginas
 * Optimizado para performance - sin JavaScript pesado
 */

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
  <div className="min-h-screen opacity-100 animate-[fadeIn_0.15s_ease-in-out]">
      {children}
    </div>
  );
}
