"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from "@/components/app/layout/app-layout";

// Define the VatTax interface based on the API response
interface VatTax {
  id: string;
  name: string;
  rate: number;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Define a router wrapper interface for apiRequest
interface RouterWrapper {
  push: (url: string) => Promise<boolean | void>;
}

const TaxSettingPage = () => {
  const router = useRouter();

  // Create a router wrapper for apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );

  // State for VAT taxes
  const [vatTaxes, setVatTaxes] = useState<VatTax[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modal forms
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTax, setSelectedTax] = useState<VatTax | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    rate: number;
    description: string;
    is_active: boolean;
  }>({
    name: "",
    rate: 0,
    description: "",
    is_active: true,
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // State for tax rules expansion
  const [isTaxRulesExpanded, setIsTaxRulesExpanded] = useState(false);

  // Fetch VAT taxes from the API
  const fetchVatTaxes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest<null, VatTax[]>(
        "settings/vat/",
        routerWrapper,
        { method: "GET" },
        true
      );
      setVatTaxes(data);
    } catch (error) {
      console.error("Error fetching VAT taxes:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unknown error occurred while fetching VAT taxes."
      );
    } finally {
      setIsLoading(false);
    }
  }, [routerWrapper]);

  // Load VAT taxes on component mount
  useEffect(() => {
    fetchVatTaxes();
  }, [fetchVatTaxes]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rate" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle switch toggle for is_active
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  // Open create form
  const handleOpenCreateForm = () => {
    setFormMode("create");
    setFormData({
      name: "",
      rate: 0,
      description: "",
      is_active: true,
    });
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };

  // Open edit form
  const handleOpenEditForm = (tax: VatTax) => {
    setFormMode("edit");
    setSelectedTax(tax);
    setFormData({
      name: tax.name,
      rate: tax.rate,
      description: tax.description,
      is_active: tax.is_active,
    });
    setFormError(null);
    setFormSuccess(null);
    setIsFormOpen(true);
  };
  // Handle form submission
  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // Check if we're trying to set this tax as active and handle the single active tax rule
      if (formData.is_active) {
        // First, deactivate any currently active taxes if necessary
        const activeTax = vatTaxes.find(
          (tax) =>
            tax.is_active &&
            (formMode === "edit" ? tax.id !== selectedTax?.id : true)
        );

        if (activeTax) {
          // Deactivate the currently active tax
          await apiRequest<{ is_active: boolean }, VatTax>(
            `settings/vat/${activeTax.id}/`,
            routerWrapper,
            {
              method: "PATCH",
              data: { is_active: false },
            },
            true
          );
        }
      }

      // Now proceed with the create or update
      if (formMode === "create") {
        // Create new VAT tax
        await apiRequest<typeof formData, VatTax>(
          "settings/vat/",
          routerWrapper,
          {
            method: "POST",
            data: formData,
          },
          true
        );
        setFormSuccess("VAT tax created successfully!");
      } else {
        // Update existing VAT tax
        if (!selectedTax) return;

        await apiRequest<typeof formData, VatTax>(
          `settings/vat/${selectedTax.id}/`,
          routerWrapper,
          {
            method: "PUT",
            data: formData,
          },
          true
        );
        setFormSuccess("VAT tax updated successfully!");
      }

      // Refresh the VAT taxes list
      await fetchVatTaxes();

      // Close the form after successful submission
      setTimeout(() => {
        setIsFormOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting VAT tax form:", error);
      setFormError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unknown error occurred while submitting the form."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation
  const handleOpenDeleteConfirm = (tax: VatTax) => {
    setSelectedTax(tax);
    setIsDeleteConfirmOpen(true);
  };

  // Handle delete VAT tax
  const handleDeleteVatTax = async () => {
    if (!selectedTax) return;

    setIsSubmitting(true);

    try {
      await apiRequest<null, null>(
        `settings/vat/${selectedTax.id}/`,
        routerWrapper,
        {
          method: "DELETE",
        },
        true
      );

      // Refresh the VAT taxes list
      await fetchVatTaxes();

      // Close the delete confirmation dialog
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting VAT tax:", error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unknown error occurred while deleting the VAT tax."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex  items-center justify-between space-y-4">
          <PageHeader
            title="Tax Settings"
            description="Manage Value Added Tax (VAT) settings for your products and services"
          />

          <div className="flex justify-end mb-4">
            <Button onClick={handleOpenCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New VAT
            </Button>
          </div>
        </div>        {/* Tax Rules Information Card */}
        <Card className="mb-6 border-primary/20">
          {" "}
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/5">
            {" "}
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Tax Rules and Guidelines
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-1 items-center"
              onClick={() => setIsTaxRulesExpanded(!isTaxRulesExpanded)}
            >
              {" "}
              {isTaxRulesExpanded ? (
                <>
                  <span>Hide Details</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show Details</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardHeader>
          {isTaxRulesExpanded && (
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-4">
                {" "}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    General Tax Rules
                  </h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Each tax rate must have a unique name for clear
                      identification.
                    </li>
                    <li>
                      Tax rates should be entered as percentages (e.g., 15.00
                      for 15%).
                    </li>
                    <li>
                      <strong>
                        Only one tax rate can be active at a time.
                      </strong>{" "}
                      This is a critical system requirement.
                    </li>
                    <li>
                      When you activate a new tax rate, any previously active
                      rate will be automatically deactivated.
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Best Practices
                  </h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Include descriptive names that clearly identify the tax
                      purpose.
                    </li>
                    <li>
                      Use the description field to add important details about
                      when to apply this tax rate.
                    </li>
                    <li>
                      Regularly review tax settings to ensure compliance with
                      local regulations.
                    </li>
                    <li>
                      Consider using standard names like &quot;Standard
                      VAT&quot;, &quot;Reduced VAT&quot;, etc. for consistency.
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Important Notes
                  </h4>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Changes to tax rates are immediately reflected in new
                      orders.
                    </li>
                    <li>
                      Deleting a tax rate that has been used in orders may
                      affect reporting accuracy.
                    </li>
                    <li>
                      Tax rates are applied according to the local tax
                      regulations of your business location.
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    How Tax Processing Works
                  </h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="mb-2">
                      The system processes tax in the following way:
                    </p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>
                        Only the <strong>single active tax rate</strong> is
                        applied to all orders.
                      </li>
                      <li>
                        When creating a new order, the system checks for the
                        currently active tax rate.
                      </li>
                      <li>
                        The tax amount is calculated as:{" "}
                        <code className="text-primary bg-primary/10 px-1 rounded">
                          Item Price × Tax Rate %
                        </code>
                        .
                      </li>
                      <li>
                        If you need to change the active tax rate, simply toggle
                        a different rate to active status.
                      </li>
                      <li>
                        Historical orders maintain the tax rate that was active
                        at the time of order creation.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          )}{" "}
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* VAT Taxes Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>VAT Tax Rates</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="loader">Loading...</div>
              </div>            ) : vatTaxes.length === 0 ? (              <div className="text-center py-8 space-y-6">
                <div className="text-muted-foreground px-4">
                  <p className="mb-2 font-medium text-foreground">No VAT taxes configured</p>
                  <p>Please review the Tax Rules and Guidelines above before creating a new tax configuration.</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setIsTaxRulesExpanded(true)}
                    className="flex items-center"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Read Tax Rules
                  </Button>
                  <Button
                    onClick={handleOpenCreateForm}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New VAT
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatTaxes.map((tax) => (
                      <TableRow key={tax.id}>
                        <TableCell className="font-medium">
                          {tax.name}
                        </TableCell>
                        <TableCell>{tax.rate}%</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {tax.description}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Badge
                            variant={tax.is_active ? "default" : "secondary"}
                          >
                            {tax.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditForm(tax)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenDeleteConfirm(tax)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* VAT Tax Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Create New VAT Tax" : "Edit VAT Tax"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Add a new VAT tax rate that will be applied to products and services."
                  : "Update the details of the existing VAT tax rate."}
              </DialogDescription>
            </DialogHeader>

            {formMode === "create" && !isTaxRulesExpanded && (
              <Alert className="bg-blue-50 border-blue-200 text-blue-700 mt-4">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700">Important</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Please review the Tax Rules and Guidelines before creating a new tax.{" "}
                  <button 
                    className="text-blue-900 underline font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFormOpen(false);
                      setIsTaxRulesExpanded(true);
                    }}
                  >
                    View Rules
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              {formSuccess && (
                <Alert variant="success" className="mb-4">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{formSuccess}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g., Standard VAT"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">
                  Rate (%)
                </Label>
                <Input
                  id="rate"
                  name="rate"
                  type="number"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="col-span-3"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Description of the VAT tax rate"
                />
              </div>{" "}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Active
                </Label>
                <div className="flex flex-col space-y-2 col-span-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      {formData.is_active ? "Active" : "Inactive"}
                    </Label>
                  </div>
                  {formData.is_active && (
                    <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Note:</strong> Only one tax rate can be active
                        at a time. Activating this tax rate will automatically
                        deactivate any currently active tax rate.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitForm}
                disabled={isSubmitting || !formData.name || formData.rate < 0}
              >
                {isSubmitting
                  ? "Submitting..."
                  : formMode === "create"
                  ? "Create"
                  : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                VAT tax &ldquo;{selectedTax?.name}&rdquo; and remove it from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteVatTax}
                className="bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default TaxSettingPage;
