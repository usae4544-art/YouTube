import React, { useEffect, useState, useRef } from "react";
import VirtualKeyboard from "./VirtualKeyboard";

/**
 * Optional floating keyboard controller. Native mobile/Android keyboards remain active
 * unless the user explicitly opens the custom keyboard drawer.
 */
export default function GlobalKeyboardManager({ kidsMode }: { kidsMode: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" &&
          ![
            "checkbox",
            "radio",
            "range",
            "file",
            "submit",
            "button",
            "color",
            "date",
            "datetime-local",
            "month",
            "time",
            "week",
            "hidden",
          ].includes((target as HTMLInputElement).type)) ||
        target.tagName === "TEXTAREA"
      ) {
        const inputTarget = target as HTMLInputElement | HTMLTextAreaElement;
        activeInputRef.current = inputTarget;
        setInputValue(inputTarget.value);
      }
    };

    const handleInput = (e: Event) => {
      if (e.target === activeInputRef.current) {
        setInputValue((e.target as HTMLInputElement).value);
      }
    };

    const handleOpenToggle = () => setIsOpen((prev) => !prev);

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("input", handleInput);
    window.addEventListener("nexus-toggle-keyboard", handleOpenToggle);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("input", handleInput);
      window.removeEventListener("nexus-toggle-keyboard", handleOpenToggle);
    };
  }, []);

  const handleKeyPress = (key: string) => {
    const activeInput = activeInputRef.current;
    if (!activeInput) return;

    const start = activeInput.selectionStart ?? activeInput.value.length;
    const end = activeInput.selectionEnd ?? activeInput.value.length;
    const currentVal = activeInput.value;

    let newVal = currentVal;
    let newPos = start;

    if (key === "{backspace}") {
      if (start !== end) {
        newVal = currentVal.substring(0, start) + currentVal.substring(end);
        newPos = start;
      } else if (start > 0) {
        newVal = currentVal.substring(0, start - 1) + currentVal.substring(end);
        newPos = start - 1;
      }
    } else if (key === "{space}") {
      newVal = currentVal.substring(0, start) + " " + currentVal.substring(end);
      newPos = start + 1;
    } else {
      newVal = currentVal.substring(0, start) + key + currentVal.substring(end);
      newPos = start + key.length;
    }

    setInputValue(newVal);

    const setter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(activeInput),
      "value",
    )?.set;
    if (setter) {
      setter.call(activeInput, newVal);
      activeInput.dispatchEvent(new Event("input", { bubbles: true }));
      requestAnimationFrame(() => {
        try {
          activeInput.setSelectionRange(newPos, newPos);
        } catch {}
      });
    }
  };

  const handleSubmit = () => {
    const activeInput = activeInputRef.current;
    if (activeInput) {
      if (activeInput.form) {
        activeInput.form.requestSubmit();
      } else {
        activeInput.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }),
        );
      }
      activeInput.blur();
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="vk-wrapper" style={{ position: "relative", zIndex: 999999 }}>
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
