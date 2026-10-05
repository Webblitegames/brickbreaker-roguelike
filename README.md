# Brickbreaker Roguelike

Mobile-first brick-breaker roguelike prototype.

## Core rules
- Paddle movement is direct 1:1 touch X movement, left/right only.
- Break bricks to open paths to enemies.
- Bricks are also cover: enemy projectiles are intended to interact with the brick field as the combat system grows.
- The paddle blocks enemy attacks before they reach the hit zone.
- Levels use seeded procedural generation with pattern families rather than pure random scatter.
- The run seed is visible and can be replayed with `?seed=YOURSEED`.

## Current prototype
Includes touch/mouse paddle control, ball physics, destructible procedural brick patterns, enemies, enemy projectiles, paddle blocking, a protected hit zone, HP, level progression, and deterministic seeded layouts.

Next systems: richer procedural validation, special brick types, enemy attack archetypes, rewards/upgrades, encounters, bosses and full seed determinism for combat behavior.
