
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalPracticeManagementAPI } from '@/components/LegalPracticeManagementAPI';

const Index = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Legal Practice Management API</h1>
      <p className="text-gray-600 mb-8">A modern solution for legal case management built with NestJS and TypeScript</p>
      
      <Card className="mb-8 border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            My approach to building a scalable and maintainable API for legal practice management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalPracticeManagementAPI />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
