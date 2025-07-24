<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    //
    public function index(){
        $user = Auth::user();
        if(!$user->role === 'admin'){
            return redirect()->route('shop.index')->with('message', "Page requires admin access");
        }

        $products = Product::paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);

    }

    public static function generateProductid(int $length = 20): string
    {
        $order_id = Str::random($length);//Generate random string
        $exists = Product::where('id', '=', $order_id)->first();
        if (isset($exists[0]->id)) {//id exists in orders table
            return self::generateProductid();//Retry with another generated id
        }
        return $order_id;//Return the generated id as it does not exist in the DB
    }
    public function create(){
        $user = Auth::user();
        if(!$user->role === 'admin'){
            return redirect()->route('shop.index')->with('message', "Page requires admin access");
        }

        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request){
        // Validate and store the product
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|decimal:2',
            'stock' => 'required|integer|min:0',
            'collection' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Create the uploads directory if it doesn't exist
       $uploadPath = public_path('uploads');
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        // Create a new product instance
        $newProduct = new Product();
        $newProduct->name = $data['name'];
        $newProduct->description = $data['description'];
        $newProduct->price = $data['price'];
        $newProduct->stock = $data['stock'];
        $newProduct->collection = $data['collection'];
        $newProduct->category = $data['category'];
        // Handle the image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move($uploadPath, $imageName);
            $newProduct->image = 'uploads/' . $imageName; // Store the relative path
        }
        // Save the product to the database
        try {
            $newProduct->save();
        } catch (\Exception $e) {
            // Handle any errors that occur during the save operation
            return redirect()->back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
        // Redirect to the product index page with a success message
        }
        return redirect()->route('products.index')->with('message', 'Product created successfully!');
    }

    public function destroy(Product $product)
    {
        // Delete the product
        $product->delete();

        // Redirect to the product index page with a success message
        return redirect()->route('products.index')->with('message', 'Product deleted successfully!');
    }

    public function edit(Product $product)
    {
        // Return the edit view with the product data

        // dd($product);
        $user = Auth::user();
        if(!$user->role === 'admin'){
            return redirect()->route('shop.index')->with('message', "Page requires admin access");
        }
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|decimal:2',
            'stock' => 'required|integer|min:0',
            'collection' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Update the product instance
        $product->name = $data['name'];
        $product->description = $data['description'];
        $product->price = $data['price'];
        $product->stock = $data['stock'];
        $product->collection = $data['collection'];
        $product->category = $data['category'];

        // Handle the image upload if a new image is provided
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($product->image && file_exists(public_path($product->image))) {
                unlink(public_path($product->image));
            }
            // Upload the new image
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads'), $imageName);
            $product->image = 'uploads/' . $imageName; // Store the relative path
        }

        // Save the updated product to the database
        try {
            $product->save();
        } catch (\Exception $e) {
            // Handle any errors that occur during the save operation
            return redirect()->back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }

        // Redirect to the product index page with a success message
        return redirect()->route('products.index')->with('message', 'Product updated successfully!');
    }


    public function addToCart($id)
    {
        $product = Product::find($id);

        if (!$product) {

            abort(404);
        }

        $cart = session()->get('cart');

        if (!$cart) {

            $cart = [
                $id => [
                    "name" => $product->name,
                    "quantity" => 1,
                    "price" => $product->price,
                    "photo" => $product->photo
                ]
            ];

            session()->put('cart', $cart);

            return redirect()->back()->with('success', 'Product added to cart successfully!');
        }

        if (isset($cart[$id])) {

            $cart[$id]['quantity']++;

            session()->put('cart', $cart);

            return redirect()->back()->with('success', 'Product added to cart successfully!');
        }

        $cart[$id] = [
            "name" => $product->name,
            "quantity" => 1,
            "price" => $product->price,
            "photo" => $product->photo
        ];

        session()->put('cart', $cart);
        if (request()->wantsJson()) {
            return response()->json(['message' => 'Product added to cart successfully!']);
        }

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function removeCartItem(Request $request)
    {
        if ($request->id) {

            $cart = session()->get('cart');

            if (isset($cart[$request->id])) {

                unset($cart[$request->id]);

                session()->put('cart', $cart);
            }

            session()->flash('success', 'Product removed successfully');
        }
    }

    public function clearCart()
    {
        session()->forget('cart');
        return redirect()->back();
    }

    public function showProducts()
    {
        $products = Product::all();
        return view('welcome', compact('products'));
    }

}
