import React from 'react';
import { MessageCircle, Stethoscope } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const WhatsAppFloat = () => {
  const { addToast } = useToast();

  const handleOpenConsult = () => {
    addToast('Opening 100% confidential WhatsApp consultation with senior medical advisor...', 'info');
    setTimeout(() => {
      window.open('https://wa.me/919876543210?text=Hi%20BoldCare%20Medical%20Team,%20I%20want%20a%20private%20doctor%20consultation.', '_blank');
    }, 800);
  };

  return (
    <button
      onClick={handleOpenConsult}
      aria-label="Talk to a wellness advisor privately"
      className="fixed bottom-6 right-6 z-40 bg-[#0F3D2B] hover:bg-[#155E3E] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-glow-forest border border-[#0F3D2B]/20 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-emerald-400 text-[#0F3D2B]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      </div>
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-xs font-bold text-white leading-tight">Talk to Wellness Advisor</span>
        <span className="text-[10px] text-emerald-200 font-medium">100% Private & Free Consultation</span>
      </div>
    </button>
  );
};
