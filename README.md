# Zorro Burger 🦊

Juego de cocina en un local liminal: cocina, sirve, limpia. **Siempre es de noche.** Controles Android: joystick, arrastrar para mirar, botones ✋ interactuar, 👟 correr (interruptor), 🔦 linterna, ⏸ pausa.

Furry negro con linterna explorando lugares liminales. Estética PS1, cámara sobre el hombro, pasos y silencio.
Three.js + Vite, empaquetado a APK con Capacitor.

## Compilar el APK (sin instalar nada)
1. Sube esta carpeta a un repo de GitHub (rama `main`).
2. Ve a **Actions → Build APK → Run workflow** (también corre solo en cada push).
3. Al terminar, descarga **zorro-liminal-apk** en la sección *Artifacts*, descomprime e instala `app-debug.apk`.

## Ambiente
- **Clima** que cambia solo cada 1–2 min: despejado, niebla, lluvia, tormenta (con relámpagos y truenos) y nieve. No llueve dentro del local.
- **Parqueadero vacío**: solo líneas pintadas, postes de luz y el letrero. Algunos postes parpadean.
- **Sin enemigos.** Solo tensión: pasos de la nada (a veces en el techo), una placa del techo que cae sin aviso (deja un hueco y escombro que se barre), golpes en las paredes, crujidos, la campanita de la puerta sin que entre nadie, radio con estática, susurros lejanos, una caja de música que se corta, parpadeos de luz y silencios repentinos.
- **Incidentes** (tareas aparte, uno a la vez):
  - ⚡ *Falla el generador*: se apaga todo el local. Hay que salir al costado este y jalar la cuerda varias veces. Sin luz no funcionan las estaciones y no llegan pedidos nuevos.
  - 📞 *Suena el teléfono* de la cocina: contéstalo (a veces es un pedido).
  - 🧊 *Se abre el congelador* con una alarma: ciérralo.
  - 💧 *Gotera*: aparece un charco que hay que limpiar.

## Controles
- Android: joystick flotante (mitad izquierda), arrastrar a la derecha para mirar, botón 👟 (activa/desactiva correr; se apaga al soltar el joystick), ✋ y 🔦. El botón atrás pausa el juego.
- PC: WASD, Shift, mouse, F = linterna.

## Probar local
`npm install && npm run dev`
