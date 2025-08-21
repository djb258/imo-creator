import { useState } from 'react';
import { GitHubRepoIndex } from './GitHubRepoIndex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RepoWithMetadata } from '@/lib/github-api';
import { createIMOCreatorService, FactoryOptions, MechanicOptions } from '@/lib/imo-creator-service';
import { useToast } from '@/hooks/use-toast';
import { 
  Cog, 
  Wrench, 
  Plus, 
  Rocket, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  FolderOpen,
  ArrowRight
} from 'lucide-react';

interface ProcessingTask {
  id: string;
  type: 'factory' | 'mechanic';
  repo?: RepoWithMetadata;
  appName?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  result?: {
    path: string;
    complianceScore?: number;
    sessionId?: string;
  };
  error?: string;
}

export function IMOCreatorDashboard() {
  const [tasks, setTasks] = useState<ProcessingTask[]>([]);
  const [newAppName, setNewAppName] = useState('');
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);
  const { toast } = useToast();
  const imoService = createIMOCreatorService();

  const handlePullToGarage = async (repo: RepoWithMetadata, token: string) => {
    const taskId = `mechanic-${Date.now()}`;
    const newTask: ProcessingTask = {
      id: taskId,
      type: 'mechanic',
      repo,
      status: 'pending',
      progress: 0
    };

    setTasks(prev => [...prev, newTask]);

    try {
      // Update to processing
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'processing', progress: 25 } : t
      ));

      const options: MechanicOptions = {
        targetRepo: repo,
        githubToken: token,
        cloneFirst: true,
        upgradeWiki: true
      };

      // Simulate progress updates
      setTimeout(() => {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, progress: 50 } : t
        ));
      }, 2000);

      setTimeout(() => {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, progress: 75 } : t
        ));
      }, 4000);

      const result = await imoService.processExistingRepo(options);

      if (result.success) {
        // Launch Garage-MCP session
        const garageResult = await imoService.launchGarageMCP(result.repoPath!);
        
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { 
            ...t, 
            status: 'complete', 
            progress: 100,
            result: {
              path: result.repoPath!,
              complianceScore: result.complianceScore,
              sessionId: garageResult.sessionId
            }
          } : t
        ));

        toast({
          title: "Garage-MCP Ready",
          description: `${repo.name} processed and ready for development`,
        });
      } else {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { 
            ...t, 
            status: 'error', 
            error: result.error 
          } : t
        ));

        toast({
          title: "Processing Failed",
          description: result.error,
          variant: "destructive"
        });
      }

    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { 
          ...t, 
          status: 'error', 
          error: String(error) 
        } : t
      ));
    }
  };

  const handleCreateNew = (basedOnRepo?: RepoWithMetadata) => {
    if (basedOnRepo) {
      // Quick create based on existing repo
      startFactoryProcess(basedOnRepo.name + '-new', basedOnRepo);
    } else {
      // Show dialog for manual app name
      setShowNewAppDialog(true);
    }
  };

  const startFactoryProcess = async (appName: string, basedOnRepo?: RepoWithMetadata) => {
    const taskId = `factory-${Date.now()}`;
    const newTask: ProcessingTask = {
      id: taskId,
      type: 'factory',
      appName,
      repo: basedOnRepo,
      status: 'pending',
      progress: 0
    };

    setTasks(prev => [...prev, newTask]);
    setShowNewAppDialog(false);
    setNewAppName('');

    try {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'processing', progress: 20 } : t
      ));

      const options: FactoryOptions = {
        appName,
        basedOnRepo,
        includeDeepWiki: true,
        complianceLevel: 'standard'
      };

      // Simulate progress
      setTimeout(() => {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, progress: 60 } : t
        ));
      }, 1500);

      const result = await imoService.createNewApplication(options);

      if (result.success) {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { 
            ...t, 
            status: 'complete', 
            progress: 100,
            result: {
              path: result.appPath!,
              complianceScore: 100
            }
          } : t
        ));

        toast({
          title: "Application Created",
          description: `${appName} ready for development with 100% compliance`,
        });
      } else {
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { 
            ...t, 
            status: 'error', 
            error: result.error 
          } : t
        ));

        toast({
          title: "Creation Failed",
          description: result.error,
          variant: "destructive"
        });
      }

    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { 
          ...t, 
          status: 'error', 
          error: String(error) 
        } : t
      ));
    }
  };

  const getStatusIcon = (status: ProcessingTask['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Cog className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const activeTasks = tasks.filter(t => t.status === 'processing');
  const completedTasks = tasks.filter(t => t.status === 'complete');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                IMO Creator Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Factory & Mechanic patterns with Garage-MCP integration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                v2.0 + Deep Wiki
              </Badge>
              {activeTasks.length > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  {activeTasks.length} Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid gap-6 lg:grid-cols-3">
        {/* Main Content - Repository Index */}
        <div className="lg:col-span-2">
          <GitHubRepoIndex 
            onPullToGarage={handlePullToGarage}
            onCreateNew={handleCreateNew}
          />
        </div>

        {/* Sidebar - Active Tasks & Results */}
        <div className="space-y-6">
          {/* Quick Create */}
          {showNewAppDialog && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Application name"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newAppName.trim()) {
                      startFactoryProcess(newAppName.trim());
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => startFactoryProcess(newAppName.trim())}
                    disabled={!newAppName.trim()}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowNewAppDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5 animate-spin" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {task.type === 'factory' ? '🏭' : '🔧'} 
                        {task.appName || task.repo?.name}
                      </span>
                      {getStatusIcon(task.status)}
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {task.type === 'factory' ? 'Creating compliant application...' : 'Processing with Mechanic pattern...'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completed ({completedTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.slice(-3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {task.type === 'factory' ? '🏭' : '🔧'} 
                        {task.appName || task.repo?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.result?.complianceScore && `${task.result.complianceScore}% compliant`}
                        {task.result?.sessionId && ' • Garage-MCP ready'}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <FolderOpen className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">IMO Creator Patterns</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="flex items-start gap-2">
                <Wrench className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Mechanic Pattern</div>
                  <div className="text-muted-foreground">Fix & enhance existing repos with compliance upgrades</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Plus className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Factory Pattern</div>
                  <div className="text-muted-foreground">Create new compliant applications from scratch</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Rocket className="h-4 w-4 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium">Garage-MCP</div>
                  <div className="text-muted-foreground">Claude subagents with HEIR coordination</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}