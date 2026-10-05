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


## Locked Enemy Design — Slime Faction (not implemented yet)

Do not implement these combat behaviors until the corresponding enemy/projectile art and animation designs are finalized.

- **Blue Slime — Basic Shooter**
  - Slower standard shooter.
  - Projectile is visually stretchy/gooey in motion, but only the circular main blob has collision.
  - Projectile is blocked by bricks and splats/dissipates on contact.
  - Does **not** damage bricks.

- **Red Slime — Ricochet Shooter**
  - Faster firing rate and projectile speed than Blue.
  - Projectile may use stronger visual stretching to communicate speed.
  - Only the circular main blob has collision; tails/droplets are visual only.
  - Projectile bounces off bricks instead of damaging them.
  - Use a limited bounce/lifetime rule to prevent permanently trapped projectiles.

- **Green Slime — Builder/Repair Enemy**
  - Projectile deals **zero damage** to the player, paddle, and bricks.
  - Targets valid empty cells where bricks from the generated formation were previously destroyed.
  - On arrival: slime ball splats into the empty slot, spreads into a rectangle, then hardens into a replacement brick.
  - It should repair the procedural formation rather than freely create arbitrary new walls.

- **Future Phase Projectile Enemy**
  - Projectile begins temporarily phased and passes through bricks.
  - Phase state must be clearly telegraphed visually (translucent/flickering/afterimage).
  - After a timed phase period it becomes solid and ricochets off bricks for the remainder of its lifetime.

- **Enemy Brick Destruction Rule**
  - Normal enemy projectiles do **not** damage or destroy bricks.
  - Brick destruction by enemies is a special mechanic reserved for specific archetypes such as bombers, corrosive enemies, miners, bosses, or other explicitly designed threats.
  - This preserves the brick field as player-controlled cover while making cover-destroying enemies high-priority threats.

### Projectile collision standard
Projectile stretching, trails, droplets, and splashes are visual only. Collision uses a circular hitbox centered on the projectile's main blob at every animation frame.
