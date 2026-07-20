import { Sparkles } from "lucide-react";

export function AnimatedFlipCard() {
  return (
    <div className="flip-card" tabIndex={0} aria-label="Animated card. Hover or focus to flip.">
      <div className="flip-card__content">
        <div className="flip-card__back">
          <div className="flip-card__beam" />
          <div className="flip-card__back-content"><Sparkles size={36} /><strong>Studio UI</strong></div>
        </div>
        <div className="flip-card__front">
          <div className="orb orb--one" /><div className="orb orb--two" /><div className="orb orb--three" />
          <div className="flip-card__front-content">
            <span className="flip-card__badge">Interactive</span>
            <div className="flip-card__description"><strong>Moving light card</strong><span>Reusable, responsive and keyboard friendly.</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
