"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Patient",
    embedded: false
  },
  {
    name: "Diagnosis",
    embedded: false
  },
  {
    name: "Medication",
    embedded: false
  },
  {
    name: "Insurance",
    embedded: false
  },
  {
    name: "Prescription",
    embedded: false
  },
  {
    name: "Record",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/ghostwriter9151-f1ea0f/prisma/dev`
});
exports.prisma = new exports.Prisma();
