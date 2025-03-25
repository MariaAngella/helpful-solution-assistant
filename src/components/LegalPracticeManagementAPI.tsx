
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from '@/components/Code';
import { APIModules } from '@/components/APIModules';
import { DatabaseModel } from '@/components/DatabaseModel';
import { AuthComponents } from '@/components/AuthComponents';
import { BookOpen, Code as CodeIcon, Database, Key, LayoutGrid } from 'lucide-react';

export const LegalPracticeManagementAPI = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <LayoutGrid size={16} />
            <span>API Design</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database size={16} />
            <span>Data Models</span>
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Key size={16} />
            <span>Auth Strategy</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <CodeIcon size={16} />
            <span>Implementation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Legal Practice Management API</h3>
            <p className="text-gray-700">For this challenge, I've built a RESTful API that provides the core functionality needed to manage a legal practice:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-indigo-700 mb-2">Cases Management</h4>
                <p className="text-gray-600">Complete CRUD operations for legal cases with filtering, sorting, and pagination. Cases connect to clients, attorneys, and other related entities.</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-indigo-700 mb-2">Time Tracking</h4>
                <p className="text-gray-600">Robust time entry system for billing and productivity tracking, with detailed reporting capabilities and case association.</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-indigo-700 mb-2">Document Management</h4>
                <p className="text-gray-600">Manage document metadata with versioning support, search functionality, and integration with case records.</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-lg text-indigo-700 mb-2">User & Access Control</h4>
                <p className="text-gray-600">Role-based access control for different user types (admin, attorney, paralegal, client) with granular permissions.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-md mt-6 border-l-4 border-indigo-500">
              <h4 className="font-medium mb-3">Technical Approach</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
                  <span>Built with <span className="font-semibold">NestJS</span> to leverage its modular architecture and dependency injection</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
                  <span>Utilized <span className="font-semibold">TypeScript</span> for type safety and improved developer experience</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
                  <span>Implemented a simulated <span className="font-semibold">Prisma ORM</span> with the repository pattern for clean data access</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
                  <span>Secured with <span className="font-semibold">JWT authentication</span> and role-based guards</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
                  <span>Documented with <span className="font-semibold">Swagger</span> for API exploration and testing</span>
                </li>
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
