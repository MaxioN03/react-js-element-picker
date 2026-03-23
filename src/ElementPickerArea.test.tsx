import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { ElementPickerArea } from './ElementPickerArea';

const startPicking = vi.fn();
const stopPicking = vi.fn();

vi.mock('js-element-picker', () => ({
  ElementPicker: vi.fn(),
}));

import { ElementPicker } from 'js-element-picker';

const MockedElementPicker = vi.mocked(ElementPicker);

describe('ElementPickerArea', () => {
  beforeEach(() => {
    startPicking.mockClear();
    stopPicking.mockClear();
    MockedElementPicker.mockClear();
    MockedElementPicker.mockImplementation(() => ({
      startPicking,
      stopPicking,
    }));
  });

  it('constructs ElementPicker with the container element', async () => {
    render(
      <ElementPickerArea>
        <span data-testid="child">x</span>
      </ElementPickerArea>,
    );

    await waitFor(() => expect(MockedElementPicker).toHaveBeenCalledTimes(1));
    const options = MockedElementPicker.mock.calls[0][0];
    const container = options.container as HTMLElement;
    expect(container.tagName).toBe('DIV');
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('calls startPicking when picking is true', async () => {
    render(
      <ElementPickerArea picking>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(startPicking).toHaveBeenCalled());
  });

  it('calls stopPicking when picking is false', async () => {
    render(
      <ElementPickerArea picking={false}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(stopPicking).toHaveBeenCalled());
  });

  it('toggles startPicking and stopPicking when picking changes', async () => {
    const { rerender } = render(
      <ElementPickerArea picking={false}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(stopPicking).toHaveBeenCalled());
    startPicking.mockClear();
    stopPicking.mockClear();

    rerender(
      <ElementPickerArea picking>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(startPicking).toHaveBeenCalled());
    startPicking.mockClear();
    stopPicking.mockClear();

    rerender(
      <ElementPickerArea picking={false}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(stopPicking).toHaveBeenCalled());
  });

  it('calls stopPicking on unmount', async () => {
    const { unmount } = render(
      <ElementPickerArea picking>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(MockedElementPicker).toHaveBeenCalled());
    stopPicking.mockClear();
    unmount();

    expect(stopPicking).toHaveBeenCalled();
  });

  it('invokes the latest onClick when the prop changes', async () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = render(
      <ElementPickerArea picking onClick={first}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(MockedElementPicker).toHaveBeenCalled());
    const options = MockedElementPicker.mock.calls[0][0];
    const el = document.createElement('div');
    options.onClick?.(el);

    expect(first).toHaveBeenCalledWith(el, undefined);
    expect(second).not.toHaveBeenCalled();

    rerender(
      <ElementPickerArea picking onClick={second}>
        <div />
      </ElementPickerArea>,
    );

    options.onClick?.(el);

    expect(second).toHaveBeenCalledWith(el, undefined);
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('invokes the latest onTargetChange when the prop changes', async () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = render(
      <ElementPickerArea picking onTargetChange={first}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(MockedElementPicker).toHaveBeenCalled());
    const options = MockedElementPicker.mock.calls[0][0];
    const el = document.createElement('div');
    options.onTargetChange?.(el);

    expect(first).toHaveBeenCalledWith(el, undefined);
    expect(second).not.toHaveBeenCalled();

    rerender(
      <ElementPickerArea picking onTargetChange={second}>
        <div />
      </ElementPickerArea>,
    );

    options.onTargetChange?.(el);

    expect(second).toHaveBeenCalledWith(el, undefined);
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('uses the latest overlayDrawer when the prop changes', async () => {
    const first = vi.fn(() => <div data-testid="overlay-a" />);
    const second = vi.fn(() => <div data-testid="overlay-b" />);

    const { rerender } = render(
      <ElementPickerArea picking overlayDrawer={first}>
        <div />
      </ElementPickerArea>,
    );

    await waitFor(() => expect(MockedElementPicker).toHaveBeenCalled());
    const options = MockedElementPicker.mock.calls[0][0];
    expect(options.overlayDrawer).toBeDefined();

    const pos = { x: 0, y: 0, width: 10, height: 10 };
    const node = options.overlayDrawer!(pos, null);
    expect(first).toHaveBeenCalled();
    expect(node.getAttribute('data-testid')).toBe('overlay-a');

    rerender(
      <ElementPickerArea picking overlayDrawer={second}>
        <div />
      </ElementPickerArea>,
    );

    const node2 = options.overlayDrawer!(pos, null);
    expect(second).toHaveBeenCalled();
    expect(node2.getAttribute('data-testid')).toBe('overlay-b');
  });
});
