import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, X } from 'lucide-react';

interface KidsPinPadProps {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  onChange: (val: string) => void;
}

const keyLayout = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['{close}', '0', '{backspace}']
];

export default function KidsPinPad({
  isOpen,
  onClose,
  inputValue,
  onChange,
}: KidsPinPadProps) {
  if (!isOpen) return null;

  const lastKeyTimeRef = React.useRef(0);
  const handleKeyClick = (key: string, e: React.MouseEvent | React.TouchEvent) => {
    if ("preventDefault" in e) e.preventDefault();
    const now = Date.now();
    if (now - lastKeyTimeRef.current < 150) return;
    lastKeyTimeRef.current = now;
    e.preventDefault();
    e.stopPropagation();
    
    if (key === '{backspace}') {
      onChange(inputValue.slice(0, -1));
    } else if (key === '{close}') {
      onClose();
    } else {
      if (inputValue.length < 4) {
        onChange(inputValue + key);
      }
    }
  };

  const renderKey = (key: string) => {
    let content: React.ReactNode = key;
    let className = "flex items-center justify-center rounded-2xl font-bold text-2xl transition-colors select-none active:scale-95 bg-rose-100 text-rose-900 border border-rose-200 active:bg-rose-300 h-16 w-16";
    
    if (key === '{backspace}') {
      content = <Delete className="w-8 h-8" />;
      className = "flex items-center justify-center rounded-2xl font-bold text-2xl transition-colors select-none active:scale-95 bg-rose-200 text-rose-900 border border-rose-300 active:bg-rose-400 h-16 w-16";
    } else if (key === '{close}') {
      content = <X className="w-8 h-8" />;
      className = "flex items-center justify-center rounded-2xl font-bold text-2xl transition-colors select-none active:scale-95 bg-red-200 text-red-900 border border-red-300 active:bg-red-400 h-16 w-16";
    }

    return (
      <button
        key={key}
        type="button"
        onMouseDown={(e) => handleKeyClick(key, e)}
        onTouchStart={(e) => handleKeyClick(key, e as any)}
        className={className}
      >
        {content}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[99999] p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t bg-white/95 backdrop-blur-xl border-rose-200 flex justify-center"
          style={{ touchAction: 'none' }}
        >
          <div className="flex flex-col gap-3">
            {keyLayout.map((row, i) => (
              <div key={i} className="flex gap-3 justify-center w-full">
                {row.map(renderKey)}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
