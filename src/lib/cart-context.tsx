import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, OrderInstance, OrderOptions, Product } from "../types";
import { addCartItem, getCartQuantity, setCartItemQuantity } from "./cart";
import { isTableNumber } from "./table-numbers";
import { loadStoredChoice, saveStoredChoice } from "./stored-choice";

const TABLE_KEY = "barmisaki-last-table";
const INSTANCE_KEY = "barmisaki-last-instance";
const isInstance = (value: string) => value === "first" || value === "second";
interface CartValue {
  items: CartItem[];
  table: string;
  instance: OrderInstance | "";
  quantity: number;
  setTable: (value: string) => void;
  setInstance: (value: OrderInstance | "") => void;
  add: (product: Product, options?: OrderOptions, quantity?: number) => void;
  change: (id: string, quantity: number) => void;
  clear: () => void;
}
const Context = createContext<CartValue | null>(null);
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  // The last table and instance are remembered on this device. The order
  // confirmation step still shows them, so a stale choice is caught before sending.
  const [table, setTableState] = useState(() => loadStoredChoice(TABLE_KEY, isTableNumber));
  const [instance, setInstanceState] = useState<OrderInstance | "">(
    () => loadStoredChoice(INSTANCE_KEY, isInstance) as OrderInstance | "",
  );
  const setTable = useCallback((value: string) => {
    setTableState(value);
    saveStoredChoice(TABLE_KEY, value);
  }, []);
  const setInstance = useCallback((value: OrderInstance | "") => {
    setInstanceState(value);
    saveStoredChoice(INSTANCE_KEY, value);
  }, []);
  const value = useMemo<CartValue>(
    () => ({
      items,
      table,
      instance,
      setTable,
      setInstance,
      quantity: getCartQuantity(items),
      add: (product, options = {}, quantity = 1) =>
        setItems((current) => addCartItem(current, product, options, quantity)),
      change: (id, quantity) =>
        setItems((current) => setCartItemQuantity(current, id, quantity)),
      clear: () => setItems([]),
    }),
    [items, table, instance, setTable, setInstance],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(Context);
  if (!context) throw new Error("CartProvider is required");
  return context;
};
