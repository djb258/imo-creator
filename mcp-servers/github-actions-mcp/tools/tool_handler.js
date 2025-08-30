const { Octokit } = require('@octokit/rest');

class GitHubActionsHandler {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: 'MCP-GitHub-Actions-Server/1.0.0'
    });
  }

  async trigger_workflow(payload) {
    try {
      const { repo, workflow_id, ref = 'main', inputs = {} } = payload.data;
      const [owner, repoName] = repo.split('/');
      
      const response = await this.octokit.actions.createWorkflowDispatch({
        owner,
        repo: repoName,
        workflow_id,
        ref,
        inputs
      });
      
      return {
        success: true,
        result: {
          workflow_triggered: true,
          repository: repo,
          workflow_id,
          ref,
          inputs,
          triggered_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'trigger_workflow',
          github_repo: repo,
          workflow: workflow_id,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.status,
        error_type: 'github_api_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          github_repo: payload.data.repo,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_workflow_status(payload) {
    try {
      const { repo, workflow_id, status, limit = 10 } = payload.data;
      const [owner, repoName] = repo.split('/');
      
      let params = {
        owner,
        repo: repoName,
        per_page: limit
      };
      
      // If specific workflow requested
      if (workflow_id) {
        params.workflow_id = workflow_id;
      }
      
      // If status filter requested
      if (status) {
        params.status = status;
      }
      
      const response = await this.octokit.actions.listWorkflowRunsForRepo(params);
      
      const runs = response.data.workflow_runs.map(run => ({
        id: run.id,
        workflow_name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at,
        updated_at: run.updated_at,
        head_branch: run.head_branch,
        head_sha: run.head_sha.substring(0, 7),
        html_url: run.html_url,
        run_attempt: run.run_attempt
      }));
      
      return {
        success: true,
        result: {
          repository: repo,
          total_runs: response.data.total_count,
          runs: runs,
          filter_applied: { workflow_id, status, limit },
          fetched_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_workflow_status',
          github_repo: repo,
          results_count: runs.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.status,
        error_type: 'github_api_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          github_repo: payload.data.repo,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async cancel_workflow_run(payload) {
    try {
      const { repo, run_id } = payload.data;
      const [owner, repoName] = repo.split('/');
      
      await this.octokit.actions.cancelWorkflowRun({
        owner,
        repo: repoName,
        run_id
      });
      
      return {
        success: true,
        result: {
          workflow_cancelled: true,
          repository: repo,
          run_id,
          cancelled_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'cancel_workflow_run',
          github_repo: repo,
          run_id,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.status,
        error_type: 'github_api_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          github_repo: payload.data.repo,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async get_deployment_status(payload) {
    try {
      const { repo, environment } = payload.data;
      const [owner, repoName] = repo.split('/');
      
      // Get deployments
      let deploymentParams = {
        owner,
        repo: repoName,
        per_page: 10
      };
      
      if (environment) {
        deploymentParams.environment = environment;
      }
      
      const deploymentsResponse = await this.octokit.repos.listDeployments(deploymentParams);
      
      // Get environments
      const environmentsResponse = await this.octokit.repos.getAllEnvironments({
        owner,
        repo: repoName
      });
      
      const deployments = deploymentsResponse.data.map(deployment => ({
        id: deployment.id,
        environment: deployment.environment,
        description: deployment.description,
        created_at: deployment.created_at,
        updated_at: deployment.updated_at,
        ref: deployment.ref,
        sha: deployment.sha?.substring(0, 7),
        task: deployment.task
      }));
      
      const environments = environmentsResponse.data.environments?.map(env => ({
        name: env.name,
        url: env.html_url,
        protection_rules: env.protection_rules?.length || 0
      })) || [];
      
      return {
        success: true,
        result: {
          repository: repo,
          environments: environments,
          recent_deployments: deployments,
          environment_filter: environment,
          fetched_at: new Date().toISOString()
        },
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          operation: 'get_deployment_status',
          github_repo: repo,
          environments_found: environments.length,
          deployments_found: deployments.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        error_code: error.status,
        error_type: 'github_api_error',
        heir_tracking: {
          unique_id: payload.unique_id,
          process_lineage: [payload.process_id],
          error_occurred: true,
          github_repo: payload.data.repo,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async handleToolCall(payload) {
    // Validate GitHub token
    if (!process.env.GITHUB_TOKEN) {
      return {
        success: false,
        error: 'GitHub token not configured',
        configuration_required: 'GITHUB_TOKEN environment variable'
      };
    }

    switch (payload.tool) {
      case 'trigger_workflow':
        return await this.trigger_workflow(payload);
      case 'get_workflow_status':
        return await this.get_workflow_status(payload);
      case 'cancel_workflow_run':
        return await this.cancel_workflow_run(payload);
      case 'get_deployment_status':
        return await this.get_deployment_status(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: ['trigger_workflow', 'get_workflow_status', 'cancel_workflow_run', 'get_deployment_status']
        };
    }
  }
}

module.exports = new GitHubActionsHandler();