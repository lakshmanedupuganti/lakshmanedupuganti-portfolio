"use client";

import { useCallback, useEffect } from "react";
import domUtil from "@clientlib/utility/domUtility";

const LocalInputHandler: React.FC = () => {
  // Define a callback to handle input events specifically for slider inputs
  const handleInput = useCallback((event: Event) => {
    const target = event.target as HTMLElement | null;

    if (target?.getAttribute("data-slider")) {
      domUtil.handleSliderInput(target);
    }
  }, []);

  useEffect(() => {
    // Select all input elements that have the data-slider attribute set to "true"
    const inputElements = document.querySelectorAll<HTMLInputElement>('input[data-slider="true"]');

    inputElements.forEach((inputElement) => {
      inputElement.addEventListener("input", handleInput);
    });

    // Cleanup event listeners on component unmount
    return () => {
      inputElements.forEach((inputElement) => {
        inputElement.removeEventListener("input", handleInput);
      });
    };
  }, [handleInput]);

  return null;
};

export default LocalInputHandler;
