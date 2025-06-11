def tenant_context(request):
    """
    Add the current tenant to the template context.
    """
    return {"tenant": getattr(request, "tenant", None)}
