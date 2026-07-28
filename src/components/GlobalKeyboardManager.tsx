import React, { useEffect, useState } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

export default function GlobalKeyboardManager({ kidsMode }: { kidsMode: boolean }) {
  const [activeInput, setActiveInput] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const setInputMode = () => {
      document.querySelectorAll('input, textarea').forEach(el => {
        const inputType = (el as HTMLInputElement).type;
        if (!['checkbox', 'radio', 'range', 'file', 'submit', 'button', 'color', 'date', 'datetime-local', 'month', 'time', 'week', 'hidden'].includes(inputType)) {
          el.setAttribute('inputmode', 'none');
        }
      });
    };
    setInputMode();
    const observer = new MutationObserver(setInputMode);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'file', 'submit', 'button', 'color', 'date', 'datetime-local', 'month', 'time', 'week', 'hidden'].includes((target as HTMLInputElement).type)) ||
        target.tagName === 'TEXTAREA'
      ) {
        const inputTarget = target as HTMLInputElement | HTMLTextAreaElement;
        setActiveInput(inputTarget);
        setInputValue(inputTarget.value);
        setIsOpen(true);
        setTimeout(() => inputTarget.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    };

    const handleInput = (e: Event) => {
      if (e.target === activeInput) {
        setInputValue((e.target as HTMLInputElement).value);
      }
    };
    
    // We want to handle document clicks to close the keyboard if the click is outside the keyboard AND outside any input
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.vk-wrapper') && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        setIsOpen(false);
      }
    }

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('input', handleInput);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('input', handleInput);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [activeInput, isOpen]);

  const handleKeyPress = (key: string) => {
    if (!activeInput) return;
    
    // Focus the input safely without triggering native keyboard if possible
    // (inputMode='none' already handles this)
    if (document.activeElement !== activeInput) {
        activeInput.focus();
    }

    const start = activeInput.selectionStart ?? activeInput.value.length;
    const end = activeInput.selectionEnd ?? activeInput.value.length;
    const currentVal = activeInput.value;
    
    let newVal = currentVal;
    let newPos = start;

    if (key === '{backspace}') {
      if (start !== end) {
         newVal = currentVal.substring(0, start) + currentVal.substring(end);
         newPos = start;
      } else if (start > 0) {
         newVal = currentVal.substring(0, start - 1) + currentVal.substring(end);
         newPos = start - 1;
      }
    } else if (key === '{space}') {
      newVal = currentVal.substring(0, start) + ' ' + currentVal.substring(end);
      newPos = start + 1;
    } else {
      // It's a character or pasted string
      newVal = currentVal.substring(0, start) + key + currentVal.substring(end);
      newPos = start + key.length;
    }
    
    setInputValue(newVal);
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(activeInput), 'value')?.set;
    if (setter) {
      setter.call(activeInput, newVal);
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      // Restore caret selection immediately after the React state updates
      requestAnimationFrame(() => {
         try {
             activeInput.setSelectionRange(newPos, newPos);
         } catch (e) {}
      });
    }
  };

  const handleSubmit = () => {
    if (activeInput) {
      if (activeInput.form) {
        activeInput.form.requestSubmit();
      } else {
         activeInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      }
      activeInput.blur();
    }
    setIsOpen(false);
  };

  return (
    <div className="vk-wrapper" style={{ position: 'relative', zIndex: 999999 }}>
      <VirtualKeyboard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        inputValue={inputValue}
        onKeyPress={handleKeyPress}
        onSubmit={handleSubmit}
        kidsMode={kidsMode}
      />
    </div>
  );
}
