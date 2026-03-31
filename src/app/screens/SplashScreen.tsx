import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Leaf } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen px-8"
      style={{
        background: 'linear-gradient(135deg, #5C7A5F 0%, #3D5440 100%)'
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: 'white' }}
          >
            <Leaf 
              className="w-14 h-14" 
              style={{ color: 'var(--main-green)' }}
              strokeWidth={2.5}
            />
          </div>
        </div>
        
        <h1 
          className="text-5xl tracking-tight"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: 'white'
          }}
        >
          Calority
        </h1>
        
        <p 
          className="text-lg text-center max-w-xs opacity-95"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: 'white'
          }}
        >
          Snap your meal. Know your calories.
        </p>
      </div>
    </div>
  );
}


