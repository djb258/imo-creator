# Pipeline Dispatch Signals

**Owner**: GitHub Actions (pipeline-trigger.yml)

CI writes dispatch signals here when a new packet is detected in an agent inbox. The runner with Doppler credentials watches this directory and picks up signals to invoke the corresponding agent.

**CI holds zero API keys.** It detects and signals only. The runner authenticates via its own Doppler installation.

See `sys/runtime/PACKET_CONTRACT.md` for the full trigger mechanism.
