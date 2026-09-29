import QRCode from 'qrcode';

export interface QrOptions {
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  darkColor?: string;
  lightColor?: string;
  width?: number;
  dotStyle?: 'square' | 'rounded' | 'dots';
  finderStyle?: 'square' | 'rounded';
  logoSizeRatio?: number; // portion of QR to reserve for logo (0-0.3)
  gradientColors?: [string, string] | null;
}

/**
 * Get raw QR matrix data
 */
function getQrMatrix(url: string, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'H'): boolean[][] {
  const qr = QRCode.create(url, { errorCorrectionLevel }) as unknown as {
    modules: { size: number; data: Uint8Array };
  };
  const size = qr.modules.size;
  const data = qr.modules.data;
  const matrix: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    matrix[row] = [];
    for (let col = 0; col < size; col++) {
      matrix[row][col] = !!data[row * size + col];
    }
  }
  return matrix;
}

/**
 * Check if a module is part of a finder pattern (the 3 big squares in corners)
 */
function isFinderModule(row: number, col: number, size: number): boolean {
  // Top-left finder: 0-6, 0-6
  if (row <= 6 && col <= 6) return true;
  // Top-right finder: 0-6, size-7 to size-1
  if (row <= 6 && col >= size - 7) return true;
  // Bottom-left finder: size-7 to size-1, 0-6
  if (row >= size - 7 && col <= 6) return true;
  return false;
}

/**
 * Check if module is in the logo exclusion zone (center area)
 */
function isInLogoZone(row: number, col: number, size: number, logoSizeRatio: number): boolean {
  if (logoSizeRatio <= 0) return false;
  const center = size / 2;
  const halfLogo = (size * logoSizeRatio) / 2;
  return (
    row >= center - halfLogo &&
    row < center + halfLogo &&
    col >= center - halfLogo &&
    col < center + halfLogo
  );
}

/**
 * Render a single rounded finder pattern (the branded corner squares)
 */
function renderFinderPattern(
  x: number,
  y: number,
  cellSize: number,
  darkColor: string,
  lightColor: string,
  gradientId: string | null,
  style: 'square' | 'rounded'
): string {
  const outerSize = 7 * cellSize;
  const innerRingOffset = cellSize;
  const innerRingSize = 5 * cellSize;
  const coreOffset = 2 * cellSize;
  const coreSize = 3 * cellSize;
  const fill = gradientId ? `url(#${gradientId})` : darkColor;

  if (style === 'rounded') {
    const outerR = cellSize * 1.4;
    const innerR = cellSize * 1.0;
    const coreR = cellSize * 0.8;
    return `
      <rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" rx="${outerR}" ry="${outerR}" fill="${fill}" />
      <rect x="${x + innerRingOffset}" y="${y + innerRingOffset}" width="${innerRingSize}" height="${innerRingSize}" rx="${innerR}" ry="${innerR}" fill="${lightColor}" />
      <rect x="${x + coreOffset}" y="${y + coreOffset}" width="${coreSize}" height="${coreSize}" rx="${coreR}" ry="${coreR}" fill="${fill}" />
    `;
  }

  return `
    <rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" fill="${fill}" />
    <rect x="${x + innerRingOffset}" y="${y + innerRingOffset}" width="${innerRingSize}" height="${innerRingSize}" fill="${lightColor}" />
    <rect x="${x + coreOffset}" y="${y + coreOffset}" width="${coreSize}" height="${coreSize}" fill="${fill}" />
  `;
}

/**
 * Render a single data module with the chosen dot style
 */
function renderModule(
  x: number,
  y: number,
  cellSize: number,
  darkColor: string,
  gradientId: string | null,
  dotStyle: 'square' | 'rounded' | 'dots'
): string {
  const fill = gradientId ? `url(#${gradientId})` : darkColor;

  switch (dotStyle) {
    case 'dots': {
      const r = cellSize * 0.38;
      const cx = x + cellSize / 2;
      const cy = y + cellSize / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
    }
    case 'rounded': {
      const inset = cellSize * 0.08;
      const size = cellSize - inset * 2;
      const radius = size * 0.35;
      return `<rect x="${x + inset}" y="${y + inset}" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${fill}" />`;
    }
    default: {
      return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`;
    }
  }
}

/**
 * Generate premium branded QR code as SVG string
 */
export async function generateQrSvg(
  url: string,
  options: QrOptions = {}
): Promise<string> {
  const {
    margin = 2,
    errorCorrectionLevel = 'H',
    darkColor = '#18181B',
    lightColor = '#FFFFFF',
    dotStyle = 'rounded',
    finderStyle = 'rounded',
    logoSizeRatio = 0.22,
    gradientColors = null,
  } = options;

  const matrix = getQrMatrix(url, errorCorrectionLevel);
  const moduleCount = matrix.length;
  const cellSize = 10;
  const totalSize = (moduleCount + margin * 2) * cellSize;

  const gradientId = gradientColors ? 'qrGradient' : null;
  let gradientDef = '';
  if (gradientColors) {
    gradientDef = `
      <defs>
        <linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientColors[0]}" />
          <stop offset="100%" stop-color="${gradientColors[1]}" />
        </linearGradient>
      </defs>
    `;
  }

  let modules = '';

  // Render data modules (skip finder patterns and logo zone)
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!matrix[row][col]) continue;
      if (isFinderModule(row, col, moduleCount)) continue;
      if (isInLogoZone(row, col, moduleCount, logoSizeRatio)) continue;

      const x = (col + margin) * cellSize;
      const y = (row + margin) * cellSize;
      modules += renderModule(x, y, cellSize, darkColor, gradientId, dotStyle);
    }
  }

  // Render 3 finder patterns
  const finderPositions = [
    { row: 0, col: 0 }, // top-left
    { row: 0, col: moduleCount - 7 }, // top-right
    { row: moduleCount - 7, col: 0 }, // bottom-left
  ];

  let finders = '';
  for (const pos of finderPositions) {
    const x = (pos.col + margin) * cellSize;
    const y = (pos.row + margin) * cellSize;
    finders += renderFinderPattern(x, y, cellSize, darkColor, lightColor, gradientId, finderStyle);
  }

  // Render center logo zone background (white circle for logo placement)
  let logoZone = '';
  if (logoSizeRatio > 0) {
    const center = (moduleCount / 2 + margin) * cellSize;
    const logoRadius = (moduleCount * logoSizeRatio / 2) * cellSize + cellSize * 0.8;
    logoZone = `
      <circle cx="${center}" cy="${center}" r="${logoRadius}" fill="${lightColor}" />
      <circle cx="${center}" cy="${center}" r="${logoRadius - 1.5}" fill="none" stroke="${gradientColors ? gradientColors[0] : darkColor}" stroke-width="1.5" opacity="0.15" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="geometricPrecision">
    ${gradientDef}
    <rect width="${totalSize}" height="${totalSize}" fill="${lightColor}" />
    ${modules}
    ${finders}
    ${logoZone}
  </svg>`;
}

/**
 * Generate QR as data URL (PNG) for download, with logo overlay via canvas
 */
export async function generateQrDataUrl(
  url: string,
  options: QrOptions = {}
): Promise<string> {
  const {
    width = 1000,
    margin = 2,
    errorCorrectionLevel = 'H',
    darkColor = '#18181B',
    lightColor = '#FFFFFF',
    dotStyle = 'rounded',
    finderStyle = 'rounded',
    logoSizeRatio = 0.22,
    gradientColors = null,
  } = options;

  // Get SVG string and render to canvas
  const svgString = await generateQrSvg(url, {
    margin,
    errorCorrectionLevel,
    darkColor,
    lightColor,
    dotStyle,
    finderStyle,
    logoSizeRatio,
    gradientColors,
  });

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas not supported'));

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, width);
      URL.revokeObjectURL(svgUrl);

      // Overlay the logo PNG
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.onload = () => {
        const logoSize = width * logoSizeRatio * 0.75;
        const logoX = (width - logoSize) / 2;
        const logoY = (width - logoSize) / 2;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        resolve(canvas.toDataURL('image/png'));
      };
      logo.onerror = () => {
        // If logo fails, return QR without logo
        resolve(canvas.toDataURL('image/png'));
      };
      logo.src = '/logo/SYMBOL/KAIROTRIX_Symbol_Black.png';
    };
    img.onerror = reject;
    img.src = svgUrl;
  });
}
