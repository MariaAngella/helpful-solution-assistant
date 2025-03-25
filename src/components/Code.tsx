
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Code = () => {
  const [activeTab, setActiveTab] = useState<string>("controllers");

  const codeSnippets = {
    controllers: `
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CaseService } from './case.service';
import { CreateCaseDto, UpdateCaseDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cases')
@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  @Roles(UserRole.ATTORNEY, UserRole.PARALEGAL, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully' })
  async createCase(@Body() createCaseDto: CreateCaseDto) {
    return this.caseService.create(createCaseDto);
  }

  @Get()
  @Roles(UserRole.ATTORNEY, UserRole.PARALEGAL, UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all cases with optional filtering' })
  async getAllCases(
    @Query('status') status?: string,
    @Query('attorneyId') attorneyId?: string,
  ) {
    return this.caseService.findAll({ status, attorneyId });
  }

  @Get(':id')
  @Roles(UserRole.ATTORNEY, UserRole.PARALEGAL, UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a case by ID' })
  async getCaseById(@Param('id') id: string) {
    return this.caseService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ATTORNEY, UserRole.PARALEGAL, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a case' })
  async updateCase(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    return this.caseService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a case' })
  async deleteCase(@Param('id') id: string) {
    return this.caseService.remove(id);
  }
}`,

    services: `
import { Injectable, NotFoundException } from '@nestjs/common';
import { CaseRepository } from './case.repository';
import { CreateCaseDto, UpdateCaseDto } from './dto';
import { TimeEntryRepository } from '../time-entries/time-entry.repository';
import { DocumentRepository } from '../documents/document.repository';

@Injectable()
export class CaseService {
  constructor(
    private readonly caseRepository: CaseRepository,
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly documentRepository: DocumentRepository,
  ) {}

  async create(createCaseDto: CreateCaseDto) {
    return this.caseRepository.create(createCaseDto);
  }

  async findAll(filters: { status?: string; attorneyId?: string }) {
    return this.caseRepository.findMany({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.attorneyId && { attorneyId: filters.attorneyId }),
      },
      include: {
        client: true,
        attorney: true,
      },
    });
  }

  async findById(id: string) {
    const caseData = await this.caseRepository.findUnique({
      where: { id },
      include: {
        client: true,
        attorney: true,
      },
    });

    if (!caseData) {
      throw new NotFoundException(\`Case with ID \${id} not found\`);
    }

    // Get related time entries
    const timeEntries = await this.timeEntryRepository.findMany({
      where: { caseId: id },
    });

    // Get related documents
    const documents = await this.documentRepository.findMany({
      where: { caseId: id },
    });

    return {
      ...caseData,
      timeEntries,
      documents,
    };
  }

  async update(id: string, updateCaseDto: UpdateCaseDto) {
    await this.findById(id); // Check if exists
    return this.caseRepository.update({
      where: { id },
      data: updateCaseDto,
    });
  }

  async remove(id: string) {
    await this.findById(id); // Check if exists
    
    // Delete related time entries first
    await this.timeEntryRepository.deleteMany({
      where: { caseId: id },
    });
    
    // Delete related documents
    await this.documentRepository.deleteMany({
      where: { caseId: id },
    });
    
    // Finally delete the case
    return this.caseRepository.delete({
      where: { id },
    });
  }
}`,

    repositories: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCaseDto) {
    return this.prisma.case.create({
      data,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }) {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.case.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(params: { where: any; include?: any }) {
    const { where, include } = params;
    return this.prisma.case.findUnique({
      where,
      include,
    });
  }

  async update(params: { where: any; data: any }) {
    const { where, data } = params;
    return this.prisma.case.update({
      where,
      data,
    });
  }

  async delete(params: { where: any }) {
    const { where } = params;
    return this.prisma.case.delete({
      where,
    });
  }

  async deleteMany(params: { where: any }) {
    const { where } = params;
    return this.prisma.case.deleteMany({
      where,
    });
  }
}`,

    authentication: `
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { comparePasswords } from '../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Remove password from the returned user object
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }
}

// JWT Strategy implementation
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      ...user,
    };
  }
}

// Role Guard
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}`,

    dtos: `
// Case DTOs
export class CreateCaseDto {
  title: string;
  description: string;
  caseNumber: string;
  status: CaseStatus;
  type: CaseType;
  clientId: string;
  attorneyId: string;
  courtDetails?: string;
  filingDate: Date;
}

export class UpdateCaseDto {
  title?: string;
  description?: string;
  status?: CaseStatus;
  attorneyId?: string;
  courtDetails?: string;
}

// Time Entry DTOs
export class CreateTimeEntryDto {
  caseId: string;
  userId: string;
  description: string;
  date: Date;
  durationMinutes: number;
  billable: boolean;
  rate?: number;
}

export class UpdateTimeEntryDto {
  description?: string;
  durationMinutes?: number;
  billable?: boolean;
  rate?: number;
}

// Document DTOs
export class CreateDocumentDto {
  caseId: string;
  title: string;
  description?: string;
  type: DocumentType;
  fileLocation: string;
  uploadedBy: string;
  tags?: string[];
}

export class UpdateDocumentDto {
  title?: string;
  description?: string;
  type?: DocumentType;
  tags?: string[];
}

// User DTOs
export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  roles: UserRole[];
  phone?: string;
  address?: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  roles?: UserRole[];
  phone?: string;
  address?: string;
}

export class LoginDto {
  email: string;
  password: string;
}`,

    models: `
// Prisma schema equivalent
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
  clientId   String
  client     User      @relation("ClientToCases", fields: [clientId], references: [id])
  attorneyId String
  attorney   User      @relation("AttorneyToCases", fields: [attorneyId], references: [id])
  timeEntries TimeEntry[]
  documents   Document[]
}

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

enum UserRole {
  ADMIN
  ATTORNEY
  PARALEGAL
  CLIENT
}

enum CaseStatus {
  OPEN
  CLOSED
  PENDING
  ARCHIVED
}

enum CaseType {
  CIVIL
  CRIMINAL
  FAMILY
  CORPORATE
  INTELLECTUAL_PROPERTY
  REAL_ESTATE
  TAX
  IMMIGRATION
  OTHER
}

enum DocumentType {
  PLEADING
  CONTRACT
  CORRESPONDENCE
  EVIDENCE
  COURT_ORDER
  FORM
  MEMO
  OTHER
}`,

    prismaSimulation: `
import { Injectable, OnModuleInit } from '@nestjs/common';

// In-memory database simulation
interface DatabaseState {
  users: any[];
  cases: any[];
  timeEntries: any[];
  documents: any[];
}

@Injectable()
export class PrismaService implements OnModuleInit {
  private db: DatabaseState = {
    users: [],
    cases: [],
    timeEntries: [],
    documents: [],
  };

  async onModuleInit() {
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    // Seed users
    this.db.users = [
      {
        id: '1',
        email: 'admin@legalfirm.com',
        password: 'hashed_password_here',
        name: 'Admin User',
        roles: ['ADMIN'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'attorney@legalfirm.com',
        password: 'hashed_password_here',
        name: 'John Lawyer',
        roles: ['ATTORNEY'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        email: 'client@example.com',
        password: 'hashed_password_here',
        name: 'Client Smith',
        roles: ['CLIENT'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Seed cases
    this.db.cases = [
      {
        id: '1',
        title: 'Smith v. Johnson',
        description: 'Personal injury case',
        caseNumber: 'PI-2023-001',
        status: 'OPEN',
        type: 'CIVIL',
        courtDetails: 'Superior Court of California',
        filingDate: new Date(),
        clientId: '3',
        attorneyId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  // Simulated Prisma client
  user = {
    create: (params: any) => this.createRecord('users', params.data),
    findMany: (params: any) => this.findManyRecords('users', params),
    findUnique: (params: any) => this.findUniqueRecord('users', params),
    update: (params: any) => this.updateRecord('users', params),
    delete: (params: any) => this.deleteRecord('users', params),
    deleteMany: (params: any) => this.deleteManyRecords('users', params),
  };

  case = {
    create: (params: any) => this.createRecord('cases', params.data),
    findMany: (params: any) => this.findManyRecords('cases', params),
    findUnique: (params: any) => this.findUniqueRecord('cases', params),
    update: (params: any) => this.updateRecord('cases', params),
    delete: (params: any) => this.deleteRecord('cases', params),
    deleteMany: (params: any) => this.deleteManyRecords('cases', params),
  };

  timeEntry = {
    create: (params: any) => this.createRecord('timeEntries', params.data),
    findMany: (params: any) => this.findManyRecords('timeEntries', params),
    findUnique: (params: any) => this.findUniqueRecord('timeEntries', params),
    update: (params: any) => this.updateRecord('timeEntries', params),
    delete: (params: any) => this.deleteRecord('timeEntries', params),
    deleteMany: (params: any) => this.deleteManyRecords('timeEntries', params),
  };

  document = {
    create: (params: any) => this.createRecord('documents', params.data),
    findMany: (params: any) => this.findManyRecords('documents', params),
    findUnique: (params: any) => this.findUniqueRecord('documents', params),
    update: (params: any) => this.updateRecord('documents', params),
    delete: (params: any) => this.deleteRecord('documents', params),
    deleteMany: (params: any) => this.deleteManyRecords('documents', params),
  };

  private createRecord(table: keyof DatabaseState, data: any) {
    const id = data.id || String(this.db[table].length + 1);
    const newRecord = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.db[table].push(newRecord);
    return newRecord;
  }

  private findManyRecords(table: keyof DatabaseState, params: any = {}) {
    let result = [...this.db[table]];
    
    // Simple filtering
    if (params.where) {
      result = result.filter(record => {
        return Object.keys(params.where).every(key => {
          if (key.includes('.')) {
            // Handle nested property
            const [relation, property] = key.split('.');
            return record[relation] && record[relation][property] === params.where[key];
          }
          return record[key] === params.where[key];
        });
      });
    }
    
    // Pagination
    if (params.skip) {
      result = result.slice(params.skip);
    }
    
    if (params.take) {
      result = result.slice(0, params.take);
    }
    
    // Include related records
    if (params.include) {
      result = result.map(record => {
        const included = { ...record };
        
        for (const relationKey in params.include) {
          if (params.include[relationKey]) {
            if (relationKey === 'client' || relationKey === 'attorney') {
              included[relationKey] = this.db.users.find(user => user.id === record[relationKey + 'Id']);
            } else if (relationKey === 'timeEntries') {
              included[relationKey] = this.db.timeEntries.filter(entry => entry.caseId === record.id);
            } else if (relationKey === 'documents') {
              included[relationKey] = this.db.documents.filter(doc => doc.caseId === record.id);
            }
          }
        }
        
        return included;
      });
    }
    
    return result;
  }

  private findUniqueRecord(table: keyof DatabaseState, params: any) {
    if (params.where.id) {
      const record = this.db[table].find(item => item.id === params.where.id);
      
      if (record && params.include) {
        const result = { ...record };
        
        for (const relationKey in params.include) {
          if (params.include[relationKey]) {
            if (relationKey === 'client' || relationKey === 'attorney') {
              result[relationKey] = this.db.users.find(user => user.id === record[relationKey + 'Id']);
            } else if (relationKey === 'timeEntries') {
              result[relationKey] = this.db.timeEntries.filter(entry => entry.caseId === record.id);
            } else if (relationKey === 'documents') {
              result[relationKey] = this.db.documents.filter(doc => doc.caseId === record.id);
            }
          }
        }
        
        return result;
      }
      
      return record;
    }
    
    if (params.where.email) {
      return this.db[table].find(item => item.email === params.where.email);
    }
    
    if (params.where.caseNumber) {
      return this.db[table].find(item => item.caseNumber === params.where.caseNumber);
    }
    
    return null;
  }

  private updateRecord(table: keyof DatabaseState, params: any) {
    const recordIndex = this.db[table].findIndex(item => item.id === params.where.id);
    
    if (recordIndex !== -1) {
      this.db[table][recordIndex] = {
        ...this.db[table][recordIndex],
        ...params.data,
        updatedAt: new Date(),
      };
      
      return this.db[table][recordIndex];
    }
    
    return null;
  }

  private deleteRecord(table: keyof DatabaseState, params: any) {
    const recordIndex = this.db[table].findIndex(item => item.id === params.where.id);
    
    if (recordIndex !== -1) {
      const [removed] = this.db[table].splice(recordIndex, 1);
      return removed;
    }
    
    return null;
  }

  private deleteManyRecords(table: keyof DatabaseState, params: any) {
    const initialCount = this.db[table].length;
    
    this.db[table] = this.db[table].filter(item => {
      return !Object.keys(params.where).every(key => 
        item[key] === params.where[key]
      );
    });
    
    return { count: initialCount - this.db[table].length };
  }
}`,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Code Implementation</h3>

      <Tabs defaultValue="controllers" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="controllers">Controllers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="authentication">Auth</TabsTrigger>
          <TabsTrigger value="dtos">DTOs</TabsTrigger>
          <TabsTrigger value="prismaSimulation">Prisma Simulation</TabsTrigger>
        </TabsList>

        {Object.entries(codeSnippets).map(([key, code]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-sm overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
