import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("page-transition-enter");
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("page-transition-exit-active");
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("page-transition-enter");
        
        const enterTimeout = setTimeout(() => {
          setTransitionStage("page-transition-enter-active");
        }, 10);
        
        return () => clearTimeout(enterTimeout);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);
  
  return (
    <div className={`w-full ${transitionStage}`}>
      {children}
    </div>
  );
}