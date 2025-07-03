"use client";

import { AppLayout } from "@/components/app/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronLeft, Loader2, Pencil, Trash2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableList,
  Table,
  TableResponseWithCounts,
} from "@/components/table/table-list";
import { Badge } from "@/components/ui/badge";

// Define UI state types as constants
const STATUS_TYPES = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

// Define the interface for a working router wrapper compatible with apiRequest
interface RouterWrapper {
  push: (url: string) => Promise<boolean | void>;
}

// Define the interface for a working router wrapper compatible with apiRequest
interface RouterWrapper {
  push: (url: string) => Promise<boolean | void>;
}

export default function EditTablePage() {
  const router = useRouter();
  const params = useParams();
  const tableId = params.id as string;

  // Create a router wrapper compatible with apiRequest
  const routerWrapper = useMemo<RouterWrapper>(
    () => ({
      push: async (url: string) => router.push(url),
    }),
    [router]
  );

  // Form state in a single consolidated object
  const [formData, setFormData] = useState<{
    number: string;
    name: string;
    capacity: string;
    status: string;
    area: string;
    is_active: boolean;
    notes: string;
  }>({
    number: "",
    name: "",
    capacity: "",
    status: "available",
    area: "",
    is_active: true,
    notes: "",
  });

  // Edit mode state to control form editing
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // UI state
  const [uiState, setUiState] = useState<{
    status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
    message: string | null;
    isSubmitting: boolean;
    isDeleting: boolean;
  }>({
    status: STATUS_TYPES.LOADING,
    message: null,
    isSubmitting: false,
    isDeleting: false,
  });
  // Lists state
  const [tablesList, setTablesList] = useState<
    TableResponseWithCounts | Table[]
  >([] as Table[]);
  const [loadingState, setLoadingState] = useState({
    tables: true,
    currentTable: true,
  });

  // Status options for the dropdown
  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "reserved", label: "Reserved" },
    { value: "inactive", label: "Inactive" },
  ];

  // Generic form field change handler for text fields
  const handleFieldChange = (
    field: string,
    value: string | boolean | number | null
  ) => {
    // Only update form data if in edit mode
    if (isEditMode) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle text input changes (number, name, area, notes)
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Clean field name (remove Edit suffix)
    const fieldName = id.replace(/Edit$/, "").toLowerCase();
    handleFieldChange(fieldName, value);
  };

  // Handle capacity input (integers only)
  const handleCapacityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow positive integers
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      handleFieldChange("capacity", value);
    }
  };

  // Show message (success or error)
  const showMessage = (type: "success" | "error", message: string) => {
    setUiState((prev) => ({
      ...prev,
      status: type === "success" ? STATUS_TYPES.SUCCESS : STATUS_TYPES.ERROR,
      message,
    }));

    // Auto-clear success messages after 3 seconds
    if (type === "success") {
      setTimeout(() => {
        setUiState((prev) => ({ ...prev, message: null }));
      }, 3000);
    }
  };

  // Fetch data functions  // Fetch all tables for the list
  const fetchTables = useCallback(async () => {
    try {
      setLoadingState((prev) => ({ ...prev, tables: true }));
      const data = await apiRequest<null, TableResponseWithCounts>(
        "management/table/?include_counts=true",
        routerWrapper,
        { method: "GET" },
        true
      );
      // Set the response data which includes counts
      setTablesList(
        data || {
          data: [],
          counts: {
            total: 0,
            available: 0,
            occupied: 0,
            reserved: 0,
            inactive: 0,
          },
        }
      );
    } catch (error) {
      console.error("Error loading tables:", error);
      // Set empty array on error
      setTablesList([] as Table[]);
    } finally {
      setLoadingState((prev) => ({ ...prev, tables: false }));
    }
  }, [routerWrapper]);
  // Fetch current table data
  const fetchCurrentTable = useCallback(async () => {
    if (!tableId) return;
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.LOADING,
      message: null,
    }));

    try {
      setLoadingState((prev) => ({ ...prev, currentTable: true }));
      const table = await apiRequest<null, Table>(
        `management/table/${tableId}/`,
        routerWrapper,
        { method: "GET" },
        true
      );

      // Populate form with table data
      setFormData({
        number: table.number,
        name: table.name || "",
        capacity: table.capacity.toString(),
        status: table.status,
        area: table.area || "",
        is_active: table.is_active,
        notes: table.notes || "",
      });
      setUiState((prev) => ({
        ...prev,
        status: STATUS_TYPES.SUCCESS,
        message: null,
      }));
    } catch (error) {
      console.error("Error fetching table:", error);
      setUiState({
        status: STATUS_TYPES.ERROR,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load table details",
        isSubmitting: false,
        isDeleting: false,
      });
    } finally {
      setLoadingState((prev) => ({ ...prev, currentTable: false }));
    }
  }, [tableId, routerWrapper]);

  // Load all data when component mounts
  useEffect(() => {
    // Load data in parallel for better performance
    Promise.all([fetchTables(), fetchCurrentTable()]);
  }, [fetchTables, fetchCurrentTable]);

  // Handle form submission to update table
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.number.trim()) {
      showMessage("error", "Table number is required");
      return;
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      showMessage("error", "Please enter a valid capacity greater than zero");
      return;
    }

    setUiState((prev) => ({
      ...prev,
      isSubmitting: true,
      message: null,
    }));

    try {
      // Prepare data for submission
      const submitData = {
        number: formData.number,
        name: formData.name,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        area: formData.area,
        is_active: formData.is_active,
        notes: formData.notes,
      };

      // Submit the update
      await apiRequest(
        `management/table/${tableId}/`,
        routerWrapper,
        {
          method: "PUT",
          data: submitData,
        },
        true
      );
      showMessage("success", "Table updated successfully");
      setIsEditMode(false); // Exit edit mode after successful update
      fetchTables(); // Refresh tables list
    } catch (error) {
      console.error("Update error:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred"
      );
    } finally {
      setUiState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle table deletion
  const handleDelete = async () => {
    if (!tableId) return;

    setUiState((prev) => ({
      ...prev,
      isDeleting: true,
      message: null,
    }));

    try {
      await apiRequest(
        `management/table/${tableId}/`,
        routerWrapper,
        { method: "DELETE" },
        true
      );

      showMessage("success", "Table deleted successfully! Redirecting...");
      // Redirect after a short delay so user can see the success message
      setTimeout(() => {
        router.push("/create/table");
      }, 1000);
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(
        "error",
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred"
      );
      setUiState((prev) => ({ ...prev, isDeleting: false }));
    }
  };
  // Handle clicking on a table in the list
  const handleTableClick = (table: Table) => {
    router.push(`/create/table/${table.id}`);
  };

  // Show loading state
  if (loadingState.currentTable || uiState.status === STATUS_TYPES.LOADING) {
    return (
      <AppLayout>
        <div className="px-4">
          <Breadcrumb
            items={[
              { label: "Create", href: "/create" },
              { label: "Tables", href: "/create/table" },
              { label: "Loading..." },
            ]}
            className="mb-4"
          />
        </div>
        <AnimatedCard
          variant="fadeIn"
          duration={0.4}
          className="flex flex-col items-center justify-center h-full p-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading table details...</p>
        </AnimatedCard>
      </AppLayout>
    );
  }

  // Show error state if table doesn't exist or couldn't be loaded
  if (uiState.status === STATUS_TYPES.ERROR || !formData.number) {
    return (
      <AppLayout>
        <div className="px-4">
          <Breadcrumb
            items={[
              { label: "Create", href: "/create" },
              { label: "Tables", href: "/create/table" },
              { label: "Error" },
            ]}
            className="mb-4"
          />
        </div>
        <AnimatedCard variant="fadeIn" duration={0.4} className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {uiState.message || "Table could not be found or loaded"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/create/table")} className="mt-4">
            Back to Tables
          </Button>
        </AnimatedCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-muted/20 to-background opacity-80 pointer-events-none z-0"></div>
        <div className="relative z-10">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Create", href: "/create" },
              { label: "Tables", href: "/create/table" },
              { label: `Table ${formData.number}` },
            ]}
            className="mb-4"
          />

          <AnimatedCard variant="fadeIn" duration={0.4}>
            <PageHeader
              title="Edit Table"
              description="Update the details of your restaurant table"
              className="mb-4"
              actions={
                <Button
                  variant="outline"
                  onClick={() => router.push("/create/table")}
                >
                  <ChevronLeft className="mr-2" />
                  Back to Tables
                </Button>
              }
            />
          </AnimatedCard>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6">
        {/* Left Column: Edit Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <AnimatedCard variant="slideUp" delay={0.1} duration={0.4}>
            <Card className="flex flex-col h-auto">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-2">
                  <div className="text-base sm:text-lg md:text-xl">
                    {isEditMode ? "Edit Table" : "Table Details"}:
                    <Badge
                      variant={"default"}
                      className="text-lg rounded-full ml-2"
                    >
                      {formData.number}
                    </Badge>
                  </div>
                  <div className="flex justify-start sm:justify-end gap-x-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant={isEditMode ? "outline" : "default"}
                      onClick={() => setIsEditMode(!isEditMode)}
                      disabled={uiState.isSubmitting || uiState.isDeleting}
                      size="sm"
                      className="h-9 px-3"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      {isEditMode ? "Cancel" : "Edit"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          type="button"
                          disabled={uiState.isSubmitting || uiState.isDeleting}
                          size="sm"
                          className="h-9"
                        >
                          {uiState.isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this table from your system.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Display message alert */}
                {uiState.message && (
                  <AnimatedCard variant="fadeIn" duration={0.3}>
                    <Alert
                      variant={
                        String(uiState.status) === String(STATUS_TYPES.ERROR)
                          ? "destructive"
                          : "default"
                      }
                      className="mb-4"
                    >
                      <AlertTitle>
                        {String(uiState.status) === String(STATUS_TYPES.ERROR)
                          ? "ERROR"
                          : "SUCCESS"}
                      </AlertTitle>
                      <AlertDescription>{uiState.message}</AlertDescription>
                    </Alert>
                  </AnimatedCard>
                )}
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberEdit">Table Number *</Label>
                      <Input
                        className={`mt-2 ${!isEditMode && "opacity-90"}`}
                        id="numberEdit"
                        type="text"
                        value={formData.number}
                        onChange={handleTextChange}
                        disabled={!isEditMode}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameEdit">Table Name</Label>
                      <Input
                        className={`mt-2 ${!isEditMode && "opacity-90"}`}
                        id="nameEdit"
                        type="text"
                        value={formData.name}
                        onChange={handleTextChange}
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacityEdit">Capacity *</Label>
                      <Input
                        className={`mt-2 ${!isEditMode && "opacity-90"}`}
                        id="capacityEdit"
                        type="text"
                        inputMode="numeric"
                        value={formData.capacity}
                        onChange={handleCapacityInput}
                        disabled={!isEditMode}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="statusEdit">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleFieldChange("status", value)
                        }
                        disabled={!isEditMode}
                      >
                        <SelectTrigger
                          id="statusEdit"
                          className={`mt-2 ${!isEditMode && "opacity-90"}`}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="areaEdit">Area</Label>
                    <Input
                      className={`mt-2 ${!isEditMode && "opacity-90"}`}
                      id="areaEdit"
                      type="text"
                      value={formData.area}
                      onChange={handleTextChange}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_activeEdit"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        handleFieldChange("is_active", checked)
                      }
                      disabled={!isEditMode}
                    />
                    <Label htmlFor="is_activeEdit" className="cursor-pointer">
                      {formData.is_active ? "Active" : "Inactive"}
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="notesEdit">Notes</Label>
                    <Textarea
                      className={`mt-2 ${!isEditMode && "opacity-90"}`}
                      id="notesEdit"
                      value={formData.notes}
                      onChange={handleTextChange}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="flex space-x-2">
                    {isEditMode && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              disabled={
                                uiState.isSubmitting || uiState.isDeleting
                              }
                            >
                              {uiState.isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Save Changes</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to save these changes to
                                the table?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  document.forms[0].dispatchEvent(
                                    new Event("submit", {
                                      bubbles: true,
                                      cancelable: true,
                                    })
                                  );
                                }}
                              >
                                Save
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => router.push("/create/table")}
                      type="button"
                      disabled={uiState.isSubmitting || uiState.isDeleting}
                    >
                      Back to Table Creation
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />
        {/* Right Column: Display All Tables */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <AnimatedCard variant="slideUp" delay={0.2} duration={0.4}>
            <Card className="h-auto">
              <CardHeader className="px-4 py-2 sm:px-6 sm:py-3">
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  All Tables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="px-3 sm:px-6 pb-4">
                    <TableList
                      tables={tablesList}
                      isLoading={loadingState.tables}
                      error={null}
                      title=""
                      highlightId={tableId}
                      onTableClick={handleTableClick}
                      showCounts={true}
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </AppLayout>
  );
}
