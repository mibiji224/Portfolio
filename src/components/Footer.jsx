import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border text-foreground py-8 px-4 sm:px-6 lg:px-12 font-sans relative z-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* LEFT: Copyright & Branding */}
        <div className="text-center md:text-left">
          <p className="text-muted-foreground/80 text-sm">
            &copy; {new Date().getFullYear()} <span className="text-foreground font-bold">DR.S</span>. All rights reserved.
          </p>
          <p className="text-muted-foreground/70 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> in Davao City
          </p>
        </div>


      </div>
    </footer>
  );
};

export default Footer;