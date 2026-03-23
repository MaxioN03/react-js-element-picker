
# react-js-element-picker

React TypeScript library for selecting elements on a web page.

<p align="center">
  <img src="https://i.imgur.com/mGlNnAo.gif" alt="Demo">
</p>

## Installation

```bash
npm install react-js-element-picker
```

```bash
yarn add react-js-element-picker
```

Peer dependencies: `react` and `react-dom` (18+).

## Under the hood

This package wraps [`js-element-picker`](https://www.npmjs.com/package/js-element-picker). Use that if you need vanilla JS/TS or a non-React integration.

## Usage

```tsx
import { useState } from 'react';
import {
  ElementPickerArea,
  type ElementPickerAreaProps,
} from 'react-js-element-picker';

function InspectorPanel() {
  const [picking, setPicking] = useState(true);

  return (
    <ElementPickerArea
      picking={picking}
      onClick={(target) => {
        console.log('Picked:', target?.tagName);
        setPicking(false);
      }}
    >
      <div>
        <h1>First item</h1>
        <h1>Second item</h1>
      </div>
    </ElementPickerArea>
  );
}
```

### TypeScript types

```ts
import type {
  ElementPickerAreaProps,
  ElementPickerOverlayPosition,
} from 'react-js-element-picker';

const props: ElementPickerAreaProps = {
  picking: true,
  children: null,
};
```

`ElementPickerOverlayPosition` is `{ x, y, width, height } | null` — the `position` argument passed to `overlayDrawer`.

## `ElementPickerArea`

Renders a container; while `picking` is true, the user can hover and click to select a **child element** inside this area.

## Props

| Name | Type | Description |
|------|------|-------------|
| `picking` | `boolean` | If `true`, picking is active; if `false`, it stops. |
| `overlayDrawer` | See below | Custom hover overlay; omit for the default overlay. |
| `onTargetChange` | `(target?: Element, event?: MouseEvent) => void` | Fires when the hovered target changes while picking. |
| `onClick` | `(target?: Element, event?: MouseEvent) => void` | Fires when the user clicks a target while picking. |

### `overlayDrawer`

```ts
import type { ReactElement } from 'react';

overlayDrawer?: (
  position: ElementPickerOverlayPosition,
  event: MouseEvent | null
) => ReactElement;
```

`position` mirrors geometry from the hover event for convenience. The returned JSX is rendered to static markup for the overlay (no React hooks inside this subtree).

---

## Examples

### Basic: pick once, then stop

```tsx
import { useState } from 'react';
import { ElementPickerArea } from 'react-js-element-picker';

export function BasicExample() {
  const [picking, setPicking] = useState(true);

  return (
    <ElementPickerArea
      picking={picking}
      onClick={(target) => {
        console.log('Goal target:', target?.tagName);
        setPicking(false);
      }}
    >
      <div>
        <h1>First item</h1>
        <h1>Second item</h1>
      </div>
    </ElementPickerArea>
  );
}
```

### Start picking after a button click

```tsx
import { useState } from 'react';
import { ElementPickerArea } from 'react-js-element-picker';

export function StartOnButtonExample() {
  const [picking, setPicking] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setPicking(true)}>
        Start picking
      </button>
      <ElementPickerArea
        picking={picking}
        onClick={(target) => {
          console.log('Goal target:', target?.tagName);
          setPicking(false);
        }}
      >
        <div>
          <h1>First item</h1>
          <h1>Second item</h1>
        </div>
      </ElementPickerArea>
    </>
  );
}
```

### `onTargetChange` while hovering

```tsx
import { useState } from 'react';
import { ElementPickerArea } from 'react-js-element-picker';

export function HoverPreviewExample() {
  const [picking, setPicking] = useState(true);

  return (
    <ElementPickerArea
      picking={picking}
      onClick={(target) => {
        console.log('Clicked:', target?.tagName);
        setPicking(false);
      }}
      onTargetChange={(target) => {
        console.log('Hovering:', target?.tagName);
      }}
    >
      <div>
        <h1>First item</h1>
        <h1>Second item</h1>
      </div>
    </ElementPickerArea>
  );
}
```

### Custom overlay (`overlayDrawer`)

`overlayDrawer` must return JSX. The library renders it via `react-dom/server` for the native picker overlay, so treat it as static markup (avoid relying on hooks inside this inner component).

```tsx
import { useState } from 'react';
import {
  ElementPickerArea,
  type ElementPickerOverlayPosition,
} from 'react-js-element-picker';

function HoveringOverlay({
  position,
  event,
}: {
  position: ElementPickerOverlayPosition;
  event: MouseEvent | null;
}) {
  const target = event ? (event.target as Element) : null;

  return (
    <div className="hovering-overlay">
      {target ? <span>{target.tagName}</span> : null}
      {position ? (
        <span>
          {position.x}, {position.y}
        </span>
      ) : null}
    </div>
  );
}

export function CustomOverlayExample() {
  const [picking, setPicking] = useState(true);

  return (
    <ElementPickerArea
      picking={picking}
      onClick={(target) => {
        console.log('Goal target:', target?.tagName);
        setPicking(false);
      }}
      overlayDrawer={(position, event) => (
        <HoveringOverlay position={position} event={event} />
      )}
    >
      <div>
        <h1>First item</h1>
        <h1>Second item</h1>
      </div>
    </ElementPickerArea>
  );
}
```

```css
.hovering-overlay {
  height: 100%;
  width: 100%;
  background-color: rgba(255, 0, 166, 0.504);
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: monospace;
}
```

<p align="center">
  <img src="https://i.imgur.com/Q8bwEU7.gif" alt="Custom overlay demo">
</p>
