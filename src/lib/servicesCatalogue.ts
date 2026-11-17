export interface ServiceCatalogueItem {
  id: string;
  category: 'hair' | 'beard' | 'spa' | 'treatments';
  name: string;
  price: string;
}

/**
 * Official Best Creative Hub service catalogue.
 * Serves as the single server-side source of truth for pricing and validation.
 */
export const SERVICE_CATALOGUE: readonly ServiceCatalogueItem[] = [
  // ── HAIR (10 services) ───────────────────────────────────────────────
  { id: 'haircut', category: 'hair', name: 'Classic Haircut', price: '5,000' },
  { id: 'skin-fade', category: 'hair', name: 'Skin Fade', price: '7,000' },
  { id: 'low-fade', category: 'hair', name: 'Low Fade', price: 'Price on request' },
  { id: 'mid-fade', category: 'hair', name: 'Mid Fade', price: 'Price on request' },
  { id: 'high-fade', category: 'hair', name: 'High Fade', price: 'Price on request' },
  { id: 'taper-fade', category: 'hair', name: 'Taper Fade', price: 'Price on request' },
  { id: 'haircut-styling', category: 'hair', name: 'Haircut & Styling', price: 'Price on request' },
  { id: 'hair-wash', category: 'hair', name: 'Hair Wash', price: 'Price on request' },
  { id: 'hair-colouring', category: 'hair', name: 'Hair Colouring', price: 'Price on request' },
  { id: 'hair-treatment', category: 'hair', name: 'Hair Treatment', price: 'Price on request' },

  // ── BEARD (10 services) ──────────────────────────────────────────────
  { id: 'beard-trim', category: 'beard', name: 'Beard Trim', price: '3,500' },
  { id: 'beard-shaping', category: 'beard', name: 'Beard Shaping', price: 'Price on request' },
  { id: 'beard-grooming', category: 'beard', name: 'Beard Grooming', price: 'Price on request' },
  { id: 'beard-lineup', category: 'beard', name: 'Beard Line-up', price: 'Price on request' },
  { id: 'beard-colouring', category: 'beard', name: 'Beard Colouring', price: 'Price on request' },
  { id: 'hot-towel-shave', category: 'beard', name: 'Hot Towel Shave', price: '6,000' },
  { id: 'full-beard-styling', category: 'beard', name: 'Full Beard Styling', price: 'Price on request' },
  { id: 'mustache-grooming', category: 'beard', name: 'Mustache Grooming', price: 'Price on request' },
  { id: 'beard-conditioning', category: 'beard', name: 'Beard Conditioning', price: 'Price on request' },
  { id: 'premium-beard-treatment', category: 'beard', name: 'Premium Beard Treatment', price: 'Price on request' },

  // ── SPA & WELLNESS (11 services) ─────────────────────────────────────
  { id: 'swedish-massage', category: 'spa', name: 'Swedish Massage', price: 'Price on request' },
  { id: 'deep-tissue-massage', category: 'spa', name: 'Deep Tissue Massage', price: 'Price on request' },
  { id: 'relaxation-massage', category: 'spa', name: 'Relaxation Massage', price: 'Price on request' },
  { id: 'aromatherapy', category: 'spa', name: 'Aromatherapy', price: 'Price on request' },
  { id: 'body-scrub', category: 'spa', name: 'Body Scrub', price: 'Price on request' },
  { id: 'body-polish', category: 'spa', name: 'Body Polish', price: 'Price on request' },
  { id: 'facial-spa', category: 'spa', name: 'Facial Spa', price: '12,000' },
  { id: 'foot-spa', category: 'spa', name: 'Foot Spa', price: 'Price on request' },
  { id: 'manicure', category: 'spa', name: 'Manicure', price: '8,000' },
  { id: 'pedicure', category: 'spa', name: 'Pedicure', price: 'Price on request' },
  { id: 'full-body-massage', category: 'spa', name: 'Full Body Massage', price: '15,000' },

  // ── TREATMENTS (11 services) ─────────────────────────────────────────
  { id: 'hair-conditioning-treatment', category: 'treatments', name: 'Hair Conditioning Treatment', price: 'Price on request' },
  { id: 'scalp-treatment', category: 'treatments', name: 'Scalp Treatment', price: '4,000' },
  { id: 'hair-repair-treatment', category: 'treatments', name: 'Hair Repair Treatment', price: 'Price on request' },
  { id: 'anti-dandruff-treatment', category: 'treatments', name: 'Anti-Dandruff Treatment', price: 'Price on request' },
  { id: 'facial-cleansing', category: 'treatments', name: 'Facial Cleansing', price: 'Price on request' },
  { id: 'deep-cleansing-facial', category: 'treatments', name: 'Deep Cleansing Facial', price: '10,000' },
  { id: 'skin-rejuvenation', category: 'treatments', name: 'Skin Rejuvenation', price: 'Price on request' },
  { id: 'hair-restoration-consultation', category: 'treatments', name: 'Hair Restoration Consultation', price: 'Price on request' },
  { id: 'moisturising-treatment', category: 'treatments', name: 'Moisturising Treatment', price: 'Price on request' },
  { id: 'premium-hair-treatment', category: 'treatments', name: 'Premium Hair Treatment', price: 'Price on request' },
  { id: 'scalp-massage', category: 'treatments', name: 'Scalp Massage', price: '4,000' }
] as const;

export function getServiceFromCatalogue(serviceId: string): ServiceCatalogueItem | undefined {
  return SERVICE_CATALOGUE.find((s) => s.id === serviceId);
}

export interface FeeCalculationResult {
  isPayable: boolean;
  reason?: string;
  originalPriceNaira: number;
  originalPriceKobo: number;
  commitmentFeeNaira: number;
  commitmentFeeKobo: number;
  balanceDueNaira: number;
  balanceDueKobo: number;
  percentage: number;
}

/**
 * Calculates the commitment fee (default 30%) and outstanding balance (70%).
 * Performs exact arithmetic in kobo (1 NGN = 100 kobo) with deterministic rounding.
 */
export function calculateCommitmentFee(
  priceString: string,
  percentage: number = 30
): FeeCalculationResult {
  if (!priceString || priceString.toLowerCase().includes('request')) {
    return {
      isPayable: false,
      reason: 'Services marked "Price on request" require direct consultation and cannot be paid online.',
      originalPriceNaira: 0,
      originalPriceKobo: 0,
      commitmentFeeNaira: 0,
      commitmentFeeKobo: 0,
      balanceDueNaira: 0,
      balanceDueKobo: 0,
      percentage,
    };
  }

  // Sanitize numeric string: remove commas, currency signs, whitespace
  const sanitized = priceString.replace(/[^0-9.]/g, '');
  const priceNaira = parseFloat(sanitized);

  if (isNaN(priceNaira) || priceNaira <= 0) {
    return {
      isPayable: false,
      reason: `Invalid or zero service price: "${priceString}".`,
      originalPriceNaira: 0,
      originalPriceKobo: 0,
      commitmentFeeNaira: 0,
      commitmentFeeKobo: 0,
      balanceDueNaira: 0,
      balanceDueKobo: 0,
      percentage,
    };
  }

  // Exact kobo conversion
  const originalPriceKobo = Math.round(priceNaira * 100);

  // Clamped percentage: 1 to 100
  const validPercentage = Math.min(100, Math.max(1, percentage));
  const rate = validPercentage / 100;

  // Round commitment fee to nearest kobo
  const commitmentFeeKobo = Math.round(originalPriceKobo * rate);

  // Exact balance is remaining kobo to guarantee: commitmentFee + balanceDue === originalPrice
  const balanceDueKobo = originalPriceKobo - commitmentFeeKobo;

  return {
    isPayable: true,
    originalPriceNaira: originalPriceKobo / 100,
    originalPriceKobo,
    commitmentFeeNaira: commitmentFeeKobo / 100,
    commitmentFeeKobo,
    balanceDueNaira: balanceDueKobo / 100,
    balanceDueKobo,
    percentage: validPercentage,
  };
}

