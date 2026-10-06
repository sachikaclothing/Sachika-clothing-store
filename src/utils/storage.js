import { initialProducts, customerReviews } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'sachika_clothing_products',
  CART: 'sachika_clothing_cart',
  WISHLIST: 'sachika_clothing_wishlist',
  ORDERS: 'sachika_clothing_orders',
  COUPONS: 'sachika_clothing_coupons',
  REFERRALS: 'sachika_clothing_referrals',
  CHECKLIST: 'sachika_clothing_checklist',
  REVIEWS: 'sachika_clothing_reviews'
};

const LEGACY_STORAGE_KEYS = {
  PRODUCTS: 'suchika_clothing_products',
  CART: 'suchika_clothing_cart',
  WISHLIST: 'suchika_clothing_wishlist',
  ORDERS: 'suchika_clothing_orders',
  COUPONS: 'suchika_clothing_coupons',
  REFERRALS: 'suchika_clothing_referrals',
  CHECKLIST: 'suchika_clothing_checklist',
  REVIEWS: 'suchika_clothing_reviews'
};

const DEFAULT_COUPONS = [
  { code: 'SACHIKA10', discountType: 'percentage', value: 10, minSpend: 999, description: '10% Extra Discount on All Orders' },
  { code: 'SUCHIKA10', discountType: 'percentage', value: 10, minSpend: 999, description: '10% Extra Discount on All Orders' },
  { code: 'AURA10', discountType: 'percentage', value: 10, minSpend: 999, description: '10% Extra Discount on All Orders' },
  { code: 'FESTIVE20', discountType: 'percentage', value: 20, minSpend: 1999, description: '20% Mega Festive Offer above ₹1999' },
  { code: 'FIRSTBUY', discountType: 'flat', value: 250, minSpend: 1499, description: 'Flat ₹250 OFF on your first purchase' },
  { code: 'ROYAL15', discountType: 'percentage', value: 15, minSpend: 999, description: '15% VIP Abandoned Cart Recovery Discount' }
];

export const getProducts = () => {
  try {
    let saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!saved) {
      saved = localStorage.getItem(LEGACY_STORAGE_KEYS.PRODUCTS);
    }
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Error loading products from storage', err);
    return initialProducts;
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products', err);
  }
};

export const addProduct = (newProduct) => {
  const products = getProducts();
  const updated = [newProduct, ...products];
  saveProducts(updated);
  return updated;
};

export const updateProduct = (updatedProduct) => {
  const products = getProducts();
  const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
  saveProducts(updated);
  return updated;
};

export const deleteProduct = (productId) => {
  const products = getProducts();
  const updated = products.filter(p => p.id !== productId);
  saveProducts(updated);
  return updated;
};

// Cart
export const getCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem(LEGACY_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart', err);
  }
};

// Wishlist
export const getWishlist = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST) || localStorage.getItem(LEGACY_STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const toggleWishlist = (productId) => {
  const list = getWishlist();
  const exists = list.includes(productId);
  const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
  return updated;
};

// Orders
export const getOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS) || localStorage.getItem(LEGACY_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order) => {
  const orders = getOrders();
  const updated = [order, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return updated;
};

export const updateOrderStatus = (orderId, newStatus, cancelReason = 'Out of Stock') => {
  const orders = getOrders();
  const updated = orders.map(o => {
    if (o.id === orderId) {
      const isCancelled = newStatus === 'Cancelled';
      return {
        ...o,
        status: newStatus,
        cancelReason: isCancelled ? (cancelReason || o.cancelReason || 'Out of Stock') : null,
        cancelledAt: isCancelled ? (o.cancelledAt || new Date().toISOString()) : null,
        cancelledBy: isCancelled ? (o.cancelledBy || 'Admin') : null
      };
    }
    return o;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return updated;
};

export const cancelOrderCustomer = (orderId, reason = 'Cancelled by Customer') => {
  return updateOrderStatus(orderId, 'Cancelled', reason);
};

// Seen / Unread Orders Notification System
const SEEN_ORDERS_KEY = 'sachika_seen_orders';

export const getUnreadOrdersCount = () => {
  try {
    const orders = getOrders();
    if (!orders || orders.length === 0) return 0;
    const raw = localStorage.getItem(SEEN_ORDERS_KEY);
    const seenList = raw ? JSON.parse(raw) : [];
    // Count orders whose current signature (id + status) has not been seen yet
    return orders.filter(o => !seenList.includes(`${o.id}_${o.status}`)).length;
  } catch {
    return 0;
  }
};

export const markOrdersAsSeen = () => {
  try {
    const orders = getOrders();
    const currentSignatures = orders.map(o => `${o.id}_${o.status}`);
    localStorage.setItem(SEEN_ORDERS_KEY, JSON.stringify(currentSignatures));
  } catch (err) {
    console.error('Error marking orders as seen', err);
  }
};

// Marketplace Referral Tracker (Flipkart, Meesho, Ajio clicks)
export const getReferrals = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS) || localStorage.getItem(LEGACY_STORAGE_KEYS.REFERRALS);
    if (!saved) {
      return { flipkart: 0, meesho: 0, ajio: 0, directStore: 0 };
    }
    const parsed = JSON.parse(saved);
    // If it contained legacy dummy seed values (84, 112, 67), automatically reset to 0
    if (parsed.flipkart === 84 || parsed.meesho === 112 || parsed.ajio === 67) {
      const reset = { flipkart: 0, meesho: 0, ajio: 0, directStore: 0 };
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(reset));
      return reset;
    }
    return parsed;
  } catch {
    return { flipkart: 0, meesho: 0, ajio: 0, directStore: 0 };
  }
};

export const resetReferrals = () => {
  const reset = { flipkart: 0, meesho: 0, ajio: 0, directStore: 0 };
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(reset));
  return reset;
};

export const recordMarketplaceClick = (platform) => {
  const refs = getReferrals();
  refs[platform] = (refs[platform] || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(refs));
  return refs;
};

// Coupons
export const getCoupons = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  } catch {
    return DEFAULT_COUPONS;
  }
};

export const saveCoupons = (coupons) => {
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
};

// Checklist
export const getLaunchChecklist = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return {
    testEveryProduct: true,
    testAddToCart: true,
    testCheckout: true,
    testUpiCardPayment: true,
    testCod: true,
    testOrderConfirmation: true,
    testEmailSms: true,
    testMobileWebsite: true,
    testDesktopWebsite: true,
    testContactWhatsapp: true,
    checkPolicies: true,
    checkSpellingPrices: true,
    placeTestOrder: false
  };
};

export const saveLaunchChecklist = (checklist) => {
  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
};

// Reviews
export const getReviews = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : customerReviews;
  } catch {
    return customerReviews;
  }
};

export const addReview = (review) => {
  const reviews = getReviews();
  const updated = [review, ...reviews];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  return updated;
};
