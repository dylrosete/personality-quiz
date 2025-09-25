import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonalityProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Calculate MBTI type from traits
  app.post("/api/calculate-mbti", async (req, res) => {
    try {
      const traits = req.body;
      const mbtiType = storage.calculateMBTI(traits);
      const mbtiData = await storage.getMBTIData(mbtiType);
      
      if (!mbtiData) {
        return res.status(404).json({ message: "MBTI data not found" });
      }

      res.json({ 
        mbtiType,
        ...mbtiData 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate MBTI type" });
    }
  });

  // Save personality profile
  app.post("/api/personality-profiles", async (req, res) => {
    try {
      const validatedData = insertPersonalityProfileSchema.parse(req.body);
      const profile = await storage.createPersonalityProfile(validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create personality profile" });
    }
  });

  // Get personality profile by ID
  app.get("/api/personality-profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getPersonalityProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Personality profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve personality profile" });
    }
  });

  // Get MBTI data by type
  app.get("/api/mbti-data/:type", async (req, res) => {
    try {
      const mbtiData = await storage.getMBTIData(req.params.type);
      if (!mbtiData) {
        return res.status(404).json({ message: "MBTI data not found" });
      }
      res.json(mbtiData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve MBTI data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
