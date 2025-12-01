import { useEffect } from 'react';

export default function MathDisplay({ tex, display = false }) {
  useEffect(() => {
    if (window.katex) {
      try {
        window.katex.render(tex, document.getElementById(`math-${tex}`), {
          displayMode: display,
          throwOnError: false,
        });
      } catch (e) {
        console.error('KaTeX error:', e);
      }
    }
  }, [tex, display]);

  return <div id={`math-${tex}`} className="inline-block" />;
}
