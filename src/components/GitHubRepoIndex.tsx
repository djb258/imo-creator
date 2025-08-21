import { useState, useEffect } from 'react';
import { Search, Eye, Lock, AlertCircle, CheckCircle, Clock, Wrench, Plus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitHubAPI, RepoWithMetadata } from '@/lib/github-api';
import { DiagnosticTracker } from '@/lib/utils/diagnostics';
import { useToast } from '@/hooks/use-toast';

interface GitHubRepoIndexProps {
  onRepoSelect?: (repo: RepoWithMetadata, token: string) => void;
  onPullToGarage?: (repo: RepoWithMetadata, token: string) => void;
  onCreateNew?: (basedOnRepo?: RepoWithMetadata) => void;
}

export function GitHubRepoIndex({ onRepoSelect, onPullToGarage, onCreateNew }: GitHubRepoIndexProps) {
  const [repos, setRepos] = useState<RepoWithMetadata[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<RepoWithMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Filter repos based on search term
    const filtered = repos.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRepos(filtered);
  }, [repos, searchTerm]);

  const fetchRepositories = async () => {
    if (!githubToken) {
      toast({
        title: "GitHub Token Required",
        description: "Please enter your GitHub Personal Access Token",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    DiagnosticTracker.createEvent(
      DiagnosticTracker.generateCode('30', 'UI', 'repo-fetch', 'start'),
      'GREEN',
      'SUCCESS',
      'Fetching GitHub repositories',
      { timestamp: new Date().toISOString() }
    );

    try {
      const api = new GitHubAPI(githubToken);
      const repositories = await api.getRepositories();
      
      setRepos(repositories);
      
      DiagnosticTracker.createEvent(
        DiagnosticTracker.generateCode('20', 'UI', 'repo-fetch', 'success'),
        'GREEN',
        'SUCCESS',
        `Successfully fetched ${repositories.length} repositories`,
        { count: repositories.length, timestamp: new Date().toISOString() }
      );

      toast({
        title: "Repositories Loaded",
        description: `Found ${repositories.length} repositories`
      });

    } catch (error) {
      DiagnosticTracker.createEvent(
        DiagnosticTracker.generateCode('40', 'UI', 'repo-fetch', 'error'),
        'RED',
        'FAILED_FETCH',
        `Failed to fetch repositories: ${error}`,
        { error: String(error), timestamp: new Date().toISOString() }
      );

      toast({
        title: "Error Loading Repositories",
        description: "Please check your GitHub token and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: RepoWithMetadata['doctrine_status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'missing':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'issues':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: RepoWithMetadata['doctrine_status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-success/10 text-success border-success/20';
      case 'missing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'issues':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePullToGarage = async (e: React.MouseEvent, repo: RepoWithMetadata) => {
    e.stopPropagation();
    
    DiagnosticTracker.createEvent(
      DiagnosticTracker.generateCode('20', 'UI', 'garage-mcp', 'pull'),
      'BLUE',
      'SUCCESS',
      `Pulling ${repo.name} to Garage-MCP for processing`,
      { repo: repo.name, action: 'mechanic_recall' }
    );

    toast({
      title: "Pulling to Garage-MCP",
      description: `${repo.name} will be processed with Mechanic pattern`
    });

    onPullToGarage?.(repo, githubToken);
  };

  const handleCreateNew = (e: React.MouseEvent, basedOnRepo?: RepoWithMetadata) => {
    e.stopPropagation();
    
    DiagnosticTracker.createEvent(
      DiagnosticTracker.generateCode('30', 'UI', 'factory', 'create'),
      'GREEN',
      'SUCCESS',
      `Creating new compliant application via Factory pattern`,
      { basedOn: basedOnRepo?.name || 'fresh', action: 'factory_create' }
    );

    toast({
      title: "Creating New Application",
      description: basedOnRepo ? `New app based on ${basedOnRepo.name}` : "Fresh compliant application"
    });

    onCreateNew?.(basedOnRepo);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🔍 Repo Index
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access and analyze all your GitHub repositories with ORBT doctrine compliance tracking
          </p>
        </div>

        {/* GitHub Token Input */}
        {repos.length === 0 && !loading && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Connect to GitHub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter your GitHub Personal Access Token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <Button onClick={fetchRepositories} className="w-full" disabled={loading}>
                {loading ? 'Loading Repositories...' : 'Load Repositories'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        {repos.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={(e) => handleCreateNew(e)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New App
              </Button>
              <div className="text-sm text-muted-foreground">
                {filteredRepos.length} of {repos.length} repositories
              </div>
            </div>
          </div>
        )}

        {/* Repository Grid */}
        {filteredRepos.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <Card 
                key={repo.id} 
                className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onRepoSelect?.(repo, githubToken)}
                    >
                      <CardTitle className="text-lg truncate">{repo.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {repo.full_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {repo.private ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      {getStatusIcon(repo.doctrine_status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div onClick={() => onRepoSelect?.(repo, githubToken)} className="cursor-pointer">
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getStatusColor(repo.doctrine_status)}`}>
                        {repo.doctrine_status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span>Updated {formatDate(repo.updated_at)}</span>
                      <div className="flex items-center gap-3">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🔗 {repo.forks_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handlePullToGarage(e, repo)}
                      className="flex-1 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      Fix/Enhance
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline"
                      onClick={(e) => handleCreateNew(e, repo)}
                      className="flex-1 text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      New From This
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {repos.length > 0 && filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No repositories found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading repositories...</p>
          </div>
        )}
      </div>
    </div>
  );
}