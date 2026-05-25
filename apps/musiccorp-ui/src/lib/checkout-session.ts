'use client';

import type { CheckoutDraft, CheckoutResult } from '@/lib/types';

export const CHECKOUT_DRAFT_KEY = 'musiccorp.checkout.draft.v1';
export const CHECKOUT_RESULT_KEY = 'musiccorp.checkout.result.v1';

export const defaultCheckoutDraft: CheckoutDraft = {
  customerEmail: '',
  customerName: '',
  paymentMethod: 'CREDIT_CARD',
  termsAccepted: false,
};

export function readCheckoutDraft(): CheckoutDraft {
  if (typeof window === 'undefined') {
    return defaultCheckoutDraft;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CHECKOUT_DRAFT_KEY) ?? '{}');
    return {
      ...defaultCheckoutDraft,
      ...parsed,
      validationErrors: {},
    };
  } catch {
    return defaultCheckoutDraft;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    CHECKOUT_DRAFT_KEY,
    JSON.stringify({
      customerEmail: draft.customerEmail,
      customerName: draft.customerName,
      paymentMethod: draft.paymentMethod,
      termsAccepted: draft.termsAccepted,
    })
  );
}

export function readCheckoutResult(): CheckoutResult | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(CHECKOUT_RESULT_KEY) ?? 'null');
    return parsed && typeof parsed === 'object' ? (parsed as CheckoutResult) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutResult(result: CheckoutResult): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(CHECKOUT_RESULT_KEY, JSON.stringify(result));
}

export function clearCheckoutResult(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(CHECKOUT_RESULT_KEY);
}
