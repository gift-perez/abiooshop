import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm, usePage, router } from "@inertiajs/react";
import { MessageSquareWarning } from "lucide-react";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import type { Cart, CartItem } from "@/types";

interface Props {
  cart: Cart;
  cartItems: CartItem[];
}

export default function CheckoutForm({ cart, cartItems }: Props) {
  const { data, setData, post, processing, progress, errors } = useForm({
    receiver_name: "",
    receiver_address: "",
    phone: "",
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const { receiver_name, receiver_address, phone } = data;

  const payload: Record<string, any> = {
    receiver_name,
    receiver_address,
    phone,
  };

  if (cart.status === 'buy_now') {
    payload.items = cartItems;
    payload.cart_status = 'buy_now';
  }

  router.post('finalize', payload, {
    onStart: () => toast.loading("Submitting order..."),
    onSuccess: () => {
      toast.success("Order placed successfully!");
      setData({
        receiver_name: "",
        receiver_address: "",
        phone: "",
      });
    },
    onError: () => {
      toast.error("Failed to place order. Please check your details.");
    },
  });
};


  return (
    <form className='space-y-4' onSubmit={handleSubmit} encType="multipart/form-data">
      {errors && Object.keys(errors).length > 0 && (
        <div className="mb-4">
          <div className="text-red-600">
            <Alert>
              <MessageSquareWarning />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div className="join join-vertical bg-base-100">
        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" defaultChecked />
          <div className="collapse-title font-semibold">Delivery Information</div>
          <div className="collapse-content">
            <div className='gap-1.5'>
              <Label htmlFor="receiver_name">Receiver Name</Label>
              <Input placeholder="Receiver Name" value={data.receiver_name} onChange={e => setData('receiver_name', e.target.value)} />
            </div>
            <div className='gap-1.5'>
              <Label htmlFor="receiver_address">Receiver Address</Label>
              <Textarea placeholder="Receiver Address" value={data.receiver_address} onChange={e => setData('receiver_address', e.target.value)} />
            </div>
            <div className='gap-1.5'>
              <Label htmlFor="phone">Receiver Phone</Label>
              <Input placeholder="09XXXXXXXXX" value={data.phone} onChange={e => setData('phone', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="collapse collapse-arrow join-item border-base-300 border">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title font-semibold">Payment Options</div>
          <div className="collapse-content text-sm">
            Available options
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="gcash" />
                <Label htmlFor="gcash">
                  <img src='uploads/GCash-Logo.png' alt="Gcash" className="w-30 h-15 object-cover full" />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div>
        <Button type='submit' disabled={processing}>Proceed to Payment</Button>
      </div>
    </form>
  );
}
