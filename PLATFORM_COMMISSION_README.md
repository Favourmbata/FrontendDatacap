{
  "name": "Platform Commission Management",
  "description": "Manage platform commissions for categories and industries",
  "features": [
    "Create platform commissions with commission rates",
    "List and filter platform commissions",
    "Edit existing platform commissions",
    "View detailed platform commission information",
    "Delete platform commissions",
    "Toggle commission status (active/inactive)",
    "Export platform commissions data",
    "Filter by industry and category"
  ],
  "api_endpoints": {
    "POST": "/api/super-admin/platform-commissions",
    "GET": "/api/super-admin/platform-commissions",
    "GET_by_id": "/api/super-admin/platform-commissions/:id",
    "GET_by_category": "/api/super-admin/platform-commissions/category/:categoryId",
    "PUT": "/api/super-admin/platform-commissions/:id",
    "DELETE": "/api/super-admin/platform-commissions/:id",
    "EXPORT": "/api/super-admin/platform-commissions/export/:format"
  },
  "components": {
    "list": "src/modules/super-admin/platform-commission/list.tsx",
    "create": "src/modules/super-admin/platform-commission/create.tsx",
    "edit": "src/modules/super-admin/platform-commission/edit.tsx",
    "view": "src/modules/super-admin/platform-commission/view.tsx"
  },
  "services": {
    "service": "src/services/PlatformCommissionService.ts",
    "types": "src/types/platformCommission.ts"
  }
}