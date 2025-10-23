"""Sidecar package for IMO Creator"""
from .event_emitter import SidecarEventEmitter, get_emitter, emit_event

__version__ = "1.0.0"
__all__ = ["SidecarEventEmitter", "get_emitter", "emit_event"]