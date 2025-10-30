import { GameObject, GameObjectType, Vector2D } from '../types/game';

// Generate a static starfield for the background
const STAR_COUNT = 120;
const stars: { x: number; y: number; r: number; a: number }[] = [];
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.3,
    a: Math.random() * 0.5 + 0.5,
  });
}

export function renderGameObjects(
  ctx: CanvasRenderingContext2D,
  gameObjects: GameObject[],
  predictedPath: Vector2D[],
  isDragging: boolean = false
) {
  // Space background gradient
  const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
  grad.addColorStop(0, '#0a0a1a');
  grad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Starfield
  for (const star of stars) {
    ctx.save();
    ctx.globalAlpha = star.a;
    ctx.beginPath();
    ctx.arc(star.x * ctx.canvas.width, star.y * ctx.canvas.height, star.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();
  }

  // Draw predicted path
  if (predictedPath.length > 1) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(predictedPath[0].x, predictedPath[0].y);
    for (let i = 1; i < predictedPath.length; i++) {
      ctx.lineTo(predictedPath[i].x, predictedPath[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw game objects
  gameObjects.forEach(obj => {
    switch (obj.type) {
      case GameObjectType.SEEKER:
        renderSeeker(ctx, obj as any, isDragging);
        break;
      case GameObjectType.CHALICE:
        renderChalice(ctx, obj as any);
        break;
      case GameObjectType.PLANET:
        renderPlanet(ctx, obj as any);
        break;
      case GameObjectType.WORMHOLE:
        renderWormhole(ctx, obj as any);
        break;
      case GameObjectType.CURRENT:
        renderCurrent(ctx, obj as any);
        break;
      case GameObjectType.PHASE_GATE:
        renderPhaseGate(ctx, obj as any);
        break;
      case GameObjectType.DEBRIS_CLOUD:
        renderDebrisCloud(ctx, obj as any);
        break;
    }
  });
}

function renderSeeker(ctx: CanvasRenderingContext2D, seeker: any, isDragging: boolean) {
  // Don't render seeker if it's in the chalice
  if (seeker.isInChalice) {
    return;
  }

  // Seeker trail (faint, trailing behind the seeker)
  if (seeker.isLaunched) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(seeker.position.x, seeker.position.y, seeker.radius * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Seeker glow
  const gradient = ctx.createRadialGradient(
    seeker.position.x, seeker.position.y, 0,
    seeker.position.x, seeker.position.y, seeker.radius * 2.5
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(seeker.position.x, seeker.position.y, seeker.radius * 2.5, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();

  // Seeker core (with a subtle starburst)
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(seeker.position.x, seeker.position.y, seeker.radius, 0, Math.PI * 2);
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Starburst effect
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      seeker.position.x + Math.cos(angle) * (seeker.radius + 2),
      seeker.position.y + Math.sin(angle) * (seeker.radius + 2)
    );
    ctx.lineTo(
      seeker.position.x + Math.cos(angle) * (seeker.radius + 8),
      seeker.position.y + Math.sin(angle) * (seeker.radius + 8)
    );
    ctx.stroke();
  }
  ctx.restore();

  // Draw velocity vector only if dragging
  if (isDragging) {
    const speed = Math.sqrt(seeker.velocity.x ** 2 + seeker.velocity.y ** 2);
    if (speed > 0.1) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(seeker.position.x, seeker.position.y);
      ctx.lineTo(
        seeker.position.x + seeker.velocity.x * 10,
        seeker.position.y + seeker.velocity.y * 10
      );
      ctx.stroke();
    }
  }
}

function renderChalice(ctx: CanvasRenderingContext2D, chalice: any) {
  // Chalice glow
  const gradient = ctx.createRadialGradient(
    chalice.position.x, chalice.position.y, 0,
    chalice.position.x, chalice.position.y, chalice.radius * 2.2
  );
  gradient.addColorStop(0, 'rgba(0, 255, 255, 0.7)');
  gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
  ctx.save();
  ctx.beginPath();
  ctx.arc(chalice.position.x, chalice.position.y, chalice.radius * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.restore();

  // Chalice cup (stylized)
  ctx.save();
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(0,255,255,0.15)';
  ctx.beginPath();
  ctx.ellipse(chalice.position.x, chalice.position.y, chalice.radius, chalice.radius * 0.7, 0, Math.PI, 0, true);
  ctx.lineTo(chalice.position.x + chalice.radius, chalice.position.y + chalice.radius * 1.2);
  ctx.arcTo(
    chalice.position.x,
    chalice.position.y + chalice.radius * 2.2,
    chalice.position.x - chalice.radius,
    chalice.position.y + chalice.radius * 1.2,
    chalice.radius * 0.7
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Chalice base
  ctx.beginPath();
  ctx.ellipse(
    chalice.position.x,
    chalice.position.y + chalice.radius * 2.1,
    chalice.radius * 0.5,
    chalice.radius * 0.18,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = 'rgba(0,255,255,0.3)';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Chalice rim (highlight)
  ctx.save();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(chalice.position.x, chalice.position.y, chalice.radius * 0.95, chalice.radius * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function renderPlanet(ctx: CanvasRenderingContext2D, planet: any) {
  const time = Date.now() * 0.003; // Animation time for pulsing effects
  
  // Generate consistent sunspot positions based on planet ID
  const sunspots = [];
  if (!planet._sunspotsGenerated) {
    // Generate sunspots once per planet
    for (let i = 0; i < 5; i++) {
      // Use planet ID as seed for consistent randomization
      const seed = planet.id.charCodeAt(0) + i * 7;
      const angle = (seed * 137.5) % (Math.PI * 2);
      const r = planet.radius * (0.3 + (seed % 50) / 100);
      const size = (seed % 40) / 10 + 3;
      sunspots.push({ angle, r, size });
    }
    planet._sunspotsGenerated = true;
    planet._sunspots = sunspots;
  } else {
    sunspots.push(...planet._sunspots);
  }
  
  // Pulsating ring effect based on gravity type
  if (planet.isNegativeGravity) {
    // Push planet (negative gravity) - pulsing red/orange ring
    const pulse = Math.sin(time * 2) * 0.3 + 0.7;
    const ringRadius = planet.radius * (1.8 + pulse * 0.4);
    
    // Outer pulsing ring
    ctx.save();
    ctx.strokeStyle = `rgba(255, 100, 100, ${pulse * 0.6})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(planet.position.x, planet.position.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner pulsing ring
    ctx.strokeStyle = `rgba(255, 150, 150, ${pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(planet.position.x, planet.position.y, ringRadius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    // Pull planet (positive gravity) - subtle blue pulsing effect
    const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;
    const ringRadius = planet.radius * (1.6 + pulse * 0.2);
    
    // Subtle blue pulsing ring
    ctx.save();
    ctx.strokeStyle = `rgba(100, 150, 255, ${pulse * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(planet.position.x, planet.position.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Sun texture: radial gradient, glow, and subtle sunspots
  const grad = ctx.createRadialGradient(
    planet.position.x, planet.position.y, planet.radius * 0.2,
    planet.position.x, planet.position.y, planet.radius * 1.1
  );
  
  // Different colors based on gravity type
  if (planet.isNegativeGravity) {
    // Push planet - red/orange colors
    grad.addColorStop(0, '#fff0f0');
    grad.addColorStop(0.2, '#ffcccc');
    grad.addColorStop(0.5, '#ff6666');
    grad.addColorStop(1, 'rgba(255, 50, 50, 0.7)');
  } else {
    // Pull planet - yellow/orange colors (original)
    grad.addColorStop(0, '#fffbe0');
    grad.addColorStop(0.2, '#ffe066');
    grad.addColorStop(0.5, '#ffb300');
    grad.addColorStop(1, 'rgba(255, 140, 0, 0.7)');
  }
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(planet.position.x, planet.position.y, planet.radius * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.shadowColor = planet.isNegativeGravity ? '#ff6666' : '#ffb300';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();

  // Sun flares - different colors and intensity based on gravity type
  ctx.save();
  if (planet.isNegativeGravity) {
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.4)';
  } else {
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.25)';
  }
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      planet.position.x + Math.cos(angle) * planet.radius * 1.1,
      planet.position.y + Math.sin(angle) * planet.radius * 1.1
    );
    ctx.lineTo(
      planet.position.x + Math.cos(angle) * planet.radius * 1.5,
      planet.position.y + Math.sin(angle) * planet.radius * 1.5
    );
    ctx.stroke();
  }
  ctx.restore();

  // Sunspots - using pre-generated positions
  ctx.save();
  ctx.globalAlpha = 0.18;
  for (const sunspot of sunspots) {
    const x = planet.position.x + Math.cos(sunspot.angle) * sunspot.r;
    const y = planet.position.y + Math.sin(sunspot.angle) * sunspot.r;
    ctx.beginPath();
    ctx.arc(x, y, sunspot.size, 0, Math.PI * 2);
    ctx.fillStyle = planet.isNegativeGravity ? '#cc3333' : '#b97a00';
    ctx.fill();
  }
  ctx.restore();
}

function renderWormhole(ctx: CanvasRenderingContext2D, wormhole: any) {
  // Draw wormhole portal effect
  const time = Date.now() * 0.001;
  const pulse = Math.sin(time * 3) * 0.2 + 0.8;
  
  const gradient = ctx.createRadialGradient(
    wormhole.position.x, wormhole.position.y, 0,
    wormhole.position.x, wormhole.position.y, wormhole.radius
  );
  gradient.addColorStop(0, `rgba(0, 0, 0, ${pulse})`);
  gradient.addColorStop(0.5, 'rgba(128, 0, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(128, 0, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(wormhole.position.x, wormhole.position.y, wormhole.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw wormhole border
  ctx.strokeStyle = '#8000ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(wormhole.position.x, wormhole.position.y, wormhole.radius, 0, Math.PI * 2);
  ctx.stroke();
}

function renderCurrent(ctx: CanvasRenderingContext2D, current: any) {
  // Draw current flow
  ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
  ctx.fillRect(
    current.position.x - current.width / 2,
    current.position.y - current.height / 2,
    current.width,
    current.height
  );

  // Draw flow arrows
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  
  const arrowCount = Math.floor(current.width / 20);
  for (let i = 0; i < arrowCount; i++) {
    const x = current.position.x - current.width / 2 + (i + 0.5) * (current.width / arrowCount);
    const y = current.position.y;
    
    const arrowLength = 15;
    const arrowAngle = Math.atan2(current.direction.y, current.direction.x);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + Math.cos(arrowAngle) * arrowLength,
      y + Math.sin(arrowAngle) * arrowLength
    );
    ctx.stroke();
    
    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(arrowAngle) * arrowLength,
      y + Math.sin(arrowAngle) * arrowLength
    );
    ctx.lineTo(
      x + Math.cos(arrowAngle - 0.5) * 8,
      y + Math.sin(arrowAngle - 0.5) * 8
    );
    ctx.moveTo(
      x + Math.cos(arrowAngle) * arrowLength,
      y + Math.sin(arrowAngle) * arrowLength
    );
    ctx.lineTo(
      x + Math.cos(arrowAngle + 0.5) * 8,
      y + Math.sin(arrowAngle + 0.5) * 8
    );
    ctx.stroke();
  }
}

function renderPhaseGate(ctx: CanvasRenderingContext2D, gate: any) {
  if (!gate.isActive) return;

  // Draw gate background
  ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
  ctx.fillRect(
    gate.position.x - gate.width / 2,
    gate.position.y - gate.height / 2,
    gate.width,
    gate.height
  );

  // Draw gate border
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    gate.position.x - gate.width / 2,
    gate.position.y - gate.height / 2,
    gate.width,
    gate.height
  );

  // Draw velocity indicator
  ctx.fillStyle = '#ffff00';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(
    `${gate.minVelocity.toFixed(1)}-${gate.maxVelocity.toFixed(1)}`,
    gate.position.x,
    gate.position.y + gate.height / 2 + 15
  );
}

function renderDebrisCloud(ctx: CanvasRenderingContext2D, debris: any) {
  // Draw debris cloud
  const gradient = ctx.createRadialGradient(
    debris.position.x, debris.position.y, 0,
    debris.position.x, debris.position.y, debris.radius
  );
  gradient.addColorStop(0, 'rgba(128, 128, 128, 0.3)');
  gradient.addColorStop(0.7, 'rgba(128, 128, 128, 0.1)');
  gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(debris.position.x, debris.position.y, debris.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw debris particles
  ctx.fillStyle = 'rgba(128, 128, 128, 0.6)';
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const distance = Math.random() * debris.radius;
    const x = debris.position.x + Math.cos(angle) * distance;
    const y = debris.position.y + Math.sin(angle) * distance;
    
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
} 