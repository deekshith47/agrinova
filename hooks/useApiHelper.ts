import { useState, useEffect, useCallback } from 'react';

// FIX: Removed conflicting global type declaration for `window.aistudio` to resolve a TypeScript error.
// Cast to `any` is used to access the object's properties.

export const useApiHelper = () => {
  const [isKeySelected, setIsKeySelected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = useCallback(async () => {
    setIsChecking(true);
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    } else {
        // If the aistudio object isn't available, assume we are not in the right environment
        // and for local dev, we can assume a key is present via other means.
        // In a real production scenario outside of the intended platform, this would need error handling.
        setIsKeySelected(true); 
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const promptForKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        await aistudio.openSelectKey();
        // Assume success and update state immediately to avoid race conditions
        setIsKeySelected(true);
      } catch (e) {
        console.error("Error opening API key selection dialog:", e);
        // Handle potential errors, e.g., user closes the dialog
        // Re-check the status just in case
        checkKey();
      }
    } else {
        alert("API Key selection is not available in this environment.");
    }
  };
  
  const resetApiKey = useCallback(() => {
    setIsKeySelected(false);
  }, []);

  // While checking, we can consider the key not selected to show a loading state if needed
  return { isKeySelected: !isChecking && isKeySelected, promptForKey, resetApiKey };
};