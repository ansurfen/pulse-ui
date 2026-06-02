export type ViewBoxBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapViewport = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export function parseViewBox(viewBox: string): ViewBoxBounds {
  const [x, y, width, height] = viewBox.split(/\s+/).map(Number);

  return { x, y, width, height };
}

export function getVisibleSize(bounds: ViewBoxBounds, zoom: number) {
  return {
    width: bounds.width / zoom,
    height: bounds.height / zoom
  };
}

export function clampViewport(viewport: MapViewport, bounds: ViewBoxBounds): MapViewport {
  const { width: visibleWidth, height: visibleHeight } = getVisibleSize(bounds, viewport.zoom);
  const maxOffsetX = Math.max(0, bounds.width - visibleWidth);
  const maxOffsetY = Math.max(0, bounds.height - visibleHeight);

  return {
    zoom: viewport.zoom,
    offsetX: Math.min(Math.max(0, viewport.offsetX), maxOffsetX),
    offsetY: Math.min(Math.max(0, viewport.offsetY), maxOffsetY)
  };
}

export function createDefaultViewport(minZoom: number): MapViewport {
  return {
    zoom: minZoom,
    offsetX: 0,
    offsetY: 0
  };
}

export function isDefaultViewport(viewport: MapViewport, minZoom: number) {
  return viewport.zoom === minZoom && viewport.offsetX === 0 && viewport.offsetY === 0;
}

export function viewportToViewBox(viewport: MapViewport, bounds: ViewBoxBounds) {
  const clamped = clampViewport(viewport, bounds);
  const { width: visibleWidth, height: visibleHeight } = getVisibleSize(bounds, clamped.zoom);

  return `${bounds.x + clamped.offsetX} ${bounds.y + clamped.offsetY} ${visibleWidth} ${visibleHeight}`;
}

export function zoomViewport(viewport: MapViewport, bounds: ViewBoxBounds, nextZoom: number) {
  const { width: visibleWidth, height: visibleHeight } = getVisibleSize(bounds, viewport.zoom);
  const centerX = viewport.offsetX + visibleWidth / 2;
  const centerY = viewport.offsetY + visibleHeight / 2;
  const { width: nextVisibleWidth, height: nextVisibleHeight } = getVisibleSize(bounds, nextZoom);

  return clampViewport(
    {
      zoom: nextZoom,
      offsetX: centerX - nextVisibleWidth / 2,
      offsetY: centerY - nextVisibleHeight / 2
    },
    bounds
  );
}

export function panViewport(
  viewport: MapViewport,
  bounds: ViewBoxBounds,
  deltaX: number,
  deltaY: number,
  containerWidth: number,
  containerHeight: number
) {
  const { width: visibleWidth, height: visibleHeight } = getVisibleSize(bounds, viewport.zoom);
  const unitsPerPixelX = visibleWidth / Math.max(containerWidth, 1);
  const unitsPerPixelY = visibleHeight / Math.max(containerHeight, 1);

  return clampViewport(
    {
      ...viewport,
      offsetX: viewport.offsetX - deltaX * unitsPerPixelX,
      offsetY: viewport.offsetY - deltaY * unitsPerPixelY
    },
    bounds
  );
}
