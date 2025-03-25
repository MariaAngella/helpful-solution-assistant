
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalPracticeManagementAPI } from '@/components/LegalPracticeManagementAPI';

const Index = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Legal Practice Management API Challenge</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technical Challenge Solution</CardTitle>
          <CardDescription>NestJS, TypeScript, and Simulated Prisma ORM</CardDescription>
        </CardHeader>
        <CardContent>
          <LegalPracticeManagementAPI />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
