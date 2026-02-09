"use client";

import { Plus, Tag } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SectionHeader } from "@/src/components/ui/section-header";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";

import { createPartnerCategory, getPartnerCategories } from "@/services/partner";

const PAGE_SIZE = 8;

export default function PartnerCategoriesPage() {
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const authKey = useSyncExternalStore(
    (listener) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    },
    () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("auth_user_id") || localStorage.getItem("auth_token");
    },
    () => null
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["partner-categories", authKey, pageNumber, PAGE_SIZE],
    queryFn: () => getPartnerCategories(pageNumber, PAGE_SIZE),
    enabled: Boolean(authKey),
  });

  const categories = data?.categories ?? [];
  const pagination = data?.pagination;
  const isBusy = isLoading || isFetching;

  const canPrev = pagination ? !pagination.first : pageNumber > 1;
  const canNext = pagination ? !pagination.last : categories.length === PAGE_SIZE;

  const metaText = useMemo(() => {
    if (!pagination) return "Loading category totals...";
    return `Showing page ${pagination.currentPage} of ${pagination.totalPages} · ${pagination.totalElements} total`;
  }, [pagination]);

  const createMutation = useMutation({
    mutationFn: (name: string) => createPartnerCategory(name),
    onSuccess: () => {
      setCategoryName("");
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["partner-categories"] });
      toast.success("Category created.");
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to create category";
      setFormError(message);
      toast.error(message);
    },
  });

  const onCreateCategory = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) {
      setFormError("Category name is required.");
      toast.info("Enter a category name.");
      return;
    }
    setFormError(null);
    createMutation.mutate(trimmed);
  };

  return (
    <div className="relative p-6 space-y-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <SectionHeader
        title="Categories"
        description="Organize product groups, promotions, and shelf visibility."
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={onCreateCategory}
            disabled={createMutation.isPending}
            isLoading={createMutation.isPending}
            leftIcon={!createMutation.isPending ? <Plus className="h-4 w-4" /> : undefined}
          >
            Add category
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Category list</CardTitle>
                <CardDescription>{metaText}</CardDescription>
              </div>
              <Badge variant="info">{pagination?.totalElements ?? 0} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isBusy ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`category-skeleton-${idx}`} className="h-16" />
                ))}
              </div>
            ) : categories.length ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <div>
                      <p className="text-body font-semibold text-text">{category.name}</p>
                      <p className="text-caption text-text-muted">
                        Created {category.createdDate} · Updated {category.updatedDate}
                      </p>
                    </div>
                    <Badge variant="neutral">#{category.id}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Tag className="h-5 w-5" />}
                title="No categories yet"
                description="Create your first category to keep products organized."
                action={
                  <Button variant="primary" size="sm" onClick={onCreateCategory}>
                    Add first category
                  </Button>
                }
              />
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={!canPrev || isBusy}
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <div className="text-caption text-text-muted">
              Page {pagination?.currentPage ?? pageNumber}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!canNext || isBusy}
              onClick={() => setPageNumber((prev) => prev + 1)}
            >
              Next
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create category</CardTitle>
            <CardDescription>Add a new group for products and promotions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-caption font-medium text-text">Category name</label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Snacks, Beverages"
                disabled={createMutation.isPending}
              />
            </div>
            {formError && (
              <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-caption text-danger">
                {formError}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={onCreateCategory}
              disabled={createMutation.isPending}
              isLoading={createMutation.isPending}
              leftIcon={!createMutation.isPending ? <Plus className="h-4 w-4" /> : undefined}
            >
              Create category
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
