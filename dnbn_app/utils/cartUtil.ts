interface ItemImage {
  originalName: string;
  fileUrl: string;
  order: number;
}

interface CartItem {
  cartItemIdx: number;
  storeCode: string;
  productNm: string;
  price: number;
  discountPrice: number;
  quantity: number;
  productAmount: number;
  itemImg: ItemImage;
  selected?: boolean;
}

interface CartStore {
  storeNm: string;
  items: CartItem[];
  selected?: boolean;
}

/**
 * 개별 상품의 선택 상태를 토글합니다.
 */
export const toggleItemSelection = (
  cartData: CartStore[],
  cartItemIdx: number,
): CartStore[] => {
  return cartData.map((store) => ({
    ...store,
    items: store.items.map((item) =>
      item.cartItemIdx === cartItemIdx
        ? { ...item, selected: !item.selected }
        : item,
    ),
  }));
};

/**
 * 모든 상품의 선택 상태를 토글합니다.
 */
export const toggleAllSelection = (cartData: CartStore[]): CartStore[] => {
  const allSelected = cartData.every((store) =>
    store.items.every((item) => item.selected),
  );

  return cartData.map((store) => ({
    ...store,
    items: store.items.map((item) => ({
      ...item,
      selected: !allSelected,
    })),
  }));
};

/**
 * 특정 가맹점의 모든 상품 선택 상태를 토글합니다.
 */
export const toggleStoreSelection = (
  cartData: CartStore[],
  storeNm: string,
): CartStore[] => {
  return cartData.map((store) => {
    if (store.storeNm === storeNm) {
      const allSelected = store.items.every((item) => item.selected);
      return {
        ...store,
        items: store.items.map((item) => ({
          ...item,
          selected: !allSelected,
        })),
      };
    }
    return store;
  });
};

/**
 * 가맹점의 모든 상품이 선택되었는지 확인합니다.
 */
export const isStoreAllSelected = (store: CartStore): boolean => {
  return store.items.length > 0 && store.items.every((item) => item.selected);
};

/**
 * 모든 상품이 선택되었는지 확인합니다.
 */
export const isAllSelected = (cartData: CartStore[]): boolean => {
  return (
    cartData.length > 0 &&
    cartData.every((store) => store.items.every((item) => item.selected))
  );
};

/**
 * 상품의 수량을 변경합니다. (최소 수량: 1)
 */
export const updateItemQuantity = (
  cartData: CartStore[],
  cartItemIdx: number,
  delta: number,
): CartStore[] => {
  return cartData.map((store) => ({
    ...store,
    items: store.items.map((item) =>
      item.cartItemIdx === cartItemIdx
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item,
    ),
  }));
};
