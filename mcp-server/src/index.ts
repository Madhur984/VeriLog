import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/**
 * Custom MCP Server for VeriLog electronics learning platform.
 */
const server = new Server(
    {
        name: "verilog-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Tool: evaluate_logic
 * Evaluates basic gate logic (AND, OR, NOT, XOR).
 */
const EvaluateLogicSchema = z.object({
    gate: z.enum(["AND", "OR", "NOT", "XOR", "NAND", "NOR"]),
    inputs: z.array(z.number().min(0).max(1)),
});

/**
 * Tool: generate_verilog
 * Generates simple Verilog code for a given logic structure.
 */
const GenerateVerilogSchema = z.object({
    moduleName: z.string(),
    inputs: z.array(z.string()),
    outputs: z.array(z.string()),
    logicDescription: z.string(),
});

/**
 * Tool: solve_kmap
 * Solves/Simplifies boolean expressions for a 2, 3, or 4 variable K-Map.
 */
const SolveKMapSchema = z.object({
    variables: z.number().min(2).max(4),
    minterms: z.array(z.number()),
});

// Handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "evaluate_logic",
                description: "Evaluates the output of a logic gate based on inputs (0 or 1).",
                inputSchema: {
                    type: "object",
                    properties: {
                        gate: { type: "string", enum: ["AND", "OR", "NOT", "XOR", "NAND", "NOR"] },
                        inputs: { type: "array", items: { type: "number" }, description: "Array of 0s and 1s" },
                    },
                    required: ["gate", "inputs"],
                },
            },
            {
                name: "generate_verilog",
                description: "Generates Verilog code for a digital logic module.",
                inputSchema: {
                    type: "object",
                    properties: {
                        moduleName: { type: "string" },
                        inputs: { type: "array", items: { type: "string" } },
                        outputs: { type: "array", items: { type: "string" } },
                        logicDescription: { type: "string", description: "Literal expression like 'Y = A & B | C'" },
                    },
                    required: ["moduleName", "inputs", "outputs", "logicDescription"],
                },
            },
            {
                name: "solve_kmap",
                description: "Simplifies a boolean expression using K-Map minterms.",
                inputSchema: {
                    type: "object",
                    properties: {
                        variables: { type: "number", description: "Number of variables (2, 3, or 4)" },
                        minterms: { type: "array", items: { type: "number" }, description: "List of minterm indices" },
                    },
                    required: ["variables", "minterms"],
                },
            },
        ],
    };
});

// Handler for calling tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        if (name === "evaluate_logic") {
            const { gate, inputs } = EvaluateLogicSchema.parse(args);
            let result = 0;

            switch (gate) {
                case "AND":
                    result = inputs.every((v) => v === 1) ? 1 : 0;
                    break;
                case "OR":
                    result = inputs.some((v) => v === 1) ? 1 : 0;
                    break;
                case "NOT":
                    result = inputs[0] === 1 ? 0 : 1;
                    break;
                case "XOR":
                    result = inputs.reduce((acc, v) => acc ^ v, 0);
                    break;
                case "NAND":
                    result = inputs.every((v) => v === 1) ? 0 : 1;
                    break;
                case "NOR":
                    result = inputs.some((v) => v === 1) ? 0 : 1;
                    break;
            }

            return {
                content: [{ type: "text", text: `Output of ${gate} gate: ${result}` }],
            };
        }

        if (name === "generate_verilog") {
            const { moduleName, inputs, outputs, logicDescription } = GenerateVerilogSchema.parse(args);
            const verilog = `
module ${moduleName}(
  ${inputs.map(i => `input ${i}`).join(",\n  ")},
  ${outputs.map(o => `output ${o}`).join(",\n  ")}
);

  assign ${logicDescription};

endmodule
      `.trim();

            return {
                content: [{ type: "text", text: verilog }],
            };
        }

        if (name === "solve_kmap") {
            const { variables, minterms } = SolveKMapSchema.parse(args);
            // Simplified logic for demonstration (returns a placeholder message)
            // In a production scenario, you would implement a Quine-McCluskey solver here.
            return {
                content: [{ type: "text", text: `K-Map simplification for ${variables} variables with minterms [${minterms.join(", ")}] requested. (Simulation Placeholder)` }],
            };
        }

        throw new Error(`Unknown tool: ${name}`);
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

/**
 * Start the server using Stdio transport.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("VeriLog MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
