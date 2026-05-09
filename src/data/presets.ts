import { DeviceType } from '@/store/useStore';

export interface PresetDevice {
  name: string;
  width: number;
  height: number;
  type: DeviceType;
  brand: string;
}

export const allPresets: PresetDevice[] = [
  // Apple Mobile
  { name: 'iPhone 15 Pro', width: 393, height: 852, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, type: 'mobile', brand: 'Apple' },
  { name: 'Apple iPhone 15', width: 393, height: 852, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 15 Plus', width: 430, height: 932, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 14 Pro', width: 393, height: 852, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 14', width: 390, height: 844, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 13 Pro', width: 390, height: 844, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 13 Pro Max', width: 428, height: 926, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 13', width: 390, height: 844, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 13 mini', width: 360, height: 780, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone SE', width: 375, height: 667, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 11 Pro', width: 375, height: 812, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 12 Mini', width: 379, height: 820, type: 'mobile', brand: 'Apple' },
  { name: 'iPhone 12 Pro Max', width: 379, height: 820, type: 'mobile', brand: 'Apple' },

  // Apple Tablet
  { name: 'iPad Air 5', width: 820, height: 1180, type: 'tablet', brand: 'Apple' },
  { name: 'iPad mini', width: 608, height: 926, type: 'tablet', brand: 'Apple' },
  { name: 'iPad', width: 575, height: 767, type: 'tablet', brand: 'Apple' },
  { name: 'iPad Pro 11', width: 581, height: 832, type: 'tablet', brand: 'Apple' },
  { name: 'iPad Air 4', width: 573, height: 824, type: 'tablet', brand: 'Apple' },

  // Apple Desktop
  { name: 'Macbook Air M2', width: 1280, height: 832, type: 'desktop', brand: 'Apple' },
  { name: 'Macbook Pro 16', width: 1728, height: 1117, type: 'desktop', brand: 'Apple' },
  { name: 'Studio Display', width: 1280, height: 720, type: 'desktop', brand: 'Apple' },
  { name: 'Pro Display XDR', width: 1504, height: 846, type: 'desktop', brand: 'Apple' },
  { name: 'iMac 24', width: 1120, height: 630, type: 'desktop', brand: 'Apple' },
  { name: 'Macbook Air', width: 1559, height: 975, type: 'desktop', brand: 'Apple' },

  // Google Mobile
  { name: 'Pixel 7 Pro', width: 480, height: 1040, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 7a', width: 427, height: 950, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 6 Pro', width: 480, height: 1040, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 2 XL', width: 375, height: 750, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 2', width: 375, height: 667, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 4', width: 370, height: 781, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 4a', width: 372, height: 805, type: 'mobile', brand: 'Google' },
  { name: 'Pixel 5', width: 376, height: 815, type: 'mobile', brand: 'Google' },

  // Google Tablet
  { name: 'Pixel Tablet', width: 1575, height: 984, type: 'tablet', brand: 'Google' },
  { name: 'Pixel Slate', width: 542, height: 813, type: 'tablet', brand: 'Google' },

  // Google Desktop
  { name: 'Pixelbook Go', width: 1643, height: 924, type: 'desktop', brand: 'Google' },

  // Android/Samsung Mobile
  { name: 'Galaxy A50', width: 372, height: 800, type: 'mobile', brand: 'Samsung' },
  { name: 'Galaxy S20', width: 370, height: 822, type: 'mobile', brand: 'Samsung' },
  { name: 'Galaxy Note20', width: 371, height: 824, type: 'mobile', brand: 'Samsung' },
  { name: 'Galaxy Note20 Ultra', width: 390, height: 830, type: 'mobile', brand: 'Samsung' },

  // Android/Samsung Tablet
  { name: 'Galaxy Tab S7', width: 526, height: 842, type: 'tablet', brand: 'Samsung' },

  // Amazon
  { name: 'Fire HD 10', width: 468, height: 749, type: 'tablet', brand: 'Amazon' },

  // Microsoft
  { name: 'Surface Pro X', width: 575, height: 862, type: 'tablet', brand: 'Microsoft' },
];
