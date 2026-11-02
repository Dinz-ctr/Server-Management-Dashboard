import asyncio
import platform
import time

from pathlib import Path
from datetime import datetime, timezone

import asyncssh
import psutil

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, SecretStr


# =====================================================
# APPLICATION CONFIGURATION
# =====================================================

app = FastAPI(
    title="NEXUS Server Operations API",
    description="Backend API for NEXUS Server Management Dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# SYSTEM CONFIGURATION
# =====================================================

START_TIME = time.time()

KNOWN_HOSTS_FILE = (
    Path(__file__).resolve().parents[1] / "known_hosts"
)


# =====================================================
# SSH REQUEST MODEL
# =====================================================

class SSHConnectionRequest(BaseModel):
    host: str = Field(min_length=1, max_length=253)
    port: int = Field(default=22, ge=1, le=65535)
    username: str = Field(min_length=1, max_length=64)
    password: SecretStr


# =====================================================
# ROOT ENDPOINT
# =====================================================

@app.get("/")
async def root():
    return {
        "application": "NEXUS Server Operations API",
        "version": "1.0.0",
        "status": "running",
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# =====================================================
# SYSTEM METRICS
# =====================================================

@app.get("/api/metrics")
async def get_metrics():

    cpu_usage = psutil.cpu_percent(interval=0.5)

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/" if platform.system() != "Windows" else "C:\\")

    boot_time = psutil.boot_time()
    uptime = int(time.time() - boot_time)

    return {
        "hostname": platform.node(),
        "platform": platform.system(),
        "processor": platform.processor(),

        "cpu": {
            "usage_percent": cpu_usage,
            "cores_physical": psutil.cpu_count(logical=False),
            "cores_logical": psutil.cpu_count(logical=True),
        },

        "memory": {
            "total": memory.total,
            "used": memory.used,
            "available": memory.available,
            "usage_percent": memory.percent,
        },

        "disk": {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "usage_percent": disk.percent,
        },

        "uptime_seconds": uptime,

        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# =====================================================
# SSH CONNECTION TEST
# =====================================================

@app.post("/api/ssh/test")
async def test_ssh_connection(request: SSHConnectionRequest):

    if not KNOWN_HOSTS_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail="SSH known_hosts file not found",
        )

    try:
        async with asyncssh.connect(
            host=request.host,
            port=request.port,
            username=request.username,
            password=request.password.get_secret_value(),
            known_hosts=str(KNOWN_HOSTS_FILE),
            connect_timeout=10,
        ):

            return {
                "success": True,
                "message": "SSH connection successful",
                "host": request.host,
                "port": request.port,
                "username": request.username,
            }

    except asyncssh.HostKeyNotVerifiable:
        raise HTTPException(
            status_code=403,
            detail="SSH host key verification failed",
        )

    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=408,
            detail="SSH connection timed out",
        )

    except asyncssh.PermissionDenied:
        raise HTTPException(
            status_code=401,
            detail="SSH authentication failed",
        )

    except (asyncssh.Error, OSError):
        raise HTTPException(
            status_code=400,
            detail="Unable to establish SSH connection",
        )
