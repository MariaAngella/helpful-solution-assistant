
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DatabaseModel = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Database Models</h3>
      <p className="text-muted-foreground mb-4">The system uses the following data models with relationships between entities:</p>
      
      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="timeEntries">Time Entries</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cases">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Case Model</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Basic Properties</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">id</span> - UUID primary key</li>
                      <li><span className="font-mono bg-muted px-1">title</span> - Case title</li>
                      <li><span className="font-mono bg-muted px-1">description</span> - Full description</li>
                      <li><span className="font-mono bg-muted px-1">caseNumber</span> - Unique identifier</li>
                      <li><span className="font-mono bg-muted px-1">status</span> - OPEN, CLOSED, PENDING, ARCHIVED</li>
                      <li><span className="font-mono bg-muted px-1">type</span> - Category of the case</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Additional Fields</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">courtDetails</span> - Court information</li>
                      <li><span className="font-mono bg-muted px-1">filingDate</span> - When the case was filed</li>
                      <li><span className="font-mono bg-muted px-1">createdAt</span> - Timestamp</li>
                      <li><span className="font-mono bg-muted px-1">updatedAt</span> - Last modified</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Relationships</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">client</span> - User relation (Client)</li>
                      <li><span className="font-mono bg-muted px-1">attorney</span> - User relation (Attorney)</li>
                      <li><span className="font-mono bg-muted px-1">timeEntries</span> - Has many time entries</li>
                      <li><span className="font-mono bg-muted px-1">documents</span> - Has many documents</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md mt-4 text-xs font-mono">
                  <pre>{`
model Case {
  id           String     @id @default(uuid())
  title        String
  description  String
  caseNumber   String     @unique
  status       CaseStatus @default(OPEN)
  type         CaseType
  courtDetails String?
  filingDate   DateTime
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relations
  clientId    String
  client      User       @relation("ClientToCases", fields: [clientId], references: [id])
  attorneyId  String
  attorney    User       @relation("AttorneyToCases", fields: [attorneyId], references: [id])
  timeEntries TimeEntry[]
  documents   Document[]
}
                  `}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeEntries">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Time Entry Model</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Properties</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">id</span> - UUID primary key</li>
                      <li><span className="font-mono bg-muted px-1">description</span> - Work description</li>
                      <li><span className="font-mono bg-muted px-1">date</span> - When work was performed</li>
                      <li><span className="font-mono bg-muted px-1">durationMinutes</span> - Time spent</li>
                      <li><span className="font-mono bg-muted px-1">billable</span> - If client can be billed</li>
                      <li><span className="font-mono bg-muted px-1">rate</span> - Optional hourly rate</li>
                      <li><span className="font-mono bg-muted px-1">createdAt</span> - Timestamp</li>
                      <li><span className="font-mono bg-muted px-1">updatedAt</span> - Last modified</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Relationships</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">case</span> - Related legal case</li>
                      <li><span className="font-mono bg-muted px-1">user</span> - User who logged the time</li>
                    </ul>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Business Rules</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Time entries can be added by attorneys and paralegals</li>
                      <li>Rates are applied based on user's role and case type</li>
                      <li>Time entries can be marked as billable or non-billable</li>
                      <li>Time reports can be generated per case, user, or date range</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md mt-4 text-xs font-mono">
                  <pre>{`
model TimeEntry {
  id              String   @id @default(uuid())
  description     String
  date            DateTime
  durationMinutes Int
  billable        Boolean  @default(true)
  rate            Float?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  caseId    String
  case      Case     @relation(fields: [caseId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
                  `}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Document Model</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Properties</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">id</span> - UUID primary key</li>
                      <li><span className="font-mono bg-muted px-1">title</span> - Document title</li>
                      <li><span className="font-mono bg-muted px-1">description</span> - Optional details</li>
                      <li><span className="font-mono bg-muted px-1">type</span> - Document category</li>
                      <li><span className="font-mono bg-muted px-1">fileLocation</span> - Storage path</li>
                      <li><span className="font-mono bg-muted px-1">tags</span> - Array of searchable tags</li>
                      <li><span className="font-mono bg-muted px-1">createdAt</span> - Timestamp</li>
                      <li><span className="font-mono bg-muted px-1">updatedAt</span> - Last modified</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Relationships</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">case</span> - Related legal case</li>
                      <li><span className="font-mono bg-muted px-1">uploader</span> - User who uploaded document</li>
                    </ul>
                    
                    <h4 className="text-sm font-medium mt-4 mb-2">Document Types</h4>
                    <ul className="space-y-2 text-sm">
                      <li>PLEADING - Court filings</li>
                      <li>CONTRACT - Agreements</li>
                      <li>CORRESPONDENCE - Letters, emails</li>
                      <li>EVIDENCE - Case evidence</li>
                      <li>COURT_ORDER - Judicial orders</li>
                      <li>FORM - Standard forms</li>
                      <li>MEMO - Internal memos</li>
                      <li>OTHER - Miscellaneous</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md mt-4 text-xs font-mono">
                  <pre>{`
model Document {
  id           String       @id @default(uuid())
  title        String
  description  String?
  type         DocumentType
  fileLocation String
  tags         String[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Relations
  caseId      String
  case        Case      @relation(fields: [caseId], references: [id])
  uploadedBy  String
  uploader    User      @relation("UploadedByUser", fields: [uploadedBy], references: [id])
}
                  `}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">User Model</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Properties</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">id</span> - UUID primary key</li>
                      <li><span className="font-mono bg-muted px-1">email</span> - Unique email</li>
                      <li><span className="font-mono bg-muted px-1">password</span> - Hashed password</li>
                      <li><span className="font-mono bg-muted px-1">name</span> - Full name</li>
                      <li><span className="font-mono bg-muted px-1">roles</span> - Array of roles</li>
                      <li><span className="font-mono bg-muted px-1">phone</span> - Optional contact</li>
                      <li><span className="font-mono bg-muted px-1">address</span> - Optional address</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Relationships</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">cases</span> - Cases as attorney</li>
                      <li><span className="font-mono bg-muted px-1">clientCases</span> - Cases as client</li>
                      <li><span className="font-mono bg-muted px-1">timeEntries</span> - Time logged by user</li>
                      <li><span className="font-mono bg-muted px-1">documents</span> - Documents uploaded</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">User Roles</h4>
                    <ul className="space-y-2 text-sm">
                      <li><span className="font-mono bg-muted px-1">ADMIN</span> - Full system access</li>
                      <li><span className="font-mono bg-muted px-1">ATTORNEY</span> - Manages cases</li>
                      <li><span className="font-mono bg-muted px-1">PARALEGAL</span> - Assists attorneys</li>
                      <li><span className="font-mono bg-muted px-1">CLIENT</span> - Limited case access</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md mt-4 text-xs font-mono">
                  <pre>{`
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  name      String
  roles     UserRole[]
  phone     String?
  address   String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  // Relations
  cases        Case[]         @relation("AttorneyToCases")
  clientCases  Case[]         @relation("ClientToCases")
  timeEntries  TimeEntry[]
  documents    Document[]     @relation("UploadedByUser")
}

enum UserRole {
  ADMIN
  ATTORNEY
  PARALEGAL
  CLIENT
}
                  `}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
