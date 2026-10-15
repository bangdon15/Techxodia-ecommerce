import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Truck, Database } from 'lucide-react';

interface AnnouncementBarProps {
  customAnnouncement?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ customAnnouncement }) => {
  const messages = [
    ...(customAnnouncement
      ? [{ icon: Sparkles, text: customAnnouncement }]
      : [{ icon: Sparkles, text: 'TECHXODIA × SERIES 01 DROP // LIMITED RUN ARCHIVE' }]),
    {
      icon: Truck,
      text: 'COMPLIMENTARY EXPRESS GLOBAL SHIPPING OVER $75',
    },
    {
      icon: ShieldCheck,
      text: 'BUILT FOR ETERNITY // LIFETIME RECYCLED STEEL WARRANTY',
    },
    {
      icon: Database,
      text: 'LIVE SUPABASE SYNCED STOREFRONT // INSTANT PERSISTENCE',
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [messages.length]);

  const current = messages[index] || messages[0];
  const Icon = current.icon;

  return (
    <div
      style={{
        background: '#C86237',
        color: '#FFFFFF',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 60,
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
      }}
    >
      <div
        key={index}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'fadeIn 0.4s ease-out',
        }}
      >
        <Icon size={14} style={{ color: '#FFE3D1' }} />
        <span>{current.text}</span>
      </div>
    </div>
  );
};
