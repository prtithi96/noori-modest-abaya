import React, { useState, useEffect } from 'react';
import { PageId, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrdersModal } from './components/OrdersModal';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { WholesalePage } from './pages/WholesalePage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { LookbookPage } from './pages/LookbookPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function MainApp() {
  const { user, token } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      size: '54',
      color: 'Deep Emerald',
      quantity: 1,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([PRODUCTS[1].id]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync wishlist from PostgreSQL when user logs in
  useEffect(() => {
    if (token) {
      getWishlistApi(token)
        .then((dbIds) => {
          if (Array.isArray(dbIds) && dbIds.length > 0) {
            setWishlistIds((prev) => Array.from(new Set([...prev, ...dbIds])));
          }
        })
        .catch((err) => console.error('Wishlist sync error:', err));
    }
  }, [token]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string = '54',
    color: string = product.colors[0]?.name || 'Default',
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, color, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCartItems((prev) => {
        const next = [...prev];
        next[index].quantity = quantity;
        return next;
      });
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Wishlist operations with PostgreSQL sync
  const handleToggleWishlist = async (productId: string) => {
    const isCurrentlyWishlisted = wishlistIds.includes(productId);

    if (isCurrentlyWishlisted) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      if (token) {
        removeFromWishlistApi(productId, token).catch((e) => console.error(e));
      }
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      if (token) {
        addToWishlistApi(productId, token).catch((e) => console.error(e));
      }
    }
  };

  const handleMoveToCartFromWishlist = (product: Product) => {
    handleAddToCart(product, '54', product.colors[0]?.name || 'Standard', 1);
    handleToggleWishlist(product.id);
  };

  // Total cart item count
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf6] text-[#181c1a] antialiased selection:bg-[#fed65b] selection:text-[#241a00]">
      {/* Universal Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        openOrders={() => setIsOrdersOpen(true)}
        openSupabaseModal={() => setIsSupabaseOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1 pt-28 sm:pt-32">
        {currentPage === 'home' && (
          <HomePage
            products={PRODUCTS}
            onNavigate={setCurrentPage}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, s, c) => handleAddToCart(p, s, c)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {currentPage === 'collection' && (
          <CollectionPage
            products={PRODUCTS}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, s, c) => handleAddToCart(p, s, c)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'wholesale' && <WholesalePage products={PRODUCTS} />}

        {currentPage === 'size-guide' && <SizeGuidePage />}

        {currentPage === 'lookbook' && (
          <LookbookPage
            products={PRODUCTS}
            onNavigate={setCurrentPage}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p) => handleAddToCart(p)}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={setCurrentPage} />}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Universal Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => {
          setQuickViewProduct(null);
          setCurrentPage('size-guide');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreCollection={() => {
          setIsCartOpen(false);
          setCurrentPage('collection');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        allProducts={PRODUCTS}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCartFromWishlist}
        onExploreCollection={() => {
          setIsWishlistOpen(false);
          setCurrentPage('collection');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Orders & Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Supabase Connection & Schema Modal */}
      <SupabaseConnectModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
