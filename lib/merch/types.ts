export type MerchModelStatus = "pending" | "processing" | "ready" | "failed";

export type MerchProduct = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  shipping_fee_cents: number;
  sizes: string[];
  front_image_url: string | null;
  back_image_url: string | null;
  glb_model_url: string | null;
  model_status: MerchModelStatus;
  meshy_task_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type MerchLineItem = {
  product_id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price_cents: number;
  shipping_fee_cents: number;
};

export type MerchOrder = {
  id: string;
  order_number: string;
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  line_items: MerchLineItem[];
  total_charged_cents: number;
  tigerhill_notified: boolean;
  created_at: string;
};
