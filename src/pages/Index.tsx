import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RepoAnalyzer } from "@/components/RepoAnalyzer";
import { ErrorLogDashboard } from "@/components/ErrorLogDashboard";
import { RBPComplianceDashboard } from "@/components/RBPComplianceDashboard";
import { ORPTDataService } from "@/lib/orpt-data-service";
import { ORPTStatusHelper } from "@/lib/orpt-types";
import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

const Index = () => {
  console.log('Index component rendering...');
  const [activeView, setActiveView] = useState<'analyzer' | 'errors' | 'orpt-status' | 'rbp-compliance'>('analyzer');

  // Get ORPT system status
  console.log('Loading ORPT data...');
  const allModules = ORPTDataService.getAllModules();
  const healthyModules = ORPTDataService.getModulesByStatus('healthy');
  const warningModules = ORPTDataService.getModulesByStatus('warning');
  const failureModules = ORPTDataService.getModulesByStatus('failure');
  console.log('ORPT data loaded:', { allModules: allModules.length, healthy: healthyModules.length });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🔍 Repo Lens
              </h1>
              <Badge variant="outline">BP-039</Badge>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span>ORPT Compliant</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeView === 'analyzer' ? 'default' : 'outline'}
                onClick={() => setActiveView('analyzer')}
              >
                Repository Analyzer
              </Button>
              <Button 
                variant={activeView === 'errors' ? 'default' : 'outline'}
                onClick={() => setActiveView('errors')}
              >
                Error Dashboard
              </Button>
              <Button 
                variant={activeView === 'orpt-status' ? 'default' : 'outline'}
                onClick={() => setActiveView('orpt-status')}
              >
                ORPT Status
              </Button>
              <Button 
                variant={activeView === 'rbp-compliance' ? 'default' : 'outline'}
                onClick={() => setActiveView('rbp-compliance')}
              >
                RBP Compliance
              </Button>
              <Link to="/imo-creator">
                <Button 
                  variant="outline"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-purple-600"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  IMO Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'analyzer' && <RepoAnalyzer />}
      {activeView === 'errors' && <ErrorLogDashboard />}
      {activeView === 'orpt-status' && (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">ORPT System Status</h2>
            <p className="text-muted-foreground">
              Operating, Repair, Parts, Training compliance across all modules
            </p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-success">{healthyModules.length}</div>
              <div className="text-sm text-muted-foreground">Healthy Modules</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-warning">{warningModules.length}</div>
              <div className="text-sm text-muted-foreground">Warning Modules</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-destructive">{failureModules.length}</div>
              <div className="text-sm text-muted-foreground">Failed Modules</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-3xl font-bold text-primary">{allModules.length}</div>
              <div className="text-sm text-muted-foreground">Total Modules</div>
            </div>
          </div>

          {/* Module Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allModules.map((module) => {
              const status = ORPTStatusHelper.getOverallStatus(module.orpt);
              return (
                <div key={module.barton_number.blueprint_id + module.barton_number.module_id} 
                     className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{module.module_name}</h3>
                    <Badge variant={ORPTStatusHelper.getStatusBadge(status)}>
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Barton: {module.barton_number.blueprint_id}.{module.barton_number.module_id}.{module.barton_number.submodule_id}.{module.barton_number.step_id}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Version: {module.version}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={`text-center p-2 rounded ${
                      module.schema_validation.stamped_compliant ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      STAMPED
                    </div>
                    <div className={`text-center p-2 rounded ${
                      module.schema_validation.spvpet_compliant ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      SPVPET
                    </div>
                    <div className={`text-center p-2 rounded ${
                      module.schema_validation.stacked_compliant ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      STACKED
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Fixes: {module.orpt.repair.total_fixes}</span>
                    <span>Escalations: {module.orpt.repair.escalation_count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeView === 'rbp-compliance' && (
        <div className="max-w-7xl mx-auto p-6">
          <RBPComplianceDashboard />
        </div>
      )}
    </div>
  );
};

export default Index;