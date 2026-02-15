// KNOUX OS Guardian - Animation Helpers
// Utility functions for animations and visual effects

class AnimationHelpers {
  // Shake element animation
  shakeElement(element: HTMLElement | null) {
    if (!element) return;
    
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }

  // Fade in element
  fadeIn(element: HTMLElement | null, duration = 300) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity.toString();
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Create singleton instance
const animationHelpers = new AnimationHelpers();

export default animationHelpers;