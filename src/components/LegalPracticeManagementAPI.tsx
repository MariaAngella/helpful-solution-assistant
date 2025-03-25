
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from '@/components/Code';
import { APIModules } from '@/components/APIModules';
import { DatabaseModel } from '@/components/DatabaseModel';
import { AuthComponents } from '@/components/AuthComponents';

export const LegalPracticeManagementAPI = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Modules</TabsTrigger>
          <TabsTrigger value="database">Database Models</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="code">Code Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Legal Practice Management API</h3>
            <p>This solution implements a RESTful API for a legal practice management system with the following features:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Cases Management:</strong> Create, update, retrieve, and delete legal cases</li>
              <li><strong>Time Tracking:</strong> Log and manage time entries associated with cases</li>
              <li><strong>Document Management:</strong> Store metadata for legal documents</li>
              <li><strong>User Management:</strong> Handle users with different roles and permissions</li>
              <li><strong>Authentication:</strong> JWT-based authentication with role-based access control</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <h4 className="font-medium mb-2">Technical Implementation</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>NestJS framework with TypeScript</li>
                <li>Modular architecture with dependency injection</li>
                <li>Repository pattern for data access</li>
                <li>Simulated Prisma ORM implementation</li>
                <li>JWT authentication with Guards for role-based access</li>
                <li>API documentation with Swagger</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <APIModules />
        </TabsContent>
        
        <TabsContent value="database" className="mt-6">
          <DatabaseModel />
        </TabsContent>
        
        <TabsContent value="auth" className="mt-6">
          <AuthComponents />
        </TabsContent>
        
        <TabsContent value="code" className="mt-6">
          <Code />
        </TabsContent>
      </Tabs>
    </div>
  );
};
