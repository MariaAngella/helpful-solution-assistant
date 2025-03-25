
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, Clock, Users, Briefcase } from 'lucide-react';

export const APIModules = () => {
  const [openModule, setOpenModule] = React.useState<string | null>("cases");

  const toggleModule = (module: string) => {
    setOpenModule(openModule === module ? null : module);
  };

  const modules = [
    {
      id: "cases",
      title: "Cases Module",
      icon: <Briefcase className="h-5 w-5" />,
      description: "Manages legal cases and related data",
      endpoints: [
        { method: "GET", path: "/cases", description: "List all cases with filtering options" },
        { method: "GET", path: "/cases/:id", description: "Get a specific case by ID" },
        { method: "POST", path: "/cases", description: "Create a new case" },
        { method: "PUT", path: "/cases/:id", description: "Update an existing case" },
        { method: "DELETE", path: "/cases/:id", description: "Delete a case" }
      ],
      roles: ["ADMIN", "ATTORNEY", "PARALEGAL", "CLIENT (read-only)"]
    },
    {
      id: "timeEntries",
      title: "Time Tracking Module",
      icon: <Clock className="h-5 w-5" />,
      description: "Records billable and non-billable time spent on cases",
      endpoints: [
        { method: "GET", path: "/time-entries", description: "List all time entries with filtering" },
        { method: "GET", path: "/time-entries/:id", description: "Get a specific time entry" },
        { method: "GET", path: "/cases/:caseId/time-entries", description: "Get time entries for a case" },
        { method: "POST", path: "/time-entries", description: "Create a new time entry" },
        { method: "PUT", path: "/time-entries/:id", description: "Update a time entry" },
        { method: "DELETE", path: "/time-entries/:id", description: "Delete a time entry" }
      ],
      roles: ["ADMIN", "ATTORNEY", "PARALEGAL"]
    },
    {
      id: "documents",
      title: "Document Management Module",
      icon: <FileText className="h-5 w-5" />,
      description: "Handles document metadata storage and retrieval",
      endpoints: [
        { method: "GET", path: "/documents", description: "List all documents with filtering" },
        { method: "GET", path: "/documents/:id", description: "Get a specific document" },
        { method: "GET", path: "/cases/:caseId/documents", description: "Get documents for a case" },
        { method: "POST", path: "/documents", description: "Create a new document record" },
        { method: "PUT", path: "/documents/:id", description: "Update document metadata" },
        { method: "DELETE", path: "/documents/:id", description: "Delete a document record" }
      ],
      roles: ["ADMIN", "ATTORNEY", "PARALEGAL", "CLIENT (read-only)"]
    },
    {
      id: "users",
      title: "User Management Module",
      icon: <Users className="h-5 w-5" />,
      description: "Manages users and their roles",
      endpoints: [
        { method: "GET", path: "/users", description: "List all users with filtering" },
        { method: "GET", path: "/users/:id", description: "Get a specific user" },
        { method: "POST", path: "/users", description: "Create a new user" },
        { method: "PUT", path: "/users/:id", description: "Update user information" },
        { method: "DELETE", path: "/users/:id", description: "Delete a user" }
      ],
      roles: ["ADMIN only (full access)", "Users can view/edit their own profiles"]
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">API Modules</h3>
      <p className="text-muted-foreground">The API is organized into these core modules:</p>
      
      <div className="grid gap-4 mt-4">
        {modules.map((module) => (
          <Card key={module.id} className={openModule === module.id ? "border-primary" : ""}>
            <Collapsible
              open={openModule === module.id}
              onOpenChange={() => toggleModule(module.id)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.icon}
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                  {openModule === module.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="mb-3 text-muted-foreground">{module.description}</p>
                  
                  <h4 className="font-medium mt-4 mb-2">Endpoints:</h4>
                  <div className="space-y-2">
                    {module.endpoints.map((endpoint, i) => (
                      <div key={i} className="flex items-start">
                        <span className={`inline-block w-16 font-mono text-xs px-2 py-1 rounded-md mr-2
                          ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                            endpoint.method === 'POST' ? 'bg-green-100 text-green-800' : 
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' : 
                            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {endpoint.method}
                        </span>
                        <div>
                          <p className="font-mono text-sm">{endpoint.path}</p>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="font-medium mt-4 mb-2">Access Control:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {module.roles.map((role, i) => (
                      <li key={i}>{role}</li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};
