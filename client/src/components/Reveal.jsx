import useOnScreen from '../hooks/useOnScreen';

// eslint-disable-next-line react/prop-types
export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useOnScreen({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
