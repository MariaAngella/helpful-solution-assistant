import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthComponents = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Authentication & Authorization</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>JWT Authentication</CardTitle>
            <CardDescription>Secure token-based authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">Authentication Flow:</span>
                <span className="text-sm text-muted-foreground">1. User provides credentials</span>
                <span className="text-sm text-muted-foreground">2. Server validates credentials</span>
                <span className="text-sm text-muted-foreground">3. JWT token issued with role info</span>
                <span className="text-sm text-muted-foreground">4. Token sent with each request</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Security Features:</span>
                <span className="text-sm text-muted-foreground">• Token expiration</span>
                <span className="text-sm text-muted-foreground">• Refresh token mechanism</span>
                <span className="text-sm text-muted-foreground">• HTTPS transport only</span>
                <span className="text-sm text-muted-foreground">• Password hashing with bcrypt</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Implementation:</span>
                <span className="text-sm text-muted-foreground">• NestJS Guards and Passport.js</span>
                <span className="text-sm text-muted-foreground">• Custom JWT strategy</span>
                <span className="text-sm text-muted-foreground">• User repository integration</span>
              </li>
            </ul>
            
            <div className="mt-4 bg-slate-50 p-3 rounded-md text-xs font-mono">
              <pre>{`
// JWT Strategy implementation
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
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
              `}</pre>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Role-Based Authorization</CardTitle>
            <CardDescription>Fine-grained access control</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex flex-col">
                <span className="font-medium">User Roles:</span>
                <span className="text-sm text-muted-foreground">• ADMIN - Full system access</span>
                <span className="text-sm text-muted-foreground">• ATTORNEY - Case management, time tracking</span>
                <span className="text-sm text-muted-foreground">• PARALEGAL - Limited case access, time tracking</span>
                <span className="text-sm text-muted-foreground">• CLIENT - Read-only access to their cases</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Access Control:</span>
                <span className="text-sm text-muted-foreground">• Route-level guards</span>
                <span className="text-sm text-muted-foreground">• Method-level decorators</span>
                <span className="text-sm text-muted-foreground">• Resource ownership validation</span>
                <span className="text-sm text-muted-foreground">• Client data segregation</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium">Implementation:</span>
                <span className="text-sm text-muted-foreground">• Custom RolesGuard</span>
                <span className="text-sm text-muted-foreground">• @Roles() decorator</span>
                <span className="text-sm text-muted-foreground">• Service-level permissions</span>
              </li>
            </ul>
            
            <div className="mt-4 bg-slate-50 p-3 rounded-md text-xs font-mono">
              <pre>{`
// Role-based Guard
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
}

// Usage example
@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CaseController {
  @Post()
  @Roles(UserRole.ATTORNEY, UserRole.ADMIN)
  createCase(@Body() createCaseDto: CreateCaseDto) {
    // Implementation
  }
}
              `}</pre>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ownership & Data Access Control</CardTitle>
            <CardDescription>Advanced authorization rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Case Access Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Clients can only access their own cases</li>
                  <li>• Attorneys can access cases assigned to them</li>
                  <li>• Paralegals can access cases from their practice area</li>
                  <li>• Admin can access all cases</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2">Document Access Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Client-visible vs. internal documents</li>
                  <li>• Privileged document tagging</li>
                  <li>• Version control authorization</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Time Entry Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Users can only create time entries for themselves</li>
                  <li>• Users can only modify their own time entries</li>
                  <li>• Admins can modify any time entry</li>
                  <li>• Clients cannot see unbilled time entries</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2">Implementation</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Service-level ownership checks</li>
                  <li>• Custom policies per resource type</li>
                  <li>• Data filtering based on user context</li>
                  <li>• Audit logging for sensitive operations</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-slate-50 p-3 rounded-md text-xs font-mono">
              <pre>{`
// Example of ownership check in service
@Injectable()
export class CaseService {
  // ... other methods

  async canUserAccessCase(userId: string, caseId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    const caseData = await this.caseRepository.findUnique({ where: { id: caseId } });
    
    if (!user || !caseData) {
      return false;
    }
    
    // Admin can access everything
    if (user.roles.includes(UserRole.ADMIN)) {
      return true;
    }
    
    // Client can only access their own cases
    if (user.roles.includes(UserRole.CLIENT)) {
      return caseData.clientId === userId;
    }
    
    // Attorney can access cases assigned to them
    if (user.roles.includes(UserRole.ATTORNEY)) {
      return caseData.attorneyId === userId;
    }
    
    // Paralegal access logic based on practice areas
    if (user.roles.includes(UserRole.PARALEGAL)) {
      // Additional logic here for practice area checks
      return true; // Simplified for this example
    }
    
    return false;
  }
}
              `}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
