
# react-js-element-picker

React TypeScript library for selecting elements on a web page.

<p align="center">
  <img src="https://i.imgur.com/mGlNnAo.gif">
</p>


## Installation

Install with `npm`:
```bash
npm install react-js-element-picker
```

Or `yarn`:
```bash
yarn add react-js-element-picker
```

## Basic JavaScript/TypeScript library

This library is based on another JavaScript/TypeScript library `js-element-picker`. If you need to use pure JS/TS or want to write a wrapper for another framework, you can get the library [here](https://www.npmjs.com/package/js-element-picker)

## ElementPickerArea

Library contain React component `ElementPickerArea`. When you create it, it allows you to pick any child of this component 

## Simple example

```javascript
import { ElementPickerArea } from 'react-js-element-picker';

const MyComponentWithPickingArea = () => {
  const [picking, setPicking] = useState<boolean>(true);
  
  <ElementPickerArea
    picking={picking}
    onClick={(target) => {
      console.log('Goal target is: ', target?.tagName);
      setPicking(false);
    }}
  >
    <div>
      <h1>First item</h1>
      <h1>Second item</h1>
    </div>
  </ElementPickerArea>;
};
```

## Props

| Name        | Type        | Default | Description
|-------------|-------------|---------|-------------|
| `picking`   | `boolean`   |         |if `true`, starts picking, if `false`, stops picking|
| `overlayDrawer`   | `Function`   | Default overlay        |[See type below](#overlaydrawer-type). If `overlayDrawer` was passed, it will be drawn instead of default overlay on the hovering element|
| `onTargetChange`   | `(target?: Element, event?: MouseEvent) => void;`   |         |callback that will fire every time when hovering target was changed|
| `onClick`   | `(target: Element, event?: MouseEvent) => void;`   |         |callback that fires when user clicks on the picked element|

### overlayDrawer type:
```javascript
overlayDrawer?: (
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    event: MouseEvent | null
  ) => JSX.Element;
```


## Examples

<details>
  <summary>Basic example</summary>

  In this example you create `ElementPickerArea` component which starts picking immediately after initialization and after click on target logs it in console and stops picking

  ```javascript
import { ElementPickerArea } from 'react-js-element-picker';

const MyComponentWithPickingArea = () => {
  const [picking, setPicking] = useState<boolean>(true);
  
  <ElementPickerArea
    picking={picking}
    onClick={(target) => {
      console.log('Goal target is: ', target?.tagName);
      setPicking(false);
    }}
  >
    <div>
      <h1>First item</h1>
      <h1>Second item</h1>
    </div>
  </ElementPickerArea>;
};
  ```
</details>

<details>
  <summary>Start picking after custom event</summary>

  If you want to start picking on any event (for example, button click), you can use `picking` prop

  ```javascript
import { ElementPickerArea } from 'react-js-element-picker';

const MyComponentWithPickingArea = () => {
  const [picking, setPicking] = useState<boolean>(true);
  
  <>
      <button onClick={() => setPicking(true)}>Start picking</button>
      <ElementPickerArea
        picking={picking}
        onClick={(target) => {
          console.log('Goal target is: ', target?.tagName);
          setPicking(false);
        }}
      >
        <div>
          <h1>First item</h1>
          <h1>Second item</h1>
        </div>
      </ElementPickerArea>
  </>
};
  ```
</details>

<details>
  <summary>Make something when target is changed</summary>

  If you want to make something while user is picking elements, you can use `onTargetChange` prop. That is function which will fire every time when target was updated

  ```javascript
import { ElementPickerArea } from 'react-js-element-picker';

const MyComponentWithPickingArea = () => {
  const [picking, setPicking] = useState<boolean>(true);
  
  <ElementPickerArea
    picking={picking}
    onClick={(target) => {
      console.log('Goal target is: ', target?.tagName);
      setPicking(false);
    }}
    onTargetChange={(target) => {
      console.log('Hovering target is: ', target?.tagName);
    }}
  >
    <div>
      <h1>First item</h1>
      <h1>Second item</h1>
    </div>
  </ElementPickerArea>;
};
  ```
</details>

<details>
  <summary>Custom overlay for hovering element</summary>

  If you want to create custom overlay for hovering element, you need to pass `overlayDrawer()` prop. It gets `position` and `event` as arguments and must return an JSX.Element. Result element will appear inside of overlay, so you don't need to think about positioning. Actually `position` is some fields from `event` just to make it easier to get.

  So first you need to create a component for overlay drawer:
  

  ```javascript
const HoveringOverlay = ({
    position,
    event,
}: {
    position: { x: number; y: number } | null;
    event: MouseEvent | null;
}) => {
    const target = event ? (event.target as Element) : null;

    return (
      <div className="hovering-overlay">
        {target ? <span>{target?.tagName}</span> : null}
        {position ? <span>{`${position.x}, ${position.y}`}</span> : null}
      </div>
    );
};
  ```

  And then you can use it:


  ```javascript
import { ElementPickerArea } from 'react-js-element-picker';

const MyComponentWithPickingArea = () => {
  const [picking, setPicking] = useState<boolean>(true);
  
  <ElementPickerArea
    picking={picking}
    onClick={(target) => {
      console.log('Goal target is: ', target?.tagName);
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
  </ElementPickerArea>;
};
  ```

  As a result you'll see something like this:
  <p align="center">
  <img src="https://i.imgur.com/Q8bwEU7.gif">
  </p>
</details>
