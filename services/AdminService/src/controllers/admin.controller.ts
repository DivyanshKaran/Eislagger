import axios from "axios";
import type { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3002";

// --- Controller Logic ---

/**
 * Controller to get all users.
 * Communicates with the Auth Service via the API Gateway.
 */
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/users`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

/**
 * Controller to update a user's role.
 * Sends a command to the Auth Service via the API Gateway.
 */
const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const response = await axios.put(
      `${AUTH_SERVICE_URL}/api/v1/auth/users/${userId}/role`,
      {
        role,
      },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user role", error: error.message });
  }
};

/**
 * Controller to delete a user.
 * Sends a command to the Auth Service via the API Gateway.
 */
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await axios.delete(`${AUTH_SERVICE_URL}/api/v1/auth/users/${userId}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

/**
 * Controller to check the health of all microservices.
 * Pings each service through the API Gateway.
 */
const getSystemHealth = async (req: Request, res: Response) => {
  const services = [
    { name: "auth", url: `${AUTH_SERVICE_URL}/api/v1/auth/health` },
    // Add other services here
  ];
  try {
    const healthChecks = services.map((service) =>
      axios
        .get(service.url, {
          headers: {
            Authorization: req.headers.authorization,
          },
        })
        .then(
          () => ({
            service: service.name,
            status: "Operational",
            statusCode: 200,
          }),
          (err) => ({
            service: service.name,
            status: "Unreachable",
            statusCode: err.response?.status || 503,
          })
        )
    );
    const results = await Promise.all(healthChecks);
    res.status(200).json({ overallStatus: "Checked", services: results });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during health check",
      error: error.message,
    });
  }
};

/**
 * Controller to retrieve audit logs.
 * Queries the dedicated audit log database.
 */
const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, serviceName, userId } = req.query;

    const dataFilePath = path.join(__dirname, "..", "data", "auditlogs-1.json");
    console.log(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    let logs = JSON.parse(fileContent);

    if (startDate) {
      logs = logs.filter(
        (log: any) => new Date(log.timestamp) >= new Date(startDate as string)
      );
    }
    if (endDate) {
      logs = logs.filter(
        (log: any) => new Date(log.timestamp) <= new Date(endDate as string)
      );
    }
    if (serviceName) {
      logs = logs.filter((log: any) => log.sourceService === serviceName);
    }
    if (userId) {
      logs = logs.filter((log: any) => log.userId === userId);
    }

    res.status(200).json({ logs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve audit logs", error: error.message });
  }
};

/**
 * Controller to create a system-wide broadcast.
 * Publishes an event to Kafka for the Notification Service to handle.
 */
const createBroadcast = async (req: Request, res: Response) => {
  try {
    const { message, target } = req.body;
    const eventPayload = {
      id: `broadcast-${Date.now()}`,
      message,
      target,
      requestedBy: req.user?.user.id, // Assumes user is attached to the request
      timestamp: new Date().toISOString(),
    };
    await kafkaProducer.publish("broadcast-requests", eventPayload);
    res
      .status(202)
      .json({ message: "Broadcast request has been queued for delivery." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to queue broadcast", error: error.message });
  }
};

const adminController = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemHealth,
  getAuditLogs,
  createBroadcast,
};

export default adminController;
