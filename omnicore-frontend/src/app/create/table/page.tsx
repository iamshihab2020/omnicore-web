"use client";

import { AppLayout } from "@/components/app/app-layout";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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

export default function CreateTablePage() {
  const router = useRouter();

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
    capacity: "4",
    status: "available",
    area: "",
    is_active: true,
    notes: "",
  });

  // UI state
  const [uiState, setUiState] = useState<{
    status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
    message: string | null;
    isSubmitting: boolean;
  }>({
    status: STATUS_TYPES.SUCCESS,
    message: null,
    isSubmitting: false,
  });
  // Tables list state
  const [tablesList, setTablesList] = useState<
    TableResponseWithCounts | Table[]
  >([] as Table[]);
  const [loadingState, setLoadingState] = useState({
    tables: true,
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle text input changes (number, name, area, notes)
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Clean field name (remove table prefix)
    const fieldName = id.replace(/^table/, "").toLowerCase();
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
  }; // Fetch tables for the list
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
      showMessage(
        "error",
        error instanceof Error
          ? `Error loading tables: ${error.message}`
          : "An unknown error occurred while loading tables."
      );
      // Set empty array on error
      setTablesList([] as Table[]);
    } finally {
      setLoadingState((prev) => ({ ...prev, tables: false }));
    }
  }, [routerWrapper]);

  // Initialize form and data when component mounts
  useEffect(() => {
    // Reset UI state to initial state
    setUiState((prev) => ({
      ...prev,
      status: STATUS_TYPES.SUCCESS,
      message: null,
    }));

    // Load data
    fetchTables();
  }, [fetchTables]);

  // Handle form submission to create table
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous messages
    setUiState((prev) => ({ ...prev, message: null }));

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

      // Submit the create request
      await apiRequest(
        "management/table/",
        routerWrapper,
        {
          method: "POST",
          data: submitData,
        },
        true
      );

      showMessage("success", "Table created successfully!");

      // Reset form after successful creation
      setFormData({
        number: "",
        name: "",
        capacity: "4",
        status: "available",
        area: "",
        is_active: true,
        notes: "",
      });

      // Refresh tables list
      fetchTables();
    } catch (error) {
      console.error("Create error:", error);
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
  // Handle clicking on a table in the list
  const handleTableClick = (table: Table) => {
    router.push(`/create/table/${table.id}`);
  };

  return (
    <AppLayout>
      <div className="px-4">
        <PageHeader
          title="Create Table"
          description="Add new tables to your restaurant."
          className="mb-4"
          actions={
            <Button variant="outline" onClick={() => router.push("/create")}>
              <ChevronLeft className="mr-2" />
              Back to Create
            </Button>
          }
        />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 p-4 gap-6">
        {/* Left Column: Create Table Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="flex flex-col h-auto">
            <CardHeader>
              <CardTitle>Create Table</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Display message alert */}
              {uiState.message && (
                <Alert
                  variant={
                    uiState.status === STATUS_TYPES.ERROR
                      ? "destructive"
                      : "default"
                  }
                  className="mb-4"
                >
                  <AlertTitle>
                    {uiState.status === STATUS_TYPES.ERROR
                      ? "ERROR"
                      : "SUCCESS"}
                  </AlertTitle>
                  <AlertDescription>{uiState.message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tableNumber">Table Number *</Label>
                    <Input
                      className="mt-2"
                      id="tableNumber"
                      type="text"
                      value={formData.number}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableName">Table Name (Optional)</Label>
                    <Input
                      className="mt-2"
                      id="tableName"
                      type="text"
                      value={formData.name}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tableCapacity">Capacity *</Label>
                    <Input
                      className="mt-2"
                      id="tableCapacity"
                      type="text"
                      inputMode="numeric"
                      value={formData.capacity}
                      onChange={handleCapacityInput}
                      placeholder="4"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableStatus">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleFieldChange("status", value)
                      }
                    >
                      <SelectTrigger id="tableStatus" className="mt-2">
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
                  <Label htmlFor="tableArea">Area (Optional)</Label>
                  <Input
                    className="mt-2"
                    id="tableArea"
                    type="text"
                    value={formData.area}
                    onChange={handleTextChange}
                    placeholder="e.g., Main Hall, Patio"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="tableIsActive"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      handleFieldChange("is_active", checked)
                    }
                  />
                  <Label htmlFor="tableIsActive" className="cursor-pointer">
                    {formData.is_active ? "Active" : "Inactive"}
                  </Label>
                </div>
                <div>
                  <Label htmlFor="tableNotes">Notes (Optional)</Label>
                  <Textarea
                    className="mt-2"
                    id="tableNotes"
                    value={formData.notes}
                    onChange={handleTextChange}
                    placeholder="Any additional details about the table"
                  />
                </div>
                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" disabled={uiState.isSubmitting}>
                        {uiState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Table
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Create New Table</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to create this new restaurant
                          table?
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
                          Create
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/create")}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <Separator className="my-6 lg:hidden" />

        {/* Right Column: Display All Tables */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <Card className="h-auto">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">All Tables</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-290px)]">
                <div className="px-3 sm:px-6 pb-4">
                  <TableList
                    tables={tablesList}
                    isLoading={loadingState.tables}
                    error={null}
                    title=""
                    onTableClick={handleTableClick}
                    showCounts={true}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
