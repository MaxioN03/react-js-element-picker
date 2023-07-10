import React, { PropsWithChildren, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ElementPicker } from 'js-element-picker';

interface ElementPickerProps extends PropsWithChildren<unknown> {
  picking?: boolean;
  overlayDrawer?: (
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    event: MouseEvent | null
  ) => JSX.Element;
  onTargetChange?: (target?: Element, event?: MouseEvent) => void;
  onClick?: (target?: Element, event?: MouseEvent) => void;
}

export const ElementPickerArea = ({
  children,
  picking,
  overlayDrawer,
  onTargetChange,
  onClick,
}: ElementPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const picker = useRef<ElementPicker | null>(null);

  useEffect(() => {
    if (!picker.current) {
      picker.current = new ElementPicker({
        container: containerRef.current as Element,
        overlayDrawer: overlayDrawer
          ? overlayDrawerConverter(overlayDrawer)
          : undefined,
        onTargetChange,
        onClick,
      });
    }

    return () => {
      if (picker.current) {
        picker.current.stopPicking();
        picker.current = null;
      }
    };
  }, []);

  const overlayDrawerConverter = (
    overlayDrawer: (
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      } | null,
      event: MouseEvent | null
    ) => JSX.Element
  ): ((
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    event: MouseEvent | null
  ) => Element) => {
    return (
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      } | null,
      event: MouseEvent | null
    ) => {
      const overlayDrawerElement = overlayDrawer(position, event);

      const elementString = ReactDOMServer.renderToString(overlayDrawerElement);
      const parser = new DOMParser();
      const doc = parser.parseFromString(elementString, 'text/html');

      return doc.body.firstChild as Element;
    };
  };

  useEffect(() => {
    if (picking) {
      picker.current?.startPicking();
    } else {
      picker.current?.stopPicking();
    }
  }, [picking]);

  return <div ref={containerRef}>{children}</div>;
};
