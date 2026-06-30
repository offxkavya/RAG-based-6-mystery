import React from 'react';
import type { ReactionOutcome } from '../services/reactionEngine';

interface VesselRendererProps {
  type: 'test_tube' | 'beaker' | 'burette';
  outcome: ReactionOutcome;
  temperature: number;
  isHeating: boolean;
  isStirring: boolean;
  fillLevel: number;
  isPouring: boolean;
  pouringColor?: string;
}

export const VesselRenderer: React.FC<VesselRendererProps> = () => {
  return <div>Vessel Renderer</div>;
};
