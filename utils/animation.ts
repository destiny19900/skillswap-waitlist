import { UseInViewOptions } from "framer-motion";

// Simplified animation settings for consistent cross-device behavior
export const getInViewProps = (amount = 0.1, once = true) => ({
  // How much of the element needs to be in view
  amount,
  
  // Only animate once when the element comes into view
  once,
  
  // Small delay to ensure proper loading
  rootMargin: "0px 0px -50px 0px"
}); 