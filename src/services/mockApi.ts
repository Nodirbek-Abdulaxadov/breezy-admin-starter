/**
 * Mock API — in-memory CRUD store.
 *
 * Simulates async REST endpoints with artificial latency so the app behaves
 * exactly as it would when talking to a real back-end.
 *
 * Endpoints mirrored:
 *   GET    /employees        → mockApi.employees.list()
 *   POST   /employees        → mockApi.employees.create(data)
 *   PUT    /employees/:id    → mockApi.employees.update(id, data)
 *   DELETE /employees/:id    → mockApi.employees.delete(id)
 */

import type { Employee } from "@/types/data";

// ─── helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise<void>((res) => setTimeout(res, ms));

let nextId = 6;

const seed: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Frontend Dev",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Backend Dev",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    role: "Product Manager",
    department: "Product",
    status: "Active",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    role: "Designer",
    department: "Design",
    status: "On Leave",
  },
  {
    id: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "Inactive",
  },
];

// Mutable in-memory store — persists for the lifetime of the browser session.
let store: Employee[] = [...seed];

// ─── API object ───────────────────────────────────────────────────────────────

export const mockApi = {
  employees: {
    /** GET /employees — returns a copy of all records */
    async list(): Promise<Employee[]> {
      await delay();
      return store.map((e) => ({ ...e }));
    },

    /** POST /employees — inserts a new record, returns it with a generated id */
    async create(data: Omit<Employee, "id">): Promise<Employee> {
      await delay();
      const newEmployee: Employee = { id: nextId++, ...data };
      store = [newEmployee, ...store];
      return { ...newEmployee };
    },

    /** PUT /employees/:id — replaces editable fields, returns updated record */
    async update(id: number, data: Omit<Employee, "id">): Promise<Employee> {
      await delay();
      const index = store.findIndex((e) => e.id === id);
      if (index === -1) throw new Error(`Employee #${id} not found`);
      store[index] = { id, ...data };
      return { ...store[index] };
    },

    /** DELETE /employees/:id — removes record, returns deleted id */
    async delete(id: number): Promise<{ id: number }> {
      await delay();
      const exists = store.some((e) => e.id === id);
      if (!exists) throw new Error(`Employee #${id} not found`);
      store = store.filter((e) => e.id !== id);
      return { id };
    },
  },
};

// ─── Real ↔ Mock toggle (future wiring) ───────────────────────────────────────
//
// Toggle between real API and mock via VITE_USE_MOCK_API.
// Services can use this pattern once real endpoints exist:
//
//   import { api, isMockMode } from "@/lib/api";
//   import { mockApi } from "@/services/mockApi";
//
//   const realEmployeesApi = {
//     list:   ()                              => api.get<Employee[]>("/employees"),
//     create: (data: Omit<Employee, "id">)    => api.post<Employee>("/employees", data),
//     update: (id: number, data: Omit<Employee, "id">) =>
//                                                api.put<Employee>(`/employees/${id}`, data),
//     delete: (id: number)                    => api.delete<{ id: number }>(`/employees/${id}`),
//   };
//
//   export const employees = isMockMode() ? mockApi.employees : realEmployeesApi;
//
// Left intentionally un-wired: real endpoints aren't implemented yet.
