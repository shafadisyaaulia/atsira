"use client";

import { X, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface CartNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function CartNotificationModal({ isOpen, onClose, productName }: CartNotificationModalProps) {
  // Otomatis menutup modal setelah 3 detik jika tidak ditutup manual
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-surface border border-surface-container-high rounded-2xl p-6 max-w-md w-full shadow-elevation-3 relative animate-scale-up notranslate"
        translate="no"
      >
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Konten Utama */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          
          <h3 className="text-lg font-bold text-on-surface mt-1">Berhasil Ditambahkan!</h3>
          
          <p className="text-sm text-on-surface-variant">
            <span className="font-semibold text-primary">[{productName}]</span> berhasil dimasukkan ke dalam keranjang belanja Anda.
          </p>
        </div>
      </div>
    </div>
  );
}