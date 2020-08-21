import { Application } from "express";

export interface RegistrableRouter {
    register(app: Application): void;
}