import {
  type PropsWithChildren,
  type ReactElement,
  useEffect,
  useRef,
} from 'react';
import ReactDOMServer from 'react-dom/server';
import { ElementPicker } from 'js-element-picker';

export type ElementPickerOverlayPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

export interface ElementPickerAreaProps extends PropsWithChildren<unknown> {
  picking?: boolean;
  overlayDrawer?: (
    position: ElementPickerOverlayPosition,
    event: MouseEvent | null
  ) => ReactElement;
  onTargetChange?: (target?: Element, event?: MouseEvent) => void;
  onClick?: (target?: Element, event?: MouseEvent) => void;
}

function overlayDrawerConverter(
  overlayDrawer: (
    position: ElementPickerOverlayPosition,
    event: MouseEvent | null
  ) => ReactElement
): ((
  position: ElementPickerOverlayPosition,
  event: MouseEvent | null
) => Element) {
  return (position, event) => {
    const overlayDrawerElement = overlayDrawer(position, event);
    const elementString = ReactDOMServer.renderToString(overlayDrawerElement);
    const parser = new DOMParser();
    const doc = parser.parseFromString(elementString, 'text/html');

    return doc.body.firstChild as Element;
  };
}

export const ElementPickerArea = ({
  children,
  picking,
  overlayDrawer,
  onTargetChange,
  onClick,
}: ElementPickerAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const picker = useRef<ElementPicker | null>(null);

  const overlayDrawerRef = useRef(overlayDrawer);
  const onTargetChangeRef = useRef(onTargetChange);
  const onClickRef = useRef(onClick);

  overlayDrawerRef.current = overlayDrawer;
  onTargetChangeRef.current = onTargetChange;
  onClickRef.current = onClick;

  useEffect(() => {
    if (!picker.current) {
      picker.current = new ElementPicker({
        container: containerRef.current as Element,
        overlayDrawer: overlayDrawerRef.current
          ? overlayDrawerConverter((position, event) => {
              const draw = overlayDrawerRef.current;
              return draw ? draw(position, event) : <span />;
            })
          : undefined,
        onTargetChange: (target, event) =>
          onTargetChangeRef.current?.(target, event),
        onClick: (target, event) => onClickRef.current?.(target, event),
      });
    }

    return () => {
      if (picker.current) {
        picker.current.stopPicking();
        picker.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (picking) {
      picker.current?.startPicking();
    } else {
      picker.current?.stopPicking();
    }
  }, [picking]);

  return <div ref={containerRef}>{children}</div>;
};
