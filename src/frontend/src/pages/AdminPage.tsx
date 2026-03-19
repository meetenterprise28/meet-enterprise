import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Edit2,
  Gift,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ADMIN_SESSION_KEY } from "../hooks/useActor";
import {
  useAllOrders,
  useAllUsers,
  useAllVouchers,
  useCategories,
  useCreateCategory,
  useCreateProduct,
  useCreateScheme,
  useDeleteCategory,
  useDeleteProduct,
  useDeleteScheme,
  usePaymentSettings,
  useProducts,
  useSchemes,
  useSetPaymentSettings,
  useUpdateCategory,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";
import {
  fileToUint8Array,
  formatPrice,
  uint8ToDataUrl,
} from "../utils/imageUtils";

const ADMIN_CODE = "2537";
const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const PRESET_SIZES = ["S", "M", "L", "XL", "XXL", "Free Size"];

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_CODE,
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  const handleUnlock = () => {
    if (code === ADMIN_CODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_CODE);
      setUnlocked(true);
      // Invalidate actor so it reinitializes with the admin token
      queryClient.invalidateQueries({ queryKey: ["actor"] });
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  if (!unlocked) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-luxury p-10 w-full max-w-sm text-center"
        >
          <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Settings className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-serif text-2xl text-gold uppercase tracking-widest mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Enter the 4-digit access code
          </p>
          <Input
            type="password"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="· · · ·"
            className={`text-center text-2xl tracking-[0.5em] bg-secondary border-gold-border mb-4 ${
              error ? "border-destructive" : ""
            }`}
            data-ocid="admin.passcode.input"
          />
          {error && (
            <p className="text-destructive text-xs mb-3">
              Incorrect code. Try again.
            </p>
          )}
          <Button
            className="btn-gold w-full tracking-widest uppercase"
            onClick={handleUnlock}
            data-ocid="admin.passcode.submit"
          >
            Unlock
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-4xl text-gold uppercase tracking-widest mb-2">
          Admin Panel
        </h1>
        <div className="w-16 h-px bg-gold mb-10" />

        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 bg-secondary border border-gold-border">
            {[
              {
                value: "users",
                icon: <Users className="w-3.5 h-3.5" />,
                label: "Users",
              },
              {
                value: "categories",
                icon: <Tag className="w-3.5 h-3.5" />,
                label: "Categories",
              },
              {
                value: "products",
                icon: <Package className="w-3.5 h-3.5" />,
                label: "Products",
              },
              {
                value: "orders",
                icon: <ShoppingBag className="w-3.5 h-3.5" />,
                label: "Orders",
              },
              {
                value: "schemes",
                icon: <Gift className="w-3.5 h-3.5" />,
                label: "Schemes",
              },
              {
                value: "settings",
                icon: <Settings className="w-3.5 h-3.5" />,
                label: "Settings",
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-xs tracking-widest uppercase data-[state=active]:text-gold data-[state=active]:bg-background"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="schemes">
            <SchemesTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useAllUsers();
  const { data: orders } = useAllOrders();

  const getOrderCount = (userId: string) =>
    orders?.filter((o) => o.userId.toString() === userId).length ?? 0;

  return (
    <div>
      <h2 className="font-serif text-2xl text-gold uppercase tracking-widest mb-6">
        Users
      </h2>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="card-luxury overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold-border hover:bg-transparent">
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Name
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  WhatsApp
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Orders
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!users?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No users yet
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, idx) => (
                  <TableRow
                    key={user.id.toString()}
                    className="border-gold-border"
                    data-ocid={`admin.user.item.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.whatsapp}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gold/10 text-gold border-gold-border">
                        {getOrderCount(user.id.toString())}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function CategoriesTab() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<bigint | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createCategory.mutateAsync(newName.trim());
      setNewName("");
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id: bigint) => {
    if (!editName.trim()) return;
    try {
      await updateCategory.mutateAsync({ id, name: editName.trim() });
      setEditId(null);
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-gold uppercase tracking-widest mb-6">
        Categories
      </h2>
      <div className="card-luxury p-4 mb-6 flex gap-3 items-center">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="bg-secondary border-gold-border"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          data-ocid="admin.category.input"
        />
        <Button
          className="btn-gold tracking-widest uppercase text-xs flex-shrink-0"
          onClick={handleCreate}
          disabled={createCategory.isPending}
          data-ocid="admin.category.add.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="card-luxury overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold-border hover:bg-transparent">
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Name
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!categories?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground py-8"
                  >
                    No categories yet
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat, idx) => (
                  <TableRow
                    key={cat.id.toString()}
                    className="border-gold-border"
                    data-ocid={`admin.category.item.${idx + 1}`}
                  >
                    <TableCell>
                      {editId === cat.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 bg-secondary border-gold-border max-w-xs"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleUpdate(cat.id)
                          }
                          autoFocus
                        />
                      ) : (
                        <span>{cat.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editId === cat.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            className="w-7 h-7 btn-gold"
                            onClick={() => handleUpdate(cat.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={() => setEditId(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-muted-foreground hover:text-gold"
                            onClick={() => {
                              setEditId(cat.id);
                              setEditName(cat.name);
                            }}
                            data-ocid={`admin.category.edit_button.${idx + 1}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(cat.id)}
                            data-ocid={`admin.category.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

type ProductForm = {
  name: string;
  description: string;
  mrp: string;
  discountAmount: string;
  categoryId: string;
  inStock: boolean;
  sizes: string[];
  colours: string[];
  image: Uint8Array | null;
  imageType: string;
};

const DEFAULT_FORM: ProductForm = {
  name: "",
  description: "",
  mrp: "",
  discountAmount: "0",
  categoryId: "",
  inStock: true,
  sizes: [],
  colours: [],
  image: null,
  imageType: "",
};

function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ProductForm>(DEFAULT_FORM);
  const [colourInput, setColourInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setColourInput("");
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      mrp: Number(p.mrp).toString(),
      discountAmount: Number(p.discountAmount).toString(),
      categoryId: p.categoryId.toString(),
      inStock: p.inStock,
      sizes: [...p.sizes],
      colours: [...p.colours],
      image: p.image,
      imageType: p.imageType,
    });
    setDialogOpen(true);
  };

  const toggleSize = (s: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s)
        ? f.sizes.filter((x) => x !== s)
        : [...f.sizes, s],
    }));
  };

  const addColour = () => {
    const c = colourInput.trim();
    if (!c || form.colours.includes(c)) return;
    setForm((f) => ({ ...f, colours: [...f.colours, c] }));
    setColourInput("");
  };

  const removeColour = (c: string) =>
    setForm((f) => ({ ...f, colours: f.colours.filter((x) => x !== c) }));

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await fileToUint8Array(file);
    setForm((f) => ({ ...f, image: result.bytes, imageType: result.type }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mrp || !form.categoryId) {
      toast.error("Please fill name, MRP and category");
      return;
    }
    const info = {
      name: form.name,
      description: form.description,
      mrp: BigInt(Math.round(Number(form.mrp))),
      discountAmount: BigInt(Math.round(Number(form.discountAmount) || 0)),
      categoryId: BigInt(form.categoryId),
      inStock: form.inStock,
      sizes: form.sizes,
      colours: form.colours,
      image: form.image ?? new Uint8Array(),
      imageType: form.imageType,
    };
    try {
      if (editingId !== null) {
        await updateProduct.mutateAsync({ id: editingId, info });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(info);
        toast.success("Product created");
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const effectivePrice = (p: any) => Number(p.mrp) - Number(p.discountAmount);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-gold uppercase tracking-widest">
          Products
        </h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(o) => {
            if (!o) resetForm();
            setDialogOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="btn-gold text-xs tracking-widest uppercase"
              data-ocid="admin.product.add.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-gold-border max-w-lg max-h-[90vh] overflow-y-auto"
            data-ocid="admin.product.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-serif text-gold uppercase tracking-widest">
                {editingId !== null ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Name *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1 bg-secondary border-gold-border"
                  data-ocid="admin.product.name.input"
                />
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1 bg-secondary border-gold-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    MRP (₹) *
                  </Label>
                  <Input
                    type="number"
                    value={form.mrp}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, mrp: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-gold-border"
                    data-ocid="admin.product.mrp.input"
                  />
                </div>
                <div>
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Discount (₹)
                  </Label>
                  <Input
                    type="number"
                    value={form.discountAmount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, discountAmount: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-gold-border"
                    data-ocid="admin.product.discount.input"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Category *
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, categoryId: v }))
                  }
                >
                  <SelectTrigger
                    className="mt-1 bg-secondary border-gold-border"
                    data-ocid="admin.product.category.select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-border">
                    {categories?.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Sizes */}
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                  Sizes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 text-xs border transition-all tracking-wider ${
                        form.sizes.includes(s)
                          ? "bg-gold text-background border-gold"
                          : "border-gold-border text-muted-foreground hover:border-gold"
                      }`}
                      data-ocid={`admin.product.size.${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Colours */}
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                  Colours
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={colourInput}
                    onChange={(e) => setColourInput(e.target.value)}
                    placeholder="e.g. Red"
                    className="bg-secondary border-gold-border h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addColour();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="btn-gold h-8 text-xs"
                    onClick={addColour}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.colours.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1 px-2 py-1 bg-secondary border border-gold-border text-xs text-gold"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => removeColour(c)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.inStock}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, inStock: v }))
                  }
                />
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  In Stock
                </Label>
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Product Image
                </Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  variant="outline"
                  className="mt-1 w-full border-gold-border text-muted-foreground hover:text-gold"
                  onClick={() => fileRef.current?.click()}
                  data-ocid="admin.product.image.upload_button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {form.image ? "Image Selected" : "Upload Image"}
                </Button>
              </div>
              <Button
                className="btn-gold tracking-widest uppercase"
                onClick={handleSubmit}
                disabled={createProduct.isPending || updateProduct.isPending}
                data-ocid="admin.product.submit.button"
              >
                {createProduct.isPending || updateProduct.isPending
                  ? "Saving..."
                  : editingId !== null
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="card-luxury overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold-border hover:bg-transparent">
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Image
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Name
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  MRP / Sale
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Sizes
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Stock
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!products?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No products yet
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p, idx) => {
                  const imgSrc = p.image?.length
                    ? uint8ToDataUrl(p.image, p.imageType)
                    : null;
                  return (
                    <TableRow
                      key={p.id.toString()}
                      className="border-gold-border"
                      data-ocid={`admin.product.item.${idx + 1}`}
                    >
                      <TableCell>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={p.name}
                            className="w-10 h-12 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-12 bg-muted" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground line-through text-xs">
                          {formatPrice(p.mrp)}
                        </span>
                        <br />
                        <span className="text-gold text-sm">
                          {formatPrice(effectivePrice(p))}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.sizes.join(", ") || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            p.inStock
                              ? "bg-green-900/30 text-green-400 border-green-800"
                              : "bg-red-900/30 text-red-400 border-red-800"
                          }
                        >
                          {p.inStock ? "In Stock" : "Out"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-muted-foreground hover:text-gold"
                            onClick={() => openEdit(p)}
                            data-ocid={`admin.product.edit_button.${idx + 1}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(p.id)}
                            data-ocid={`admin.product.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = useAllOrders();
  const { data: users } = useAllUsers();
  const updateStatus = useUpdateOrderStatus();

  const getUser = (userId: string) =>
    users?.find((u) => u.id.toString() === userId);

  return (
    <div>
      <h2 className="font-serif text-2xl text-gold uppercase tracking-widest mb-6">
        Orders
      </h2>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="card-luxury overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gold-border hover:bg-transparent">
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Customer
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  WhatsApp
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Amount
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Payment
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Location
                </TableHead>
                <TableHead className="text-gold-muted uppercase text-xs tracking-widest">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!orders?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No orders yet
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, idx) => {
                  const user = getUser(order.userId.toString());
                  return (
                    <TableRow
                      key={order.id}
                      className="border-gold-border"
                      data-ocid={`admin.order.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {user?.name ?? "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.whatsapp ?? "—"}
                      </TableCell>
                      <TableCell className="text-gold">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-secondary text-foreground border-gold-border">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                        {order.deliveryLocation || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            updateStatus.mutate({
                              orderId: order.id,
                              status: v,
                            })
                          }
                        >
                          <SelectTrigger className="h-7 text-xs bg-secondary border-gold-border w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-gold-border">
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function SchemesTab() {
  const { data: schemes, isLoading } = useSchemes();
  const createScheme = useCreateScheme();
  const deleteScheme = useDeleteScheme();
  const [form, setForm] = useState({
    title: "",
    description: "",
    couponCode: "",
  });

  const handleCreate = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      await createScheme.mutateAsync(form);
      setForm({ title: "", description: "", couponCode: "" });
      toast.success("Scheme added");
    } catch {
      toast.error("Failed to add scheme");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this scheme?")) return;
    try {
      await deleteScheme.mutateAsync(id);
      toast.success("Scheme deleted");
    } catch {
      toast.error("Failed to delete scheme");
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-gold uppercase tracking-widest mb-6">
        Schemes & Offers
      </h2>
      <div className="card-luxury p-6 mb-6 flex flex-col gap-4">
        <h3 className="text-sm tracking-widest uppercase text-muted-foreground">
          Add New Scheme
        </h3>
        <div>
          <Label className="text-xs tracking-widest uppercase text-muted-foreground">
            Title *
          </Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Summer Sale"
            className="mt-1 bg-secondary border-gold-border"
            data-ocid="admin.scheme.title.input"
          />
        </div>
        <div>
          <Label className="text-xs tracking-widest uppercase text-muted-foreground">
            Description
          </Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Scheme details..."
            className="mt-1 bg-secondary border-gold-border"
          />
        </div>
        <div>
          <Label className="text-xs tracking-widest uppercase text-muted-foreground">
            Coupon Code
          </Label>
          <Input
            value={form.couponCode}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                couponCode: e.target.value.toUpperCase(),
              }))
            }
            placeholder="e.g. SUMMER20"
            className="mt-1 bg-secondary border-gold-border font-mono"
            data-ocid="admin.scheme.coupon.input"
          />
        </div>
        <Button
          className="btn-gold tracking-widest uppercase self-start"
          onClick={handleCreate}
          disabled={createScheme.isPending}
          data-ocid="admin.scheme.add.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Scheme
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="flex flex-col gap-3">
          {!schemes?.length ? (
            <div className="card-luxury p-8 text-center text-muted-foreground">
              No schemes yet
            </div>
          ) : (
            schemes.map((s, idx) => (
              <div
                key={s.id.toString()}
                className="card-luxury p-4 flex items-center justify-between gap-4"
                data-ocid={`admin.scheme.item.${idx + 1}`}
              >
                <div className="flex-1">
                  <p className="font-serif text-gold">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.description}
                  </p>
                  {s.couponCode && (
                    <span className="font-mono text-xs text-gold border border-gold-border px-2 py-0.5 mt-1 inline-block">
                      {s.couponCode}
                    </span>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => handleDelete(s.id)}
                  data-ocid={`admin.scheme.delete.button.${idx + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const { data: settings, isLoading } = usePaymentSettings();
  const setSettings = useSetPaymentSettings();
  const [upiId, setUpiId] = useState("");
  const [qrImage, setQrImage] = useState<Uint8Array | null>(null);
  const [qrImageType, setQrImageType] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await fileToUint8Array(file);
    setQrImage(result.bytes);
    setQrImageType(result.type);
  };

  const handleSave = async () => {
    const id = upiId.trim() || settings?.upiId || "";
    if (!id) {
      toast.error("Please enter UPI ID");
      return;
    }
    try {
      await setSettings.mutateAsync({
        upiId: id,
        qrImage: qrImage ?? settings?.qrImage ?? new Uint8Array(),
        qrImageType: qrImageType || settings?.qrImageType || "",
      });
      toast.success("Payment settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const existingQr = settings?.qrImage?.length
    ? uint8ToDataUrl(settings.qrImage, settings.qrImageType)
    : null;

  return (
    <div className="max-w-lg">
      <h2 className="font-serif text-2xl text-gold uppercase tracking-widest mb-6">
        Payment Settings
      </h2>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="card-luxury p-6 flex flex-col gap-6">
          <div>
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              UPI ID
            </Label>
            <Input
              value={upiId || settings?.upiId || ""}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="mt-2 bg-secondary border-gold-border"
              data-ocid="admin.settings.upi.input"
            />
          </div>
          <div>
            <Label className="text-xs tracking-widest uppercase text-muted-foreground">
              GPay QR Code
            </Label>
            {existingQr && (
              <div className="mt-2 mb-3">
                <img
                  src={existingQr}
                  alt="Current QR"
                  className="w-32 h-32 object-contain border border-gold-border p-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current QR Code
                </p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              variant="outline"
              className="w-full border-gold-border text-muted-foreground hover:text-gold"
              onClick={() => fileRef.current?.click()}
              data-ocid="admin.settings.qr.upload_button"
            >
              <Upload className="w-4 h-4 mr-2" />
              {qrImage ? "New QR Selected" : "Upload QR Image"}
            </Button>
          </div>
          <Button
            className="btn-gold tracking-widest uppercase"
            onClick={handleSave}
            disabled={setSettings.isPending}
            data-ocid="admin.settings.save.button"
          >
            {setSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}
